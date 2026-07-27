"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card3D } from "@/components/ui/card-3d";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
}

const editorialMedia = [
  { type: "image" as const, src: "/images/editorial/AR203957.webp", alt: "Editorial 1" },
  { type: "video" as const, src: "/videos/editorial/v3.mp4", alt: "Film 1" },
  { type: "image" as const, src: "/images/editorial/DSC03473.webp", alt: "Editorial 2" },
  { type: "video" as const, src: "/videos/editorial/video2.mp4", alt: "Film 2" },
  { type: "image" as const, src: "/images/editorial/DSC02616.webp", alt: "Editorial 3" },
  { type: "video" as const, src: "/videos/editorial/v1.mp4", alt: "Film 3" },
  { type: "image" as const, src: "/images/editorial/DSC04093.webp", alt: "Editorial 4" },
  { type: "video" as const, src: "/videos/editorial/v4.mp4", alt: "Film 4" },
  { type: "image" as const, src: "/images/editorial/4.webp", alt: "Editorial 5" },
  { type: "video" as const, src: "/videos/editorial/v12.mp4", alt: "Film 5" },
  { type: "image" as const, src: "/images/editorial/DSC08009.webp", alt: "Editorial 6" },
  { type: "video" as const, src: "/videos/editorial/v2.mp4", alt: "Film 6" },
  { type: "video" as const, src: "/videos/editorial/v5.mp4", alt: "Film 7" },
];

export default function EditorialPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/posts?limit=20")
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden vignette mb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/editorial/AR203957.webp"
            alt="Editorial"
            fill
            className="object-cover ken-burns opacity-40"
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
            Editorial
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-cream leading-tight">
            Stories <span className="text-gradient">&amp;</span> Visuals
          </h1>
          <p className="text-muted text-base max-w-xl mx-auto mt-6">
            Behind-the-scenes moments, photography highlights, and cinematic shorts.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Masonry media grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mb-24">
          {editorialMedia.map((media, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.6 }}
              className="break-inside-avoid"
            >
              <Card3D maxTilt={6}>
                <div className="glass rounded-xl overflow-hidden img-zoom group relative">
                  {media.type === "video" ? (
                    <>
                      <video
                        src={media.src}
                        className="w-full h-auto block"
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-10 h-10 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30">
                          <svg className="w-3.5 h-3.5 text-gold ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-cream/80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  )}
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Blog posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-6" />
          <span className="text-gold text-[11px] tracking-[0.3em] uppercase">
            Latest Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mt-4">
            From the Blog
          </h2>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="w-10 h-[1px] bg-gold/30 mx-auto mb-4" />
            <p className="text-muted mb-1 text-sm">No articles yet</p>
            <p className="text-muted/40 text-xs">Check back soon for stories and insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link href={`/editorial/${post.slug}`}>
                  <Card3D maxTilt={10}>
                    <div className="glass rounded-xl overflow-hidden group">
                      {post.coverImage ? (
                        <div className="aspect-[16/10] relative overflow-hidden img-zoom">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] bg-surface-alt flex items-center justify-center">
                          <div className="w-10 h-[1px] bg-gold/20" />
                        </div>
                      )}
                      <div className="p-6">
                        <span className="text-[10px] text-muted/50 tracking-wider uppercase">
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <h3 className="text-base font-heading font-bold text-cream mt-2 mb-2 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-xs text-muted/60 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-2 mt-4 text-gold text-xs font-medium tracking-wider uppercase group">
                          Read more
                          <span className="w-4 h-[1px] bg-gold/40 transition-all duration-300 group-hover:w-6" />
                        </span>
                      </div>
                    </div>
                  </Card3D>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
