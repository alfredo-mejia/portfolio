import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

// Get path to projects
export const PROJECTS_PATH = path.join(process.cwd(), "content/projects");
export const BLOGS_PATH = path.join(process.cwd(), "content/blog");

export interface ContentPreview {
  slug: string;
  order: number;
  title: string;
  tags: string[];
  summary: string;
  summaryImage: {
    src: string;
    alt: string;
  };
}

export interface Content extends ContentPreview {
  content: string;
}

function getMarkdownFileNames(contentPath: string): string[] {
  return fs.readdirSync(contentPath).filter((file) => file.endsWith(".md"));
}

function getContentFile(contentPath: string, fileName: string): Content {
  const filePath = path.join(contentPath, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContents);

  return {
    slug: fileName.replace(".md", ""),
    order: data.order,
    title: data.title,
    tags: data.tags,
    summary: data.summary,
    summaryImage: data.summaryImage,
    content: content,
  };
}

export function getContentPreviews(
  contentPath: string,
  limit: number,
): ContentPreview[] {
  return (
    getMarkdownFileNames(contentPath)
      // get file content
      .map((fileName) => getContentFile(contentPath, fileName))
      .sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }

        return a.title.localeCompare(b.title);
      })
      // remove body, we don't need that
      .map(({ content: _content, ...project }) => project)
      .slice(0, limit)
  );
}

export function getContentSlugs(contentPath: string): string[] {
  return getMarkdownFileNames(contentPath).map((fileName) =>
    fileName.replace(".md", ""),
  );
}

export function getContentBySlug(
  contentPath: string,
  slug: string,
): Content | null {
  const fileName = getMarkdownFileNames(contentPath).find(
    (candidate) => candidate.replace(".md", "") === slug,
  );

  return fileName ? getContentFile(contentPath, fileName) : null;
}

const PUBLIC_DIR = path.join(process.cwd(), "public");
const HEADER_BYTES = 24;

export function getPngDimensions(src: string): {
  width: number;
  height: number;
} {
  // Root-relative only, and no traversal or NUL smuggled through the path.
  if (!src.startsWith("/") || src.includes("\0") || src.includes("\\")) {
    throw new Error(`Body image must be root-relative under public/: ${src}`);
  }

  // Resolve, then prove containment with path.relative. A prefix test would
  // also accept a sibling directory such as `publicity/`.
  const fullPath = path.resolve(PUBLIC_DIR, `.${src}`);
  const relative = path.relative(PUBLIC_DIR, fullPath);
  if (
    relative === "" ||
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`Body image must resolve inside public/: ${src}`);
  }
  const buffer = Buffer.alloc(HEADER_BYTES);
  const fd = fs.openSync(fullPath, "r");
  let bytesRead: number;
  try {
    bytesRead = fs.readSync(fd, buffer, 0, HEADER_BYTES, 0);
  } finally {
    fs.closeSync(fd);
  }
  if (bytesRead < HEADER_BYTES || buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`Body image is not a readable PNG: ${src}`);
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}
