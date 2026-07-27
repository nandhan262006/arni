import type { ReactNode, ElementType } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function GlassPanel({
  children,
  className = "",
  as: Tag = "div",
}: GlassPanelProps) {
  return (
    <Tag
      className={`glass rounded-2xl p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </Tag>
  );
}
