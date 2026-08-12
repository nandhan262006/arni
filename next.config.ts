import type { NextConfig } from "next";

const videoCdnUrl = process.env.VIDEO_CDN_URL?.replace(/\/+$/, "");

const r2PublicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "arniphotography.in",
      },
      ...(r2Hostname
        ? [
            {
              protocol: "https" as const,
              hostname: r2Hostname,
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async rewrites() {
    if (!videoCdnUrl) {
      return [];
    }
    return [
      {
        source: "/videos/:path*",
        destination: `${videoCdnUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
