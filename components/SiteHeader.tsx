"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TAILWIND_MD_BREAKPOINT = "(min-width: 768px)";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Watch whether the browser viewport is at least 768px (desktop size)
    const mediaQuery = window.matchMedia(TAILWIND_MD_BREAKPOINT);

    // Close the mobile menu if the screen expanded into desktop size
    function handleMediaChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    }

    // Listen for whenever the screen crosses the 768px breakpoint threshold
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Mobile menu state changes
  useEffect(() => {
    // Only run when the menu is open
    if (!isMobileMenuOpen) return;

    // Reset menu scroll position to the top on open
    const nav = document.getElementById("mobile-navigation");
    if (nav) nav.scrollTop = 0;

    // Lock body scroll and disable interaction on background page
    document.body.style.overflow = "hidden";
    const main = document.querySelector("main");
    if (main) main.setAttribute("inert", "");

    // Close menu when user presses the Escape key
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    }

    // Listen for the Escape key press
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: restore scroll, re-enable main content, and remove key listener
    return () => {
      document.body.style.overflow = "";
      if (main) main.removeAttribute("inert");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-foreground/10
        bg-background font-mono"
    >
      {/* Nav header */}
      <div
        className="relative site-container flex h-16 items-center
          justify-between bg-background"
      >
        {/* Logo */}
        <Link
          href="/"
          className="-ml-5 rounded-full px-5 py-2 font-mono text-xl font-bold
            md:-ml-4 md:px-4 md:py-1.5 md:text-base"
        >
          am<span className="text-foreground/40">.dev</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-6 text-base font-medium md:absolute
            md:left-1/2 md:flex md:-translate-x-1/2"
        >
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

        {/* Right Resume Actions */}
        <a
          href="/resume.pdf"
          className="group -mr-4 hidden items-center gap-2 rounded-full px-4
            py-1.5 text-base font-medium transition-colors
            hover:bg-foreground/10 active:bg-foreground/15 md:inline-flex"
        >
          Resume
          <ArrowRight
            className="size-4 transition-transform duration-200
              group-hover:translate-x-1"
          />
        </a>

        {/* Hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="-mr-3 rounded-md p-3 transition-colors
            hover:bg-foreground/10 active:bg-foreground/15 md:hidden"
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Full-Screen Mobile Navigation Overlay */}
      <div
        id="mobile-navigation"
        inert={!isMobileMenuOpen}
        className={`fixed inset-0 -z-10 flex flex-col justify-between
          overflow-y-auto overscroll-contain bg-background px-6 pt-20 pb-10
          transition-transform duration-300 ease-out will-change-transform
          motion-reduce:transition-none md:hidden ${
            isMobileMenuOpen
              ? "translate-y-0"
              : "pointer-events-none -translate-y-full"
          }`}
      >
        {/* Main Nav Links (Large & easy to tap) */}
        <nav className="-ml-5 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-fit rounded-full px-5 py-2 text-2xl font-medium
                tracking-tight transition-colors hover:bg-foreground/10
                active:bg-foreground/15"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bottom Action: Resume Link */}
        <div className="mt-8 border-t border-foreground/10 pt-6">
          <a
            href="/resume.pdf"
            onClick={() => setIsMobileMenuOpen(false)}
            className="group -ml-5 inline-flex w-fit items-center gap-2
              rounded-full px-5 py-2 text-xl font-medium transition-colors
              hover:bg-foreground/10 active:bg-foreground/15"
          >
            Resume
            <ArrowRight
              className="size-5 transition-transform duration-200
                group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
