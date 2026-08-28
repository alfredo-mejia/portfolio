/**
 * Note: Return statement in use effect is the cleanup function when it unmounts
 *       and right before the effect runs again
 */

"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import avatar from "@/public/avatar-transparent.png";

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

const PROMPT_SYMBOL = ">";
const PIPE_SYMBOL = "|";

const STATISTICS = {
  EXP_YEARS: {
    DESCRIPTION: "YEARS EXPERIENCE",
    AMOUNT: 5,
  },
  PROJECTS: {
    DESCRIPTION: "PROJECTS SHIPPED",
    AMOUNT: 43,
  },
  LANGUAGES: {
    DESCRIPTION: "CORE LANGUAGES",
    AMOUNT: 8,
  },
};

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  // Animate counter from 0 to target value on mount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // If user prefers reduced motion, skip animation and jump straight to
    // final value
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  }, [value]);

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
  const [promptSymbol, setPromptSymbol] = useState(">");

  // Run once on mount
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Start the alternating timeouts, every 800ms switch symbol
    const interval = setInterval(() => {
      setPromptSymbol((prev) =>
        prev === PROMPT_SYMBOL ? PIPE_SYMBOL : PROMPT_SYMBOL,
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // If reduced motion is on: show full static "software engineer." and stop!
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  }, [roleDisplayText, isDeleting, roleIndex]);

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
          <div
            className="mb-6 flex items-center gap-2 font-mono text-xs
              text-foreground/60"
          >
            <span
              className="font-bold text-accent"
              aria-hidden="true"
            >
              {promptSymbol}
            </span>
            <span className="tracking-wide">open to opportunities</span>
          </div>

          {/* Large above: Text 7XL */}
          {/* SM to MD: Text 6XL */}
          {/* Lower than SM: Text 5XL */}
          {/* Text balance ensures no hanging single word lines */}
          {/* Tracking wide gives more space between letters */}
          <h1
            id="hero-heading"
            className="text-5xl leading-[1.08] font-bold tracking-wide
              text-balance text-foreground sm:text-6xl lg:text-7xl"
          >
            {HEADLINE}
          </h1>

          {/* Large above: Text 6XL */}
          {/* SM to MD: Text 5XL */}
          {/* Lower than SM: Text 4XL */}
          {/* Text balance ensures no hanging single word lines */}
          {/* Tracking wide gives more space between letters*/}
          {/* Grid allows the ghost element and regular element to sit on
              top of each other allowing the space to be taken by the
              ghost elem
          */}
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

          {/* Bio Paragraph */}
          <p
            className="mt-6 max-w-xl text-base leading-relaxed
              text-foreground/75 sm:text-lg"
          >
            {DESCRIPTION}
          </p>

          {/* CTA Link */}
          <div className="mt-8">
            {/* Had to use negative margin to not misalign the link but keep it
                centered inside focus via tab
            */}
            <a
              href="#work"
              className="group -ml-5 inline-flex items-center gap-2 rounded-full
                px-5 py-2 font-mono text-lg font-semibold text-accent
                transition-colors hover:bg-accent/10 active:bg-accent/15
                lg:-ml-4 lg:px-4 lg:py-1.5 lg:text-base"
            >
              <span>{CTA}</span>

              {/* Arrow moves on hover */}
              <ArrowRight
                className="size-4 transition-transform duration-200
                  motion-safe:group-hover:translate-x-1
                  motion-reduce:transform-none"
              />
            </a>
          </div>

          {/* Statistics with animated counter */}
          <dl
            className="mt-12 grid grid-cols-3 gap-3 border-t
              border-foreground/10 pt-8 font-mono sm:gap-6"
          >
            {/* Stat 1 */}
            <div className="flex flex-col-reverse">
              <dt
                className="mt-1 text-xs tracking-wider text-foreground/60
                  uppercase sm:text-sm"
              >
                {STATISTICS.EXP_YEARS.DESCRIPTION}
              </dt>
              <dd className="text-3xl font-bold text-foreground sm:text-4xl">
                <Counter value={STATISTICS.EXP_YEARS.AMOUNT} />+
              </dd>
            </div>

            {/* Stat 2 */}
            <div
              className="flex flex-col-reverse border-l border-foreground/10
                pl-3 sm:pl-6"
            >
              <dt
                className="mt-1 text-xs tracking-wider text-foreground/60
                  uppercase sm:text-sm"
              >
                {STATISTICS.PROJECTS.DESCRIPTION}
              </dt>
              <dd className="text-3xl font-bold text-foreground sm:text-4xl">
                <Counter value={STATISTICS.PROJECTS.AMOUNT} />+
              </dd>
            </div>

            {/* Stat 3 */}
            <div
              className="flex flex-col-reverse border-l border-foreground/10
                pl-3 sm:pl-6"
            >
              <dt
                className="mt-1 text-xs tracking-wider text-foreground/60
                  uppercase sm:text-sm"
              >
                {STATISTICS.LANGUAGES.DESCRIPTION}
              </dt>
              <dd className="text-3xl font-bold text-foreground sm:text-4xl">
                <Counter value={STATISTICS.LANGUAGES.AMOUNT} />+
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: 40% for Photo */}
        <div className="hidden items-end justify-end pt-12 lg:flex">
          <Image
            src={avatar}
            alt="Portrait of Alfredo Mejia"
            sizes="(min-width: 1024px) 40vw, 0vw"
            loading="eager"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
