"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Testimonial {
  id: number;
  clientName: string;
  event: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ clientName: "", event: "", rating: 5, text: "", avatarUrl: "" });

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ clientName: "", event: "", rating: 5, text: "", avatarUrl: "" });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ clientName: t.clientName, event: t.event, rating: t.rating, text: t.text, avatarUrl: t.avatarUrl || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/testimonials/${editing.id}` : "/api/testimonials";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Updated" : "Created");
      resetForm();
      const data = await fetch("/api/testimonials").then((r) => r.json());
      setTestimonials(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to save");
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const renderStars = (count: number) => "★".repeat(count) + "☆".repeat(5 - count);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-gold font-bold">Testimonials</h2>
          <p className="text-muted mt-1">{testimonials.length} testimonials</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg hover:bg-gold-light transition-colors"
        >
          {showForm ? "Cancel" : "Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 mb-8 space-y-4">
          <h3 className="text-lg font-heading text-gold">{editing ? "Edit Testimonial" : "New Testimonial"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="Client name"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
              required
            />
            <input
              value={form.event}
              onChange={(e) => setForm({ ...form, event: e.target.value })}
              placeholder="Event (e.g., Wedding, Seemantham)"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            />
            <div>
              <label className="text-sm text-muted block mb-1">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{renderStars(n)}</option>
                ))}
              </select>
            </div>
            <input
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              placeholder="Avatar URL (optional)"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream"
            />
          </div>
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Testimonial text"
            rows={3}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream resize-none"
            required
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
          {testimonials.map((t) => (
            <div key={t.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-cream">{t.clientName}</h4>
                  {t.event && <span className="text-xs text-muted">{t.event}</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(t)} className="px-3 py-1 text-sm text-muted hover:text-cream">Edit</button>
                  <button onClick={() => deleteTestimonial(t.id)} className="px-3 py-1 text-sm text-muted hover:text-error">Delete</button>
                </div>
              </div>
              <div className="text-gold text-sm mb-2">{renderStars(t.rating)}</div>
              <p className="text-sm text-muted line-clamp-3">{t.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
