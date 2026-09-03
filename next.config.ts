import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Workers Static Assets serves the prerendered site from `out/`.
  // Every route is already prerendered and `dynamicParams` is false, so
  // nothing needs a server at request time.
  output: "export",

  // A static export has no image optimizer, so `next/image` emits the source
  // files unchanged. Source assets must therefore be sized for delivery.
  images: { unoptimized: true },
};

export default nextConfig;
