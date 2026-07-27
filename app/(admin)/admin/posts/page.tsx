"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?all=true")
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const deletePost = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      setPosts(posts.filter((p) => p.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const togglePublished = async (post: Post) => {
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      toast.success(post.published ? "Unpublished" : "Published");
      setPosts(posts.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-gold font-bold">Blog Posts</h2>
          <p className="text-muted mt-1">{posts.length} posts</p>
        </div>
        <button
          onClick={() => router.push("/admin/posts/new")}
          className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg hover:bg-gold-light transition-colors"
        >
          New Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl">
          <p className="text-muted mb-4">No posts yet</p>
          <button
            onClick={() => router.push("/admin/posts/new")}
            className="px-4 py-2 bg-gold text-bg rounded-lg hover:bg-gold-light transition-colors"
          >
            Write your first post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-cream truncate">{post.title || "Untitled"}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted">/{post.slug}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => togglePublished(post)}
                  className="px-3 py-1 text-sm text-muted hover:text-cream transition-colors"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => router.push(`/admin/posts/${post.id}`)}
                  className="px-3 py-1 text-sm text-gold hover:text-gold-light transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="px-3 py-1 text-sm text-muted hover:text-error transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
