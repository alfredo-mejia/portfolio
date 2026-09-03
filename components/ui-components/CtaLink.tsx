import Link from "next/link";

import { Arrow } from "@/components/ui-components/Arrow";

const CTA_CLASS =
  "group mt-8 -ml-5 inline-flex w-fit items-center gap-2 rounded-full px-5 " +
  "py-2 " +
  "font-mono text-base font-semibold text-accent transition-colors " +
  "hover:bg-accent/10 active:bg-accent/15 sm:text-lg lg:-ml-4 lg:px-4 " +
  "lg:py-1.5";

interface CtaLinkProps {
  href: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function CtaLink({ href, children, ...props }: CtaLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      className={CTA_CLASS}
    >
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
