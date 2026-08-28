# Portfolio UI System

> **Status:** Active  
> **Scope:** Alfredo Mejia's portfolio  
> **Baseline:** The current site header and hero

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

The Hero CTA deliberately keeps `text-accent` at rest, hover, and active. Its 4.505:1 resting contrast meets WCAG AA. The translucent terracotta hover and pressed pills reduce that contrast below 4.5:1 during interaction; keeping them is an accepted, component-specific brand exception to this system. It is not a WCAG exception, does not lower the contrast requirement for other meaningful text, and does not establish a reusable exception for future controls.

### 4.2 Surfaces, borders, and elevation

- The page, sticky header, and mobile navigation overlay use the same canvas color.
- Every structural divider must be a 1px `border-foreground/10` border.
- Do not use shadows as substitutes for dividers.
- Surfaces are flat by default. Cards, elevated panels, and shadows are not part of the system yet.
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

Every role below exists in the current interface. The table names exact utilities; when the implementation intentionally relies on a font size's default line height or an inherited weight, it says so explicitly.

| Role                | Family         | Responsive size                    | Weight                                 | Leading                                 | Tracking                   | Color                          |
| ------------------- | -------------- | ---------------------------------- | -------------------------------------- | --------------------------------------- | -------------------------- | ------------------------------ |
| Hero title          | Sans (default) | `text-5xl sm:text-6xl lg:text-7xl` | `font-bold`                            | `leading-[1.08]`                        | `tracking-wide`            | `foreground`                   |
| Hero role           | Mono           | `text-4xl sm:text-5xl lg:text-6xl` | `font-medium`                          | `leading-tight lg:leading-[1.15]`       | `tracking-wide`            | `foreground/60`                |
| Hero description    | Sans (default) | `text-base sm:text-lg`             | 400 inherited; no weight utility       | `leading-relaxed` (1.625)               | None; no tracking utility  | `foreground/75`                |
| Eyebrow/status      | Mono           | `text-xs`                          | 400 inherited; prompt uses `font-bold` | Default line height: 16px; no override  | Label uses `tracking-wide` | `foreground/60`; prompt accent |
| Desktop navigation  | Mono           | `text-base`                        | `font-medium`                          | Default line height: 24px; no override  | None; no tracking utility  | `foreground`                   |
| Mobile navigation   | Mono           | `text-2xl`                         | `font-medium`                          | Default line height: 32px; no override  | `tracking-tight`           | `foreground`                   |
| Brand               | Mono           | `text-xl md:text-base`             | `font-bold`                            | Default line height: 28px; 24px at `md` | None; no tracking utility  | `foreground`; suffix at `/60`  |
| Hero primary action | Mono           | `text-lg lg:text-base`             | `font-semibold`                        | Default line height: 28px; 24px at `lg` | None; no tracking utility  | `accent`                       |
| Data value          | Mono           | `text-3xl sm:text-4xl`             | `font-bold`                            | Default line height: 36px; 40px at `sm` | None; no tracking utility  | `foreground`                   |
| Data label          | Mono           | `text-xs sm:text-sm`               | 400 inherited; no weight utility       | Default line height: 16px; 20px at `sm` | `tracking-wider`           | `foreground/60`                |

Typography for future sections, project items, and other content remains intentionally undefined until the real content and layout exist. Define and add those roles only after evaluating them in context.

Additional rules:

- `tracking-wide` on large display titles is a deliberate brand choice. Preserve it when the large-title role is used.
- Do not use wide tracking on ordinary body copy.
- Uppercase is reserved for short data labels and compact metadata, not sentences.
- Use straight apostrophes as the portfolio's deliberate house style.
- Use sentence case for headings, actions, and navigation unless a data-label role explicitly calls for uppercase.

### 4.6 Hero role emphasis

When the hero emphasizes the `software engineer.` role, use this complete underline treatment:

```text
underline decoration-accent decoration-[3px] underline-offset-8
```

The 3px value is a deliberate component-specific stroke thickness, not a layout-spacing token. The underline color transition uses `duration-300` and becomes static under reduced motion.

## 5. Spacing

### 5.1 Base scale

The spacing system uses a 4px base grid and retains the existing 6px half-step for compact controls.

| Value | Tailwind step | Primary role                                                    |
| ----: | ------------- | --------------------------------------------------------------- |
|   4px | `1`           | Tight label spacing and arrow travel                            |
|   6px | `1.5`         | Compact desktop vertical control padding                        |
|   8px | `2`           | Inline icon gap and mobile vertical control padding             |
|  12px | `3`           | Icon-button padding and compact statistic spacing               |
|  16px | `4`           | Desktop horizontal control padding                              |
|  20px | `5`           | Mobile horizontal control padding                               |
|  24px | `6`           | Page gutters, regular content rhythm, and mobile navigation gap |
|  32px | `8`           | Component-group separation and CTA spacing                      |
|  40px | `10`          | Mobile-overlay bottom space                                     |
|  48px | `12`          | Section padding and major separation                            |
|  64px | `16`          | Header height                                                   |
|  80px | `20`          | Mobile-overlay top clearance below the header                   |

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
  padding-inline: calc(var(--spacing) * 6);
}
```

- `--container-content` is the single source of the 72rem width cap.
- `@utility site-container` is the single source of the complete rail recipe and is emitted with Tailwind's utilities.
- Every major page section must use `site-container`.
- Do not copy or reimplement these declarations inline in a component.
- Change the rail only through the theme token or utility so the header and every section remain aligned.

The 72rem cap includes both 24px gutters, leaving a maximum inner content width of 69rem.

### 5.3 Edge-control alignment

Interactive padding must not move visible content away from the page rail. For a control anchored to the outer edge of the container:

```text
negative edge margin = internal padding on that edge
```

| Control                 | Padding        | Compensation              |
| ----------------------- | -------------- | ------------------------- |
| Mobile logo             | `px-5`         | `-ml-5`                   |
| Desktop logo            | `px-4`         | `md:-ml-4`                |
| Desktop Resume          | `px-4`         | `-mr-4`                   |
| Hamburger               | `p-3`          | `-mr-3`                   |
| Mobile navigation links | `px-5`         | Parent or control `-ml-5` |
| Mobile Resume           | `px-5`         | `-ml-5`                   |
| Hero CTA                | `px-5 lg:px-4` | `-ml-5 lg:-ml-4`          |

Apply this rule only to controls anchored to a container edge. Do not use negative margins on interior controls. Focus outlines do not affect layout and are not part of the compensation calculation.

## 6. Responsive behavior

The interface is mobile-first. Existing breakpoints have distinct responsibilities:

| Breakpoint    | Responsibility                                                         |
| ------------- | ---------------------------------------------------------------------- |
| Base          | Phone header, mobile menu, one-column hero, comfortable touch controls |
| `sm` / 640px  | Hero type scale, body size, and statistic spacing                      |
| `md` / 768px  | Desktop header and centered navigation mode                            |
| `lg` / 1024px | Two-column hero, portrait, largest display type, and compact hero CTA  |

Rules:

- The header must always remain present and sticky.
- Desktop navigation must be mathematically centered with absolute centering, independent of the logo and Resume widths.
- The portrait remains hidden below `lg`; mobile prioritizes the introduction and work CTA.
- At `md` and above, the header deliberately uses the compact 36px control tier, including on touch-capable tablets. This viewport-based density policy is intentional and must not be silently replaced with a pointer-based rule.
- Avoid device-specific breakpoints unless a real layout failure requires one.

## 7. Interactive controls

### 7.1 Size tiers

Control dimensions are based on final target height, not on increasing padding mechanically with every font size.

| Variant                 | Text        | Padding       | Icon     | Final height | Use                                      |
| ----------------------- | ----------- | ------------- | -------- | -----------: | ---------------------------------------- |
| Compact                 | `text-base` | `px-4 py-1.5` | `size-4` |         36px | `md+` header controls and `lg+` hero CTA |
| Comfortable action      | `text-lg`   | `px-5 py-2`   | `size-4` |         44px | Hero CTA below `lg`                      |
| Comfortable large       | `text-xl`   | `px-5 py-2`   | `size-5` |         44px | Mobile logo and Resume                   |
| Prominent navigation    | `text-2xl`  | `px-5 py-2`   | —        |         48px | Mobile menu links                        |
| Icon-only touch control | —           | `p-3`         | `size-6` |         48px | Mobile hamburger                         |

Additional rules:

- Text-and-icon controls use `gap-2`.
- Phone controls must use the existing 44px or 48px tiers.
- Every pointer target must satisfy the WCAG 2.2 AA 24px minimum. The mobile tiers intentionally go beyond that baseline.
- Do not infer padding from font size alone. Select the component tier that matches the context.

### 7.2 Shape

- Text controls and text-with-icon controls must use `rounded-full`.
- Icon-only controls with a perceptually square glyph, such as Menu or X, must use `rounded-md`.
- Icon-only controls with a circular glyph may use `rounded-full`.
- Classify the shape by the visible glyph, not by Lucide's square SVG view box.
- Inline links inside prose are exempt from the pill treatment.

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

### 7.4 Touch behavior

- Preserve the global `touch-action: manipulation` policy.
- Keep its single implementation on `html` inside `@layer base` in `app/globals.css`; do not repeat it on individual controls.
- Accept Tailwind Preflight's transparent tap-highlight policy; no native tap highlight is used.
- Every standalone control must provide the custom 15% pressed pill state as its touch feedback.
- Do not restore a separate native tap highlight unless this policy is deliberately revisited.
- Never disable browser zoom or pinch zoom.
- Use a link for navigation and a button for an action or state change.

## 8. Icons and directional affordances

- Use `lucide-react` for interface icons.
- Match icon size to its control tier: `size-4` with compact/base actions, `size-5` with large actions, and `size-6` inside icon-only touch controls.
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

`size-5` replaces `size-4` in the comfortable-large tier. A defensive reduced-motion reset may remain, but `motion-safe` is the required behavior gate.

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

## 10. Header and mobile navigation

The header is a persistent global component and belongs in the root layout.

### Header

- Height: 64px (`h-16`).
- Position: sticky at the top with a foreground/10 bottom divider.
- Background: the canvas color.
- Left: wordmark aligned to the page rail.
- Center: desktop navigation mathematically centered at `md+`.
- Right: Resume on desktop; Menu/X control on mobile.

### Mobile navigation overlay

The overlay is part of the header system and must preserve these behaviors:

- Use a native button with `type="button"`, a state-aware accessible name, `aria-expanded`, and `aria-controls`.
- Keep the header controls visible above the overlay.
- Make the overlay fixed, full-screen, vertically scrollable, and overscroll-contained.
- Lock body scrolling and make the background `<main>` inert while open.
- Make the closed overlay inert and pointer-inactive.
- Reset the overlay scroll position when it opens.
- Close on Escape and return focus to the menu button.
- Close when the viewport reaches `md`.
- Close after every destination is activated, including the wordmark and Resume link.
- Animate only the vertical transform for 300ms with `ease-out`; remove the transition under reduced motion.
- Restore every modified global state during cleanup.

## 11. Hero and imagery

- The hero uses one column below `lg` and a `3fr / 2fr` text-to-image split at `lg+`.
- The portrait is desktop-only and must remain hidden below `lg`.
- Portrait assets should have a transparent background that blends into the page canvas.
- Do not add a phone frame, card, border, or shadow around the portrait.
- Use `next/image`, intrinsic sizing, an accurate `sizes` value, and useful alt text for meaningful images.
- The hero content order remains: availability, identity, role, description, primary work CTA, then supporting statistics.

## 12. Accessibility and semantics

- Preserve the global `:focus-visible` 2px foreground outline and 2px offset.
- Do not remove focus styles without an equal or stronger replacement.
- Use semantic landmarks and native interactive elements.
- Decorative content must not create duplicate announcements.
- Use a description list for statistics. In source order, each group must place `<dt>` before `<dd>`; CSS may reverse their visual order so the number appears first.
- Keep static final values available to assistive technology when visible values animate.
- Do not disable text resizing, browser zoom, or pinch zoom.

## 13. Content style

- Write in Alfredo's first-person voice.
- Keep the tone direct, warm, and specific.
- Prefer concrete outcomes and selected work over generic claims.
- Use straight apostrophes consistently.
- Keep labels and navigation short.
- Use sentence case by default.
- Statistics use concise uppercase labels.
- Avoid product language such as "platform," "solution," or "get started" unless it describes an actual project.

## 14. Extending the system

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
- require the arrow utility set, including `duration-200` and `motion-safe:group-hover:translate-x-1`, without depending on class order;
- detect copied content-rail declarations that bypass `site-container`; and
- flag structural divider colors other than `foreground/10` unless an exception is documented.

Radius rules and edge-compensation pairings require component context. Keep them in manual review until shared components or an AST-aware rule can enforce them without false positives. Automation should report drift, not silently rewrite design decisions.

## 15. Current adoption status

The reviewed header and hero follow this system, including:

- shared content-rail alignment and compensated edge controls;
- the approved control-size tiers and radius policy;
- 10% hover and 15% pressed fills;
- the measured canvas contrast contract and the Hero CTA's deliberate interaction-state exception;
- foreground/10 dividers;
- the `100 / 75 / 60 / 40` text hierarchy;
- motion-safe arrow movement and static reduced-motion states;
- semantic `<dl>`, `<dt>`, and `<dd>` statistics;
- the canvas-matched manifest and browser theme color;
- menu closure from the wordmark and every mobile destination; and
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
