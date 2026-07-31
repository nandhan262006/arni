"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GlassPanel } from "@/components/ui/glass-panel";
import toast from "react-hot-toast";

const STUDIO_COORDS = "17.7238354,83.318415";

const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.2836758166526!2d83.318415!3d17.7238354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39430ae4b02f0d%3A0xd205685c2e7d04b0!2sArni%20Photography%20%7C%20Best%20wedding%20photographer%20%7C%20Top%20photographer%20in%20vizag%20%7C%20candid%20photographer!5e0!3m2!1sen!2sin!4v1722000000000!5m2!1sen!2sin";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [mapEmbed, setMapEmbed] = useState(DEFAULT_MAP_EMBED);

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => r.json())
      .then((data) => {
        const embed = typeof data === "object" && data !== null ? data.google_maps_embed : null;
        if (typeof embed === "string" && embed.includes("google.com/maps")) {
          setMapEmbed(embed);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.website) {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden vignette">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/01.jpg"
            alt="Contact Arni Photography"
            fill
            className="object-cover ken-burns"
          />
          <div className="absolute inset-0 bg-bg/75" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <div className="w-12 h-[1px] bg-gold mx-auto mb-8" />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase block mb-4">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-cream leading-tight">
            Let&apos;s Create
            <br />
            <span className="text-gradient">Something Beautiful</span>
          </h1>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="lg:col-span-3"
          >
            <GlassPanel className="p-8 md:p-10">
              <div className="w-10 h-[1px] bg-gold mb-6" />
              <h2 className="text-xl font-heading font-bold text-cream mb-2">Send a Message</h2>
              <p className="text-sm text-muted mb-8">We&apos;ll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="website">Leave this field empty</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] text-muted/60 mb-2 tracking-wider uppercase">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-bg/50 border border-border/50 rounded-xl text-cream focus:border-gold/50 focus:outline-none transition-all duration-300 text-sm"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted/60 mb-2 tracking-wider uppercase">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-bg/50 border border-border/50 rounded-xl text-cream focus:border-gold/50 focus:outline-none transition-all duration-300 text-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-muted/60 mb-2 tracking-wider uppercase">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3.5 bg-bg/50 border border-border/50 rounded-xl text-cream focus:border-gold/50 focus:outline-none transition-all duration-300 text-sm"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted/60 mb-2 tracking-wider uppercase">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3.5 bg-bg/50 border border-border/50 rounded-xl text-cream focus:border-gold/50 focus:outline-none transition-all duration-300 resize-none text-sm"
                    placeholder="Tell us about your event..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-cinema w-full py-4 bg-gold text-bg font-semibold rounded-xl hover:bg-gold-light transition-all duration-300 disabled:opacity-50 text-xs tracking-[0.2em] uppercase"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </GlassPanel>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="lg:col-span-2 space-y-5"
          >
            <GlassPanel>
              <div className="w-8 h-[1px] bg-gold mb-5" />
              <h3 className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
                Studio Address
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                1st floor 106, 107, 107A right commercial space,
                <br />
                Dutt Island, above Apollo Pharmacy,
                <br />
                Siripuram, Visakhapatnam-530003
              </p>
            </GlassPanel>

            <GlassPanel>
              <div className="w-8 h-[1px] bg-gold mb-5" />
              <h3 className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
                Contact
              </h3>
              <div className="space-y-4 text-sm">
                <a
                  href="tel:+918008948977"
                  className="flex items-center gap-3 text-cream hover:text-gold transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  +91 8008948977
                </a>
                <a
                  href="mailto:Arniconglomerate@gmail.com"
                  className="flex items-center gap-3 text-cream hover:text-gold transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  Arniconglomerate@gmail.com
                </a>
              </div>
            </GlassPanel>

            <GlassPanel>
              <div className="w-8 h-[1px] bg-gold mb-5" />
              <h3 className="text-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[
                  { name: "Instagram", href: "https://www.instagram.com/arniphotographyy/" },
                  { name: "Facebook", href: "https://www.facebook.com/Arunikitha/" },
                  { name: "YouTube", href: "https://www.youtube.com/channel/UC4HWnC-vrF6Hq9urwDnnARA" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 glass rounded-full text-xs text-muted hover:text-gold hover:border-gold/30 transition-all duration-300"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </GlassPanel>

            {/* Map */}
            <div className="glass rounded-xl overflow-hidden h-64 relative">
              <iframe
                src={mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.6) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Arni Photography Studio Location"
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${STUDIO_COORDS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3.5 border border-gold/30 text-gold rounded-full hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 text-[11px] tracking-[0.15em] uppercase font-semibold"
            >
              Get Directions
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
