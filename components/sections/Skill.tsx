import {
  Section,
  sectionHeadingId,
} from "@/components/sections-components/Section";
import { SectionHeader } from "@/components/sections-components/SectionHeader";
import { Tag } from "@/components/ui-components/Tag";

const EYEBROW = "skills";
const TITLE = "How I build.";
const DESCRIPTION =
  "I move between layers — distributed query engines on one side, full-stack products on the other. What carries across is the judgment: deciding where work belongs, proving it is right before it ships, and testing it like I am the one who has to maintain it.";

const SKILL_GROUPS = [
  {
    title: "Query engines and optimization",
    description:
      "Work out what a database can do natively, then let it do that work instead of the engine.",
    skills: [
      "C++",
      "SQL",
      "SQL optimization",
      "Predicate pushdown",
      "Visitor design pattern",
    ],
  },
  {
    title: "Distributed data",
    description:
      "Move a query to the system that owns the data, and make separate systems return the same answer.",
    skills: [
      "Semantic models",
      "Query federation",
      "Distributed systems",
      "Databases",
      "Rust",
    ],
  },
  {
    title: "Product engineering",
    description:
      "Build the whole thing, from the schema to the page someone actually uses.",
    skills: [
      "TypeScript",
      "JavaScript",
      "Next.js",
      "React",
      "Node.js",
      "RESTful APIs",
      "PostgreSQL",
      "Redis",
      "Accessibility",
    ],
  },
  {
    title: "Testing and delivery",
    description:
      "Prove it works before anyone else has to, and make the pipeline say so quickly.",
    skills: [
      "Vitest",
      "Playwright",
      "Selenium",
      "Jenkins",
      "CI/CD",
      "Docker",
      "Git",
      "Code review",
    ],
  },
  {
    title: "Other languages I work in",
    description: "Different problems want different tools.",
    skills: ["Java", "Python", "Bash/Shell"],
  },
] as const;

export function Skill() {
  return (
    <Section id="skills">
      <SectionHeader
        headingId={sectionHeadingId("skills")}
        eyebrow={EYEBROW}
        title={TITLE}
        description={DESCRIPTION}
      />

      <ul className="compact-headings mt-12">
        {SKILL_GROUPS.map((group) => (
          <li
            key={group.title}
            className="grid gap-4 border-b border-foreground/10 py-10
              first:border-t lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-8
              lg:py-12"
          >
            <div>
              <h3>{group.title}</h3>
              <p className="mt-3">{group.description}</p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
