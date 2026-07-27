import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arni Photography | Best Photographers in Vizag",
    template: "%s | Arni Photography",
  },
  description:
    "Capture timeless moments with Arni Photography in Visakhapatnam. We specialize in wedding, candid, and event photography. 12+ years of cinematic storytelling. Book your session today!",
  icons: {
    icon: "/favicon.png",
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
