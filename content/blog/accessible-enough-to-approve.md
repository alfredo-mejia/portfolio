---
order: 2
title: "Accessible enough to approve"
tags:
  - Accessibility
  - WCAG
  - AI-assisted development
  - React
summary: >-
  I thought AI skipped accessibility unless you asked for it. I was wrong. Told
  nothing about accessibility, it wrote the ARIA roles, the keyboard handling
  and the focus management correctly in all ten trials. It missed two things
  every time: it never checked whether its text colors were readable, and it
  built a search box that tells a blind user nothing when the results change.
  Everything else in that code is right, which is why nobody would catch it in
  review.
summaryImage:
  src: "/blog/accessible-enough-to-approve/stated-measured-imagined.png"
  alt: >-
    Three columns comparing what ten trials produced: every accessibility
    attribute written correctly in five of five, readable contrast in two of
    ten, and an announcement for screen reader users in one of five
---

## What I thought was true

I was confident about this. AI writes accessible code when you ask it to, and
skips accessibility when you do not. I had seen enough generated components with
a `<div onClick>` and no way to use it from a keyboard to feel sure.

So I decided to prove it. Ask for a component without mentioning accessibility,
ask again with accessibility spelled out, compare the two.

The first five runs killed the idea. Told nothing about accessibility, the model
wrote it anyway — ARIA roles, keyboard handling, focus management, correct every
time.

Two things were missing, and it was the same two things in every trial.

**It never checked a color.** It used a light gray for placeholder text that
measures 2.56:1 against a white background. The standard asks for 4.5:1. Nothing
in the code suggests it ever worked that number out.

**It built a search box that says nothing.** You type three letters, the list of
results drops from twelve to two, and a blind person using a screen reader hears
nothing at all. There is no announcement in the code because nobody wrote one.

Everything else in that component is correct, and that is the problem. A
reviewer opens the pull request and sees `role="combobox"`, `aria-expanded`,
`aria-activedescendant`, a real `<label>`, full keyboard support. They approve
it.

Code that is obviously missing its accessibility markup gets caught, because it
looks wrong. This does not look wrong. It looks done and that is the problem.

## How I tested it

Two arms. Same component request both times, one silent about accessibility and
one asking for it, five trials each, because one generation is an anecdote and I
wanted to see how much it varied.

The model was Claude Opus 5. I ran the trials through Claude Code, so the thing
being tested and the thing running the test come from the same family. Every
trial was generated blind, which is what matters for the silent arm, but this is
not an independent audit and I will not pretend it is.

Each trial ran in a fresh instance that had no memory of the others and no idea
why it was being asked. That part matters. If the thing writing the code knows
it is being graded on accessibility, the test is worthless.

Keeping them ignorant was the hard part, for a funny reason. This repository has
an `AGENTS.md` that makes any agent read `docs/UI_SYSTEM.md` before touching UI,
and section 13 of that file is called "Accessibility and semantics." My own repo
would have tipped the model off. So every trial ran in a scratch directory
outside the project, and I asked each one afterward what documentation it had
read. All fifteen said none. One mentioned running the repo's TypeScript
compiler against a config it wrote itself, which tells it nothing about
accessibility, but I would rather say so now than have someone find it later.

The first request was an ordinary ticket. A mobile navigation overlay in React
and TypeScript with Tailwind: opens from a hamburger button, covers the screen,
five links, a close button, a smooth transition. Nothing about keyboards,
nothing about screen readers, nothing about WCAG.

## What came back

All five overlays hit fourteen of fifteen things I checked for.
`role="dialog"` with `aria-modal`, `aria-expanded` and `aria-controls` on the
button, `aria-hidden` on the decorative icons, Escape to close, focus moved into
the panel when it opens and returned to the hamburger when it closes, a keyboard
trap so Tab cannot wander behind the overlay, scroll locked on the body,
`prefers-reduced-motion` respected, visible focus rings, real `nav` and list
markup. Only `inert` varied, and three of five used it.

So I assumed I had picked too easy a component. A mobile nav overlay is probably
the most-written component on the internet.

The second one was chosen to be hard. An autocomplete search box is the pattern
the ARIA Authoring Practices Guide spends the most care
on <sup><a href="#ref-5" id="cite-5">5</a></sup> , and the one real teams get
wrong most often, because it needs `aria-activedescendant` — an attribute that
tells a screen reader which option is highlighted while the keyboard focus stays
in the text field. If the model were pattern-matching instead of reasoning, this
is where it would fall apart.

It got that too. Five out of five.

```tsx
<input
  role="combobox"
  aria-expanded={expanded}
  aria-controls={listboxId}
  aria-autocomplete="list"
  aria-activedescendant={
    expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined
  }
  onKeyDown={handleKeyDown}
/>
```

Nobody asked for any of it. Twelve of the thirteen things I checked came back
five out of five, including real `<label>` elements instead of an `aria-label`
stuck on the outside. I read every file by hand, because finding the right text
with grep does not mean the code works.

So my hypothesis was wrong. Told nothing about accessibility, the model wrote
accessible components ten times out of ten.

## The search box that says nothing

Type three characters into that search box. Twelve results become two.

If you can see the screen this is obvious, because the list shrinks in front of
you. If you are using a screen reader, four of the five trials told you nothing.
No `aria-live` region, no `role="status"`, no hidden text for the screen reader
to read out. The list changed and you were not told.

![Two lanes across three keystrokes. A sighted user watches the list fall from
twelve to four to two. A screen reader user receives silence at every
step.](/blog/accessible-enough-to-approve/silent-combobox.png)

The one trial that handled it did so with a single element:

```tsx
<span
  aria-live="polite"
  className="sr-only"
>
  {showPanel
    ? `${matches.length} ${matches.length === 1 ? "result" : "results"} available`
    : ""}
</span>
```

That is the whole fix. A hidden line of text that a screen reader reads out
whenever the number changes.

Now look at what the same component did get right. It implemented
`aria-activedescendant` perfectly, so it could tell you exactly which option was
highlighted. It just could not tell you that eight options had disappeared.

The difference is that one of those has a name and the other does not. You can
look up `aria-activedescendant`. There is no attribute called "tell the user the
list changed." To write that line you first have to notice that a sighted person
is getting information from something they can see, then realize that someone
else is getting nothing from the same event, and then decide it matters enough
to fix.

That is not something you look up. Nobody asked the model to think about who was
using this, so it did not.

## The color it never checked

The second miss is smaller, and it fails for the same reason.

Eight of ten trials used text colors that are too light to read comfortably —
placeholder text, helper text, secondary labels. On white, `text-slate-400`
measures **2.56:1** and `text-neutral-400` measures **2.52:1**. WCAG asks for
4.5:1 on normal text <sup><a href="#ref-4" id="cite-4">4</a></sup> . These are
roughly half that.

The number is not the interesting part. `text-slate-500` measures 4.76:1 and
would have passed, so the model was one token away. The interesting part is that
it never looked. It picked that gray because that is the color secondary text
usually is, and "it looks about right" is not a measurement.

I have to be careful here, because my own site is not clean either.

The design system behind this page records its accent color at 4.505:1 — over
the line, but barely — and it allows hover and pressed states that drop _below_
4.5:1, written down as a deliberate decision to keep button feedback the same
hue. You could tell me that was the wrong call and I would take the argument
seriously. What you cannot tell me is that nobody made it. And there are corners
of this site I have never measured, where I have done exactly what the model
did.

![Two panels. On the left an unchecked color, text-slate-400 at 2.56 to 1,
picked because it looked right and never measured. On the right a documented
token pair measured at 4.505 to 1, with its small margin recorded and its
below-threshold hover states written down and
accepted.](/blog/accessible-enough-to-approve/decided-and-undecided.png)

That is not me letting myself off. It is the point. Two colors can both sit
under the line and mean completely different things. One is a call someone made
and can explain. The other is a gap where nobody made a call at all.

## What the two misses have in common

Put them side by side. It is not that one was harder than the other.
`aria-activedescendant` is far harder than picking a readable gray.

![Three columns. Every accessibility attribute appeared in five of five trials.
Readable contrast appeared in two of ten. An announcement for screen reader
users appeared in one of
five.](/blog/accessible-enough-to-approve/stated-measured-imagined.png)

Everything the model got right is something you can **state**: it has a name, it
has a value, you write it into the markup. Everything it missed had to be
**measured** — you have to run the contrast numbers — or **imagined** — you have
to picture the person who cannot see the change.

The model does the first kind reliably and the other two not at all. What comes
out is not sloppy work. It is work that has every outward sign of being careful,
with none of the checking behind it.

## Does asking fix it?

Worth testing, so I ran the second arm. Same search box, five more trials, one
line added to the request:

> It must be accessible: fully keyboard operable, usable with a screen reader,
> and meeting WCAG 2.2 Level AA.

That is what a developer who cares actually types. Not a spec listing every
attribute, which would just be giving away the answer.

The announcement went from one of five to **five of five**. Every trial reported
the result count. The model always knew how to do this. One sentence was enough
to get it.

The contrast went from zero of five to **three of five**. Two trials still
shipped text that was too light, _while the request in front of them asked for
WCAG AA_.

![Two criteria across two prompt conditions. Announcing the result count went
from one of five to five of five when accessibility was requested. Contrast
passing AA went from zero of five to three of five, so two trials still failed
even when
asked.](/blog/accessible-enough-to-approve/asking-is-not-enough.png)

One trial showed why. It reported afterward that it picked `slate-500` for its
borders because `slate-400` "would have failed at 2.6:1." Nothing told it to
calculate anything. It went and did the math on its own, and landed within a
rounding error of the 2.56:1 I measured by hand.

So it can do this. It just does not do it unless something makes it, and asking
for WCAG AA only makes it happen sometimes. That is worse than not being able
to, because at least "cannot" is predictable.

I will not push those numbers further than they go. Five trials is five trials,
and three out of five against five out of five would not survive a statistician.
What I will say is that the two misses responded very differently to the same
sentence, and in the direction you would expect: the one the model already knew
how to do got fixed, and the one requiring it to stop and calculate did not.

## This is not just my trials

I assumed these two findings were quirks of my setup. They are not.

The 2026 WebAIM Million scanned the top million home pages. The most common
accessibility failure on the web is low-contrast text, found on **83.9%** of
them <sup><a href="#ref-1" id="cite-1">1</a></sup> . That is the same mistake my
trials made, at the top of the list, seven years running.

The next number is the one that should worry you. Pages **with** ARIA averaged
**59.1 errors**. Pages **without** ARIA averaged
**42** <sup><a href="#ref-1">1</a></sup> .

More accessibility markup, more problems. That should be uncomfortable for
anyone impressed by the code earlier in this post, mine included. Lots of
confident, correct-looking ARIA is exactly the pattern that goes with more
errors, not fewer.

And things got worse this year. 95.9% of home pages had detectable WCAG
failures, up from 94.8%, which ends six straight years of small improvements. It
is 56.1 errors per page now, up from 51 <sup><a href="#ref-1">1</a></sup> .

It is tempting to blame AI for that reversal. I am not going to. WebAIM puts it
down to pages getting bigger — the average home page grew 22.5% in one year, to
1,437 elements <sup><a href="#ref-1">1</a></sup> — and I have fifteen trials
against one model. That is not enough to claim a trend, and anyone who does
claim one from data this thin is selling something.

## Why nobody catches it

This is the part that is on us rather than the tool.

Picture that search box arriving in a pull request. It has `role="combobox"`,
`aria-expanded`, `aria-controls`, `aria-autocomplete`, `aria-activedescendant`,
a real `<label>`, Escape handling and arrow keys. What does the reviewer do?

They approve it. On everything with a name it is better than what most of us
write by hand. The reviewer sees correct accessibility markup, concludes
accessibility was handled, and stops looking. The silent search box goes
straight through.

A missing keyboard handler gets caught because it is visibly absent. A missing
announcement does not, because there is no blank space where it should have
been. You cannot see the absence of something nobody thought of.

Which is why "remember to prompt for accessibility" is only half an answer. It
fixed the announcement completely. It still left two of five components with
unreadable text while the request asked for WCAG AA. Prompting helps and it is
not enough, and the part it does not cover is the part no reviewer catches by
reading, because nobody looks at `text-slate-400` and sees 2.56:1.

## What would fix this

Two different jobs, and you cannot swap one for the other.

**The model should check its own colors.** Contrast is arithmetic, and one trial
proved the model can do that arithmetic whenever it bothers. Anything that emits
a color pair should verify it the same way a compiler verifies a type, every
time, unprompted. Until then this is a known, repeatable, one-token mistake
sitting inside otherwise excellent code.

**We have to do the rest deliberately, and write it down.** The contrast check
belongs in CI, where a machine does it better than any reviewer for almost no
cost. The announcement does not, and no linter will ever add it, because knowing
that a result count is worth saying out loud is a judgment about what a person
needs to hear. Automated tools are usually estimated to catch somewhere between
a fifth and a half of accessibility problems depending on the study and what you
count <sup><a href="#ref-2" id="cite-2">2</a></sup> , and what they miss is
weighted toward exactly this kind of thing.

There is a version of this that already works, and it is the thing that almost
ruined my experiment. `AGENTS.md` in this repository makes every agent read
`docs/UI_SYSTEM.md` before touching any UI, and that document treats focus,
keyboard, touch and reduced-motion behavior as part of designing a component
rather than something to add later. It also records the contrast ratio of every
text color, including the ones with almost no margin and the ones deliberately
allowed under the line.

That is what it looks like when the decisions are written down. It is not a
claim that my site passes everything. It is a claim that where it does not,
somebody chose, and the reasoning is on the record where the next person — or
the next model — will read it. I had to work to keep that file away from these
trials, which is the best thing I can say about it.

And there is a deadline attached now. The European Accessibility Act has been
enforceable since June 2025, and the ADA Title II rule requires WCAG 2.1 Level
AA from larger public bodies by April 2027 and everyone else by April
2028 <sup><a href="#ref-3" id="cite-3">3</a></sup> .

## What this does not prove

One model, fifteen trials, two components. Generated code varies run to run,
models change without telling you, and another one might behave nothing like
this. Both components are common enough to be well covered in training data, and
I would expect worse from something rarer — a sortable table, a tree grid, a
range slider with two handles.

I also only found what I went looking for. I checked a fixed list by hand and
calculated the contrast myself. I never put any of it in front of someone who
actually uses a screen reader, so the missing announcement is a problem I read
out of the source code, not one I watched somebody run into. Anyone who does
that work would find things I did not know to check.

What I will stand behind is narrow. Told nothing about accessibility, this model
wrote every accessibility feature that has a name, ten times out of ten, and
never once checked a color or considered someone who could not see the screen
change.

That is a better problem than the one I went looking for. It is also a harder
one, because nothing about the output asks to be checked.

## References

1. <a id="ref-1"></a>WebAIM. _The WebAIM Million — The 2026 report on the
   accessibility of the top 1,000,000 home pages_.
   [webaim.org/projects/million](https://webaim.org/projects/million/)
2. <a id="ref-2"></a>Deque Systems. _Automated Testing Study Identifies 57% of
   Digital Accessibility Issues_. The 57% measures share of total issue volume
   rather than share of WCAG success criteria, and Deque notes that some issue
   types occur far more frequently than others, which raises a volume-based
   figure. Criteria-based estimates are substantially lower; published ranges
   run from roughly 20% to 57% depending on what is counted.
   [deque.com](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)
3. <a id="ref-3"></a>U.S. Department of Justice. _Fact Sheet: New Rule on the
   Accessibility of Web Content and Mobile Apps Provided by State and Local
   Governments_. Compliance dates April 26 2027 and April 26 2028 as extended by
   the interim final rule of April 20 2026.
   [ada.gov](https://www.ada.gov/resources/2024-03-08-web-rule/)
4. <a id="ref-4"></a>W3C. _Web Content Accessibility Guidelines (WCAG) 2.2_,
   Success Criterion 1.4.3 Contrast (Minimum).
   [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/#contrast-minimum)
5. <a id="ref-5"></a>W3C. _ARIA Authoring Practices Guide — Combobox Pattern_.
   [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
