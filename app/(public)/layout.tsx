import { type Metadata } from "next";
import PublicLayoutClient from "@/components/public/public-layout";

export const metadata: Metadata = {
  title: "Arni Photography | Best Photographers in Vizag",
  description:
    "Capture timeless moments with Arni Photography in Visakhapatnam. Wedding, candid, event photography. 12+ years of cinematic storytelling.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}
