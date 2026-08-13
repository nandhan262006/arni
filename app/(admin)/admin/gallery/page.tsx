"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Card3D } from "@/components/ui/card-3d";

interface GalleryImage {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  alt: string;
  category: string;
  featured: boolean;
  order: number;
}

const DEFAULT_CATEGORIES = ["wedding", "seemantham", "reception", "preshoot", "other"];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", category: "", featured: false, order: 0 });

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/gallery?category=${filter}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    // State updates happen after the awaited fetch, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    fetch("/api/categories?type=gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((category: { slug: string }) => category.slug));
        }
      })
      .catch(() => {});
  }, []);

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

          const dimensions = await new Promise<{ width: number; height: number } | null>(
            (resolve) => {
              const img = new Image();
              img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
              img.onerror = () => resolve(null);
              img.src = publicUrl;
            }
          );

          await fetch("/api/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              storageKey: key,
              url: publicUrl,
              thumbnailUrl: null,
              width: dimensions?.width ?? null,
              height: dimensions?.height ?? null,
              alt: "",
              category: categories[0] ?? "wedding",
              featured: false,
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
        toast.success(`${uploadedCount} image(s) uploaded`);
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

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setEditForm({ alt: img.alt, category: img.category, featured: img.featured, order: img.order });
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    try {
      await fetch(`/api/gallery/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      toast.success("Updated");
      setEditingId(null);
      loadImages();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      loadImages();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-gold font-bold">Gallery</h2>
          <p className="text-muted mt-1">{images.length} images</p>
        </div>
        <label className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg cursor-pointer hover:bg-gold-light transition-colors">
          {uploading ? "Uploading..." : "Upload Images"}
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter === cat
                ? "bg-gold/20 text-gold border border-gold/30"
                : "text-muted hover:text-cream border border-border"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl">
          <p className="text-muted mb-4">No images yet</p>
          <label className="px-4 py-2 bg-gold text-bg rounded-lg cursor-pointer inline-block hover:bg-gold-light transition-colors">
            Upload your first image
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card3D key={img.id} className="group" maxTilt={8}>
              <div className="glass rounded-xl overflow-hidden">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={img.thumbnailUrl || img.url}
                    alt={img.alt || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  {img.featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-gold/80 text-bg text-xs rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>

                {editingId === img.id ? (
                  <div className="p-3 space-y-2">
                    <input
                      value={editForm.alt}
                      onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                      placeholder="Alt text"
                      className="w-full px-2 py-1 bg-surface border border-border rounded text-sm text-cream"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-2 py-1 bg-surface border border-border rounded text-sm text-cream"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-sm text-muted">
                      <input
                        type="checkbox"
                        checked={editForm.featured}
                        onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                      />
                      Featured
                    </label>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="px-3 py-1 bg-gold text-bg rounded text-sm font-medium">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 text-muted text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted capitalize">{img.category}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(img)} className="px-2 py-1 text-xs text-muted hover:text-cream">Edit</button>
                      <button onClick={() => deleteImage(img.id)} className="px-2 py-1 text-xs text-muted hover:text-error">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            </Card3D>
          ))}
        </div>
      )}
    </div>
  );
}
