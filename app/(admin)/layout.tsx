"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

function Sidebar() {
  const router = useRouter();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const links = [
    { href: "/admin", label: "Overview", icon: "📊" },
    { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
    { href: "/admin/films", label: "Films", icon: "🎬" },
    { href: "/admin/services", label: "Services", icon: "📋" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
    { href: "/admin/posts", label: "Blog", icon: "✍️" },
    { href: "/admin/messages", label: "Messages", icon: "📬" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen glass border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-gold font-heading text-xl font-bold tracking-wide">
          Arni Admin
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 ${
              pathname === link.href
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-muted hover:text-cream hover:bg-surface-alt"
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-muted hover:text-error transition-colors text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
