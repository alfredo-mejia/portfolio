# Portfolio UI System

> **Status:** Active  
> **Scope:** Alfredo Mejia's portfolio  
> **Baseline:** The current site header, hero, Work section, About section, Skills section, Blog section, Contact section, and article pages

This document formalizes the visual and interaction system already established by the portfolio. It is the source of truth for future UI work. When a deliberate design change is made, update this document in the same change so the implementation and the system do not drift apart.

## 1. How to use this document

The words **must**, **should**, and **may** are intentional:

- **Must** means the rule is required for consistency, usability, or accessibility.
- **Should** means the rule is the default, but a documented exception is allowed.
- **May** means the choice is optional and context-dependent.

Prefer an existing token or component recipe over a new one. A one-off value must solve a real design problem and should become part of this document only when it is likely to recur.

## 2. Design direction

The site must feel like a personal engineering portfolio, not a software company landing page.

- Lead with Alfredo, his work, and his point of view.
- Use direct, specific language instead of product-marketing language.
- Keep the composition content-led, restrained, and editorial.
- Use the mono typeface to express the engineering personality, not to make the page resemble a dashboard.
- Prefer flat surfaces and clear structure over cards, shadows, or decorative UI chrome.
- Do not add a background grid.

## 3. System architecture

The system has three layers:

| Layer     | Purpose                 | Examples                                                    |
| --------- | ----------------------- | ----------------------------------------------------------- |
| Primitive | Raw reusable values     | `4px`, `#e9e8e5`, `200ms`                                   |
| Semantic  | Values named by purpose | canvas, strong text, supporting text, divider               |
| Component | A complete UI recipe    | compact navigation link, mobile menu item, arrow affordance |

Tailwind utilities are the current implementation language. Do not introduce a parallel token abstraction until reuse makes it valuable.

### 3.1 Shared components

Where a recipe is repeated, a component owns it so the recipe has exactly one definition. Components are grouped by what they are:

| Directory                         | Holds                                                               |
| --------------------------------- | ------------------------------------------------------------------- |
| `components/sections/`            | The page sections themselves, and the site header                   |
| `components/sections-components/` | Structure a section is built from, and the pieces one section needs |
| `components/ui-components/`       | Small recipes reused across unrelated sections                      |

These are ordinary Server Components with no client JavaScript; do not add hooks or context to them, because that would pull every section that renders them into the client bundle.

| Component       | Owns                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Eyebrow`       | The eyebrow/status role and the `>` prompt glyph                                                                                    |
| `Arrow`         | The canonical right-arrow affordance, including its motion gate                                                                     |
| `Tag`           | The project-tag pill, as `li` in a list or `span` inside a button                                                                   |
| `CtaLink`       | The accent action: its tier, states, spacing, and arrow                                                                             |
| `SectionHeader` | Eyebrow, section title, and the optional introduction                                                                               |
| `Section`       | The `<section>` element, content rail, section rhythm, bottom divider, accessible name. Structure only; it never renders the header |

Rules:

- `Section` and `SectionHeader` are always used separately. `Section` supplies structure only and must never render the header itself; every section composes `SectionHeader` as a child. There is one usage model, not a common path plus an exception.
- A major section must render through `Section`. A section needing a different rail layout passes `containerClassName`; About uses this for its `3fr / 1fr` grid.
- Place `SectionHeader` where the layout needs it. Most sections open the rail with it. About places it inside the narrative column, because the vertically centred Personal index measures against that whole column and must align to the title rather than to the first paragraph.
- A section's accessible name must come from `sectionHeadingId(id)` rather than a hand-written string, so the section id and its heading id cannot drift apart.
- The article header is not a `Section`. It uses a different wrapper element and rhythm, and reuses `SectionHeader` with `as="h1"` and an empty `descriptionClassName`, because its `max-w-4xl` rail already sets the measure.

## 4. Foundations

### 4.1 Color

| Role            | Tailwind expression     | Value     | Use                                            |
| --------------- | ----------------------- | --------- | ---------------------------------------------- |
| Canvas          | `background`            | `#e9e8e5` | Page, header, and mobile overlay               |
| Ink             | `foreground`            | `#0a0a0a` | Titles, navigation, values, and focus outlines |
| Accent          | `accent`                | `#ba3f0c` | Primary actions, prompt, and selected emphasis |
| Reading text    | `foreground/75`         | 75% ink   | Body copy and readable secondary text          |
| Supporting text | `foreground/60`         | 60% ink   | Subtitles, eyebrows, metadata, and data labels |
| Decorative text | `foreground/40`         | 40% ink   | Nonessential decoration only                   |
| Divider         | `foreground/10`         | 10% ink   | Structural borders                             |
| Subtle surface  | `foreground/10`         | 10% ink   | Tags and code at rest; other restrained uses   |
| Hover surface   | current text hue at 10% | —         | Pill and icon-control hover state              |
| Pressed surface | current text hue at 15% | —         | Pill and icon-control pressed state            |

Rules:

- Use the `100 / 75 / 60 / 40` text hierarchy. Do not introduce nearby one-off values such as `/65` or `/80`.
- Meaningful text must use at least `foreground/60` on the current canvas.
- Reserve `foreground/40` for content whose meaning is available elsewhere.
- Primary accent text uses the accent at full strength.
- Hover and pressed fills inherit the control's text hue: foreground controls use foreground fills; accent controls use accent fills.
- The browser theme color and web-app manifest colors must match the canvas.
- The site currently has one light theme. Do not invent dark-theme tokens before a dark interface is intentionally designed.

#### Measured text contrast on the canvas

The following ratios are measured against the `#e9e8e5` canvas using the WCAG 2.x sRGB relative-luminance formula. Threshold comparisons use the unrounded values.

| Text token      | Contrast ratio | Policy                                                        |
| --------------- | -------------: | ------------------------------------------------------------- |
| `foreground`    |       16.158:1 | Strong text                                                   |
| `foreground/75` |        8.266:1 | Reading text                                                  |
| `foreground/60` |        4.918:1 | Minimum meaningful supporting text                            |
| `foreground/40` |        2.633:1 | Decorative only; never use for meaning that appears only once |
| `accent`        |        4.505:1 | Meets WCAG AA for normal text with minimal headroom           |

Treat `background` and `accent` as a contrast-sensitive pair. Any change to either token must be remeasured; darkening the canvas or lightening the accent can make normal-size accent text fall below WCAG AA.

Accent controls deliberately keep `text-accent` at rest, hover, and active. Their 4.505:1 resting contrast meets WCAG AA. The translucent terracotta hover and pressed pills reduce that contrast below 4.5:1 during interaction; keeping them is an accepted site-wide brand decision that prioritizes consistent, hue-matched feedback. It is not a WCAG exception and does not lower resting-state contrast requirements or the contrast requirements for non-accent controls and content.

### 4.2 Surfaces, borders, and elevation

- The page, sticky header, and mobile navigation overlay use the same canvas color.
- Every structural divider must be a 1px `border-foreground/10` border.
- Do not use shadows as substitutes for dividers.
- Surfaces are flat by default. `foreground/10` may be used as a restrained resting fill where useful; tags and code are the current examples. Cards, elevated panels, and shadows are not part of the system yet.
- Stronger borders or elevation require a semantic reason, not decoration alone.

### 4.3 Typography families

- **Geist Sans** is the editorial voice: titles, introductions, and body copy.
- **Geist Mono** is the interface and data voice: brand, navigation, status text, role text, actions, and statistics.
- Do not add another font family without revisiting the complete type system.

### 4.4 Font loading contract

The font pipeline is a coupled contract between `next/font`, the root layout, and Tailwind. Preserve all of these parts together:

1. `next/font` owns the runtime variables `--font-geist-sans` and `--font-geist-mono`.
2. The generated `geistSans.variable` and `geistMono.variable` classes are applied to the root `<html>` element.
3. Tailwind owns the theme outputs `--font-sans` and `--font-mono`.
4. The runtime and theme variables intentionally have different names. Collapsing either pair would create a collision or self-reference.
5. `@theme inline` maps Tailwind's font utilities directly to the runtime variables:

   ```css
   --font-sans: var(--font-geist-sans), system-ui, sans-serif;
   --font-mono: var(--font-geist-mono), monospace;
   ```

6. The generic `ui-sans-serif` and `ui-monospace` runtime fallbacks remain in `:root` inside `@layer base`. This gives the fallbacks lower cascade priority than Next's generated, unlayered font-variable classes, so the loaded fonts win without relying on stylesheet order.

Do not rename these variables, remove `inline`, move the fallbacks out of the base layer, or remove the generated variable classes from `<html>` as an isolated cleanup. Any change to this contract must verify the computed `font-sans` and `font-mono` families in the browser.

### 4.5 Implemented typography roles

Heading and body type are element rules in `app/globals.css`, not utilities written at each call site. A bare `h1`, `h2`, `h3`, or `p` is correct without a size utility, and any explicit utility still wins because the rules sit in the base layer. Three container classes override size where a container does not grow with the viewport:

| Context            | Applies to                                        | Effect                                                        |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------------- |
| `compact-headings` | The About index and Skills group columns          | `h3` holds at `text-2xl`; those columns are fixed at `lg`     |
| `article-headings` | The article rail                                  | Steps `h1`, `h2`, and `h3` down to the reading measure        |
| `heading-label`    | Contact's Email and Elsewhere, project disclosure | Removes display treatment from a heading that labels or wraps |

`h4` has no rule because no `h4` exists. Only the Blog previews use the bare `h3` default; every other `h3` sits in one of the three contexts. If a fourth context appears, move headings to a component with named variants rather than adding another selector.

Every role below exists in the current interface. The table names the resulting values; when the implementation intentionally relies on a font size's default line height or an inherited weight, it says so explicitly.

| Role               | Family         | Responsive size                    | Weight                                 | Leading                                 | Tracking                   | Color                          |
| ------------------ | -------------- | ---------------------------------- | -------------------------------------- | --------------------------------------- | -------------------------- | ------------------------------ |
| Hero title         | Sans (default) | `text-5xl sm:text-6xl lg:text-7xl` | `font-bold`                            | `leading-[1.08]`                        | `tracking-wide`            | `foreground`                   |
| Hero role          | Mono           | `text-4xl sm:text-5xl lg:text-6xl` | `font-medium`                          | `leading-tight lg:leading-[1.15]`       | `tracking-wide`            | `foreground/60`                |
| Hero description   | Sans (default) | `text-base sm:text-lg`             | 400 inherited; no weight utility       | `leading-relaxed` (1.625)               | None; no tracking utility  | `foreground/75`                |
| Eyebrow/status     | Mono           | `text-xs`                          | 400 inherited; prompt uses `font-bold` | Default line height: 16px; no override  | Label uses `tracking-wide` | `foreground/60`; prompt accent |
| Desktop navigation | Mono           | `text-base`                        | `font-medium`                          | Default line height: 24px; no override  | None; no tracking utility  | `foreground`                   |
| Mobile navigation  | Mono           | `text-2xl`                         | `font-medium`                          | Default line height: 32px; no override  | `tracking-tight`           | `foreground`                   |
| Brand              | Mono           | `text-xl lg:text-base`             | `font-bold`                            | Default line height: 28px; 24px at `lg` | None; no tracking utility  | `foreground`; suffix at `/60`  |
| Data value         | Mono           | `text-3xl sm:text-4xl`             | `font-bold`                            | Default line height: 36px; 40px at `sm` | None; no tracking utility  | `foreground`                   |
| Data label         | Mono           | `text-xs sm:text-sm`               | 400 inherited; no weight utility       | Default line height: 16px; 20px at `sm` | `tracking-wider`           | `foreground/60`                |
| Work title         | Sans (default) | `text-4xl sm:text-5xl lg:text-6xl` | `font-bold`                            | `leading-[1.08]`                        | `tracking-wide`            | `foreground`                   |
| Project number     | Mono           | `text-xl sm:text-2xl lg:text-3xl`  | 400 inherited; no weight utility       | Default line height: 28px; 32px; 36px   | None; no tracking utility  | `accent`                       |
| Project title      | Mono           | `text-xl sm:text-2xl lg:text-3xl`  | `font-semibold`                        | Default line height: 28px; 32px; 36px   | `tracking-wide`            | `foreground`                   |
| Project tag        | Mono           | `text-sm`                          | 400 inherited; no weight utility       | Default line height: 20px; no override  | None; no tracking utility  | `foreground`                   |
| Accent action      | Mono           | `text-base sm:text-lg`             | `font-semibold`                        | Default line height: 24px; 28px at `sm` | None; no tracking utility  | `accent`                       |
| Article title      | Sans (default) | `text-4xl sm:text-5xl lg:text-6xl` | `font-bold`                            | `leading-[1.08]`                        | `tracking-wide`            | `foreground`                   |
| Article H2         | Sans (default) | `text-3xl sm:text-4xl`             | `font-bold`                            | `leading-tight`                         | `tracking-wide`            | `foreground`                   |
| Article H3         | Sans (default) | `text-2xl sm:text-3xl`             | `font-semibold`                        | `leading-tight`                         | `tracking-wide`            | `foreground`                   |

The Work, About, Skills, Blog, Contact, and article eyebrows reuse the eyebrow/status role, and all six render through `Eyebrow`. The hero eyebrow uses the same role and component; it passes an alternating prompt glyph but keeps the shared `mb-4` spacing. The About, Skills, Blog, and Contact titles reuse the Work title role. Skills group headings reuse the Personal index heading treatment; both sit in `compact-headings` and so keep the `h3` weight of `font-semibold`. The Work introduction, About narrative, Skills introduction and group descriptions, Blog introduction and summaries, Contact introduction, article summary, article paragraphs, article lists, and project summaries reuse the Hero description role. Blog, article, and Skills tags reuse the Project tag role and render through `Tag`. Every accent call to action renders through `CtaLink` and so shares one role, including the hero's.

Additional rules:

- A section introduction must use the shared lede measure of `max-w-3xl`, which `SectionHeader` applies by default. Pass an empty `descriptionClassName` only when an ancestor already constrains the measure, as the article rail does. Two roles are deliberately outside this rule: the hero description keeps `max-w-xl` because its column already constrains it, and the About narrative is unconstrained because its grid column governs the measure.
- `tracking-wide` on large display titles is a deliberate brand choice. Preserve it when the large-title role is used.
- Do not use wide tracking on ordinary body copy.
- Uppercase is reserved for short data labels and compact metadata, not sentences.
- Use straight apostrophes as the portfolio's deliberate house style.
- Use sentence case for headings, actions, and navigation unless a data-label role explicitly calls for uppercase. `Featured Projects` is the deliberate title-case exception for the Work heading.

### 4.6 Hero role emphasis

When the hero emphasizes the `software engineer.` role, use this complete underline treatment:

```text
underline decoration-accent decoration-[3px] underline-offset-8
```

The 3px value is a deliberate component-specific stroke thickness, not a layout-spacing token. The underline color transition uses `duration-300` and becomes static under reduced motion.

## 5. Spacing

### 5.1 Base scale

The spacing system uses a 4px base grid and retains the existing 6px half-step for compact controls.

| Value | Tailwind step | Primary role                                                     |
| ----: | ------------- | ---------------------------------------------------------------- |
|   4px | `1`           | Tight label spacing and arrow travel                             |
|   6px | `1.5`         | Compact desktop vertical control padding                         |
|   8px | `2`           | Inline icon gap and mobile vertical control padding              |
|  12px | `3`           | Compact statistic spacing                                        |
|  16px | `4`           | Desktop horizontal control padding                               |
|  20px | `5`           | Mobile horizontal control padding                                |
|  24px | `6`           | Desktop page gutters, regular rhythm, and mobile navigation gap  |
|  32px | `8`           | Phone and tablet page gutters, group separation, and CTA spacing |
|  40px | `10`          | Mobile-overlay bottom space                                      |
|  48px | `12`          | Section padding and major separation                             |
|  64px | `16`          | Header height                                                    |
|  80px | `20`          | Mobile-overlay top clearance below the header                    |
|  96px | `24`          | Work, About, Skills, Blog, and Contact section padding at `lg`   |

Use these values before introducing another step. Arbitrary spacing is allowed only when it expresses a real layout calculation that the standard scale cannot represent.

### 5.2 Page container

The content rail is defined once in `app/globals.css`:

```css
@theme inline {
  --container-content: 72rem;
}

@utility site-container {
  margin-inline: auto;
  width: 100%;
  max-width: var(--container-content);
  padding-inline: calc(var(--spacing) * 8);
  @variant lg {
    padding-inline: calc(var(--spacing) * 6);
  }
}
```

- `--container-content` is the single source of the 72rem width cap.
- `@utility site-container` is the single source of the complete rail recipe and is emitted with Tailwind's utilities.
- Every major page section must use `site-container`.
- Do not copy or reimplement these declarations inline in a component.
- Change the rail only through the theme token or utility so the header and every section remain aligned.
- Below `lg`, the 32px gutter keeps compensated edge controls and their 2px focus outline plus 2px offset visibly clear of the viewport edge.
- At `lg` and above, the gutter returns to 24px.

At `lg` and above, the 72rem cap includes both 24px gutters, leaving a maximum inner content width of 69rem.

### 5.3 Edge-control alignment

Interactive padding must not move visible content away from its intended alignment edge. For a control anchored to the edge of its content column:

```text
negative edge margin = internal padding on that edge
```

| Control                 | Padding        | Compensation              |
| ----------------------- | -------------- | ------------------------- |
| Mobile logo             | `px-5`         | `-ml-5`                   |
| Desktop logo            | `px-4`         | `lg:-ml-4`                |
| Desktop Resume          | `px-4`         | `-mr-4`                   |
| Hamburger               | `px-5 py-2`    | `-mr-5`                   |
| Mobile navigation links | `px-5`         | Parent or control `-ml-5` |
| Mobile Resume           | `px-5`         | `-ml-5`                   |
| Hero/project/Blog CTAs  | `px-5 lg:px-4` | `-ml-5 lg:-ml-4`          |
| Project disclosure row  | `px-5 lg:px-4` | `-mx-5 lg:-mx-4`          |

The mobile logo and hamburger deliberately share `px-5 py-2`. Do not give the Menu/X icon symmetric padding merely to force a square control; matching the logo's padding and edge compensation keeps both header controls aligned.

Apply this rule only to controls anchored to a content-column edge. Do not use negative margins on controls intentionally inset within that column. Focus outlines do not affect layout and are not part of the compensation calculation.

## 6. Responsive behavior

The interface is mobile-first. Existing breakpoints have distinct responsibilities:

| Breakpoint    | Responsibility                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| Base          | Phone and tablet header, overlay navigation, one-column hero, and comfortable header controls         |
| `sm` / 640px  | Hero type scale, body size, and statistic spacing                                                     |
| `lg` / 1024px | Desktop header and centered navigation, two-column hero, portrait, largest type, and compact controls |

Rules:

- The header must always remain present and sticky.
- A section's own `py-20` top padding is what clears the sticky header on a fragment navigation. Measured, it leaves the eyebrow 15px below the 64px header. Do not add `scroll-mt-*` on top of it; that only pushes the section a further 80px down the viewport. The previous section's 1px bottom divider sitting behind the header is expected.
- Desktop navigation must be mathematically centered with absolute centering, independent of the logo and Resume widths.
- The portrait remains hidden below `lg`; mobile prioritizes the introduction and work CTA.
- Below `lg`, header controls use the comfortable `px-5 py-2` padding pattern, including on tablets. At `lg` and above, text controls use the compact 36px tier. This viewport-based density policy is intentional and must not be silently replaced with a pointer-based rule.
- Avoid device-specific breakpoints unless a real layout failure requires one.

## 7. Interactive controls

### 7.1 Size tiers

Control padding follows the density pattern for its context. Below `lg`, mobile header controls use `px-5 py-2` whether their content is text or an icon; icon geometry does not introduce a separate square-padding rule.

| Variant              | Text                              | Padding                       | Icon               |                     Final height | Use                             |
| -------------------- | --------------------------------- | ----------------------------- | ------------------ | -------------------------------: | ------------------------------- |
| Compact              | `text-base`                       | `px-4 py-1.5`                 | `size-4`           |                             36px | Header controls at `lg+`        |
| Comfortable large    | `text-xl`                         | `px-5 py-2`                   | `size-5`           |                             44px | Mobile logo and Resume          |
| Prominent navigation | `text-2xl`                        | `px-5 py-2`                   | —                  |                             48px | Mobile menu links               |
| Mobile header icon   | —                                 | `px-5 py-2`                   | `size-6`           |                             40px | Mobile hamburger                |
| Accent action        | `text-base sm:text-lg`            | `px-5 py-2 lg:px-4 lg:py-1.5` | `size-4`           | 40px; 44px at `sm`; 40px at `lg` | Every accent CTA, via `CtaLink` |
| Project disclosure   | `text-xl sm:text-2xl lg:text-3xl` | `px-5 py-2 lg:px-4 lg:py-3`   | `size-5 lg:size-6` | 44px; 48px at `sm`; 60px at `lg` | Project heading row             |
| Contact copy action  | `text-base sm:text-lg`            | `px-5 py-2 lg:px-4 lg:py-1.5` | `size-5`           | 40px; 44px at `sm`; 40px at `lg` | Contact email copy control      |
| Contact social link  | `text-lg sm:text-xl`              | `px-5 py-2 lg:px-4 lg:py-1.5` | `size-6`           |               44px; 40px at `lg` | Contact social destinations     |

Additional rules:

- Text-and-icon controls use `gap-2`.
- Every pointer target must satisfy the WCAG 2.2 AA 24px minimum. The mobile tiers intentionally go beyond that baseline.
- Do not infer padding from font size or icon geometry alone. Select the component tier that matches the context.

### 7.2 Shape

- Text controls and text-with-icon controls must use `rounded-full`.
- Icon-only controls with a perceptually square glyph, such as Menu or X, must use `rounded-md`.
- Icon-only controls with a circular glyph may use `rounded-full`.
- Classify the shape by the visible glyph, not by Lucide's square SVG view box.
- Inline links inside prose are exempt from pill surface states.

### 7.3 States

| State               | Treatment                                             |
| ------------------- | ----------------------------------------------------- |
| Default             | Transparent background; semantic text color           |
| Hover               | Background uses the text hue at 10%                   |
| Pressed             | Background uses the text hue at 15%                   |
| Keyboard focus      | 2px foreground outline with 2px offset                |
| Current destination | Use `aria-current`; do not overload the pressed state |

Neutral control recipe:

```text
rounded-full transition-colors hover:bg-foreground/10 active:bg-foreground/15
```

Accent control recipe:

```text
rounded-full text-accent transition-colors hover:bg-accent/10 active:bg-accent/15
```

The brief color transition may remain when reduced motion is requested because it is non-spatial state feedback. Focus must remain an outline rather than becoming another fill state.

Inline prose links are the exception to the surface-state recipes. They use `rounded-full px-0.5` to give the global focus outline breathing room, keep full-strength accent text and a 1px underline at rest, and increase the underline to 2px on hover. They use no pill fill.

### 7.4 Touch behavior

- Preserve the global `touch-action: manipulation` policy.
- Keep its single implementation on `html` inside `@layer base` in `app/globals.css`; do not repeat it on individual controls.
- Accept Tailwind Preflight's transparent tap-highlight policy; no native tap highlight is used.
- Every standalone control must provide the custom 15% pressed pill state as its touch feedback.
- Do not restore a separate native tap highlight unless this policy is deliberately revisited.
- Never disable browser zoom or pinch zoom.
- Use a link for navigation and a button for an action or state change.

## 8. Icons and directional affordances

- Use `lucide-react` for interface icons. When Lucide does not include a brand mark, a local SVG component may supply it.
- Match icon size to its control tier: `size-4` with compact/base actions, `size-5` with large actions and project disclosures below `lg`, and `size-6` for the mobile Menu/X control, project disclosures at `lg`, and Contact brand marks.
- Decorative icons must be hidden from assistive technology. Icon-only controls must have an accessible name.
- Icons inherit the surrounding text color unless they communicate an independent semantic state.

Every right-arrow affordance must:

- sit beside its label with `gap-2`;
- use `transition-transform duration-200`;
- move only `translate-x-1` on group hover; and
- gate that movement behind `motion-safe` so it remains static under reduced motion.

Canonical arrow pattern:

```text
size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1
```

`size-5` replaces `size-4` in the comfortable-large tier. A defensive reduced-motion reset may remain, but `motion-safe` is the required behavior gate. `Arrow` owns this pattern; use it rather than writing the utilities again.

## 9. Motion

Motion must clarify interaction or express personality without being required to understand the page.

| Motion role                  |             Timing | Reduced-motion behavior                    |
| ---------------------------- | -----------------: | ------------------------------------------ |
| Hover and pressed color      |      150ms default | May retain immediate, non-spatial feedback |
| Arrow translation            |              200ms | No translation                             |
| Role decoration              |              300ms | No transition                              |
| Mobile overlay               |    300ms, ease-out | Opens and closes instantly                 |
| Automatic or looping content | Component-specific | Show a meaningful static final state       |

Rules:

- Spatial movement, continuous animation, and sequenced content must have a static reduced-motion version.
- Prefer transform and opacity for large UI transitions.
- Do not make content availability depend on an animation completing.
- Animated values must expose their final value to assistive technology.
- The hero's reduced-motion state is the final counter values, the complete first role, a static prompt, and no cursor pulse.
- The reduced-motion preference must be tracked live rather than read once, so a visitor who changes it while the page is open sees the static state immediately.

## 10. Header and mobile navigation

The header is a persistent global component and belongs in the root layout.

### Header

- Height: 64px (`h-16`).
- Position: sticky at the top with a foreground/10 bottom divider.
- Background: the canvas color.
- Left: wordmark aligned to the page rail.
- Center: desktop navigation mathematically centered at `lg+`.
- Right: Resume at `lg+`; Menu/X control below `lg`.
- Desktop and overlay navigation must render from one shared destination list so their labels and order remain synchronized.
- Section destinations use root-relative fragments such as `/#work` so they continue to work from nested article pages.

### Mobile navigation overlay

The overlay is part of the header system and must preserve these behaviors:

- Use a native button with `type="button"`, a state-aware accessible name, `aria-expanded`, and `aria-controls`.
- Keep the header controls visible above the overlay.
- Make the overlay fixed, full-screen, vertically scrollable, and overscroll-contained.
- Use `px-8` so the overlay content aligns with the phone and tablet page rail.
- Lock body scrolling and make the background `<main>` inert while open.
- Make the closed overlay inert and pointer-inactive.
- Reset the overlay scroll position when it opens.
- Close on Escape and return focus to the menu button.
- Close when the viewport reaches `lg` (1024px). The JavaScript threshold must remain synchronized with the Tailwind breakpoint.
- Close after every destination is activated, including the wordmark and Resume link.
- Animate only the vertical transform for 300ms with `ease-out`; remove the transition under reduced motion.
- Restore every modified global state during cleanup.

## 11. Hero and imagery

- The hero uses one column below `lg` and a `3fr / 2fr` text-to-image split at `lg+`.
- The portrait is desktop-only and must remain hidden below `lg`.
- Portrait assets should have a transparent background that blends into the page canvas.
- Do not add a phone frame, card, border, or shadow around the portrait.
- Use `next/image`, intrinsic sizing, and useful alt text for meaningful images. The static export runs no optimizer, so `next/image` emits a single source at its intrinsic size and no `srcset`; a `sizes` value has nothing to select from and does not reach the markup. Source assets must therefore already be sized for delivery.
- The portrait is the exception. It is the largest element in the viewport at `lg`, so it is the page's largest contentful paint and must load eagerly, yet it is hidden below `lg`, where downloading it is waste. `loading="lazy"` trades one for the other, so the portrait uses a plain `picture` instead: a `source` with `media: (min-width: 1024px)` carrying the asset, and an `img` whose `src` is an inline 1x1 transparent GIF. The preload scanner resolves the media query before any request, so narrow viewports fetch nothing and wide ones fetch eagerly at high priority. Keep `width` and `height` on the `img` so the box is still reserved.
- The hero content order remains: availability, identity, role, description, primary work CTA, then supporting statistics.
- The title and its animated role sit together in an `hgroup`, which ties the tagline to the heading without giving a decorative, animated line its own rank in the document outline.

## 12. Work and project showcase

- The Work section renders through `Section`, which supplies `site-container`, the foreground/10 bottom divider, and `py-20 lg:py-24`.
- Its content order is eyebrow, `Featured Projects` heading, introduction, then up to three ordered project previews.
- Project previews remain flat and use foreground/10 dividers: every item has a bottom divider, and the first item also has a top divider.
- Each project heading is an `<h3>` containing one native disclosure button with `aria-expanded` and `aria-controls`.
- The disclosure row contains the project number, title with desktop-only tags, and a decorative Plus/Minus icon. The complete row is hoverable and uses the neutral control states.
- The disclosure row uses `px-5 lg:px-4` with matching `-mx-5 lg:-mx-4` compensation so its visible content stays on the rail and its focus outline stays clear of the viewport edge.
- Expanded content begins beneath the title. Below `lg`, it uses one content column and hides the preview image; at `lg`, it uses a `3fr / 2fr` summary-to-image split.
- Project preview images use `next/image`, a `4 / 3` container, `object-cover`, and useful alt text.
- The case-study link renders through `CtaLink`, which supplies the accent action role, the control states, the compensated spacing, and the arrow.

## 13. About section

- The About section renders through `Section` with a `grid lg:grid-cols-[3fr_1fr]` rail passed as `containerClassName`. Its `SectionHeader` sits inside the narrative column, not above the grid, so the vertically centred Personal index aligns to the title rather than to the first paragraph.
- Below `lg`, the narrative and Personal index stack. The index begins with a foreground/10 top divider and `mt-12 pt-12`.
- At `lg`, the section uses a `3fr / 1fr` narrative-to-index split. The narrative uses `pr-8`; the index is vertically centered with a foreground/10 left divider and `pl-12`.
- The index column carries `compact-headings`, so the Personal index heading holds at `text-2xl` and keeps the `h3` weight of `font-semibold`. Its labels use mono `text-xs`, `tracking-wider`, uppercase, and `foreground/60`; its values stay within the established foreground, reading, and supporting text hierarchy.
- The Personal index uses a semantic `<dl>` with foreground/10 dividers. The narrative's inline project link uses the prose-link treatment.

## 14. Skills section

- The Skills section renders through `Section`.
- Its content order is eyebrow, title, introduction, then grouped skills.
- Each group uses a foreground/10 bottom divider, with a top divider on the first group, and `py-10 lg:py-12`. Below `lg`, its description and tags stack; at `lg`, they use a `2fr / 3fr` split.
- Groups and tags use semantic nested lists. Tags are static and use the Project tag role with the foreground/10 resting fill.

## 15. Blog section

- The Blog section renders through `Section`. Its content order is eyebrow, title, introduction, then up to two ordered article previews.
- Below `lg`, the previews stack, the featured image is hidden, and the first preview has a bottom divider. At `lg`, they use a `3fr / 2fr` split; the featured preview shows its image, while the secondary preview has a left divider and remains text-only.
- Preview headings use Sans with `font-semibold`, `leading-tight`, `tracking-wide`, and `text-balance`. The featured heading scales through `text-3xl sm:text-4xl lg:text-5xl`; the secondary stops at `sm:text-4xl`. Both previews show a summary and plain mono tags separated by decorative dots.
- The `Read post` links render through `CtaLink`, the same accent action used by the hero and the case-study links.

## 16. Contact section

- The Contact section renders through `Section`. Its content order is eyebrow, title, introduction, a bordered Email area, then Elsewhere links.
- The email address is an `address` element, which is the element for contact information about the page; it needs `not-italic` because browsers italicise it by default. It uses mono type and scales from a mobile fluid size to `sm:text-4xl lg:text-5xl`.
- `Email` and `Elsewhere` are headings that label rather than title, so they use `heading-label`.
- The copy button and social links use neutral pill states with `px-5 lg:px-4` and matching `-ml-5 lg:-ml-4` edge compensation. Social links open in a new tab, include that behavior in their accessible names, and treat local brand icons as decorative.
- Copy success is announced and resets after two seconds. If clipboard access fails, the email becomes a read-only input that receives focus and selection, the recovery message remains visible, and the copy button allows another attempt. Below `sm`, the fallback uses a smaller fluid size so the selected address fits within its padded field; from `sm`, it matches the normal email scale.

## 17. Article pages

- Work case studies and blog entries share one article layout.
- The article uses a foreground/10 bottom divider and `py-24`. Its content uses `article-headings site-container max-w-4xl`, preserving the shared gutters while narrowing the reading measure. The context class must sit on that rail rather than on the Markdown body, because the title is in the header and would otherwise be outside its scope.
- Header order is eyebrow, frontmatter title, summary, then tags. The frontmatter title is the page's sole `<h1>`.
- `article-headings` sizes the body's `<h2>` and `<h3>`; the Markdown map supplies only their spacing. Add lower heading levels only when real content requires them.
- Paragraphs and lists use the reading-text role. List markers use the accent at full strength.
- Inline code and fenced code blocks use a foreground/10 resting fill. Blocks also use foreground/10 horizontal dividers, mono type, and the established foreground, accent, and foreground/60 hierarchy for syntax highlighting.
- Fenced code declares its language so highlighting is explicit rather than inferred.
- Body images remain where they appear in Markdown. They use root-relative PNG assets, intrinsic dimensions read at build time, and useful alt text.

## 18. Accessibility and semantics

- Preserve the global `:focus-visible` 2px foreground outline and 2px offset.
- Do not remove focus styles without an equal or stronger replacement.
- Use semantic landmarks and native interactive elements.
- Decorative content must not create duplicate announcements.
- Use a description list for statistics. In source order, each group must place `<dt>` before `<dd>`; CSS may reverse their visual order so the number appears first.
- Keep static final values available to assistive technology when visible values animate.
- Do not disable text resizing, browser zoom, or pinch zoom.

## 19. Content style

- Write in Alfredo's first-person voice.
- Keep the tone direct, warm, and specific.
- Prefer concrete outcomes and selected work over generic claims.
- Use straight apostrophes consistently.
- Keep labels and navigation short.
- Use sentence case by default.
- Statistics use concise uppercase labels.
- Avoid product language such as "platform," "solution," or "get started" unless it describes an actual project.

## 20. Extending the system

Before adding a new pattern:

1. Reuse an existing color, type role, spacing value, control tier, and state treatment.
2. Confirm that the new component aligns to the same page rail.
3. Define its mobile behavior before adding desktop enhancements.
4. Define keyboard, focus, touch, and reduced-motion behavior with the visual design.
5. Add a new token only when an existing semantic role cannot express the need.
6. Document a deliberate exception next to the component and in this file if it is expected to recur.

Do not create generic card, shadow, dark-theme, form, or disabled-state systems before the portfolio actually needs them.

### Automation candidates

UI-system linting is intentionally deferred until the interface grows. When enforcement becomes worthwhile, begin with narrow, low-noise checks:

- reject noncanonical text opacities such as `/65` and `/80`;
- recalculate the documented contrast pairs whenever color tokens or interaction-surface opacities change, preserving only explicitly documented exceptions;
- flag a right-arrow written inline rather than through `Arrow`, and a heading size written as a utility rather than taken from the scale;
- detect copied content-rail declarations that bypass `Section` and `site-container`; and
- flag structural divider colors other than `foreground/10` unless an exception is documented.

Radius rules and edge-compensation pairings require component context. Keep them in manual review until shared components or an AST-aware rule can enforce them without false positives. Automation should report drift, not silently rewrite design decisions.

## 21. Current adoption status

The reviewed header, hero, Work section, About section, Skills section, Blog section, Contact section, and article pages follow this system, including:

- a shared `Section` / `SectionHeader` / `Eyebrow` / `Arrow` / `Tag` / `CtaLink` set giving each repeated recipe one definition;
- heading and body type as element rules in `app/globals.css`, with `compact-headings`, `article-headings`, and `heading-label` as the only overrides;
- shared content-rail alignment and compensated edge controls;
- the approved control-size tiers and radius policy;
- 10% hover and 15% pressed fills;
- the measured canvas contrast contract and the accepted site-wide accent interaction-state contrast decision;
- foreground/10 dividers;
- the `100 / 75 / 60 / 40` text hierarchy;
- motion-safe arrow movement and static reduced-motion states;
- semantic `<dl>`, `<dt>`, and `<dd>` statistics;
- the canvas-matched manifest and browser theme color;
- a shared root-relative navigation-destination list and synchronized `lg` boundary across CSS and JavaScript;
- menu closure from the wordmark and every mobile destination;
- semantic project disclosures with responsive summaries and imagery;
- a responsive About narrative and Personal index with semantic description-list markup;
- a responsive Skills list with grouped dividers, semantic nested lists, and a `2fr / 3fr` desktop split;
- responsive Blog previews with a `3fr / 2fr` desktop split and a text-only stacked mobile layout;
- a Contact section with an accessible clipboard fallback, compensated neutral controls, and named external social links;
- static Markdown article pages with a single H1, H2/H3 body hierarchy, syntax-highlighted code, in-flow images, and prose-link hover feedback;
- an `hgroup` pairing the hero title with its tagline, and an `address` carrying the contact email; and
- global manipulation touch behavior with custom 15% pressed feedback replacing the native tap highlight.

## References

- [WCAG 2.2: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2: Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android accessibility: Touch target size](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views)
- [Next.js font variables](https://nextjs.org/docs/app/api-reference/components/font#css-variables)
- [CSS cascade-layer precedence](https://www.w3.org/TR/css-cascade-5/#layer-order)
- [Tailwind CSS: Theme variables and `inline`](https://tailwindcss.com/docs/theme#referencing-other-variables)
- [Tailwind CSS: Custom utilities](https://tailwindcss.com/docs/adding-custom-styles#adding-custom-utilities)
- [Tailwind CSS: Preflight](https://tailwindcss.com/docs/preflight)
- [Tailwind CSS: prefers-reduced-motion variants](https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion)
