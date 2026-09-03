import Link from "next/link";

export function AboutStory() {
  return (
    <div className="mt-6 space-y-6">
      <p>
        Growing up in Los Angeles, most of my childhood was spent outside—riding
        my bike across the city and playing basketball at local parks. We did
        not have much money, so whenever I wanted to play video games, I&apos;d
        pedal over to a friend&apos;s house, completely fascinated by how
        software could create entire worlds. Eventually, my mother saved up for
        an entire year to surprise me with a PS4. She only had enough left for
        one game, and despite her hesitation about the violence, she bought me
        an older copy of Call of Duty. When I realized my friends had already
        moved on to the newest release, a switch flipped in me: I wanted to
        learn how to build video games myself so kids like me would not be left
        out.
      </p>
      <p>
        As I grew older, playing games faded, but the underlying realization
        stuck: programming is the ultimate equalizer. You don&apos;t need
        capital or permission to build something meaningful — just knowledge,
        persistence, and a keyboard. It became the most exhilarating puzzle I
        had ever encountered, a craft where pure logic can create real, tangible
        solutions out of thin air.
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
        {". "}I see everyday people and independent vendors hustling tirelessly
        to provide for their families, and I want to give them the tools to
        expand their businesses and succeed.
      </p>
    </div>
  );
}
