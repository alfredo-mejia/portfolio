import type { MetadataRoute } from "next";

import { site } from "./site";

// A static export has no request-time rendering, so this metadata route
// must be emitted as a file at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/resume.pdf",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
