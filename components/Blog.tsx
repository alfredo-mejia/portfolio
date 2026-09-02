import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  BLOGS_PATH,
  getContentPreviews,
  getPngDimensions,
} from "@/lib/content";

const PROMPT_SYMBOL = ">";
const EYEBROW = "blog";
const TITLE = "What I think.";
const DESCRIPTION =
  "I write about engineering judgment, accessibility, and architecture — " +
  "mostly the distance between code that looks correct and code that is.";
const CTA = "Read post";
const BLOGS_LIMIT = 2;

export function Blog() {
  const articles = getContentPreviews(BLOGS_PATH, BLOGS_LIMIT);

  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="w-full border-b border-foreground/10 py-20 lg:py-24"
    >
      <div className="site-container">
        <div
          className="mb-4 flex items-center gap-2 font-mono text-xs
            text-foreground/60"
        >
          <span
            className="font-bold text-accent"
            aria-hidden="true"
          >
            {PROMPT_SYMBOL}
          </span>
          <span className="tracking-wide">{EYEBROW}</span>
        </div>

        <h2
          id="blog-heading"
          className="text-4xl leading-[1.08] font-bold tracking-wide
            text-balance text-foreground sm:text-5xl lg:text-6xl"
        >
          {TITLE}
        </h2>

        <p
          className="mt-6 max-w-4xl text-base leading-relaxed text-foreground/75
            sm:text-lg"
        >
          {DESCRIPTION}
        </p>

        <div
          className="mt-12 grid border-t border-foreground/10 pt-12
            lg:grid-cols-[3fr_2fr]"
        >
          {articles.map((article, index) => {
            const isFeatured = index === 0;
            const imageDimensions = isFeatured
              ? getPngDimensions(article.summaryImage.src)
              : null;

            return (
              <article
                key={article.slug}
                className={
                  isFeatured
                    ? "border-b border-foreground/10 pb-12 lg:border-b-0 " +
                      "lg:pr-12 lg:pb-0"
                    : "pt-12 lg:border-l lg:border-foreground/10 lg:pt-0 " +
                      "lg:pl-12"
                }
              >
                {imageDimensions ? (
                  <div className="mb-8 hidden overflow-hidden lg:block">
                    <Image
                      src={article.summaryImage.src}
                      alt={article.summaryImage.alt}
                      width={imageDimensions.width}
                      height={imageDimensions.height}
                      sizes="(min-width: 1200px) 38rem, (min-width: 1024px) 52vw, 1px"
                      className="h-auto w-full"
                    />
                  </div>
                ) : null}

                <h3
                  className={
                    isFeatured
                      ? "text-3xl leading-tight font-semibold tracking-wide " +
                        "text-balance text-foreground sm:text-4xl lg:text-5xl"
                      : "text-3xl leading-tight font-semibold tracking-wide " +
                        "text-balance text-foreground sm:text-4xl"
                  }
                >
                  {article.title}
                </h3>

                <p
                  className="mt-4 text-base leading-relaxed text-foreground/75
                    sm:text-lg"
                >
                  {article.summary}
                </p>

                <ul
                  className="mt-6 flex flex-wrap gap-x-2 gap-y-1 font-mono
                    text-sm text-foreground"
                >
                  {article.tags.map((tag, tagIndex) => (
                    <li
                      key={tag}
                      className="flex items-center gap-2"
                    >
                      <span>{tag}</span>
                      {tagIndex < article.tags.length - 1 ? (
                        <span
                          className="text-foreground/60"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/blog/${article.slug}`}
                  className="group mt-8 -ml-5 inline-flex items-center gap-2
                    rounded-full px-5 py-2 font-mono text-base font-semibold
                    text-accent transition-colors hover:bg-accent/10
                    hover:decoration-2 active:bg-accent/15 sm:text-lg lg:-ml-4
                    lg:px-4 lg:py-1.5"
                  aria-label={`${CTA}: ${article.title}`}
                >
                  <span>{CTA}</span>
                  <ArrowRight
                    className="size-4 transition-transform duration-200
                      motion-safe:group-hover:translate-x-1
                      motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
