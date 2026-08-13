"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type CategoryType = "gallery" | "films" | "services";

interface Category {
  id: number;
  name: string;
  slug: string;
  type: CategoryType;
  order: number;
}

const TYPES: { value: CategoryType; label: string }[] = [
  { value: "gallery", label: "Gallery" },
  { value: "films", label: "Films" },
  { value: "services", label: "Services" },
];

export default function CategoryManager() {
  const [type, setType] = useState<CategoryType>("gallery");
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories?type=${type}`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load categories");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    // The fetch resolves asynchronously before it updates state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, [loadCategories]);

  const addCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, type, order: categories.length }),
      });
      if (!response.ok) throw new Error("Failed to create category");
      setName("");
      await loadCategories();
      toast.success("Category added");
    } catch {
      toast.error("Could not add category. Names must be unique.");
    }
  };

  const renameCategory = async (category: Category) => {
    const nextName = window.prompt("Category name", category.name)?.trim();
    if (!nextName || nextName === category.name) return;
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextName }),
      });
      if (!response.ok) throw new Error("Failed to update category");
      await loadCategories();
      toast.success("Category updated");
    } catch {
      toast.error("Could not update category");
    }
  };

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete “${category.name}”? Items will move to another category.`)) return;
    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete category");
      await loadCategories();
      toast.success("Category deleted");
    } catch {
      toast.error("Could not delete category");
    }
  };

  return (
    <section className="glass rounded-xl p-6 max-w-2xl">
      <h3 className="text-lg font-heading text-gold">Categories</h3>
      <p className="text-sm text-muted mt-1">Manage the labels available when organizing gallery images, films, and services.</p>

      <div className="flex gap-2 mt-5 flex-wrap">
        {TYPES.map((item) => (
          <button
            key={item.value}
            onClick={() => { setLoading(true); setType(item.value); }}
            className={`px-3 py-1.5 rounded-lg text-sm ${type === item.value ? "bg-gold/20 text-gold border border-gold/30" : "border border-border text-muted hover:text-cream"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={addCategory} className="flex gap-2 mt-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={50}
          placeholder={`New ${type} category`}
          className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-cream"
        />
        <button className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg">Add</button>
      </form>

      {loading ? (
        <p className="text-sm text-muted py-6">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted py-6">No custom categories yet.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-surface/50 rounded-lg">
              <div>
                <span className="text-cream text-sm">{category.name}</span>
                <span className="block text-xs text-muted">/{category.slug}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => renameCategory(category)} className="px-2 py-1 text-xs text-muted hover:text-cream">Rename</button>
                <button onClick={() => deleteCategory(category)} className="px-2 py-1 text-xs text-muted hover:text-error">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
