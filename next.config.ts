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
