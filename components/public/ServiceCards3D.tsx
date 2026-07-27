"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const FALLBACK_SERVICES: Service[] = [
  { id: "1", title: "Wedding Photos", description: "Timeless frames that capture every sacred ritual, stolen glance, and joyful tear of your special day.", imageUrl: "/images/services/wedding.jpg", category: "wedding" },
  { id: "2", title: "Seemantham Photos", description: "Elegant coverage of the beautiful baby shower ceremony, preserving the love and blessings of family.", imageUrl: "/images/services/seemantham.jpg", category: "seemantham" },
  { id: "3", title: "Reception Photos", description: "Glamorous, high-energy coverage of your grand reception — every smile, every dance, every celebration.", imageUrl: "/images/services/reception.webp", category: "reception" },
  { id: "4", title: "Pre Shoot Photos", description: "Intimate, cinematic pre-wedding shoots that tell your unique love story before the big day.", imageUrl: "/images/services/preshoot.webp", category: "preshoot" },
];

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  "linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #1b3a4e 0%, #1a2a2e 100%)",
  "linear-gradient(135deg, #3a1b2e 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #1a3a1b 0%, #1a1a2e 100%)",
];

function getCardTransform(offset: number) {
  if (offset === 0) {
    return { tx: 0, tz: 200, ry: 0, scale: 1, opacity: 1 };
  }
  const sign = offset > 0 ? 1 : -1;
  const abs = Math.abs(offset);
  if (abs === 1) {
    return { tx: sign * 120, tz: 50, ry: sign * -25, scale: 0.88, opacity: 0.7 };
  }
  if (abs === 2) {
    return { tx: sign * 240, tz: -200, ry: sign * -50, scale: 0.76, opacity: 0.4 };
  }
  return { tx: sign * (240 + (abs - 2) * 120), tz: -200, ry: sign * -(50 + (abs - 2) * 25), scale: Math.max(0.64, 0.76 - (abs - 2) * 0.12), opacity: Math.max(0.1, 0.4 - (abs - 2) * 0.15) };
}

interface Props {
  services: Service[];
  onOverflowNext?: () => void;
  onOverflowPrev?: () => void;
}

export default function ServiceCards3D({ services, onOverflowNext, onOverflowPrev }: Props) {
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const list = services.length > 0 ? services : FALLBACK_SERVICES;
  const total = list.length;

  const goNext = useCallback(() => {
    if (active < total - 1) {
      setActive((p) => p + 1);
    } else {
      onOverflowNext?.();
    }
  }, [active, total, onOverflowNext]);

  const goPrev = useCallback(() => {
    if (active > 0) {
      setActive((p) => p - 1);
    } else {
      onOverflowPrev?.();
    }
  }, [active, onOverflowPrev]);

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    isDragging.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 10) isDragging.current = true;
    if (dx < -60) { goNext(); startX.current = e.clientX; }
    else if (dx > 60) { goPrev(); startX.current = e.clientX; }
  };

  const handlePointerUp = () => { isDragging.current = false; };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext(); else goPrev();
    }
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    wheelAccum.current += e.deltaY;
    if (wheelTimer.current) clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 200);
    if (wheelAccum.current > 80) { goNext(); wheelAccum.current = 0; }
    else if (wheelAccum.current < -80) { goPrev(); wheelAccum.current = 0; }
  }, [goNext, goPrev]);

  return (
    <section id="services" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-surface/30 to-bg" />

      <div className="relative max-w-7xl mx-auto px-4 text-center mb-16">
        <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-6" />
        <span className="text-gold text-[11px] tracking-[0.3em] uppercase">Services</span>
        <h2 className="text-4xl md:text-6xl font-heading font-bold text-cream mt-4">
          What We Offer
        </h2>
      </div>

      <div
        className="relative w-full overflow-visible"
        style={{ perspective: "1200px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          className="relative mx-auto"
          style={{ width: "min(300px, 65vw)", height: "min(400px, 87vw)" }}
        >
          {list.map((service, i) => {
            const offset = i - active;
            if (Math.abs(offset) > 3) return null;

            const { tx, tz, ry, scale, opacity } = getCardTransform(offset);

            return (
              <div
                key={service.id}
                className="absolute cursor-pointer"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: total - Math.abs(offset),
                  transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                  transition: "all 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  opacity,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (!isDragging.current) setActive(i);
                }}
              >
                <div
                  className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
                >
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 300px"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: FALLBACK_GRADIENTS[i % 5] }}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                    {service.category && (
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gold/70 block mb-2">
                        {service.category}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-white leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-2 line-clamp-2">{service.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2.5 mt-10">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`transition-all duration-500 rounded-full ${
              i === active
                ? "w-8 h-2 bg-gold"
                : "w-2 h-2 bg-white/15 hover:bg-white/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
