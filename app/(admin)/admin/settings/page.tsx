"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Setting {
  id: number;
  key: string;
  value: string;
}

const SETTING_FIELDS = [
  { key: "hero_title", label: "Hero Title", type: "text" as const },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "text" as const },
  { key: "about_text", label: "About Text", type: "textarea" as const },
  { key: "about_tagline", label: "About Tagline", type: "text" as const },
  { key: "address", label: "Address", type: "textarea" as const },
  { key: "phone", label: "Phone", type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "instagram_url", label: "Instagram URL", type: "text" as const },
  { key: "facebook_url", label: "Facebook URL", type: "text" as const },
  { key: "youtube_url", label: "YouTube URL", type: "text" as const },
  { key: "google_maps_embed", label: "Google Maps Embed HTML", type: "textarea" as const },
  { key: "seo_title", label: "SEO Title", type: "text" as const },
  { key: "seo_description", label: "SEO Description", type: "textarea" as const },
];

const DEFAULTS: Record<string, string> = {
  hero_title: "Capturing Moments. Creating Memories.",
  hero_subtitle: "We don't just take pictures, we create memories you can hold.",
  about_text: "Every smile, every tear, every glance—we believe your story deserves to be told beautifully. With over 12 years of expertise, ARNI Photography transforms fleeting moments into timeless treasures through our signature blend of candid photography and cinematic videography.",
  about_tagline: "Considered a rising name in the world of modern photography and visual storytelling.",
  address: "1st floor 106, 107, 107A right commercial space, dutt island, above apollo pharmacy, siripuram, visakhapatnam-530003",
  phone: "+91 8008948977",
  email: "Arniconglomerate@gmail.com",
  instagram_url: "https://www.instagram.com/arniphotographyy/",
  facebook_url: "https://www.facebook.com/Arunikitha/",
  youtube_url: "https://www.youtube.com/channel/UC4HWnC-vrF6Hq9urwDnnARA",
  seo_title: "Arni Photography | Vizag's Finest Wedding & Candid Photography",
  seo_description: "Capture timeless moments with Arni Photography in Visakhapatnam. We specialize in wedding, candid, and event photography. Book your session today!",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = { ...DEFAULTS };
        if (Array.isArray(data)) {
          for (const s of data) {
            map[s.key] = s.value || map[s.key] || "";
          }
        }
        setSettings(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsArray),
      });
      toast.success("Settings saved");
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-gold font-bold">Site Settings</h2>
          <p className="text-muted mt-1">Manage your site information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-gold text-bg font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6 max-w-2xl">
        {SETTING_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-muted mb-1.5 font-medium">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={settings[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream focus:border-gold focus:outline-none resize-y"
              />
            ) : (
              <input
                type="text"
                value={settings[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-cream focus:border-gold focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
