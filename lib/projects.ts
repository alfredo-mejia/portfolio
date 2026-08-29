import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

export interface ProjectPreview {
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

// Get path to projects
const contentDirectory = path.join(process.cwd(), "content/projects");

export function getProjectPreviews(): ProjectPreview[] {
  // Get file names
  const fileNames = fs.readdirSync(contentDirectory);

  // Get markdown files
  const markdownFiles = fileNames.filter((file) => file.endsWith(".md"));

  // Create an array of ProjectPreview by going through each file
  const projects: ProjectPreview[] = markdownFiles
    .map((fileName) => {
      // Get the file path
      const filepath = path.join(contentDirectory, fileName);

      // Get the file contents
      const fileContents = fs.readFileSync(filepath, "utf8");

      // Get file metadata
      const { data } = matter(fileContents);

      // Get the slug
      const slug = fileName.replace(/\.md$/, "");

      // Return each object into the array (not return from function)
      return {
        slug: slug,
        order: data.order,
        title: data.title,
        tags: data.tags,
        summary: data.summary,
        summaryImage: data.summaryImage,
      };
    })
    .sort((a, b) => {
      // Sort by order
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      // Sort alphabetically if it cannot use order
      return a.title.localeCompare(b.title);
    })
    .slice(0, 3);

  return projects;
}
