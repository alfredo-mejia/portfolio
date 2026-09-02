import Link from "next/link";

const PROMPT_SYMBOL = ">";
const EYEBROW = "about me";
const TITLE = "Why I became an engineer.";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="w-full border-b border-foreground/10 py-20 lg:py-24"
    >
      <div className="site-container grid lg:grid-cols-[3fr_1fr]">
        {/* Left Side */}
        <div className="lg:pr-8">
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

          {/* Heading */}
          <h2
            id="about-heading"
            className="text-4xl leading-[1.08] font-bold tracking-wide
              text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            {TITLE}
          </h2>

          <div
            className="mt-6 space-y-6 text-base leading-relaxed
              text-foreground/75 sm:text-lg"
          >
            <p>
              Growing up in Los Angeles, most of my childhood was spent
              outside—riding my bike across the city and playing basketball at
              local parks. We did not have much money, so whenever I wanted to
              play video games, I&apos;d pedal over to a friend&apos;s house,
              completely fascinated by how software could create entire worlds.
              Eventually, my mother saved up for an entire year to surprise me
              with a PS4. She only had enough left for one game, and despite her
              hesitation about the violence, she bought me an older copy of Call
              of Duty. When I realized my friends had already moved on to the
              newest release, a switch flipped in me: I wanted to learn how to
              build video games myself so kids like me would not be left out.
            </p>
            <p>
              As I grew older, playing games faded, but the underlying
              realization stuck: programming is the ultimate equalizer. You
              don&apos;t need capital or permission to build something
              meaningful — just knowledge, persistence, and a keyboard. It
              became the most exhilarating puzzle I had ever encountered, a
              craft where pure logic can create real, tangible solutions out of
              thin air.
            </p>
            <p>
              That is the reason I became an engineer:{" "}
              <strong>
                to build software that genuinely impacts people&apos;s lives
              </strong>
              . It&apos;s what drives my focus on high-performance systems, and
              it&apos;s why I spend my free time building{" "}
              <Link
                href="/work/prizlit"
                className="rounded-full px-0.5 font-medium text-accent underline
                  decoration-1 underline-offset-4 hover:decoration-2"
              >
                Prizlit
              </Link>
              {". "}I see everyday people and independent vendors hustling
              tirelessly to provide for their families, and I want to give them
              the tools to expand their businesses and succeed.
            </p>
          </div>
        </div>

        {/* Right Column: Vertically Centered in the middle */}
        <div
          className="mt-12 flex flex-col justify-center border-t
            border-foreground/10 pt-12 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0
            lg:pl-12"
        >
          {/* Sidecar Title */}
          <h3 className="text-2xl font-bold tracking-wide text-foreground">
            Personal index
          </h3>

          <dl className="mt-8 divide-y divide-foreground/10">
            {/* 1. Education */}
            <div className="pb-6">
              <dt
                className="font-mono text-xs tracking-wider text-foreground/60
                  uppercase"
              >
                Education
              </dt>
              <dd className="mt-3 space-y-4">
                <div>
                  <div className="text-base font-medium text-foreground">
                    M.S. in Computer Science
                  </div>
                  <div className="font-mono text-xs text-foreground/60">
                    The University of Texas at Austin
                  </div>
                </div>
                <div>
                  <div className="text-base font-medium text-foreground">
                    B.S. in Software Engineering
                  </div>
                  <div className="font-mono text-xs text-foreground/60">
                    The University of Texas at Dallas
                  </div>
                </div>
              </dd>
            </div>

            {/* 2. Outside the terminal */}
            <div className="py-6">
              <dt
                className="font-mono text-xs tracking-wider text-foreground/60
                  uppercase"
              >
                Outside the terminal
              </dt>
              <dd className="mt-3 text-base leading-relaxed text-foreground/75">
                Playing basketball, watching the Lakers, and spending time with
                Kobe (dog) and Noodle (cat).
              </dd>
            </div>

            {/* 3. Books & cinema */}
            <div className="pt-6">
              <dt
                className="font-mono text-xs tracking-wider text-foreground/60
                  uppercase"
              >
                Books & cinema
              </dt>
              <dd className="mt-3 space-y-3 text-base text-foreground/75">
                <div>
                  <span className="font-medium text-foreground">
                    Favorite book:
                  </span>{" "}
                  <em>The Great Gatsby</em>
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Currently reading:
                  </span>{" "}
                  <em>To Kill a Mockingbird</em>
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Favorite film:
                  </span>{" "}
                  <em>Invasion of the Body Snatchers</em> (1978)
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
