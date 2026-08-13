"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Card3D } from "@/components/ui/card-3d";
import { GlassPanel } from "@/components/ui/glass-panel";
import ServiceCardsWithScroll from "@/components/public/ServiceCardsWithScroll";

const gallerySample = Array.from({ length: 20 }, (_, i) => {
  const ext = [2, 5, 9].includes(i + 1) ? "webp" : "jpg";
  return `/images/gallery/${String(i + 1).padStart(2, "0")}.${ext}`;
});

const DEFAULT_HERO_IMAGES = [
  "/images/hero/01.jpg",
  "/images/hero/02.webp",
  "/images/hero/03.webp",
];

const testimonials = [
  {
    name: "Priya & Rahul",
    event: "Wedding",
    text: "Arni captured our wedding in the most beautiful way possible. Each photo tells a story and brings back all the emotions. Truly magical work!",
    rating: 5,
  },
  {
    name: "Ananya S.",
    event: "Seemantham",
    text: "The seemantham photos were beyond our expectations. Every guest complimented the photographer's patience and eye for detail.",
    rating: 5,
  },
  {
    name: "Vikram & Shreya",
    event: "Reception",
    text: "From the candid moments to the grand shots, Arni delivered perfection. The cinematic video still makes us cry happy tears.",
    rating: 5,
  },
];

const marqueeImages = [
  ...gallerySample.slice(0, 10),
  ...gallerySample.slice(0, 10),
];

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState(DEFAULT_HERO_IMAGES);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    fetch("/api/public/hero-images")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const urls = data
            .map((img: { url: string }) => img.url)
            .filter((u: string) => typeof u === "string" && u.length > 0);
          if (urls.length > 0) setHeroImages(urls);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div>
      {/* ─── Cinematic Hero ─── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden vignette">
        {/* Video/Image Background */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={`Arni Photography ${i + 1}`}
                fill
                className="object-cover ken-burns"
                priority={i === 0}
              />
            </div>
          ))}
        </motion.div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/30 to-bg/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-bg/40" />

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity, y: heroTextY }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Top accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-16 h-[1px] bg-gold mx-auto mb-8"
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <img
              src="/images/logos/logo-header.png"
              alt="Arni Photography"
              className="mx-auto mb-8 h-auto max-w-[520px] w-[85%] drop-shadow-2xl"
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-cream/60 text-base md:text-lg max-w-2xl mx-auto mb-4 leading-relaxed tracking-wide"
          >
            Candid Photography & Cinematic Videography
          </motion.p>

          {/* Script text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="font-script text-3xl md:text-5xl text-gold/80 mb-12"
          >
            since 2012
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/portfolio/wedding"
              className="btn-cinema px-10 py-4 bg-gold text-bg font-semibold rounded-full hover:bg-gold-light transition-all duration-300 text-xs tracking-[0.2em] uppercase"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="btn-cinema px-10 py-4 border border-cream/20 text-cream rounded-full hover:border-gold/50 hover:text-gold transition-all duration-300 text-xs tracking-[0.2em] uppercase"
            >
              Book Your Session
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] text-muted/50 tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-gold/60 to-transparent scroll-indicator" />
        </motion.div>

        {/* Bottom corners info */}
        <div className="absolute bottom-8 left-0 right-0 z-10 hidden md:block">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-[10px] text-muted/40 tracking-[0.2em] uppercase">
            <span>Visakhapatnam, India</span>
            <span>Award-Winning Studio</span>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="relative py-16 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "12", suffix: "+", label: "Years Experience" },
              { value: "1000", suffix: "+", label: "Projects Delivered" },
              { value: "500", suffix: "+", label: "Happy Clients" },
              { value: "4", suffix: "", label: "Awards Won" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-gold mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[11px] text-muted/60 tracking-[0.15em] uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Horizontal Gallery Strip ─── */}
      <section className="py-8 overflow-hidden relative">
        <div className="gallery-strip">
          {marqueeImages.map((src, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-44 relative overflow-hidden group">
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-bg/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Services ─── */}
      <ServiceCardsWithScroll />

      {/* ─── Featured Films ─── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-surface/50 to-bg" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-6" />
            <span className="text-gold text-[11px] tracking-[0.3em] uppercase">
              Cinematic Films
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-cream mt-4 mb-6">
              Inspired by Cinema.
            </h2>
            <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
              Every love story deserves to be told in motion — dramatic, intimate, unforgettable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { src: "/videos/films/v1.mp4", title: "Cinematic Wedding", subtitle: "A Love Story" },
              { src: "/videos/films/v12.mp4", title: "Timeless Romance", subtitle: "Classic Moments" },
              { src: "/videos/films/v2.mp4", title: "Eternal Bond", subtitle: "Forever Yours" },
              { src: "/videos/films/v3.mp4", title: "Sacred Vows", subtitle: "Promises Kept" },
            ].map((film, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <Card3D maxTilt={8}>
                  <div className="glass rounded-xl overflow-hidden group">
                    <div className="relative img-zoom">
                      <video
                        src={film.src}
                        className="w-full h-auto block"
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-14 h-14 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30">
                          <svg className="w-5 h-5 text-gold ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-[1px] bg-gold/40" />
                        <span className="text-[10px] font-medium text-gold/70 uppercase tracking-[0.2em]">Watch</span>
                      </div>
                      <h4 className="text-base font-heading font-bold text-cream">{film.title}</h4>
                      <p className="text-xs text-muted/60 mt-1">{film.subtitle}</p>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link
              href="/films"
              className="inline-flex items-center gap-3 text-gold hover:text-gold-light transition-all duration-300 font-medium text-sm tracking-wider uppercase group"
            >
              <span className="w-8 h-[1px] bg-gold/40 transition-all duration-300 group-hover:w-12" />
              Explore All Films
              <span className="w-8 h-[1px] bg-gold/40 transition-all duration-300 group-hover:w-12" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-6" />
            <span className="text-gold text-[11px] tracking-[0.3em] uppercase">
              Our Work
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-cream mt-4 mb-6">
              Through the Lens
            </h2>
            <p className="text-muted text-base max-w-lg mx-auto">
              We don&apos;t just take pictures — we create memories you can hold forever.
            </p>
          </motion.div>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-0 space-y-0">
          {gallerySample.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="break-inside-avoid img-zoom group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                  <span className="text-[10px] text-cream/80 tracking-[0.2em] uppercase">View</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            href="/portfolio/wedding"
            className="inline-flex items-center gap-3 text-gold hover:text-gold-light transition-all duration-300 font-medium text-sm tracking-wider uppercase group"
          >
            <span className="w-8 h-[1px] bg-gold/40 transition-all duration-300 group-hover:w-12" />
            View Full Portfolio
            <span className="w-8 h-[1px] bg-gold/40 transition-all duration-300 group-hover:w-12" />
          </Link>
        </motion.div>
      </section>

      {/* ─── Story Section ─── */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-80 lg:h-auto min-h-[450px] img-zoom">
              <Image
                src="/images/about/01.webp"
                alt="Arni Photography Story"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg/30 hidden lg:block" />
            </div>
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="w-10 h-[1px] bg-gold mb-6" />
              <span className="text-gold text-[11px] tracking-[0.3em] uppercase mb-4 block">
                Our Story
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-cream mb-8 leading-snug">
                Every smile, every tear, every glance — your story deserves to be told beautifully.
              </h2>
              <p className="text-muted leading-relaxed mb-4 text-sm">
                Considered a rising name in the world of modern photography and visual
                storytelling, Arni Photography has been redefining the way memories are
                captured and cherished. With a passion for creating frames that are both
                timeless and soulful, we have become a trusted choice for portraits,
                events, and artistic photography across diverse styles.
              </p>
              <p className="text-muted leading-relaxed text-sm mb-8">
                For over 12 years, we&apos;ve specialized in transforming moments into
                everlasting stories — whether the warmth of a smile, the grandeur of a
                celebration, or the serenity of a landscape.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-gold hover:text-gold-light transition-all duration-300 font-medium text-sm tracking-wider uppercase group w-fit"
              >
                Learn more
                <span className="w-6 h-[1px] bg-gold/40 transition-all duration-300 group-hover:w-10" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-surface/30 to-bg" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-6" />
            <span className="text-gold text-[11px] tracking-[0.3em] uppercase">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-cream mt-4">
              Kind Words
            </h2>
          </motion.div>

          {/* Auto-scrolling testimonial carousel */}
          <div className="relative -mx-4 px-4">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex gap-6 animate-marquee w-max">
                {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                  <div key={i} className="w-[350px] flex-shrink-0">
                    <GlassPanel className="h-full relative">
                      <div className="absolute top-4 right-6 text-5xl text-gold/10 font-heading leading-none">
                        &ldquo;
                      </div>

                      <div className="flex gap-1 mb-5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <svg key={j} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-cream/70 text-sm leading-relaxed mb-8 italic">
                        &ldquo;{t.text}&rdquo;
                      </p>

                      <div className="border-t border-border/50 pt-5">
                        <p className="text-cream font-semibold text-sm">{t.name}</p>
                        <p className="text-gold/60 text-[11px] tracking-wider uppercase mt-1">{t.event}</p>
                      </div>
                    </GlassPanel>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about/03.jpg"
            alt="Wedding photography"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg/50 via-transparent to-bg/50" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-12 h-[1px] bg-gold mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-cream mb-6 leading-tight">
              Your wedding is not just an event — it&apos;s the beginning of a lifetime of memories.
            </h2>
            <p className="text-cream/60 text-base mb-12 max-w-lg mx-auto">
              We make sure every frame speaks of love, laughter, and legacy.
            </p>
            <Link
              href="/contact"
              className="btn-cinema inline-block px-12 py-5 bg-gold text-bg font-semibold rounded-full hover:bg-gold-light transition-all duration-300 text-xs tracking-[0.2em] uppercase animate-glow"
            >
              Book Your Session
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Immersive Video Finale ─── */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden vignette">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/about/02.webp"
        >
          <source src="/videos/landscape.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-bg/50" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="w-12 h-[1px] bg-gold/60 mx-auto mb-8" />
            <p className="text-cream/90 text-xl md:text-3xl font-heading leading-relaxed italic">
              &ldquo;Your wedding is not just an event — it&apos;s the beginning of a lifetime of memories.
              We make sure every frame speaks of love, laughter, and legacy.&rdquo;
            </p>
            <div className="w-12 h-[1px] bg-gold/60 mx-auto mt-8" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
