import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arni Photography | Best Photographers in Vizag",
    template: "%s | Arni Photography",
  },
  description:
    "Capture timeless moments with Arni Photography in Visakhapatnam. We specialize in wedding, candid, and event photography. 12+ years of cinematic storytelling. Book your session today!",
  applicationName: "Arni Photography",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Arni Photography",
    title: "Arni Photography | Best Photographers in Vizag",
    description:
      "Wedding, candid and event photography in Visakhapatnam. 12+ years of cinematic storytelling.",
    locale: "en_IN",
    images: [
      {
        url: `${siteUrl}/images/hero/01.jpg`,
        width: 1600,
        height: 1067,
        alt: "Arni Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arni Photography | Best Photographers in Vizag",
    description:
      "Wedding, candid and event photography in Visakhapatnam. 12+ years of cinematic storytelling.",
    images: [`${siteUrl}/images/hero/01.jpg`],
  },
  icons: {
    icon: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full bg-bg text-cream font-body grain">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f5f5f0",
              border: "1px solid #2a2a2a",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
