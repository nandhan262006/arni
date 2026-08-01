"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  gallery: number;
  films: number;
  services: number;
  testimonials: number;
  posts: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    gallery: 0,
    films: 0,
    services: 0,
    testimonials: 0,
    posts: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [galleryRes, filmsRes, servicesRes, testimonialsRes, postsRes, msgsRes, unreadRes] =
          await Promise.all([
            fetch("/api/gallery"),
            fetch("/api/films"),
            fetch("/api/services"),
            fetch("/api/testimonials"),
            fetch("/api/posts"),
            fetch("/api/messages"),
            fetch("/api/messages?unread=true"),
          ]);

        const [gallery, films, services, testimonials, posts, msgs, unreadMsgs] =
          await Promise.all([
            galleryRes.json(),
            filmsRes.json(),
            servicesRes.json(),
            testimonialsRes.json(),
            postsRes.json(),
            msgsRes.json(),
            unreadRes.json(),
          ]);

        setStats({
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          films: Array.isArray(films) ? films.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          posts: Array.isArray(posts) ? posts.length : 0,
          messages: Array.isArray(msgs) ? msgs.length : 0,
          unreadMessages: Array.isArray(unreadMsgs) ? unreadMsgs.length : 0,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Gallery Images", value: stats.gallery, href: "/admin/gallery", icon: "🖼️" },
    { label: "Films", value: stats.films, href: "/admin/films", icon: "🎬" },
    { label: "Services", value: stats.services, href: "/admin/services", icon: "📋" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials", icon: "⭐" },
    { label: "Blog Posts", value: stats.posts, href: "/admin/posts", icon: "✍️" },
    { label: "Messages", value: stats.messages, href: "/admin/messages", icon: "📬", badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined },
    { label: "Site Settings", value: "—", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading text-gold font-bold">Dashboard</h2>
        <p className="text-muted mt-1">Welcome to Arni Photography admin panel</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="glass glass-hover rounded-xl p-6 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              {card.badge && (
                <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full font-medium">
                  {card.badge} new
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-cream mb-1">
              {loading ? "..." : card.value}
            </div>
            <div className="text-sm text-muted">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
