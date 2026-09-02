const PROMPT_SYMBOL = ">";
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
    <section
      id="skills"
      aria-labelledby="skills-heading"
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
          id="skills-heading"
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

        <ul className="mt-12">
          {SKILL_GROUPS.map((group) => (
            <li
              key={group.title}
              className="grid gap-4 border-b border-foreground/10 py-10
                first:border-t lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-8
                lg:py-12"
            >
              <div>
                <h3 className="text-2xl font-bold tracking-wide text-foreground">
                  {group.title}
                </h3>
                <p
                  className="mt-3 text-base leading-relaxed text-foreground/75
                    sm:text-lg"
                >
                  {group.description}
                </p>
              </div>

              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-foreground/10 px-3 py-1 font-mono
                      text-sm text-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
