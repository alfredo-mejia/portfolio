"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

import { CtaLink } from "@/components/ui-components/CtaLink";
import { Eyebrow, PROMPT_SYMBOL } from "@/components/ui-components/Eyebrow";
import avatar from "@/public/avatar-transparent.webp";

const roles = [
  "software engineer.",
  "ball hooper.",
  "problem solver.",
  "proud pet owner.",
  "project builder.",
];

const HEADLINE = "Hi, I'm Alfredo Mejia.";
const PREFIX_ROLE = "I'm a ";
const LONGEST_ROLE = PREFIX_ROLE + roles[0];
const DESCRIPTION =
  "Software engineer at Oracle focused on high-performance C++, " +
  "scalable backend systems, and building thoughtful digital " +
  "experiences.";
const CTA = "View selected work";

const PIPE_SYMBOL = "|";
const EYEBROW = "open to opportunities";
const AVATAR_ALT = "Portrait of Alfredo Mejia";

const STATISTICS = [
  { label: "YEARS EXPERIENCE", amount: 5 },
  { label: "PROJECTS SHIPPED", amount: 43 },
  { label: "CORE LANGUAGES", amount: 8 },
] as const;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Tracks the reduced-motion preference live. Reading `matchMedia(...).matches`
 * once inside an effect never updates, so a visitor who turns Reduce Motion on
 * while the page is open would keep seeing animation until they reloaded.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    // The server cannot know the preference; assume motion is allowed and let
    // the first client render correct it.
    () => false,
  );
}

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Animate counter from 0 to target value on mount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // If user prefers reduced motion, skip animation and jump straight to
    // final value
    if (prefersReducedMotion) {
      // Async setState prevents React 19 cascading-render warning
      timeoutId = setTimeout(() => setCount(value), 0);
      return () => clearTimeout(timeoutId);
    }

    let current = 0;

    function tick() {
      if (current >= value) return;

      current += 1;
      setCount(current);

      if (current < value) {
        const remaining = value - current;

        // Milliseconds to call next function to increase count
        // 5 or more it is 35ms, 4 left is 90ms, etc.
        let delay = 35;
        if (remaining === 4) delay = 90;
        else if (remaining === 3) delay = 150;
        else if (remaining === 2) delay = 220;
        else if (remaining === 1) delay = 320;

        // Call next function in MS (delay) time
        timeoutId = setTimeout(tick, delay);
      }
    }

    // Start timer: Initial 300ms pause so the visitor sees the starting 0
    // before numbers roll
    timeoutId = setTimeout(tick, 300);
    return () => clearTimeout(timeoutId);
  }, [value, prefersReducedMotion]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{count}</span>
    </>
  );
}

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleDisplayText, setRoleDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [promptSymbol, setPromptSymbol] = useState(PROMPT_SYMBOL);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Under reduced motion the prompt is static rather than a blinking cursor.
  const displayedPrompt = prefersReducedMotion ? PROMPT_SYMBOL : promptSymbol;

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Start the alternating timeouts, every 800ms switch symbol
    const interval = setInterval(() => {
      setPromptSymbol((prev) =>
        prev === PROMPT_SYMBOL ? PIPE_SYMBOL : PROMPT_SYMBOL,
      );
    }, 800);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // If reduced motion is on: show full static "software engineer." and stop!
    if (prefersReducedMotion) {
      if (roleDisplayText !== roles[0]) {
        timeoutId = setTimeout(() => setRoleDisplayText(roles[0]), 0);
        return () => clearTimeout(timeoutId);
      }
      return;
    }

    // Current active role string
    const currentFullRole = roles[roleIndex];

    // Finished typing, it is not deleting and role and text are same (finished)
    // Then after 2500 ms, set isDeleting to true
    if (!isDeleting && roleDisplayText === currentFullRole) {
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    // Finished deleting all the word
    // Set isDeleting to false because it already deleted all the word
    // Set the role index to the next role
    if (isDeleting && roleDisplayText === "") {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 500);
      return () => clearTimeout(timeout);
    }

    // For deleting we go 40ms, if we are "typing" go 80ms
    const speed = isDeleting ? 40 : 80;

    // We haven't finished typing or deleting the full word
    // So delete or add a character to the current role per the speed specified
    const timeout = setTimeout(() => {
      setRoleDisplayText(
        isDeleting
          ? currentFullRole.substring(0, roleDisplayText.length - 1)
          : currentFullRole.substring(0, roleDisplayText.length + 1),
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [roleDisplayText, isDeleting, roleIndex, prefersReducedMotion]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full border-b border-foreground/10"
    >
      {/* Desktop: Large and above */}
      {/* Mobile: Smaller than large */}
      <div
        className="site-container grid grid-cols-1 lg:grid-cols-[3fr_2fr]
          lg:gap-8"
      >
        {/* Left: 60% for Words */}
        <div className="flex flex-col justify-center py-12">
          {/* Availability Banner */}
          <Eyebrow
            label={EYEBROW}
            symbol={displayedPrompt}
          />

          {/* `hgroup` ties the title to its tagline without giving the tagline
              its own rank in the document outline. */}
          <hgroup>
            <h1 id="hero-heading">{HEADLINE}</h1>

            <p
              className="grid font-mono text-4xl leading-tight font-medium
                tracking-wide text-balance text-foreground/60 sm:text-5xl
                lg:text-6xl lg:leading-[1.15]"
            >
              <span className="sr-only">{PREFIX_ROLE + roles[0]}</span>

              {/* Ghost element */}
              <span
                className="invisible col-start-1 row-start-1 select-none"
                aria-hidden="true"
              >
                {LONGEST_ROLE}
              </span>

              {/* Real element */}
              <span
                aria-hidden="true"
                className="col-start-1 row-start-1"
              >
                {PREFIX_ROLE}
                <span
                  className={
                    roleIndex === 0
                      ? `underline decoration-accent decoration-[3px]
                        underline-offset-8 transition-colors duration-300
                        motion-reduce:transition-none`
                      : `transition-colors duration-300
                        motion-reduce:transition-none`
                  }
                >
                  {roleDisplayText}
                </span>

                {/* Cursor blinker */}
                <span
                  className="inline-block animate-pulse font-normal
                    text-foreground/75 [animation-duration:1s]
                    motion-reduce:animate-none"
                >
                  {PIPE_SYMBOL}
                </span>
              </span>
            </p>
          </hgroup>

          {/* Bio Paragraph */}
          <p className="mt-6 max-w-xl">{DESCRIPTION}</p>

          {/* CTA Link */}
          <CtaLink href="#work">{CTA}</CtaLink>

          {/* Statistics with animated counter */}
          <dl
            className="mt-12 grid grid-cols-3 gap-3 border-t
              border-foreground/10 pt-12 font-mono sm:gap-6"
          >
            {STATISTICS.map(({ label, amount }, index) => (
              <div
                key={label}
                className={
                  index === 0
                    ? "flex flex-col-reverse"
                    : `flex flex-col-reverse border-l border-foreground/10 pl-3
                      sm:pl-6`
                }
              >
                <dt
                  className="mt-1 text-xs tracking-wider text-foreground/60
                    uppercase sm:text-sm"
                >
                  {label}
                </dt>
                <dd className="text-3xl font-bold text-foreground sm:text-4xl">
                  <Counter value={amount} />+
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: 40% for Photo */}
        <div className="hidden items-end justify-end pt-12 lg:flex">
          {/* The column is hidden below `lg`, and a lazy image inside a
              display:none container is never fetched, so phones skip it
              entirely. `sizes` is omitted because a static export emits no
              `srcset` for it to select from. */}
          <Image
            src={avatar}
            alt={AVATAR_ALT}
            sizes="(min-width: 1024px) 40vw, 0vw"
            loading="lazy"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
