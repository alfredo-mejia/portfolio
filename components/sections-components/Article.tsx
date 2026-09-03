import Image from "next/image";
import Link from "next/link";
import Markdown, { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import { SectionHeader } from "@/components/sections-components/SectionHeader";
import { Tag } from "@/components/ui-components/Tag";
import { Content, getPngDimensions } from "@/lib/content";

const TAGS_LABEL = "Tags";

const LIST_CLASS =
  "mt-6 space-y-3 pl-6 text-base leading-relaxed text-foreground/75 " +
  "marker:text-accent sm:text-lg";

interface ArticleProps {
  eyebrow: string;
  content: Content;
}

// Map markdown to HTML
const markdownComponents: Components = {
  h2: ({ node: _, ...props }) => (
    <h2
      {...props}
      className="mt-20"
    />
  ),
  h3: ({ node: _, ...props }) => (
    <h3
      {...props}
      className="mt-12"
    />
  ),
  p: ({ node: _, ...props }) => (
    <p
      {...props}
      className="mt-6"
    />
  ),
  ul: ({ node: _, ...props }) => (
    <ul
      {...props}
      className={`${LIST_CLASS} list-disc`}
    />
  ),
  ol: ({ node: _, ...props }) => (
    <ol
      {...props}
      className={`${LIST_CLASS} list-decimal`}
    />
  ),
  a: ({ node: _, href, children, ...props }) => {
    const classes =
      "rounded-full px-0.5 font-medium text-accent underline decoration-1 " +
      "underline-offset-4 hover:decoration-2";

    // An anchor with no href is a landing target, not a link — the footnote
    // ids the citations point at. Render it unstyled so `#ref-N` resolves.
    if (!href) {
      return <a {...props}>{children}</a>;
    }

    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link
          {...props}
          href={href}
          className={classes}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  },
  pre: ({ node: _, ...props }) => (
    <pre
      {...props}
      className="my-8 overflow-x-auto border-y border-foreground/10
        bg-foreground/10 p-6 font-mono text-sm leading-relaxed text-foreground
        [&_.hljs-comment]:text-foreground/60 [&_.hljs-comment]:italic
        [&_.hljs-keyword]:text-accent [&_.hljs-literal]:text-accent
        [&_.hljs-number]:text-accent [&_.hljs-string]:text-accent
        [&_.hljs-title]:font-semibold [&_.hljs-title]:text-foreground
        [&_.hljs-type]:font-semibold [&_.hljs-type]:text-foreground"
    />
  ),
  code: ({ node: _, className, children, ...props }) => {
    const isInline = !className && typeof children === "string";
    if (isInline) {
      return (
        <code
          {...props}
          className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-sm
            text-foreground sm:text-base"
        >
          {children}
        </code>
      );
    }
    return (
      <code
        {...props}
        className={className}
      >
        {children}
      </code>
    );
  },
  img: ({ node: _, src, alt }) => {
    if (!src || typeof src !== "string") return null;

    // Markdown carries no dimensions; measure the file so next/image can
    // reserve the box. Build-time only — these routes are all static.
    const { width, height } = getPngDimensions(src);

    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 53rem, calc(100vw - 4rem)"
        className="my-12 h-auto w-full max-w-4xl"
      />
    );
  },
};

export function Article({ eyebrow, content }: ArticleProps) {
  return (
    <article
      aria-labelledby="article-title"
      className="w-full border-b border-foreground/10 py-24"
    >
      <div className="article-headings site-container max-w-4xl">
        <header>
          <SectionHeader
            headingId="article-title"
            as="h1"
            eyebrow={eyebrow}
            title={content.title}
            description={content.summary}
            // The `max-w-4xl` rail already sets the reading measure here.
            descriptionClassName=""
          />

          {/* Tags */}
          <ul
            aria-label={TAGS_LABEL}
            className="mt-8 flex flex-wrap gap-2"
          >
            {content.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </ul>
        </header>

        {/* Markdown Body Content */}
        <div className="my-16">
          <Markdown
            components={markdownComponents}
            rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: false }]]}
          >
            {content.content}
          </Markdown>
        </div>
      </div>
    </article>
  );
}
