"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";

interface HeroImage {
  id: number;
  url: string;
  alt: string;
  active: boolean;
  order: number;
}

export default function HeroImagesSection() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch("/api/hero-images");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // State updates happen after the awaited fetch, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadImages();
  }, [loadImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      let uploadedCount = 0;

      for (const file of Array.from(files)) {
        try {
          const sigRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type || "application/octet-stream",
              kind: "image",
            }),
          });
          if (!sigRes.ok) throw new Error("Upload URL failed");
          const { key, uploadUrl, publicUrl } = await sigRes.json();

          const putRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!putRes.ok) throw new Error("R2 upload failed");

          await fetch("/api/hero-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              storageKey: key,
              url: publicUrl,
              alt: "",
              active: true,
              order: images.length + uploadedCount,
            }),
          });
          uploadedCount++;
        } catch {
          // Skip files that fail individually so one bad file
          // doesn't abort the whole batch.
        }
      }

      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} hero image(s) uploaded`);
        loadImages();
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const patch = async (id: number, data: Record<string, unknown>) => {
    const res = await fetch(`/api/hero-images/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update");
    return res.json();
  };

  const toggleActive = async (img: HeroImage) => {
    try {
      await patch(img.id, { active: !img.active });
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, active: !i.active } : i))
      );
      toast.success(img.active ? "Hidden from hero" : "Showing in hero");
    } catch {
      toast.error("Update failed");
    }
  };

  const updateAlt = async (img: HeroImage, alt: string) => {
    try {
      await patch(img.id, { alt });
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, alt } : i))
      );
    } catch {
      toast.error("Update failed");
    }
  };

  const move = async (id: number, dir: -1 | 1) => {
    const idx = images.findIndex((i) => i.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= images.length) return;
    const a = images[idx];
    const b = images[swapIdx];
    try {
      await Promise.all([
        patch(a.id, { order: b.order }),
        patch(b.id, { order: a.order }),
      ]);
      setImages((prev) => {
        const next = [...prev];
        next[idx] = b;
        next[swapIdx] = a;
        return next;
      });
    } catch {
      toast.error("Reorder failed");
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Delete this hero image?")) return;
    try {
      const res = await fetch(`/api/hero-images/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      loadImages();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDrop = async (targetId: number) => {
    const sourceId = draggingId;
    setDraggingId(null);
    dragCounter.current = 0;
    if (sourceId === null || sourceId === targetId) return;
    const source = images.find((i) => i.id === sourceId);
    const target = images.find((i) => i.id === targetId);
    if (!source || !target) return;
    try {
      await Promise.all([
        patch(source.id, { order: target.order }),
        patch(target.id, { order: source.order }),
      ]);
      loadImages();
    } catch {
      toast.error("Reorder failed");
    }
  };

  return (
    <section className="glass rounded-2xl p-6 mb-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-heading text-gold font-bold">
            Hero Slideshow Images
          </h3>
          <p className="text-muted text-sm mt-1">
            These images rotate in the homepage hero. Active images show, and
            drag or use the arrows to reorder.
          </p>
        </div>
        <label className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg cursor-pointer hover:bg-gold-light transition-colors whitespace-nowrap">
          {uploading ? "Uploading..." : "Upload Images"}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl mt-6">
          <p className="text-muted mb-4">No hero images yet</p>
          <label className="px-4 py-2 bg-gold text-bg rounded-lg cursor-pointer inline-block hover:bg-gold-light transition-colors">
            Upload your first image
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => setDraggingId(img.id)}
              onDragEnter={(e) => {
                e.preventDefault();
                dragCounter.current++;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => {
                dragCounter.current--;
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragCounter.current <= 0) return;
                handleDrop(img.id);
              }}
              className={`glass rounded-xl overflow-hidden border ${
                img.active ? "border-gold/20" : "border-border opacity-50"
              } cursor-grab active:cursor-grabbing`}
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={img.url}
                  alt={img.alt || "Hero image"}
                  className="w-full h-full object-cover"
                />
                {img.active && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-gold/80 text-bg text-xs rounded-full font-medium">
                    Active
                  </span>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-cream text-xs rounded-full">
                  {idx + 1}
                </span>
              </div>

              <div className="p-3 space-y-2">
                <input
                  value={img.alt}
                  onChange={(e) => updateAlt(img, e.target.value)}
                  placeholder="Alt text"
                  className="w-full px-2 py-1 bg-surface border border-border rounded text-sm text-cream"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      onClick={() => move(img.id, -1)}
                      disabled={idx === 0}
                      className="px-2 py-1 text-xs text-muted hover:text-cream disabled:opacity-30"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(img.id, 1)}
                      disabled={idx === images.length - 1}
                      className="px-2 py-1 text-xs text-muted hover:text-cream disabled:opacity-30"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => toggleActive(img)}
                      className="px-2 py-1 text-xs text-gold hover:text-gold-light"
                      title={img.active ? "Hide" : "Show"}
                    >
                      {img.active ? "Hide" : "Show"}
                    </button>
                  </div>
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="px-2 py-1 text-xs text-muted hover:text-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
