import { ProjectShowcase } from "@/components/ProjectShowcase";
import { getContentPreviews, PROJECTS_PATH } from "@/lib/content";

const PROMPT_SYMBOL = ">";
const EYEBROW = "selected work";
const TITLE = "Featured Projects";
const DESCRIPTION =
  "I build a lot of things. Take a look at the three I'd point to first. " +
  "Two of these come from my work at Oracle on an analytics query engine. " +
  "I built the SQL generation behind it, then spent a long stretch proving " +
  "its results agreed with the transactional engine's. The third is mine: a " +
  "tool for vendors to run sweepstakes, which I'm building now.";

const PROJECTS_LIMIT = 3;

export function Work() {
  const projects = getContentPreviews(PROJECTS_PATH, PROJECTS_LIMIT);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="w-full border-b border-foreground/10 py-20 lg:py-24"
    >
      {/* Content inside container */}
      <div className="site-container">
        {/* Eyebrow */}
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

        {/* Header */}
        <h2
          id="work-heading"
          className="text-4xl leading-[1.08] font-bold tracking-wide
            text-balance text-foreground sm:text-5xl lg:text-6xl"
        >
          {TITLE}
        </h2>

        {/* Description */}
        <p
          className="mt-6 max-w-4xl text-base leading-relaxed text-foreground/75
            sm:text-lg"
        >
          {DESCRIPTION}
        </p>

        {/* Projects from files */}
        <div className="mt-12">
          {projects.map((project, index) => (
            <ProjectShowcase
              key={project.slug}
              index={String(index + 1).padStart(2, "0")}
              title={project.title}
              tags={project.tags}
              summary={project.summary}
              summaryImage={project.summaryImage}
              caseStudyHref={`/work/${project.slug}`}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
