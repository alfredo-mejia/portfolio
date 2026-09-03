import type { MetadataRoute } from "next";

import { site } from "./site";

// A static export has no request-time rendering, so this metadata route must
// be emitted as a file at build time.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Alfredo Mejia",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#e9e8e5",
    theme_color: "#e9e8e5",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
