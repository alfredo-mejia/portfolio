# Page Wireframe

## Purpose

This section provides low-fidelity wireframes for each page of the
portfolio. These wireframes are structural references, not visual
designs.

They illustrate:

- Content hierarchy

- Layout flow

- Relative emphasis of elements

All styling, spacing, color, and interaction behavior is governed by the
Visual Design Requirements (VDR) and Experience Design Requirements
(XDR).

# Home Page Wireframe

**File**

[**0.home.v3.excalidraw**](https://excalidraw.com/#json=vw4-NRF1eHjnDF9PAp5GN,r2G7IjR7pfJgINVsiw7ESA)

**Intent**

The Home page servers as a clear entry point to the portfolio.

It must:

- Immediately identify the site owner by name

- Provide a one-click resume download

- Offer obvious navigation to all primary pages

- Keep contact information accessible without drawing focus

- Fit entirely within a single viewport without scrolling

## Structural Overview

The Home page follows a single-column vertical layout.

Top to bottom hierarchy:

1.  Primary Identity

- Site owner's name

- Resume download call-to-action

2.  Primary Navigation

- My Story

- My Resume

- My Blog

- My Projects

- Each navigation item is represented by:
  - Text label

  - Subtle monochrome icon

3.  Contact & External Links

- Email address with copy-to-clipboard affordance

- Social links (GitHub, LinkedIn, etc.)

## Visual & Interaction Notes

- Navigation icons use the secondary text color (#6B6B6B)

- On hover, icons transition to the accent gray (#4A4A4A)

- Navigation text follows standard link behavior as defined in the VDR

- No card-based navigation is used

- No descriptions are shown for navigation items

- No scrolling is required to access any content on the page

## Design Rationale

The Home page is intentionally minimal.

It does not:

- Explain content

- Provide descriptions

- Introduce animations or visual effects

Its sole purpose is orientation and access.

Content, narrative, and depth are deferred to the respective pages.

## Status

- Wireframe version: v3

- Layout: Final for initial implementation

- Visual styling: Governed entirely by VDR

# Resume Page Wireframe

**File**

[**2.resume.v2.excalidraw**](https://excalidraw.com/#json=X8fLHxWbruDxROEDzJZfq,xeu2-7FD36I-La_mGrzlgA)

**Intent**

The Resume page is designed to answer two questions quickly and clearly:

1.  _Can I understand Alfredo's experience at a glance?_

2.  _Can I download a clean, recruiter-ready resume immediately?_

The page prioritizes **readability, familiarity, and trust**. It assumes
many visitors will skim briefly or download the resume without reading
the full page.

It must:

- Clearly present itself as a resume

- Make downloading the resume obvious and frictionless

- Keep resume and contact access available at all times

- Follow a predictable, recruiter-friendly structure

- Allow long-form explanations without constraining content to a
  single page

- Recede UI elements (nav bar) while reading

Editing and export controls are owner-only and not part of the default
visitor experience.

## Structural Overview

The page follows a single-column vertical layout with a hide-on-scroll
navigation bar.

**Top to Bottom Hierarchy**

1.  Global Navigation Bar

- Left side:
  - Primary action: Download Resume

  - Email displayed as text with copy affordance

- Right side:
  - Navigation links: Home, My Story, My Resume, My Blog, My
    Projects

  - Account icon (owner-only access)

  - Navigation hides on scroll down and reappears on scroll up

2.  Page Header

- Page title: Resume

- Optional quiet metadata (e.g., "Last updated")

3.  Resume Content

- Education

- Experience

- Projects

- Skills

4.  End of Content

- No footer; persistent access is handled by the navigation bar

## Design Rationale

The Resume page intentionally avoids creativity or visual novelty.

It favors:

- Familiar structure

- Clear hierarchy

- Minimal UI

- Predictable scanning patterns

The navigation bar provides constant access to the resume and contact
information, while its hide-on-scroll behavior ensures the UI disappears
during focused reading.

The web resume is allowed to be expansive and explanatory, while the
downloadable PDF remains compact and recruiter-friendly.

## Status

- Wireframe version: v2

- Layout: Final for initial implementation

- Interaction patterns: Locked

- Visual styling: Governed by VDR

## Visual & Interaction Notes

- The navigation bar follows the global navigation pattern defined in
  the VDR, including hide-on-scroll behavior.

- The navigation bar uses a single subtle bottom divider (#E2E2E2) to
  separate it from page content; no background fill, shadow, or
  container styling is applied.

- The "Download Resume" action is rendered as a primary button using
  the global primary button pattern (accent gray text and border,
  transparent background).

- The email address is displayed as plain text (no border, no
  background, no button container) with an adjacent copy affordance;
  the email itself is always visible and readable.

- The copy affordance is visually lightweight and follows the global
  icon-button pattern; on activation, a subtle confirmation ("Copied")
  appears using secondary text styling.

- Navigation links are text-only with no borders or background; hover
  and focus behavior follows the global link interaction rules defined
  in the VDR.

- The current page ("My Resume") is indicated using darker text only,
  without underline, background, or additional emphasis.

- The "Last updated" label is displayed as quiet metadata beneath the
  page title using secondary text styling; it is non-interactive and
  informational only.

- Resume content follows the global single-column reading layout with
  no cards, panels, icons, or decorative containers; all structure is
  conveyed through headings, spacing, and text hierarchy.

# Blog Search Page Wireframe

**File**

[**3.blog_search.v1.excalidraw**](https://excalidraw.com/#json=CRwErhIJDpEe1Ng_MNHvO,Byt_T0sNtJbcO919ZdD7gw)

**Intent**

The Blog Search page is designed to help visitors discover and select
blog posts quickly and calmly.

It serves as a searchable index of writing, prioritizing clarity,
scan-ability, and orientation over promotion or visual complexity. The
page supports both casual browsing and targeted searching without
overwhelming the reader.

**Must-Haves**

The Blog Search page must:

- Make searching for blog posts obvious and frictionless

- Support filtering and sorting without clutter

- Present posts in both card and table views

- Allow incremental result loading

- Clearly surface curated content ("My Top Picks")

- Maintain a quiet, reading-first tone

- Reuse global navigation and interaction patterns

Editing controls, drafts, and AI prompt interfaces are **owner-only**
and not visible to visitors.

## Structural Overview

The page follows a single-column vertical layout with a consistent
global navigation bar.

**Top to Bottom Hierarchy**

1.  Global Navigation Bar

- Same navigation pattern as the Resume page

- Includes persistent access to resume download and email

- Hides on scroll down and reappears on scroll up

2.  Page Header

- Page title: _Blogs_

3.  Search & Controls Section
    - Search bar with search icon

    - Filter button

    - Sort dropdown with ascending/descending toggle

    - Card / Table view toggle

    - Filter and sort controls are left-aligned

    - View toggle is right aligned

4.  Active Filters Row (Conditional)
    - Appears only when filters are applied

    - Displays filter chips representing active filters

    - Each chip includes a removal ("X") affordance

5.  Results Section
    - Displays blog posts in either card view or table view

    - Results load incrementally via a "See More" interaction

6.  My Top Picks Section
    - Displays manually curated blog posts selected by the site owner

    - Visually secondary to search results

    - Uses the same card or table presentation patterns

## Visual & Interaction Notes

- The page uses the global navigation styling and hide-on-scroll
  behavior defined in the VDR.

- The search bar is visually dominant within the page content and
  aligned to the main content column.

- Filter and sort controls use the global control patterns and are
  visually quieter than the search bar.

- The card/table toggle uses icon-based selection, with the active
  view clearly indicated.

- Active filters are shown as removable chips using the global chip
  styling.

- Blog results follow the global reading width and spacing rules.

- All cards and table rows are fully clickable, with no nested
  actions.

- The "See More" interaction appends additional results below the
  existing list.

- No pagination controls (page numbers, previous/next) are used.

## Card View Content

Each blog post card displays:

- Title

- Thumbnail

- Last updated date

- Tags and categories

- Short summary truncated to a fixed length with ellipsis

Additional rules:

- Cards are uniform in size

- Tags and categories may scroll horizontally within a card to avoid
  vertical expansion

## Table / List View Content

Each table row displays:

- Title

- Short summary

- Publish date

- Last updated date

- Tags

- Categories

Switching between card and table views changes only presentation
density, not content.

## Design Rationale

The Blog Search page is intentionally structured as a flat directory
rather than a feed.

By prioritizing search, filters, and sorting over predefined sections
like "Most Recent" or "Most Popular," the page avoids redundancy and
keeps discovery flexible. The "My Top Picks" section introduces personal
curation without competing with the primary discovery experience.

All controls are designed to remain secondary to content, ensuring the
page feels calm, predictable, and easy to scan.

## Status

- Wireframe version: v1

- Layout: Final for initial implementation

- Discovery model: Locked

- Interaction patterns: Validated

- Visual styling: Governed by VDR

# Project Search Page Wireframe

**File**

[**5.project_search.v1.excalidraw**](https://excalidraw.com/#json=ZP-XnS8JFCCHnyjt5L5Zo,EQU8OVf9vNAiex20KfMlZQ)

**Intent**

The Projects Search page is designed to help visitors discover, browse,
and evaluate projects efficiently.

It mirrors the blog discovery experience to maintain consistency, while
shifting focus toward demonstrating end-to-end implementation, technical
depth, and real, runnable work.

**Must-Haves**

The Projects Search page must:

- Provide a searchable, filterable directory of projects

- Support both browsing and targeted discovery

- Reuse the same interaction and layout patterns as the Blog Search
  page

- Clearly surface curated projects ("Featured Projects")

- Maintain a calm, non-marketing tone

- Avoid manual curation or duplicated content

All project data is sourced automatically and is read-only for visitors.

## Structural Overview

The page follows the same single-column vertical layout and global
navigation behavior as the Blog Search page.

**Top to Bottom Hierarchy**

1.  Global Navigation Bar

- Identical to Blog and Resume pages

- Persistent access to resume download and email

- Hides on scroll down and reappears on scroll up

2.  Page Header

- Page title: _Projects_

3.  Search & Controls Section

- Search bar

- Filter button

- Sort dropdown with ascending/descending toggle

- Card / Table view toggle

- Filter and sort controls are left-aligned

- View toggle is right-aligned

4.  Active Filters Row (Conditional)

- Displays removable filter chips when filters are applied

5.  Results Section

- Displays projects in either card view or table view

- Results load incrementally via a "See More" interaction

6.  Featured Projects Section

- Displays curated projects selected by the site owner

- Visually secondary to the main results

- Uses the same card or table presentation patterns

## Visual & Interaction Notes

- The Projects Search page intentionally reuses all discovery patterns
  defined for the Blog Search page.

- Search, filter, sort, and view toggle controls behave identically.

- All cards and table rows are fully clickable and navigate to the
  individual project page.

- The "See More" interaction appends additional results below the
  existing list.

- No pagination controls (page numbers, previous/next) are used.

- No project content is editable from this page.

## Card View Content

Each project card displays:

- Project title

- Thumbnail or preview image

- Last updated date

- Tags and categories

- Short summary truncated to a fixed length with ellipsis

Additional rules:

- Cards are uniform in size

- Tags and categories may scroll horizontally within a card to avoid
  vertical expansion

## Table / List View Content

Each table row displays:

- Project title

- Short summary

- Publish date (if applicable)

- Last updated date

- Tags

- Categories

Switching between card and table views affects presentation density
only.

## Design Rationale

The Projects Search page intentionally mirrors the Blog Search page to:

- Reduce cognitive load

- Establish predictable discovery patterns

- Emphasize content over layout novelty

By keeping project discovery consistent with blog discovery, visitors
can focus on evaluating the work itself rather than learning a new
interface. The "Featured Projects" section introduces intentional
curation without undermining automated sourcing or discovery.

## Status

- Wireframe version: v1

- Layout: Final for initial implementation

- Discovery model: Reused and locked

- Interaction patterns: Identical to Blog Search

- Visual styling: Governed by VDR

# Story Page Wireframe

**File**

[**1.story.v1.excalidraw**](https://excalidraw.com/#json=3gNLSt6l5q8huzh-xAVRR,2K6YLC_GY7Z0R4P_N1xMWg)

**Intent**

The Story page is designed to answer the question:

"Who is Alfredo, and how did he become the person he is today?"

It presents a chronological, narrative-driven account of personal
growth, motivations, challenges, and experiences. The page prioritizes
reading, reflection, and clarity, with animation serving only as a
supplemental layer.

**Must-Haves**

The Story page must:

- Present a complete, readable narrative without relying on animation

- Preserve identical content between Plain mode and Story mode

- Default to Plain mode on first visit

- Maintain strict chronological ordering

- Provide orientation within the timeline without disrupting reading

- Reuse global navigation and interaction patterns

- Keep all UI secondary to the narrative text

Editing controls and animation tooling are owner-only and not visible to
visitors.

## Structural Overview

The page follows a centered, reading-first layout with optional
peripheral space reserved for animation.

**Top to Bottom Hierarchy**

1.  Global Navigation Bar

- Identical to the Resume page navigation

- Persistent access to resume download and email

- Hides on scroll down and reappears on scroll up

2.  Main Content Area

- Three conceptual columns:
  - Center column: primary story content

  - Left and right columns: reserved for optional animation layers
    (secondary)

- Content remains fully readable if animation layers are removed

3.  Page Header

- Page title: _My Story_

- Mode toggle: Plain / Story (text-based)

4.  Story Content Sections

- Chronologically ordered sections

- Each section represents a life phase or significant event

- Sections include narrative text and optional headings

- Content flows vertically with no cards, grids, or side-by-side
  layouts

5.  Timeline / Progress Indicator

- Vertical progress bar positioned to the side of the content

- Uses discrete markers to represent key points in the timeline

- Marker state updates automatically based on scroll position

## Visual & Interaction Notes

- The navigation bar follows the global navigation styling and
  hide-on-scroll behavior defined in the VDR.

- The content column uses the same reading width and spacing rules as
  blog posts and the resume page.

- The Plain / Story mode toggle is visually quiet, text-based, and
  non-sticky.

- The timeline indicator is thin, neutral in color, and visually
  secondary to the content.

- Timeline markers update passively as the user scrolls; no snapping
  or forced navigation occurs.

- Animation layers, when present, exist outside the main content
  column and never overlap or obstruct text.

- Removing animations does not affect layout, content, or orientation.

## Design Rationale

The Story page is intentionally designed as a long-form narrative,
similar to a personal essay rather than an interactive product
experience.

By centering the content and relegating animation to peripheral layers,
the page ensures that the story remains accessible, readable, and
complete under all conditions. The vertical timeline indicator provides
orientation without competing with the narrative, reinforcing a sense of
progression while preserving a calm reading experience.

## Status

- Wireframe version: v1

- Layout: Final for initial implementation

- Narrative structure: Locked

- Interaction patterns: Validated

- Animation dependency: None

- Visual styling: Governed by VDR

# Individual Blog Post Pag

**File**

[**4.blog_post.v3.excalidraw**](https://excalidraw.com/#json=JRkODngFIZdvY5RFTdpE7,ZMdOpxkhlaXE2bfSbreubg)

**Intent**

The Individual Blog Post page is designed to provide a calm,
distraction-free reading experience for long-form writing.

It prioritizes readability and comprehension while making secondary
metadata, export actions, and reference information available without
interrupting the reading flow.

**Must-Haves**

The Individual Blog Post page must:

- Present the full post content in a single, readable column

- Make published date and estimated reading time visible without
  interaction

- Allow access to extended metadata without cluttering the page

- Support rich content (code blocks, images, diagrams, math)

- Preserve reading flow with no modal interruptions

- Reuse global navigation patterns consistently

Visitors may read, export, or share content.

Editing and AI tooling are owner-only and not visible.

## Structural Overview

The page follows the same centered reading layout used by the Resume and
Story pages.

**Top to Bottom Hierarchy**

1.  Global Navigation Bar

- Identical to other pages

- Resume download and email always accessible

- Hides on scroll down and reappears on scroll up

2.  Post Header

- Blog post title (primary visual focus)

3.  Metadata Row

- Published date (visible)

- Estimated reading time (visible)

- "Details" disclosure control

- Export and share icons

- Metadata elements share a single horizontal row

4.  Details Panel (Collapsed by Default)

- Expands inline when "Details" is selected

- Appears between the metadata row and the thumbnail/content

- Spans the full width of the content column

5.  Thumbnail (Optional)

- Displayed if provided

- Positioned above the body content

6.  Post Body

- Primary narrative content

- Includes headings, paragraphs, code blocks, images, diagrams, and
  math

## Visual & Interaction Notes

- The Details control expands an inline disclosure panel, not a modal
  or popup.

- The expanded Details panel is left-aligned within the content
  column, regardless of the control's position.

- The panel scrolls naturally with the page and does not overlay
  content.

- Tags and categories inside the Details panel are rendered as chips:
  - One row per metadata type

  - Horizontal scrolling when overflowing

  - No vertical wrapping

- Chips are visually quiet and secondary; they do not resemble primary
  buttons.

- Export and share icons are visible but understated and do not
  compete with the title.

- All non-text elements (images, code output) are supplemental and
  must not block reading.

## Design Rationale

This page is intentionally designed to feel like reading a well-edited
technical notebook or article, not interacting with a platform.

Core context (published date and reading time) is visible upfront, while
extended metadata (tags, categories, post ID, update history) is grouped
into a single, collapsible reference block. Using an inline disclosure
preserves reading continuity while keeping provenance information
accessible and scalable.

Status

- Wireframe version: v3

- Layout: Final

- Metadata disclosure pattern: Locked

- Chip usage & scrolling behavior: Locked

- Reading-first constraints: Enforced

- Visual styling: Governed by VDR

# Individual Project Post Page

**File**

[**6.project_post.v1.excalidraw**](https://excalidraw.com/#json=bOfGFSS5uXAWM7ETnfaFJ,jlyC2OByTNayLgD_M1RBUA)

**Intent**

The Individual Project Page is designed to demonstrate that Alfredo can
build, explain, and reason about projects end-to-end.

The page prioritizes clear explanation and understanding of the project
while providing visual evidence through a live preview or screenshots.
Interactivity is supplemental and must never be required to understand
the project.

**Must-Haves**

The Individual Project Page must:

- Present a clear, readable explanation of the project in a single
  reading column

- Reuse the same reading-first structure as the Individual Blog Post
  page

- Support a live preview when available

- Provide a reliable visual fallback when the live preview is
  unavailable

- Make core context and metadata accessible without clutter

- Preserve readability regardless of preview availability

Visitors may read, explore, export, or share the project.

Editing and management controls are owner-only.

## Structural Overview

The page mirrors the Individual Blog Post layout with a project-specific
substitution.

**Top to Bottom Hierarchy**

1.  Global Navigation Bar

- Identical to other pages

- Resume download and email always accessible

- Hides on scroll down and reappears on scroll up

2.  Project Header

- Project title (primary visual focus)

3.  Metadata Row

- Published or first release date (visible)

- Estimated reading time (visible)

- "Details" disclosure control

- Export and share icons

4.  Details Panel (Collapsed by Default)

- Expands inline below the metadata row

- Displays extended project metadata:
  - Project ID

  - Last updated date

  - Tags

  - Categories

  - Additional provenance information

5.  Live Preview / Visual Fallback Area

- Occupies the same layout position as a blog post thumbnail

- Displays either:
  - A live project preview (preferred), or

  - A screenshot-based slideshow (fallback)

6.  Project Body Content

- Explanation of what the project does

- How it works

- Design decisions and trade-offs

- Supporting code blocks, diagrams, and images

## Live Preview & Fallback Behavior

- The live preview is optional and supplemental.

- If the live preview fails to load, is unavailable, or is
  intentionally disabled:
  - A screenshot-based slideshow is displayed automatically in its
    place.

- The slideshow:
  - Uses multiple images instead of a single thumbnail

  - Occupies the same layout position as the live preview

  - Preserves reading flow and layout consistency

- Screenshots must provide enough visual context to understand the
  project without interactivity.

The page must remain fully understandable without a live preview.

## Visual & Interaction Notes

- Live preview UI controls are intentionally unspecified at the
  wireframe stage.

- The preview area behaves as supporting media, not a primary
  interaction surface.

- Screenshot fallback behaves similarly to a blog thumbnail but
  supports multiple images.

- All images must include descriptive alt text.

- The expanded Details panel is left-aligned within the content column
  and scrolls naturally with the page.

- Tags and categories inside the Details panel are rendered as chips
  with horizontal scrolling when overflowing.

## Design Rationale

This page balances explanation with evidence. Textual explanation is
always the source of truth, while the live preview or screenshots
provide supporting context.

By treating screenshots as a first-class fallback rather than an error
state, the page remains resilient, accessible, and honest under all
conditions. This reinforces the idea that projects are evaluated by
clarity of thinking as much as by interactivity.

## Status

- Wireframe version: v1

- Layout: Final

- Live preview placement: Locked

- Screenshot fallback: Locked

- Metadata disclosure pattern: Locked

- Visual styling: Governed by VDR

# Notes on Wireframe Evolution

- Wireframes may evolve as implementation proceeds.

- Any changes must continue to satisfy the XDR and VDR principles.

- Wireframes do not override design requirements.
