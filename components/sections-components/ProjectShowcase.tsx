"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { CtaLink } from "@/components/ui-components/CtaLink";
import { Tag } from "@/components/ui-components/Tag";

const CTA = "Read full case study";

interface ProjectShowcaseProps {
  index: string;
  title: string;
  tags: string[];
  summary: string;
  summaryImage: {
    src: string;
    alt: string;
  };
  caseStudyHref: string;
  defaultOpen?: boolean;
}

export function ProjectShowcase({
  index,
  title,
  tags,
  summary,
  summaryImage,
  caseStudyHref,
  defaultOpen = false,
}: ProjectShowcaseProps) {
  const [isProjectShowcaseOpen, setIsProjectShowcaseOpen] =
    useState(defaultOpen);
  return (
    <article
      className="border-b border-foreground/10 py-10 first-of-type:border-t
        lg:py-12"
    >
      {/* Header section */}
      <div className="-mx-5 lg:-mx-4">
        {/* Adding a heading but do not change the CSS*/}
        <h3 className="heading-label">
          {/* Hoverable button*/}
          <button
            type="button"
            onClick={() => setIsProjectShowcaseOpen((open) => !open)}
            className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto]
              items-center gap-4 rounded-full px-5 py-2 text-left
              transition-colors hover:bg-foreground/10 active:bg-foreground/15
              lg:gap-8 lg:px-4 lg:py-3"
            aria-expanded={isProjectShowcaseOpen}
            aria-controls={`project-showcase-panel-${index}`}
          >
            {/* Project number */}
            <span
              className="font-mono text-xl text-accent sm:text-2xl lg:text-3xl"
            >
              {index}
            </span>

            {/* Project title and tags */}
            <span className="flex min-w-0 flex-wrap items-center gap-4 lg:gap-6">
              <span
                className="font-mono text-xl font-semibold tracking-wide
                  text-foreground sm:text-2xl lg:text-3xl"
              >
                {title}
              </span>

              <span className="hidden flex-wrap gap-2 lg:flex">
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    as="span"
                  >
                    {tag}
                  </Tag>
                ))}
              </span>
            </span>

            {/* Expand and collapse icon */}
            <span
              className="grid size-5 shrink-0 place-items-center
                justify-self-end text-foreground/75 lg:size-6"
              aria-hidden="true"
            >
              {isProjectShowcaseOpen ? (
                <Minus className="size-full" />
              ) : (
                <Plus className="size-full" />
              )}
            </span>
          </button>
        </h3>
      </div>

      {/* Expandable */}
      <div
        id={`project-showcase-panel-${index}`}
        hidden={!isProjectShowcaseOpen}
        className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] gap-4 lg:gap-8"
      >
        {/* Preserves the number column without displaying it */}
        <span
          className="invisible font-mono text-xl sm:text-2xl lg:text-3xl"
          aria-hidden="true"
        >
          {index}
        </span>

        {/* Content begins directly beneath the title */}
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr] lg:gap-8">
          {/*Summary and CTA*/}
          <div className="flex flex-col items-start">
            <p className="max-w-2xl">{summary}</p>

            <CtaLink
              href={caseStudyHref}
              aria-label={`Read full case study for ${title}`}
            >
              {CTA}
            </CtaLink>
          </div>

          {/* Image*/}
          <div className="relative hidden aspect-4/3 overflow-hidden lg:block">
            <Image
              src={summaryImage.src}
              alt={summaryImage.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
