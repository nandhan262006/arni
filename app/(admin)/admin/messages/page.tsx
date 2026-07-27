"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch {
      toast.error("Failed");
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/messages/${id}`, { method: "DELETE" });
      setMessages(messages.filter((m) => m.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleExpand = (id: number) => {
    if (!messages.find((m) => m.id === id)?.read) {
      markAsRead(id);
    }
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading text-gold font-bold">Messages</h2>
        <p className="text-muted mt-1">
          {messages.filter((m) => !m.read).length} unread / {messages.length} total
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl text-muted">
          No messages yet
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`glass rounded-xl p-4 transition-all cursor-pointer ${!msg.read ? "border-l-2 border-gold" : ""}`}
              onClick={() => toggleExpand(msg.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.read ? "bg-muted" : "bg-gold"}`} />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-cream truncate">{msg.name}</h4>
                    <span className="text-xs text-muted">
                      {msg.email} {msg.phone && `• ${msg.phone}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <span className="text-xs text-muted">
                    {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                    className="px-2 py-1 text-xs text-muted hover:text-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {expandedId === msg.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted whitespace-pre-wrap">{msg.message}</p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-gold hover:text-gold-light"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Reply via Email
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="text-xs text-gold hover:text-gold-light"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
