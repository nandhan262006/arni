"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface Service {
  id: number;
  title: string;
  description: string;
  slug: string;
  icon: string;
  imageUrl: string | null;
  category: string;
  order: number;
}

const DEFAULT_CATEGORY_OPTIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "seemantham", label: "Seemantham" },
  { value: "reception", label: "Reception" },
  { value: "preshoot", label: "Pre Shoot" },
  { value: "other", label: "Other" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORY_OPTIONS);
  const [form, setForm] = useState({
    title: "",
    description: "",
    slug: "",
    icon: "camera",
    imageUrl: "",
    category: "wedding",
    order: 0,
  });

  const loadServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // State updates happen after the awaited fetch, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    fetch("/api/categories?type=services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((category: { name: string; slug: string }) => ({
            label: category.name,
            value: category.slug,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", slug: "", icon: "camera", imageUrl: "", category: "wedding", order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description,
      slug: s.slug,
      icon: s.icon,
      imageUrl: s.imageUrl || "",
      category: s.category || "wedding",
      order: s.order,
    });
    setShowForm(true);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          kind: "image",
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

      setForm((f) => ({ ...f, imageUrl: publicUrl }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/services/${editing.id}` : "/api/services";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Updated" : "Created");
      resetForm();
      await loadServices();
    } catch {
      toast.error("Failed to save");
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      setServices(services.filter((s) => s.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const move = async (id: number, dir: -1 | 1) => {
    const idx = services.findIndex((s) => s.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= services.length) return;
    const a = services[idx];
    const b = services[swapIdx];
    try {
      await Promise.all([
        fetch(`/api/services/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`/api/services/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
      setServices((prev) => {
        const next = [...prev];
        next[idx] = b;
        next[swapIdx] = a;
        return next;
      });
    } catch {
      toast.error("Reorder failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-gold font-bold">Services</h2>
          <p className="text-muted mt-1">{services.length} services</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg hover:bg-gold-light transition-colors"
        >
          {showForm ? "Cancel" : "Add Service"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 mb-8 space-y-4">
          <h3 className="text-lg font-heading text-gold">{editing ? "Edit Service" : "New Service"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
              placeholder="Title"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
              required
            />
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="Slug (auto-generated)"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Icon (emoji or name)"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            />
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="Image URL (paste or upload)"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
                />
                <label className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-cream cursor-pointer whitespace-nowrap hover:bg-surface transition-colors">
                  {uploading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Service preview"
                  className="mt-3 h-32 w-auto rounded-lg object-cover border border-border"
                />
              )}
            </div>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream resize-none"
          />
          <button type="submit" className="px-4 py-2 bg-gold text-bg rounded-lg font-medium hover:bg-gold-light">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-muted">Loading...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl text-muted">
          No services yet. Add your first service card.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s, idx) => (
            <div key={s.id} className="glass rounded-xl overflow-hidden">
              <div className="flex">
                <div className="w-36 h-28 relative shrink-0 bg-surface/50">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{s.icon}</div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {s.category && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/70 block mb-1">
                          {s.category}
                        </span>
                      )}
                      <h4 className="font-semibold text-cream">{s.title}</h4>
                      <span className="text-xs text-muted">/{s.slug}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex gap-1">
                        <button onClick={() => move(s.id, -1)} disabled={idx === 0} className="px-1.5 text-xs text-muted hover:text-cream disabled:opacity-30">↑</button>
                        <button onClick={() => move(s.id, 1)} disabled={idx === services.length - 1} className="px-1.5 text-xs text-muted hover:text-cream disabled:opacity-30">↓</button>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <button onClick={() => startEdit(s)} className="px-3 py-1 text-sm text-muted hover:text-cream">Edit</button>
                        <button onClick={() => deleteService(s.id)} className="px-3 py-1 text-sm text-muted hover:text-error">Delete</button>
                      </div>
                    </div>
                  </div>
                  {s.description && (
                    <p className="text-sm text-muted mt-2 line-clamp-2">{s.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
