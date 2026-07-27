"use client";

import { useRef, useState, type ReactNode } from "react";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  onClick?: () => void;
}

export function Card3D({
  children,
  className = "",
  maxTilt = 15,
  glare = true,
  onClick,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: "perspective(800px) rotateX(0deg) rotateY(0deg)",
    transition: "transform 0.2s ease-out",
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background:
      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });

    if (glare) {
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.7,
        background: `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(201,169,110,0.15) 0%, transparent 60%)`,
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
      transition: "transform 0.5s ease-out",
    });
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        transformStyle: "preserve-3d",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-xl"
          style={{
            ...glareStyle,
            transition: "opacity 0.3s ease-out",
          }}
        />
      )}
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </div>
  );
}
