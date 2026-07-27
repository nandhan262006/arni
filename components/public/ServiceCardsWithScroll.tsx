"use client";

import { useEffect, useState } from "react";
import ServiceCards3D, { type Service } from "./ServiceCards3D";

export default function ServiceCardsWithScroll() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/public/services")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setServices(
          data.map((s: Record<string, unknown>) => ({
            id: String(s.id),
            title: s.title as string,
            description: s.description as string,
            imageUrl: (s.imageUrl ?? s.image_url ?? "") as string,
            category: (s.category ?? "") as string,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return <ServiceCards3D services={services} />;
}
