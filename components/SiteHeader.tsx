"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TAILWIND_MD_BREAKPOINT = "(min-width: 768px)";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(TAILWIND_MD_BREAKPOINT);
    function handleMediaChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setIsOpen(false);
      }
    }
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-foreground/10
        bg-background font-mono"
    >
      <div
        className="mx-auto flex h-16 max-w-5xl items-center justify-between
          px-6"
      >
        {/* Logo */}
        <Link
          href="/"
          className="rounded-full px-5 py-2 font-mono text-xl font-bold md:px-4
            md:py-1.5 md:text-base"
        >
          am<span className="text-foreground/40">.dev</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-base font-medium md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 transition-colors
                hover:bg-foreground/10 active:bg-foreground/15"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <a
          href="/resume.pdf"
          className="group hidden items-center gap-1.5 rounded-full px-4 py-1.5
            text-base font-medium transition-colors hover:bg-foreground/10
            active:bg-foreground/15 md:inline-flex"
        >
          Resume
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </a>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-3 transition-colors hover:bg-foreground/10
            active:bg-foreground/15 md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        {/* Full-Screen Mobile Navigation Overlay */}
        <div
          id="mobile-navigation"
          inert={!isOpen}
          className={`fixed inset-0 -z-10 flex flex-col justify-between
            bg-background px-8 pt-24 pb-10 transition-transform duration-300
            ease-out will-change-transform motion-reduce:transition-none
            md:hidden ${
              isOpen ? "translate-y-0" : "pointer-events-none -translate-y-full"
            }`}
        >
          {/* Main Nav Links (Large & easy to tap) */}
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="w-fit rounded-full px-5 py-2 text-2xl font-medium
                  tracking-tight transition-colors hover:bg-foreground/10
                  active:bg-foreground/15"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Bottom Action: Resume Link */}
          <div className="border-t border-foreground/10 pt-6">
            <a
              href="/resume.pdf"
              onClick={() => setIsOpen(false)}
              className="group inline-flex w-fit items-center gap-2 rounded-full
                px-5 py-2 text-xl font-medium transition-colors
                hover:bg-foreground/10 active:bg-foreground/15"
            >
              Resume
              <ArrowRight
                className="size-5 transition-transform
                  group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
