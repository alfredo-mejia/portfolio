"use client";

import { Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { GitHubIcon, LinkedInIcon } from "./Icons";

const PROMPT_SYMBOL = ">";
const EYEBROW = "contact";
const TITLE = "Say hello.";
const DESCRIPTION =
  "Have a hard engineering problem, a role worth discussing, or just want " +
  "to compare notes? Email is the best way to reach me.";
const EMAIL = "hello@alfredomejia.dev";
const COPY_EMAIL = "Copy email";
const COPY_SUCCESS = "Email copied.";
const COPY_FAILURE =
  "Unable to copy. The email address above is selected. Press Ctrl+C or " +
  "Command+C to copy it.";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/alfredo-mejia",
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alfredo-mejia",
    icon: LinkedInIcon,
  },
] as const;

export function Contact() {
  const [copyStatus, setCopyStatus] = useState("");
  const copyStatusTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const emailFallbackRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      clearTimeout(copyStatusTimeout.current);
    },
    [],
  );

  useEffect(() => {
    if (copyStatus !== COPY_FAILURE) return;

    emailFallbackRef.current?.focus();
    emailFallbackRef.current?.select();
  }, [copyStatus]);

  function showCopyStatus(status: string) {
    clearTimeout(copyStatusTimeout.current);
    setCopyStatus(status);
    copyStatusTimeout.current = undefined;

    if (status === COPY_SUCCESS) {
      copyStatusTimeout.current = setTimeout(() => setCopyStatus(""), 2000);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showCopyStatus(COPY_SUCCESS);
    } catch {
      showCopyStatus(COPY_FAILURE);
      emailFallbackRef.current?.focus();
      emailFallbackRef.current?.select();
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
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
          id="contact-heading"
          className="text-4xl leading-[1.08] font-bold tracking-wide
            text-balance text-foreground sm:text-5xl lg:text-6xl"
        >
          {TITLE}
        </h2>

        <p
          className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75
            sm:text-lg"
        >
          {DESCRIPTION}
        </p>

        <div className="mt-12 border-y border-foreground/10 py-10 lg:py-12">
          <h3 className="font-mono text-base text-foreground">Email</h3>

          <div
            className="mt-6 font-mono text-[clamp(1.125rem,5.75vw,1.5rem)]
              leading-tight tracking-wide break-all text-foreground sm:text-4xl
              lg:text-5xl"
          >
            {copyStatus === COPY_FAILURE ? (
              <input
                ref={emailFallbackRef}
                type="text"
                readOnly
                spellCheck={false}
                size={EMAIL.length + 1}
                value={EMAIL}
                aria-label="Email address to copy manually"
                aria-describedby="copy-status"
                onFocus={(event) => event.currentTarget.select()}
                className="-ml-5 block max-w-full rounded-full bg-transparent
                  px-5 py-2 text-[clamp(0.9375rem,4.75vw,1.25rem)] sm:text-4xl
                  lg:-ml-4 lg:px-4 lg:py-1.5 lg:text-5xl"
              />
            ) : (
              <p>{EMAIL}</p>
            )}
          </div>

          <button
            type="button"
            onClick={copyEmail}
            className="mt-6 -ml-5 inline-flex items-center gap-2 rounded-full
              px-5 py-2 font-mono text-base text-foreground transition-colors
              hover:bg-foreground/10 active:bg-foreground/15 sm:text-lg lg:-ml-4
              lg:px-4 lg:py-1.5"
          >
            <Copy
              className="size-5"
              aria-hidden="true"
            />
            <span>
              {copyStatus === COPY_SUCCESS
                ? "Copied"
                : copyStatus === COPY_FAILURE
                  ? "Copy failed: try again"
                  : COPY_EMAIL}
            </span>
          </button>

          <div
            id="copy-status"
            className={
              copyStatus === COPY_FAILURE
                ? "mt-3 text-sm leading-relaxed text-foreground/60"
                : "sr-only"
            }
            role="status"
          >
            {copyStatus}
          </div>
        </div>

        <h3 className="mt-12 font-mono text-base text-foreground">Elsewhere</h3>

        <ul className="mt-6 -ml-5 flex flex-wrap gap-4 lg:-ml-4">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2
                  font-mono text-lg text-foreground transition-colors
                  hover:bg-foreground/10 active:bg-foreground/15 sm:text-xl
                  lg:px-4 lg:py-1.5"
              >
                <Icon className="size-6 shrink-0" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
