"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Service {
  id: number;
  title: string;
  description: string;
  slug: string;
  icon: string;
  imageUrl: string | null;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: "", description: "", slug: "", icon: "camera", imageUrl: "", order: 0 });

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", slug: "", icon: "camera", imageUrl: "", order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, slug: s.slug, icon: s.icon, imageUrl: s.imageUrl || "", order: s.order });
    setShowForm(true);
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
      const data = await fetch("/api/services").then((r) => r.json());
      setServices(Array.isArray(data) ? data : []);
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
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="Icon (emoji)"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            />
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Image URL (optional)"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            />
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h4 className="font-semibold text-cream">{s.title}</h4>
                    <span className="text-xs text-muted">/{s.slug}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(s)} className="px-3 py-1 text-sm text-muted hover:text-cream">Edit</button>
                  <button onClick={() => deleteService(s.id)} className="px-3 py-1 text-sm text-muted hover:text-error">Delete</button>
                </div>
              </div>
              {s.description && (
                <p className="text-sm text-muted mt-3 line-clamp-2">{s.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
