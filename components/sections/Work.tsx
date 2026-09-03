import { ProjectShowcase } from "@/components/sections-components/ProjectShowcase";
import {
  Section,
  sectionHeadingId,
} from "@/components/sections-components/Section";
import { SectionHeader } from "@/components/sections-components/SectionHeader";
import { getContentPreviews, PROJECTS_PATH } from "@/lib/content";

const EYEBROW = "selected work";
const TITLE = "Featured Projects.";
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
    <Section id="work">
      <SectionHeader
        headingId={sectionHeadingId("work")}
        eyebrow={EYEBROW}
        title={TITLE}
        description={DESCRIPTION}
      />

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
    </Section>
  );
}
