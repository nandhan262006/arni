"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card3D } from "@/components/ui/card-3d";
import { GlassPanel } from "@/components/ui/glass-panel";

const stats = [
  { value: 12, suffix: "+", label: "Years Experience" },
  { value: 1000, suffix: "+", label: "Projects Delivered" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 4, suffix: "", label: "Awards Won" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden vignette">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/03.webp"
            alt="Arni Photography"
            fill
            className="object-cover ken-burns"
          />
          <div className="absolute inset-0 bg-bg/70" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <div className="w-12 h-[1px] bg-gold mx-auto mb-8" />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase block mb-4">
            About Arni Photography
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient leading-tight">
            Capturing Moments.
            <br />
            Creating Memories.
          </h1>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-20 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            >
              <GlassPanel className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[11px] text-muted/60 tracking-[0.15em] uppercase">{stat.label}</div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Story - Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-72 rounded-xl overflow-hidden img-zoom">
                <Image
                  src="/images/about/01.webp"
                  alt="Arni Photography"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-72 rounded-xl overflow-hidden img-zoom mt-10">
                <Image
                  src="/images/about/02.webp"
                  alt="Arni Photography"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-10 h-[1px] bg-gold mb-6" />
            <span className="text-gold text-[11px] tracking-[0.3em] uppercase">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mt-4 mb-8 leading-snug">
              Where passion meets the lens
            </h2>
            <p className="text-muted leading-relaxed mb-5 text-sm">
              Considered a rising name in the world of modern photography and visual
              storytelling, Arni Photography has been redefining the way memories are
              captured and cherished. With a passion for creating frames that are both
              timeless and soulful, we have become a trusted choice for portraits,
              events, and artistic photography across diverse styles.
            </p>
            <p className="text-muted leading-relaxed mb-5 text-sm">
              Every smile, every tear, every glance — we believe your story deserves
              to be told beautifully. With over 12 years of expertise, ARNI Photography
              transforms fleeting moments into timeless treasures through our signature
              blend of candid photography and cinematic videography.
            </p>
            <p className="text-muted leading-relaxed mb-8 text-sm">
              At ARNI Photography, we don&apos;t just take pictures — we create experiences.
              With cutting-edge equipment, cinematic editing, and a client-first approach,
              we ensure comfort, confidence, and satisfaction at every step.
            </p>

            <Link
              href="/contact"
              className="btn-cinema inline-block px-10 py-4 bg-gold text-bg font-semibold rounded-full hover:bg-gold-light transition-all duration-300 text-xs tracking-[0.2em] uppercase"
            >
              Work With Us
            </Link>
          </motion.div>
        </div>

        {/* Approach Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              ),
              title: "Cutting-Edge Equipment",
              text: "We use the latest professional cameras, lenses, and lighting to ensure every shot is flawless.",
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m1.5 3.75c-.621 0-1.125-.504-1.125-1.125" />
                </svg>
              ),
              title: "Cinematic Videography",
              text: "Our films are crafted with the same care as cinema — each frame a work of art.",
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              ),
              title: "Client-First Approach",
              text: "Your comfort and satisfaction are our priority. We work around your vision and preferences.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
            >
              <Card3D maxTilt={10}>
                <GlassPanel className="text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5 text-gold">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-cream mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                </GlassPanel>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
          <div className="relative">
            <div className="w-12 h-[1px] bg-gold mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-4">
              Ready to create something beautiful?
            </h2>
            <p className="text-muted mb-10 max-w-xl mx-auto text-sm">
              Let us capture your most precious moments. Reach out and we&apos;ll craft a
              story that lasts forever.
            </p>
            <Link
              href="/contact"
              className="btn-cinema inline-block px-12 py-5 bg-gold text-bg font-semibold rounded-full hover:bg-gold-light transition-all duration-300 text-xs tracking-[0.2em] uppercase"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
