"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
}

export default function EditorialPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/posts?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setPost(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-4 text-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-32 pb-24 px-4 text-center">
        <div className="glass rounded-2xl p-12 max-w-lg mx-auto">
          <div className="w-10 h-[1px] bg-gold/30 mx-auto mb-6" />
          <h1 className="text-2xl font-heading text-cream mb-4">Post Not Found</h1>
          <p className="text-muted mb-8 text-sm">
            The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/editorial"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm tracking-wider uppercase"
          >
            <span className="w-4 h-[1px] bg-gold/40" />
            Back to Editorial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Back link */}
          <Link
            href="/editorial"
            className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors text-sm mb-10 tracking-wider uppercase"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Editorial
          </Link>

          {/* Cover image */}
          {post.coverImage && (
            <div className="aspect-[21/9] relative rounded-2xl overflow-hidden mb-10 img-zoom">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/30 to-transparent" />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-gold" />
            <span className="text-gold text-[11px] tracking-[0.2em] uppercase">
              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-cream mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-muted/70 mb-10 leading-relaxed font-heading italic">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="glass rounded-2xl p-8 md:p-12">
            <article
              className="prose prose-invert prose-gold max-w-none
                prose-headings:font-heading prose-headings:text-cream
                prose-p:text-muted/80 prose-p:leading-relaxed prose-p:text-sm
                prose-a:text-gold prose-a:no-underline hover:prose-a:text-gold-light
                prose-img:rounded-xl prose-img:w-full
                prose-blockquote:border-gold/30 prose-blockquote:text-cream/60 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Bottom nav */}
          <div className="mt-12 text-center">
            <Link
              href="/editorial"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm tracking-wider uppercase"
            >
              <span className="w-4 h-[1px] bg-gold/40" />
              Back to Editorial
              <span className="w-4 h-[1px] bg-gold/40" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
