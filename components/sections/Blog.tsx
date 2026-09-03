import Image from "next/image";

import {
  Section,
  sectionHeadingId,
} from "@/components/sections-components/Section";
import { SectionHeader } from "@/components/sections-components/SectionHeader";
import { CtaLink } from "@/components/ui-components/CtaLink";
import {
  BLOGS_PATH,
  getContentPreviews,
  getPngDimensions,
} from "@/lib/content";

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
    <Section id="blog">
      <SectionHeader
        headingId={sectionHeadingId("blog")}
        eyebrow={EYEBROW}
        title={TITLE}
        description={DESCRIPTION}
      />

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

              <h3 className={isFeatured ? undefined : "lg:text-4xl"}>
                {article.title}
              </h3>

              <p className="mt-4">{article.summary}</p>

              <ul
                className="mt-6 flex flex-wrap gap-x-2 gap-y-1 font-mono text-sm
                  text-foreground"
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

              <CtaLink
                href={`/blog/${article.slug}`}
                aria-label={`${CTA}: ${article.title}`}
              >
                {CTA}
              </CtaLink>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
