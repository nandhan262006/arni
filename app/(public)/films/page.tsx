"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card3D } from "@/components/ui/card-3d";

interface Film {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  category: string;
  featured: boolean;
}

const FALLBACK_FILMS = [
  { id: 1, title: "Cinematic Wedding", description: "A love story in motion", videoUrl: "/videos/films/v1.mp4", thumbnailUrl: null, category: "modern", featured: true },
  { id: 2, title: "Timeless Romance", description: "Classic storytelling at its finest", videoUrl: "/videos/films/v12.mp4", thumbnailUrl: null, category: "classic", featured: false },
  { id: 3, title: "The Beginning", description: "Where the story starts", videoUrl: "/videos/films/video1.mp4", thumbnailUrl: null, category: "modern", featured: false },
  { id: 4, title: "Eternal Bond", description: "Captured in every frame", videoUrl: "/videos/films/v2.mp4", thumbnailUrl: null, category: "modern", featured: false },
  { id: 5, title: "Golden Hour", description: "Warmth and wonder", videoUrl: "/videos/films/v4.mp4", thumbnailUrl: null, category: "classic", featured: false },
  { id: 6, title: "Forever After", description: "The day that changed everything", videoUrl: "/videos/films/video2.mp4", thumbnailUrl: null, category: "classic", featured: false },
  { id: 7, title: "Sacred Vows", description: "Promises that last", videoUrl: "/videos/films/v3.mp4", thumbnailUrl: null, category: "modern", featured: false },
  { id: 8, title: "Joy & Celebration", description: "Every moment counts", videoUrl: "/videos/films/v5.mp4", thumbnailUrl: null, category: "modern", featured: false },
];

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    fetch("/api/public/films")
      .then((r) => r.json())
      .then((data) => {
        setFilms(Array.isArray(data) && data.length > 0 ? data : FALLBACK_FILMS);
      })
      .catch(() => setFilms(FALLBACK_FILMS))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(films.map((f) => f.category))];
  const filtered = activeCategory === "all" ? films : films.filter((f) => f.category === activeCategory);

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden vignette mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-bg to-bg" />
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/videos/films/v1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-bg/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <div className="w-12 h-[1px] bg-gold mx-auto mb-8" />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase block mb-4">
            Cinematic Films
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient leading-tight">
            Inspired by Cinema.
          </h1>
          <p className="text-muted text-base max-w-xl mx-auto mt-6">
            Every wedding has a story. We tell yours through the lens of cinema — dramatic, intimate, unforgettable.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Category filter */}
        <div className="flex justify-center gap-2 mb-14 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "border border-border/50 text-muted hover:text-cream hover:border-cream/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((film, i) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                onClick={() => setSelectedFilm(film)}
              >
                <Card3D maxTilt={10} className="cursor-pointer">
                  <div className="glass rounded-xl overflow-hidden group">
                    <div className="relative img-zoom">
                      <video
                        src={film.videoUrl}
                        className="w-full h-auto block"
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-12 h-12 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30">
                          <svg className="w-4 h-4 text-gold ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {film.featured && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-gold/20 backdrop-blur-md rounded-full border border-gold/30">
                          <span className="text-[9px] text-gold font-semibold tracking-wider uppercase">Featured</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-sm font-heading font-bold text-cream">
                        {film.title}
                      </h3>
                      {film.description && (
                        <p className="text-xs text-muted/60 mt-1.5">{film.description}</p>
                      )}
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen video lightbox */}
      <AnimatePresence>
        {selectedFilm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setSelectedFilm(null)}
          >
            <button
              onClick={() => setSelectedFilm(null)}
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
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedFilm.videoUrl}
                className="w-full max-h-[80vh] rounded-xl"
                controls
                autoPlay
                playsInline
              />
              <div className="text-center mt-6">
                <h3 className="text-xl font-heading text-cream">{selectedFilm.title}</h3>
                <p className="text-muted text-sm mt-1">{selectedFilm.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
