"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Film {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  category: string;
  featured: boolean;
  order: number;
}

const DEFAULT_CATEGORIES = ["modern", "classic", "intimates", "cinematic"];

export default function FilmsAdminPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Film | null>(null);
  const [uploading, setUploading] = useState<"video" | "thumbnail" | null>(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "modern",
    featured: false,
    order: 0,
  });

  useEffect(() => {
    fetch("/api/films")
      .then((r) => r.json())
      .then((data) => setFilms(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/categories?type=films")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((category: { slug: string }) => category.slug));
        }
      })
      .catch(() => {});
  }, []);

  const uploadToR2 = async (file: File, kind: "video" | "image") => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        kind: kind === "video" ? "video" : "image",
      }),
    });
    if (!res.ok) throw new Error("Upload URL failed");
    const { uploadUrl, publicUrl } = await res.json();

    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error("R2 upload failed");

    return publicUrl;
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "video" | "thumbnail"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(target);
    try {
      const url = await uploadToR2(
        file,
        target === "thumbnail" ? "image" : "video"
      );
      if (target === "video") {
        setForm((f) => ({ ...f, videoUrl: url }));
      } else {
        setForm((f) => ({ ...f, thumbnailUrl: url }));
      }
      toast.success(target === "video" ? "Video uploaded" : "Thumbnail uploaded");
    } catch {
      toast.error(`${target === "video" ? "Video" : "Thumbnail"} upload failed`);
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", videoUrl: "", thumbnailUrl: "", category: "modern", featured: false, order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (f: Film) => {
    setEditing(f);
    setForm({
      title: f.title,
      description: f.description,
      videoUrl: f.videoUrl,
      thumbnailUrl: f.thumbnailUrl || "",
      category: f.category,
      featured: f.featured,
      order: f.order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/films/${editing.id}` : "/api/films";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Updated" : "Created");
      resetForm();
      const data = await fetch("/api/films").then((r) => r.json());
      setFilms(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to save");
    }
  };

  const deleteFilm = async (id: number) => {
    if (!confirm("Delete this film?")) return;
    try {
      await fetch(`/api/films/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      setFilms(films.filter((f) => f.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-gold font-bold">Films</h2>
          <p className="text-muted mt-1">{films.length} films</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg hover:bg-gold-light transition-colors"
        >
          {showForm ? "Cancel" : "Add Film"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 mb-8 space-y-4">
          <h3 className="text-lg font-heading text-gold">{editing ? "Edit Film" : "New Film"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div>
              <div className="flex gap-2">
                <input
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="Video URL"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
                  required
                />
                <label className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-cream cursor-pointer whitespace-nowrap hover:bg-surface transition-colors">
                  {uploading === "video" ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "video")}
                    className="hidden"
                    disabled={uploading !== null}
                  />
                </label>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  placeholder="Thumbnail URL (optional)"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
                />
                <label className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-cream cursor-pointer whitespace-nowrap hover:bg-surface transition-colors">
                  {uploading === "thumbnail" ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "thumbnail")}
                    className="hidden"
                    disabled={uploading !== null}
                  />
                </label>
              </div>
            </div>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={2}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream resize-none"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
          <button type="submit" className="px-4 py-2 bg-gold text-bg rounded-lg font-medium hover:bg-gold-light">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-muted">Loading...</div>
      ) : films.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl text-muted">
          No films yet. Add your first video.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {films.map((f) => (
            <div key={f.id} className="glass rounded-xl overflow-hidden">
              <div className="aspect-video bg-surface/50 flex items-center justify-center">
                {f.thumbnailUrl ? (
                  <img src={f.thumbnailUrl} alt={f.title} className="w-full h-full object-cover" />
                ) : (
                  <video src={f.videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-cream text-sm">{f.title || "Untitled"}</h4>
                    <span className="text-xs text-muted capitalize">{f.category}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(f)} className="px-2 py-1 text-xs text-muted hover:text-cream">Edit</button>
                    <button onClick={() => deleteFilm(f.id)} className="px-2 py-1 text-xs text-muted hover:text-error">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
