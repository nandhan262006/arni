import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/films`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/editorial`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/portfolio/wedding`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/portfolio/seemantham`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/portfolio/reception`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/portfolio/preshoot`, changeFrequency: "monthly", priority: 0.8 },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import("@/db");

    const publishedPosts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });

    dynamicRoutes = publishedPosts.map((post) => ({
      url: `${siteUrl}/editorial/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // If the DB is unreachable (e.g. during a first deploy before migrations),
    // fall back to static routes only rather than failing the whole sitemap.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
