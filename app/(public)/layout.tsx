import { type Metadata } from "next";
import PublicLayoutClient from "@/components/public/public-layout";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Arni Photography | Best Photographers in Vizag",
  description:
    "Capture timeless moments with Arni Photography in Visakhapatnam. Wedding, candid, event photography. 12+ years of cinematic storytelling.",
  alternates: {
    canonical: "/",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Arni Photography",
  image: `${siteUrl}/images/logos/logo-header.png`,
  url: siteUrl,
  telephone: "+918008948977",
  email: "Arniconglomerate@gmail.com",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "1st floor 106, 107, 107A right commercial space, Dutt Island, above Apollo Pharmacy",
    addressLocality: "Siripuram, Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "530003",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.7238354,
    longitude: 83.318415,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "21:00",
  },
  sameAs: [
    "https://www.instagram.com/arniphotographyy/",
    "https://www.facebook.com/Arunikitha/",
    "https://www.youtube.com/channel/UC4HWnC-vrF6Hq9urwDnnARA",
  ],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <PublicLayoutClient>{children}</PublicLayoutClient>
    </>
  );
}
