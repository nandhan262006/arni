"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

interface PostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
}

export default function PostEditor() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<PostData>({
    id: 0,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: null,
    published: false,
  });

  useEffect(() => {
    if (!isNew && params.id) {
      fetch(`/api/posts/${params.id}`)
        .then((r) => r.json())
        .then((data) => setPost(data))
        .finally(() => setLoading(false));
    }
  }, [isNew, params.id]);

  const handleSave = async (publish = false) => {
    setSaving(true);
    const data = { ...post, published: publish ? true : post.published, slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") };

    try {
      const method = isNew ? "POST" : "PATCH";
      const url = isNew ? "/api/posts" : `/api/posts/${params.id}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      const saved = await res.json();
      toast.success(publish ? "Published!" : "Saved as draft");

      if (isNew) {
        router.push(`/admin/posts/${saved.id}`);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/posts")}
          className="text-muted hover:text-cream transition-colors"
        >
          ← Back to posts
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 border border-border rounded-lg text-sm text-cream hover:bg-surface-alt transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-gold text-bg rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="Post title"
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-2xl font-heading text-cream placeholder:text-muted focus:border-gold focus:outline-none"
        />

        <input
          value={post.slug}
          onChange={(e) => setPost({ ...post, slug: e.target.value })}
          placeholder="post-slug"
          className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-sm text-cream font-mono placeholder:text-muted focus:border-gold focus:outline-none"
        />

        <textarea
          value={post.excerpt}
          onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
          placeholder="Short excerpt or summary..."
          rows={3}
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-cream placeholder:text-muted focus:border-gold focus:outline-none resize-none"
        />

        <input
          value={post.coverImage || ""}
          onChange={(e) => setPost({ ...post, coverImage: e.target.value || null })}
          placeholder="Cover image URL (optional)"
          className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
        />

        <div>
          <label className="text-sm text-muted block mb-1">Content (HTML)</label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="<p>Write your content here. HTML is supported.</p>"
            rows={20}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-cream font-mono text-sm placeholder:text-muted focus:border-gold focus:outline-none resize-y"
          />
        </div>

        {post.coverImage && (
          <div className="glass rounded-xl overflow-hidden max-w-md">
            <img src={post.coverImage} alt="Cover preview" className="w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
