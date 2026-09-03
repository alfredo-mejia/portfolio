import type { MetadataRoute } from "next";

import { BLOGS_PATH, getContentSlugs, PROJECTS_PATH } from "@/lib/content";

import { site } from "./site";

// A static export has no request-time rendering, so this metadata route
// must be emitted as a file at build time.
export const dynamic = "force-static";

// Built from the same helpers as `generateStaticParams`, so the sitemap and
// the routes that actually exist cannot fall out of step.
export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getContentSlugs(PROJECTS_PATH).map((slug) => ({
    url: `${site.url}/work/${slug}`,
  }));

  const blogs = getContentSlugs(BLOGS_PATH).map((slug) => ({
    url: `${site.url}/blog/${slug}`,
  }));

  // `lastModified` is deliberately omitted. File timestamps are rewritten by a
  // fresh checkout, so every build would claim every page changed today, and
  // search engines discount a lastmod they cannot trust.
  return [{ url: site.url }, ...projects, ...blogs];
}
