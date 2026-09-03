import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      className="site-container flex min-h-[calc(100svh-4rem)] items-center
        justify-center bg-background text-center"
    >
      <div className="flex items-center gap-5">
        <h1
          className="border-r border-foreground/10 pr-6 text-2xl leading-12
            font-medium tracking-normal"
        >
          404
        </h1>
        <h2 className="text-sm leading-7 font-normal tracking-normal">
          This page could not be found.
        </h2>
      </div>
    </div>
  );
}
