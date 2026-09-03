import { AboutStory } from "@/components/sections-components/AboutStory";
import {
  Section,
  sectionHeadingId,
} from "@/components/sections-components/Section";
import { SectionHeader } from "@/components/sections-components/SectionHeader";

const EYEBROW = "about me";
const TITLE = "Why I became an engineer.";

const INDEX_TITLE = "Personal index";

const EDUCATION = {
  label: "Education",
  entries: [
    {
      degree: "M.S. in Computer Science",
      school: "The University of Texas at Austin",
    },
    {
      degree: "B.S. in Software Engineering",
      school: "The University of Texas at Dallas",
    },
  ],
} as const;

const OUTSIDE = {
  label: "Outside the terminal",
  text:
    "Playing basketball, watching the Lakers, and spending time with " +
    "Kobe (dog) and Noodle (cat).",
} as const;

const MEDIA = {
  label: "Books & cinema",
  entries: [
    { label: "Favorite book:", work: "The Great Gatsby" },
    { label: "Currently reading:", work: "To Kill a Mockingbird" },
    { label: "Favorite film:", work: "Invasion of the Body Snatchers (1978)" },
  ],
} as const;

const INDEX_LABEL_CLASS =
  "font-mono text-xs tracking-wider text-foreground/60 uppercase";

export function About() {
  return (
    <Section
      id="about"
      containerClassName="grid lg:grid-cols-[3fr_1fr]"
    >
      <div className="lg:pr-8">
        <SectionHeader
          headingId={sectionHeadingId("about")}
          eyebrow={EYEBROW}
          title={TITLE}
        />

        <AboutStory />
      </div>

      {/* Right: Personal index, vertically centered */}
      <div
        className="compact-headings mt-12 flex flex-col justify-center border-t
          border-foreground/10 pt-12 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0
          lg:pl-12"
      >
        {/* Sidecar Title */}
        <h3>{INDEX_TITLE}</h3>

        <dl className="mt-8 divide-y divide-foreground/10">
          {/* 1. Education */}
          <div className="pb-6">
            <dt className={INDEX_LABEL_CLASS}>{EDUCATION.label}</dt>
            <dd className="mt-3 space-y-4">
              {EDUCATION.entries.map((entry) => (
                <div key={entry.degree}>
                  <div className="text-base font-medium text-foreground">
                    {entry.degree}
                  </div>
                  <div className="font-mono text-xs text-foreground/60">
                    {entry.school}
                  </div>
                </div>
              ))}
            </dd>
          </div>

          {/* 2. Outside the terminal */}
          <div className="py-6">
            <dt className={INDEX_LABEL_CLASS}>{OUTSIDE.label}</dt>
            <dd className="mt-3 text-base leading-relaxed text-foreground/75">
              {OUTSIDE.text}
            </dd>
          </div>

          {/* 3. Books & cinema */}
          <div className="pt-6">
            <dt className={INDEX_LABEL_CLASS}>{MEDIA.label}</dt>
            <dd className="mt-3 space-y-3 text-base text-foreground/75">
              {MEDIA.entries.map((entry) => (
                <div key={entry.work}>
                  <span className="font-medium text-foreground">
                    {entry.label}
                  </span>{" "}
                  <em>{entry.work}</em>
                </div>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
