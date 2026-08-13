"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card3D } from "@/components/ui/card-3d";

const FALLBACK_CATEGORIES: Record<string, { label: string; description: string; image: string }> = {
  wedding: {
    label: "Wedding Photos",
    description: "Timeless frames that capture every sacred ritual, stolen glance, and joyful tear.",
    image: "/images/services/wedding.jpg",
  },
  seemantham: {
    label: "Seemantham Photos",
    description: "Elegant coverage of the beautiful baby shower ceremony.",
    image: "/images/services/seemantham.jpg",
  },
  reception: {
    label: "Reception Photos",
    description: "Glamorous, high-energy coverage of your grand reception celebration.",
    image: "/images/services/reception.webp",
  },
  preshoot: {
    label: "Pre Shoot Photos",
    description: "Intimate, cinematic pre-wedding shoots that tell your unique love story.",
    image: "/images/services/preshoot.webp",
  },
};

const allImages = Array.from({ length: 20 }, (_, i) => {
  const ext = i === 1 || i === 4 || i === 8 ? "webp" : "jpg";
  return {
    src: `/images/gallery/${String(i + 1).padStart(2, "0")}.${ext}`,
    category: ["wedding", "seemantham", "reception", "preshoot"][i % 4],
  };
});

interface GalleryImage {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  alt: string;
  category: string;
}

interface Category {
  name: string;
  slug: string;
}

export default function PortfolioPage() {
  const params = useParams();
  const category = params.category as string;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [categoryNav, setCategoryNav] = useState<Category[]>([]);

  const fallbackCategory = FALLBACK_CATEGORIES[category] || FALLBACK_CATEGORIES.wedding;
  const cat = {
    label: categoryNav.find((item) => item.slug === category)?.name || fallbackCategory.label,
    description: fallbackCategory.description,
    image: fallbackCategory.image,
  };

  useEffect(() => {
    fetch("/api/public/categories?type=gallery")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCategoryNav(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/public/gallery?category=${encodeURIComponent(category)}`)
      .then((response) => response.json())
      .then((data) => setGallery(Array.isArray(data) ? data : []))
      .catch(() => setGallery([]));
  }, [category]);

  const filtered = gallery.length > 0
    ? gallery.map((image) => ({ src: image.thumbnailUrl || image.url, alt: image.alt }))
    : allImages
        .filter((image) => image.category === category)
        .map((image) => ({ src: image.src, alt: "" }));
  const navigation = categoryNav.length > 0
    ? categoryNav.map((item) => ({ slug: item.slug, label: item.name }))
    : Object.entries(FALLBACK_CATEGORIES).map(([slug, data]) => ({ slug, label: data.label }));

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden vignette mb-16">
        <div className="absolute inset-0">
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            className="object-cover ken-burns opacity-30"
          />
          <div className="absolute inset-0 bg-bg/70" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <div className="w-12 h-[1px] bg-gold mx-auto mb-8" />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase block mb-4">
            Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-cream leading-tight">
            {cat.label}
          </h1>
          <p className="text-muted text-base max-w-xl mx-auto mt-6">
            {cat.description}
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Category tabs */}
        <div className="flex justify-center gap-2 mb-14 flex-wrap">
          {navigation.map((nav) => (
            <Link
              key={nav.slug}
              href={`/portfolio/${nav.slug}`}
              className={`px-6 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                nav.slug === category
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "border border-border/50 text-muted hover:text-cream hover:border-cream/20"
              }`}
            >
              {nav.label}
            </Link>
          ))}
        </div>

        {/* Image count */}
        <div className="text-center mb-10">
          <span className="text-[11px] text-muted/40 tracking-wider uppercase">
            {filtered.length} Photos
          </span>
        </div>

        {/* Gallery grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={`${category}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="break-inside-avoid"
                onClick={() => setSelectedImage(img.src)}
              >
                <Card3D maxTilt={8} className="cursor-pointer">
                  <div className="glass rounded-xl overflow-hidden img-zoom group relative">
                    <img
                      src={img.src}
                      alt={img.alt || `${cat.label} ${i + 1}`}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                        <span className="text-[10px] text-cream/80 tracking-wider uppercase">View</span>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-cream/60 hover:text-cream transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
            >
              <Image
                src={selectedImage}
                alt="Full size preview"
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
