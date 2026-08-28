import type { MetadataRoute } from "next";

import { site } from "./site";

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
