import type { NextConfig } from "next";

const videoCdnUrl = process.env.VIDEO_CDN_URL?.replace(/\/+$/, "");

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
