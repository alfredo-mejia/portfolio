import React from "react";

export function sectionHeadingId(id: string): string {
  return `${id}-heading`;
}

interface SectionProps {
  id: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export function Section({ id, containerClassName, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={sectionHeadingId(id)}
      className="w-full border-b border-foreground/10 py-20 lg:py-24"
    >
      <div
        className={
          containerClassName
            ? `site-container ${containerClassName}`
            : "site-container"
        }
      >
        {children}
      </div>
    </section>
  );
}
