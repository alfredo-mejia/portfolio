# Requirements Document

This document consolidates all functional, experience design, and visual design requirements for Alfredo's Portfolio. It combines product requirements, interaction patterns, and visual specifications into a single source of truth.

---

# Table of Contents

1. [Functional Requirements](#functional-requirements)
   - [Home Page](#home-page-requirements)
   - [My Story Page](#my-story-page-requirements)
   - [My Resume Page](#my-resume-page-requirements)
   - [My Blog](#my-blog-requirements)
   - [My Projects](#my-projects-requirements)
   - [Editor](#editor-requirements)
   - [Cross-Cutting Requirements](#cross-cutting-requirements)
2. [Experience Design Requirements](#experience-design-requirements)
3. [Visual Design Requirements](#visual-design-requirements)

---

# Functional Requirements

## Home Page Requirements

### Functional Requirements

- The site owner's name must be clearly visible on the home page, even if the domain already contains it.
- Visitors must be able to download the resume in one click from the home page.
- Visitors must be able to easily find a contact email.
- Visitors must be able to easily access public profile links, including:
  - GitHub
  - LinkedIn
  - Any other explicitly configured public profiles
- Visitors must be able to clearly identify and navigate to:
  - My Story
  - My Resume
  - My Blog
  - My Projects

### Non-Functional Requirements

- The home page must prioritize clarity and speed over visual density.
- Primary actions (resume download, navigation) must be immediately visible without scrolling.

### Accessibility Requirements

- All content must be readable using assistive technologies.
- Navigation must be usable via keyboard-only input.

## My Story Page Requirements

**Purpose:**

Present a chronological personal narrative in both readable and experiential forms.

### Functional Requirements

- The story must be vertically scrollable.
- The story must be divided into sections, each representing a life event or phase.
- Each section must include a textual description.
- The story must be presented in strict chronological order.
- The page must have markers to easily navigate / jump to different events.
- The page must support two modes:
  - Plain Mode (default)
  - Story Mode
- The page must have the editor and only visible for the site owner

### Plain Mode Requirements

- Plain mode must be the default mode.
- Content must be clearly structured and readable.
- Time progression must be visually indicated (e.g., year markers or timeline scrollbar).
- Visitors must be able to quickly jump to different sections.

### Story Mode Requirements

- Story mode must display the exact same content as plain mode.
- Story mode must add visual animation only; it must not alter wording, structure, or meaning.
- Scrolling must drive visual changes representing growth or progression.
- Visual metaphors are intentionally flexible (e.g., character, world, environment evolution).

### Non-Functional Requirements

- Animations must not include rapid flashing or high-contrast strobing.
- Animations must be smooth and not introduce noticeable lag.
- Story mode must never block access to the underlying content.

### Accessibility Requirements

- Users must be able to fully experience the story without enabling animations.
- Motion-sensitive users must not be forced into story mode.
- Story mode must respect reduced-motion preferences where applicable.

### Authentication Requirement

- Editing capabilities must only be visible when the site owner is logged in.

## My Resume Page Requirements

**Purpose:**

Act as the single source of truth for experience and generate consistent, recruiter-ready resumes.

### Functional Requirements

- The resume page must be editable directly on the website by the site owner.
- The resume must be fully readable by visitors without requiring download.
- The resume must be structured into defined sections, including at minimum:
  - Experience
  - Skills
- The page must display the date of the last edit.
- The page must have the editor and only visible to the site owner.

### Export Requirements (All Visitors)

- Visitors must be able to export and download a one-page resume.
- Exported resumes must follow a strict, consistent layout.
- Exported resumes must not include timestamps.

### AI-Assisted Export Requirements

- Resume export must use AI to summarize and compact content.
- AI input must include the full resume page content.
- AI output must not introduce new experience or fabricated information.
- AI must only rephrase, summarize, or emphasize existing content.

### Owner-Only Advanced Export

- The site owner must be able to export tailored resumes using prompts.
- Prompts must emphasize only what is explicitly requested (e.g., frontend, cybersecurity).
- Tailored resumes must still be derived exclusively from resume page content.

### Versioning & Caching Requirements

- Resume content must be versioned.
- Previous versions and export history must be visible to the site owner.
- Exported resumes must be cached.
- Cached exports must only be invalidated when resume content changes.
- AI must only be called when content has changed and an export is requested.

### Authentication Requirement

- Editing, version history, and tailored exports must only be visible to the site owner.

## My Blog Requirements

**Purpose:**

Provide a writing space that reflects interests, learning, and ideas.

### Reader-Facing Requirements

- Visitors must be able to search blog posts.
- Blog posts must be filterable by:
  - Tags
  - Categories
- Tags and categories must be generated using AI.
- The blog page must display:
  - Results Section
  - My Top Picks Section
- Visitors must be able to share the blog post via different methods.
- Visitors must be able to export as a PDF with images, code blocks, links and other attachments included in the PDF.

### Popularity Scoring

- Popularity must be calculated as:
  - **daily unique visitors x average time spent x min((average time spent / estimated reading time), 1.2)**

### AI-Assisted Features

- Blog post summaries must be generated using AI only when requested.
- Summaries must be cached per post.
- Summaries must be regenerated only if the post content changes.
- Multi-post summaries must:
  1. Use cached individual summaries
  2. Generate a combined summary from those summaries
- Blog posts must support AI-generated text-to-speech.
- Blog posts must regenerate tags and categories when edits are published using AI
- Audio must be cached and regenerated only when content changes.
- Visitors must never provide prompts to the AI.

### Authoring Requirements (Owner Only)

- The site owner must be able to:
  - Create new posts
  - Edit published posts
  - View drafts and pending edits
- Drafts and unpublished content must not be visible to visitors.
- Site owner must be able to use editor on My Blog page.

### Non-Functional Requirements

- AI features must degrade gracefully if unavailable.
- Blog posts must remain readable without AI features.

## My Projects Requirements

**Purpose:**

Show real work through automated project presentation.

### Functional Requirements

- Visitors must be able to search and filter projects.
- Projects must be filterable by:
  - Tags
  - Categories
  - Languages
  - Other metadata
- Categories and metadata must be generated using AI from GitHub data.
- The projects page must display:
  - Results Section
  - My Top Picks Section
- Popularity (used in sort) must be calculated as:
  - **daily unique visitors x average time spent x min((average time spent / estimated reading time), 1.2)**
- The projects page must regenerate the tags and categories when a repo is published using AI.

### Project Display Requirements

- All project data must be pulled from GitHub.
- Project descriptions must not be editable on the website.
- Descriptions must be rendered from repository content and styled consistently.
- Each project must:
  - Link clearly to its GitHub repository
  - Display relevant GitHub statistics
- Projects must include a live sandbox when applicable.
- Projects must be exportable as PDFs, using screenshots instead of live previews.
- Projects must not be editable, all content must be pulled from GitHub

### Safety & Resource Constraints

- The system must limit how frequently sandboxes can be launched.
- Safeguards must exist to prevent abuse or malicious load.
- Sandboxes must not be spun up automatically or in bulk by visitors.

## Cross-Cutting Requirements (Entire Site)

### Global Access

- Resume download must be accessible from all pages.
- Contact email must be accessible from all pages.
- Navigation must be consistently available.

### Authentication

- Only the site owner may edit content.
- Authentication must be hidden behind a playful interaction.
- Real authentication must follow after the playful gate.
- Multi-factor authentication must be supported.

### Analytics

- The system must track:
  - Unique visitors per page per day
  - Time spent per page
- Analytics must support popularity scoring for blogs and projects.

### Shareability

- Each blog post and project must be shareable via a direct link.
- Each blog post and project must be exportable as a PDF.

### Additional Global Requirements

#### Accessibility

- Core content must always be accessible without animations.
- Reduced-motion users must not be forced into animated experiences.

#### Longevity

- The site must remain usable even if AI features are disabled.
- No external system may be the sole source of truth for content.

## Editor Requirements

**Purpose:**

Provide a unified authoring experience for story, resume, and blog content.

### Scope

- The editor must be available in:
  - My Story
  - My Resume
  - My Blog
- The editor must **not** be used for My Projects.

### Functional Requirements

- The editor must support:
  - Markdown syntax
  - Emacs Org-mode syntax
  - Code blocks
  - Images
  - Diagrams
  - PDFs (previewable)
  - LaTeX / mathematical expressions
- Code blocks must support notebook-style execution.
- Executable blocks must display results inline.
- Web page for visitors (not site owner) must remain unaffected if the editor becomes unavailable

### Non-Functional Requirements

- Editor behavior must be consistent across pages.
- Content must remain readable if execution features are unavailable.
- The editor must not require an internet connection to read content.

## Open Questions

**Content & Presentation**

1. Should the resume page allow visitors to toggle between compact and expanded views before exporting?

**AI Usage & Cost Control**

2. Should AI-powered features (summaries, audio) be globally toggleable by the site owner?
3. Should AI-generated outputs include subtle indicators that they are AI-assisted?
4. Is there a maximum size or complexity limit for content that can be processed by AI features?

**Popularity & Analytics**

5. Should popularity scores decay over time, or remain cumulative?
6. Should repeat visitors influence popularity scores differently than first-time visitors?
7. Should internal visits by the site owner be excluded from analytics?

**Story Mode Experience**

8. Should story mode be progressively enhanced over time (e.g., more visual layers), or remain intentionally minimal?
9. Should visitors be able to share links that open the story page at a specific point?
10. Should bookmarks differ between plain mode and story mode, or be shared?

**Project Sandboxes & Safety**

11. Should certain projects be view-only without a runnable sandbox?
12. Should sandbox availability vary based on system load or visitor behavior?
13. Should visitors be informed when sandbox access is temporarily unavailable?

**Editor & Content Authoring**

14. Should executable code blocks be restricted to certain languages or contexts?
15. Should long-running or resource-heavy code execution be limited or disabled?
16. Should editor features evolve uniformly across pages, or diverge based on context (blog vs resume)?

## Future Considerations

These are deliberately out of scope for the initial versions but aligned with the long-term vision.

**Portfolio Evolution**

- Supporting multiple visual themes while keeping content unchanged
- Adding a "snapshot" view to preserve how the portfolio looked at a point in time

**Resume Enhancements**

- Exporting resumes in multiple layouts while keeping a single content source
- Comparing tailored resumes against job descriptions (owner-only)

**Blog & Knowledge Base**

- Cross-linking blog posts and projects automatically
- Highlighting related posts based on content similarity
- Building curated reading paths across posts

**Projects & Artifacts**

- Attaching design notes or postmortems to projects
- Surfacing architectural decisions or trade-offs alongside project descriptions

**Long-Term Maintainability**

- Periodic prompts or reminders for the site owner to review stale content
- Archiving older content while keeping it accessible

---

# Experience Design Requirements

## Purpose

This section defines **how the portfolio should feel and behave** for visitors and the site owner. It specifies interaction patterns, page structure, and accessibility expectations. It intentionally avoids implementation details and visual styling (fonts, colors, layout grids).

## Design Principles

1. **Content Is Fundamental**

The story, resume, each blog post, and each project description are primarily text-based and are the foundation of the site.

Animations, live previews, exports, and AI features are supplemental and must never be required to understand the content.

2. **Clarity Over Cleverness**

Everything visible must feel obvious and deliberate. Users should never guess what something does. The interface should not require explanation.

3. **Minimal Cognitive Load**

The site must avoid clutter and too many options. Visitors come to read (story, resume, posts, projects), so the UI must stay quiet and focused.

4. **Progressive Enhancement**

All pages must remain fully usable without animation, AI features, live sandboxes, or advanced capabilities.

5. **Consistency Across Pages**

Navigation and core interaction patterns must feel consistent everywhere. A visitor who learns one page can confidently use the others.

6. **Respect Accessibility and Comfort**

The site must be accessible and comfortable for users with disabilities or motion sensitivity. Avoid distracting or harmful motion.

7. **Explicit Ownership Boundaries**

Visitors can browse, search/filter, export, and request summaries/audio (where available).

Only the site owner can edit, manage versions/drafts, and use AI prompts. Owner-only behavior is not exposed to visitors.

## Global Experience Rules

### Global Navigation

- Global navigation must be visible and consistent on all pages.
- Navigation labels must remain consistent across the site.
- Navigation must not be hidden behind scrolling, animations, or mode switches.

### Global Resume & Contact Access

- The resume must be downloadable from any page within one interaction.
- The contact email must be accessible from any page without searching.
- These global actions must remain available regardless of page mode (e.g., Story Mode).

### Visitor vs Owner Capabilities

- Visitors may:
  - Browse content
  - Search/filter posts and projects
  - Request AI summaries (where enabled)
  - Request text-to-speech audio (where enabled)
  - Export resumes, blog posts, and projects as PDFs
- Site owner may (after login):
  - Edit story/resume/blog content
  - View and manage drafts/pending edits
  - View version history
  - Generate tailored resume exports using prompts
  - Control AI behaviors (summaries/audio/tags/categories)
- Owner-only controls must not be visible or discoverable to visitors.

### State Awareness and Deliberate Actions

- The site must make it clear whether the user is:
  - Viewing (default)
  - Previewing (owner-only)
  - Editing (owner-only)
  - Viewing generated content (e.g., a summary or exported PDF)
- Actions that trigger generation (export, summary, audio) must feel intentional and not accidental.

## Home Page Experience Requirements

**Intent**: Provide immediate orientation and fast routing to visitor goals.

### Primary Experience

- The home page must immediately communicate:
  - The site owner's name (visible even if included in domain)
  - What the visitor can do next
- The resume download must be treated as a primary action and be easy to find.
- Links to My Story, My Resume, My Blog, and My Projects must be obvious and easy to access.
- Public profile links (GitHub, LinkedIn, other profiles) must be easy to find.
- Contact email must be visible or trivially accessible.

### Behavioral Constraints

- No scrolling should be required for primary actions (resume download + navigation).
- The home page must not overwhelm visitors with dense content or too many options.

## My Story Page Experience Requirements

**Intent**: Tell Alfredo's story in a readable way first, with optional experiential enhancement.

### Core Structure

- The story must be vertically scrollable.
- The story must be divided into distinct sections representing life events/phases.
- Each section must include a short text description.
- The story must be strictly chronological.

### Modes

- The page must support two modes:
  - Plain Mode (default)
  - Story Mode (animated)

#### Plain Mode Rules

- Plain mode must be the default and fully usable.
- The page must clearly indicate progression through time (e.g., year markers / timeline indicator).
- Visitors must be able to jump quickly to sections (bookmarks/anchors).

#### Story Mode Rules

- Story mode must present the exact same story content as plain mode.
- Story mode must not alter wording, reorder events, or hide content.
- Story mode adds only visual metaphor/animation to support the narrative.

### Motion and Comfort Constraints

- Animations must not use rapid flashing or strobing patterns.
- Animations must not rely on aggressive color flashing for effect.
- Animations must feel smooth and not laggy.
- Reduced-motion preferences must be respected.
- Story mode must never block reading or navigation.

### "Return to where I left off"

- Story mode does not need to remember a visitor's position across sessions.
- The page must provide easy in-page ways to jump back to meaningful points (bookmarks/anchors) in both modes.

### Owner-Only Editing Visibility

- Editing controls for story content must only be visible when the site owner is logged in.
- Visitors must never see editing affordances.

## My Resume Page Experience Requirements

**Intent**: Make experience easy to understand and make exporting simple and trustworthy.

### Reading Experience

- Resume content must be readable and scannable.
- Sections must be clearly separated and predictable.
- The last edit date must be visible on the resume page.

### Editing Experience (Owner Only)

- Editing must only be available when the owner is logged in.
- Viewing and editing must feel clearly different.
- The owner must have access to version history and prior exports.

### Export Experience (All Visitors)

- Visitors must be able to export/download a one-page resume without friction.
- Export must feel deliberate (no accidental downloads).
- The exported resume must follow a consistent format with required headers (e.g., Experience, Skills).
- Exported resumes must not include timestamps.
- Exported content must remain faithful to the resume page content.

### AI Interaction Experience

- AI is used to summarize/compact resume content for export.
- The system must not fabricate or invent new experience.
- Visitor export must not request prompts from visitors.
- Owner-only tailored export supports prompts but must still remain grounded in resume content.

## My Blog Experience Requirements

**Intent**: Help visitors discover, filter, and read posts with minimal distraction.

### Page Structure: Three Sections (Consistent Layout)

The blog page must be organized into three consistent sections:

1. Search & Filter Section
2. Results Section
3. My Top Picks Section

This structure must remain stable to prevent clutter and keep scanning easy.

### Search & Filter Experience

- A search bar must be present and obvious.
- Tags and categories must be visible and usable by visitors.
  - Tags/categories are AI-generated but must be shown to help discovery.
- Search results must appear under the search bar in the same visual language as other sections.
- Search results are not limited to a top-N (not limited to 5).
- Search results should feel like a directory view: flat, sortable, filterable.
- Visitors must be able to filter posts using a filter control that opens a dedicated filter interface.
- Sorting order (ascending / descending) must be toggleable.
- Sorting may include sort alphabetically, publish date, last edit date, popular score, etc.
- "Popular" must feel earned and consistent with the site's scoring logic.

### My Top Picks Section

- A dedicated section titled "My Top Picks" must appear below the main results
- This section represents manually curated blog posts selected by the site owner
- The section must reuse the same card / list presentation patterns.

### Post Discovery Views

Visitors must be able to switch between:

- Card View
  - Title
  - Thumbnail
  - Last edit date
  - Tags/categories
  - Short summary
- Compact/List View
  - Title
  - Short Summary
  - Publish date
  - Last update date
  - Tags
  - Categories

View switching must not change underlying content; it only changes presentation.

All cards must be uniform in size and tags / categories may scroll horizontally within a card to prevent vertical expansion. Plus, the entire card must be clickable with no nested clickable actions.

### Reading Experience

- Posts must prioritize readability above all other UI.
- Optional actions (share, export, summary, audio) must not be "in the visitor's face."
- Reading time must feel accurate and credible.

### AI-Assisted Reader Features

- Summaries and text-to-speech must be visitor-initiated and never shown by default.
- Visitors must never provide prompts directly to AI.
- AI outputs must feel clearly derived from existing post content (assistive, not intrusive).
- If AI is unavailable, the post remains fully readable with a calm explanation.

### Owner-Only Authoring

- Drafts and pending edits are visible only when owner is logged in.
- Editing tools are never visible to visitors.

## My Projects Experience Requirements

**Intent**: Let visitors browse real work, view artifacts, and optionally experience live previews safely.

### Page Structure: Three Sections (Consistent Layout)

The projects page must be organized into three consistent sections:

1. Search & Filter Section
2. Results Section
3. My Top Picks Section

### Search & Filter Experience

- Search and filtering must be obvious and easy.
- Projects must be filterable by visible metadata (categories, languages, etc.).
- Categories/tags/metadata are AI-generated from GitHub data and must be visible to visitors.
- Search results must appear under the search bar in a directory-style list and are not limited to top-N.
- Visitors must be able to filter posts using a filter control that opens a dedicated filter interface.
- Sorting order (ascending / descending) must be toggleable.
- Sorting may include sort alphabetically, publish date, last edit date, popular score, etc.
- "Popular" must feel earned and consistent with the site's scoring logic.

### My Top Picks Section

- A dedicated section titled "My Top Picks" must appear below the main results
- This section represents manually curated blog posts selected by the site owner
- The section must reuse the same card / list presentation patterns.

### Project Detail Experience

- Each project must have a direct link to GitHub that is easy to find.
- The project page must clearly communicate what is available:
  - Description/artifacts
  - Screenshots (especially for PDF export)
  - Live sandbox (when applicable)
- Live sandbox access must feel deliberate and optional.

### Source of Truth and Editing

- Project descriptions are not editable on the site to avoid conflicts.
- Project descriptions and project artifacts should feel cleanly rendered and consistent.

### Sandbox Safety and Control

- Sandbox usage must be protected from rapid repeated use that could overload the system.
- Visitors must not be able to trigger multiple heavy actions rapidly or in bulk.
- If sandbox is unavailable, the site must clearly communicate it without breaking the experience.

### Export and Shareability

- Each project must be shareable via a direct link.
- Each project must be exportable as a PDF.
  - PDFs should prefer screenshots/static artifacts over live previews.

## Editor Experience Requirements

**Intent**: Provide a structured, predictable authoring experience for owner-only content.

### Visibility

- The editor must only appear for the authenticated owner.
- Visitors must never see editing UI.

### Editing Model

- The editor should feel like a structured page editor (Confluence-like).
- The editor provides GUI controls for:
  - Headers
  - Bold/italics
  - Lists
  - Tables
  - Code blocks
  - Attaching images/diagrams/PDFs
- The editor must not offer font family or font size controls (visual style is site-controlled).

### Core Buttons and Workflow

The editor must provide three primary actions:

- Save & Close
- Publish / Update
- Preview

Because it is not WYSIWYG, preview is required.

### Content Capabilities

At its core, the editor must support:

- Markdown syntax
- Org-mode syntax
- Code blocks
- Images, diagrams
- PDF previews
- LaTeX / math expressions

### Executable Code Blocks

- Executable code blocks must be enable/disable-able.
- When enabled, output must appear clearly separated (below or beside).
- Output may include text console output and, where relevant, richer previews.
- When execution is disabled or unavailable, the UI must clearly indicate this state.
- Regardless of execution availability, the content must remain readable.

### Failure Behavior

- If preview or execution fails, the editor must not lose content.
- Errors must be shown in a calm, readable, non-technical way.

## Accessibility Experience Requirements

- All content must be readable without animations, AI, or sandboxes.
- All interactive elements must support keyboard navigation.
- Reduced-motion preferences must be respected globally.
- Meaning must not rely on color alone.
- Story mode must avoid flashing patterns and visually overwhelming effects.
- The system must clearly communicate when optional features are disabled/unavailable (summaries, audio, execution, sandboxes).

## Error & Edge-State Experience

- When an optional feature is unavailable (AI summary, audio, sandbox, execution):
  - The page remains usable
  - The user sees a calm explanation and an alternative path (e.g., "view screenshots," "read the full post")
- Errors must not appear as "broken site" states.
- Errors must not use technical jargon or stack traces.

## Consistency Rules Summary

To ensure the portfolio feels cohesive:

- The same navigation patterns apply everywhere.
- Resume download and contact email are always one action away.
- Blog and Projects share the same three-section structure and the same Card/List view options.
- Owner-only editing UI never leaks into visitor experience.
- Optional enhancements never block core reading.

---

# Visual Design Requirements

## Purpose & Visual Intent

The purpose of this visual design is to invite reading, not distract from it.

The portfolio is a reading-first experience. Its primary goal is to help visitors easily consume written content: the story, the resume, blog posts, and project descriptions. Visual elements exist only to support clarity, orientation, and understanding.

If the site were rendered as plain HTML without styling, the structure and meaning of the content should still be clear.

Two core rules govern all visual decisions:

- The design must invite reading, not distract from it.
- If something doesn't help reading, orientation, or understanding --- it doesn't belong.

The overall visual tone should feel:

- Modern
- Minimal
- Calm
- Deliberate
- Quietly confident

The site should communicate craftsmanship and judgment rather than visual flair.

## Visual Design Principles

1. **Content Dominates the Interface**

Textual content is visually dominant on all reading pages. No decorative or interactive element may compete with the primary text.

2. **Clarity Over Decoration**

Visual elements must exist to clarify structure, not decorate space.

3. **Restraint Signals Quality**

Fewer visual elements, used consistently, signal intentionality and care.

4. **Familiarity Where It Matters**

Pages like the resume should feel predictable and recognizable, not experimental.

5. **Consistency Builds Trust**

Similar content types must look and behave consistently across the site.

6. **Optional Enhancements Stay Optional**

Animations, previews, and AI features must remain visually secondary and never hijack attention.

## Hierarchy & Emphasis Rules

### Global Hierarchy Rules

- Each page must have one primary visual focus.
- The hierarchy order is always:
  1. Primary content
  2. Secondary navigation or orientation
  3. Supporting metadata
  4. Optional controls
- Primary content must be readable without any interaction.
- Optional controls must never visually compete with content.
- Removing supplemental elements must not break comprehension.

### Page-Level Hierarchy Summary

- Home Page
  - Primary: Name, Resume Download
  - Secondary: Navigation
- Resume Page
  - Primary: Page title, Resume Export
  - Secondary: Resume sections
  - Metadata: Last edited date
- Story Page
  - Primary: Narrative text
  - Secondary: Timeline/bookmarks
  - Optional: Mode toggle
- Blog & Project Search Pages
  - Primary: Search bar and results
  - Secondary: My Top Picks
  - Optional: View toggles, filters
- Individual Blog / Project Pages
  - Primary: Content text
  - Secondary: Supplemental assets
  - Metadata: Dates, tags, reading time
  - Optional: Export, share
- Editor Page (Owner Only)
  - Primary: Content being edited
  - Secondary: Structure and formatting controls
  - Metadata: Version control
  - Optional: Preview, save & close, publish / update

## Typography System (Roles, Not Fonts)

Typography roles define meaning and hierarchy. Fonts are intentionally unspecified.

### Required Roles

- Page Title
  - One per page
  - Announces context clearly
- Section Headings
  - Divide content into logical units
  - Follow consistent hierarchy rules
- Body Text
  - Primary reading text
  - Most visually dominant on reading pages
- Metadata Text
  - Dates, tags, categories, reading time
  - Visible but visually quiet
- UI / Control Text
  - Navigation, buttons, toggles
  - Clear and readable, but not dominant

Typography rules:

- Text of equal importance must look the same everywhere.
- Text of different importance must look visually different.
- No page should rely on typography tricks to appear complex.

## Color Usage Constraints

Color defines emphasis, not decoration.

### Rules

- Color must never be the sole carrier of meaning.
- A neutral base must dominate the interface.
- A limited accent color may be used sparingly for:
  - Primary actions (e.g., resume download)
  - Links
- Color must not be used for large decorative areas.
- High contrast must be maintained for readability.

If color were removed, the site should still make sense.

## Layout & Content Flow

### Reading Flow

- All content flows top to bottom.
- Horizontal reading paths are avoided.
- Scrolling must feel natural and predictable.

### Content Width

- Reading content must be bounded and centered.
- Text must not stretch edge-to-edge on large screens.
- Line length should support long-form reading.

### Page Structure

- Pages with similar purpose must share layout logic.
- Blog and project pages must feel structurally related.
- Navigation placement must be stable and predictable.

## Spacing & Density Philosophy

Spacing exists to support comprehension.

### Rules

- Text must never feel cramped.
- Paragraphs and sections must have clear separation.
- Whitespace is functional and intentional.
- Density should resemble a book or notebook, not a dashboard.
- Collapsing content is allowed only when it improves clarity.

Consistent spacing signals care and quality.

## Visual Treatment of Supplemental Elements

Supplemental elements must remain visually subordinate.

### Animations

- Support understanding, never distract.
- Avoid flashing or aggressive motion.
- Respect reduced-motion preferences.

### Images & Media

- Images are supplemental to text.
- All images must include alt descriptions.
- Removing images must not remove meaning.

### Live Previews

- Clearly optional and visually secondary.
- If unavailable, screenshots or descriptions must suffice.

### AI Features

- Summaries, audio, and exports must not be visually dominant.
- These features should feel assistive, not promotional.

## Accessibility & Visual Comfort

- All text must be readable for extended periods.
- No flashing or strobing patterns.
- Adequate contrast must be maintained.
- Meaning must not rely on color alone.
- Reduced-motion preferences must be respected globally.

Accessibility is treated as a design requirement, not an afterthought.

## Consistency & Reuse Rules

- Identical concepts must share identical visual treatment.
- Blog and project search pages must look and behave similarly.
- Controls (toggles, exports, navigation) must be visually consistent.
- Reuse visual patterns instead of inventing new ones.

Consistency reduces cognitive load and increases trust.

## Explicit Visual Non-Goals

This visual system is not trying to be:

- A marketing site
- A design portfolio
- Trend-driven or flashy
- Animation-heavy
- Visually loud

The site should age well and remain readable years later.

## Typography System

### Font Strategy

The site uses two font families only:

- Primary sans-serif for all prose, UI, and structural text
- Monospace for all code-related content

This constraint is intentional and must not be expanded without a clear, documented reason.

#### Primary Sans-Serif Font

**Primary choice**

- Source Sans 3

**Fallback order**

1. Source Sans 3
2. Inter
3. system-ui

**Usage**

- Page titles
- Section headers
- Body text
- Lists and bullets
- Navigation
- Metadata
- Buttons and controls

**Rationale**

- Optimized for long-form reading
- Performs well for short, fragmented content (resume, story sections)
- Neutral, calm, and documentation-friendly
- Does not draw attention to itself

**Constraint**

- The same sans-serif font must be used consistently across all pages and contexts.
- No serif fonts are permitted for body text.

#### Monospace Font

**Primary choice**

- JetBrains Mono

**Fallback order**

1. JetBrains Mono
2. Source Code Pro
3. ui-monospace

**Usage**

- Code blocks
- Inline code
- Executable notebook-style code blocks
- Technical examples

**Rationale**

- Familiar to developers
- Strong character differentiation
- Clear distinction between prose and code
- Signals technical intent without visual noise

**Constraint**

- Monospace fonts must not be used for non-code prose.

## Color Palette

The site uses a **monochrome palette with a tonal gray accent.**

No chromatic accent colors are permitted.

Hierarchy is created through contrast, not hue.

### Background

**Role**

- Primary page background

**Options**

- #FAFAFA
- #F8F8F8

**Constraint**

- Must visually disappear
- Must reduce glare
- Must occupy the largest surface area

### Title & Section Header Text

**Role**

- Page titles
- Section headers
- Structural anchors

**Options**

- #0F0F0F
- #111111

**Constraint**

- Darkest text on the site
- Must be darker than body text
- Used sparingly and consistently

### Body Text

**Role**

- Paragraphs
- Bulleted content
- Narrative text

**Options**

- #222222
- #242424

**Constraint**

- Slightly lighter than headers
- High contrast for long reading
- Must not be reused for interactive elements

### Accent Gray (Interactive)

**Role**

- Links
- Primary actions (e.g., Resume download)
- Active states
- Focus indicators

**Options**

- #4A4A4A
- #555555

**Constraint**

- Must appear clearly gray (not near black)
- Must not be used for body text
- Used sparingly and deliberately
- Signals interactivity, not importance

### Secondary Text (Metadata)

**Role**

- Dates
- Reading time
- Tags
- Categories

**Options**

- #6B6B6B
- #707070

**Constraint**

- Must not compete with body text
- Must remain readable and accessible

### Muted / Tertiary Text

**Role**

- Disabled states
- Low-priority UI
- Subtle hints

**Options**

- #9A9A9A
- #A0A0A0

**Constraint**

- Never used for essential information
- Never used for navigation or actions

### Borders & Dividers

**Role**

- Section separators
- Card outlines (when necessary)

**Options**

- #E2E2E2
- #E6E6E6

**Constraint**

- Borders are secondary to spacing
- Must remain visually subtle
- No heavy outlines or visual boxes

### Palette Constraints (Global)

- No chromatic colors (green, blue, etc.)
- No colored section backgrounds
- No gradients
- No decorative color usage
- No semantic meaning conveyed by color alone
- The site must remain fully usable in grayscale

## Global Definitions (Clarifications)

### Focus

- Focus means keyboard focus (Tab navigation).
- Focus is indicated by a visible outline (not a border).
- The outline:
  - Does not affect layout
  - Sits outside the element's box
  - Exists solely for accessibility and precision

This is not a hover effect and not a border.

### Active

- Active means the moment when the user is pressing/clicking the element.
- Active does not mean "visited."
- Visited links do not change appearance anywhere on the site.

## Body Text Links (Inline Links)

These are links inside paragraphs, lists, and reading content.

### Default

- Text color: Accent gray #4A4A4A
- Underline: Visible, thin
- Font weight: Same as body text

This distinguishes links from normal text without relying on color alone.

### Hover

- Underline thickens slightly
- Text color remains #4A4A4A
- No background color
- No animation

### Focus (Keyboard)

- Outline: 2px solid #4A4A4A
- Outline offset: small, consistent
- Underline remains visible

### Active (Mouse / Touch)

- Text color darkens to body text color #222222
- Underline remains thick
- Effect lasts only while pressed

### Visited

- No visual change
- Same appearance as default

## Navigation Links (Header / Nav Areas)

Navigation links are not part of reading flow and are visually distinct from body links.

### Default

- Text color: Accent gray #4A4A4A
- Underline: None

Navigation context implies clickability; underline is unnecessary here.

### Hover

- Text color: Title text #111111
- No underline
- No background

### Focus (Keyboard)

- Outline: 2px solid #4A4A4A
- Outline offset: small, consistent
- No underline

### Active (Mouse / Touch)

- Text color: Body text #222222
- Effect lasts only while pressed

### Current Page Indicator

- Text color: Title text #111111
- Font weight: Same as other navigation links
- No underline
- No background

The current page is indicated by darker text only, without additional styling.

## Buttons (Primary Actions)

Primary actions include resume download, export, and publish/save operations.

### Default

- Background: Transparent
- Border: 1px solid accent gray #4A4A4A
- Text color: Accent gray #4A4A4A
- Padding: Sufficient for comfortable interaction
- Border radius: Small, consistent

### Hover

- Border color: Title text #111111
- Text color: Title text #111111
- Background remains transparent
- No shadow

### Focus (Keyboard)

- Outline: 2px solid #4A4A4A
- Outline offset: small, outside border
- Border remains visible

### Active (Mouse / Touch)

- Background: Accent gray #4A4A4A
- Text color: Background #FAFAFA (inverted)
- Border color: Accent gray #4A4A4A
- Effect lasts only while pressed

### Disabled

- Background: Transparent
- Border: 1px solid muted text #9A9A9A
- Text color: Muted text #9A9A9A
- Cursor: not-allowed

## Secondary Buttons & Icon Buttons

Secondary actions include filters, toggles, view switches, and utility controls.

### Default

- Background: Transparent
- Border: None
- Text/icon color: Accent gray #4A4A4A
- Padding: Comfortable interaction size

### Hover

- Text/icon color: Title text #111111
- No background
- No border

### Focus (Keyboard)

- Outline: 2px solid #4A4A4A
- Outline offset: small
- No background

### Active (Mouse / Touch)

- Text/icon color: Body text #222222
- Effect lasts only while pressed

### Disabled

- Text/icon color: Muted text #9A9A9A
- Cursor: not-allowed

## Toggles (Mode Switches, View Switches)

Toggles are used for binary choices like Plain/Story mode or Card/List view.

### Default

- Background: Transparent
- Border: None
- Text/icon color: Secondary text #6B6B6B
- Spacing: Consistent between toggle options

### Hover (Non-Selected)

- Text/icon color: Accent gray #4A4A4A
- No background

### Selected

- Text/icon color: Title text #111111
- No background
- No border

### Focus (Keyboard)

- Outline: 2px solid #4A4A4A
- Outline offset: small
- Applies to the focused option

## Text Inputs & Search Bars

### Default

- Background: Background #FAFAFA
- Border: 1px solid border color #E2E2E2
- Text color: Body text #222222
- Placeholder: Secondary text #6B6B6B
- Padding: Comfortable interaction size

### Hover

- Border color: Accent gray #4A4A4A
- Background unchanged

### Focus (Keyboard / Active)

- Outline: 2px solid #4A4A4A
- Outline offset: small, outside border
- Border remains visible

### Disabled

- Background: Background #FAFAFA
- Border: 1px solid muted text #9A9A9A
- Text color: Muted text #9A9A9A
- Cursor: not-allowed

## Chips (Tags, Categories, Filter Pills)

Chips are used to display tags, categories, and active filters.

### Default

- Background: Border color #E2E2E2
- Border: None
- Text color: Body text #222222
- Padding: Small, consistent
- Border radius: Small, rounded

### Hover (Interactive chips only)

- Background: Secondary text #6B6B6B
- Text color: Background #FAFAFA (inverted)

### Focus (Keyboard)

- Outline: 2px solid #4A4A4A
- Outline offset: small

### Non-Interactive Chips

- Background: Border color #E2E2E2
- No hover state
- Non-clickable

### Removable Chips (Active Filters)

- Background: Border color #E2E2E2
- Text color: Body text #222222
- Include a small "X" icon in accent gray #4A4A4A
- Clicking the "X" removes the chip

## Cards (Blog Posts, Projects)

Cards are used only for grouped content like search results.

### Default

- Background: Background #FAFAFA
- Border: 1px solid border color #E2E2E2
- Padding: Consistent with spacing scale
- No shadow

### Hover (Clickable cards)

- Border color: Accent gray #4A4A4A
- Background unchanged
- No shadow

### Focus (Keyboard)

- Outline: 2px solid #4A4A4A
- Outline offset: small, outside border
- Border remains visible

### Content Inside Cards

- Title: Title text #111111
- Body: Body text #222222
- Metadata: Secondary text #6B6B6B
- All internal spacing follows the global spacing scale

## Interaction States Summary

| Element Type     | Default                  | Hover                      | Focus       | Active               | Disabled           |
| ---------------- | ------------------------ | -------------------------- | ----------- | -------------------- | ------------------ |
| Body link        | Accent gray, underline   | Thicker underline          | 2px outline | Darkens to body text | N/A                |
| Nav link         | Accent gray              | Title text                 | 2px outline | Body text            | N/A                |
| Primary button   | Transparent, gray border | Darker border/text         | 2px outline | Inverted (gray bg)   | Muted, not-allowed |
| Secondary button | Transparent, gray text   | Darker text                | 2px outline | Body text            | Muted, not-allowed |
| Toggle           | Gray text                | Accent gray                | 2px outline | N/A                  | N/A                |
| Selected toggle  | Title text               | N/A                        | 2px outline | N/A                  | N/A                |
| Text input       | Border, white bg         | Accent gray border         | 2px outline | N/A                  | Muted, not-allowed |
| Chip             | Light gray bg            | Darker bg (if interactive) | 2px outline | N/A                  | N/A                |
| Card             | Border, white bg         | Accent gray border         | 2px outline | N/A                  | N/A                |

### Global Interaction Rules

- No layout shifts
- No reliance on visited state styling

## Spacing, Rhythm & Layout System

### Purpose & Philosophy

This system defines how content breathes, flows, and scales across the entire site.

**Core Principles**

- Reading comes first
- Vertical flow over horizontal complexity
- Spacing communicates structure
- No element exists without purpose
- If CSS is removed, the document hierarchy must still make sense

This system prioritizes:

- Long-form reading
- Professional clarity
- Predictability
- Accessibility

### Base Typographic Foundation

#### Root Font Size

- Base font size: 1rem
- The root font size must not be overridden.

#### Rationale

- Respects user accessibility preferences
- Scales naturally across devices
- Serves as the baseline for all spacing and sizing

### Typography Scale

The site uses a **limited, restrained scale**.

#### Text Sizes

| Role                   | Size     | Usage                                            |
| ---------------------- | -------- | ------------------------------------------------ |
| Page title (large)     | 2rem     | Home page name, optional identity pages          |
| Page title (standard)  | 1.75rem  | Resume, Story, Blog, Projects                    |
| Section heading        | 1.25rem  | Resume sections, story milestones, blog sections |
| Body text              | 1rem     | Primary reading text                             |
| Metadata / helper text | 0.875rem | Dates, reading time, tags                        |
| Code blocks            | 0.9rem   | All monospace code blocks                        |

#### Constraints

- No additional font sizes are allowed
- Headings rely on spacing and weight, not dramatic size jumps
- Large page titles are used sparingly

### Page Titles vs Section Headings

#### Page Titles

Page titles define page identity, not content structure.

**Usage**

- One page title per page
- Appears once at the top of the content

**Styling**

- Font size: 1.75rem (default) or 2rem (identity pages only)
- Line height: 1.25
- Margin-top: none
- Margin-bottom: 2rem

**Examples**

- Home page: 2rem (your name)
- Resume page: 1.75rem
- Blog index page: 1.75rem
- Individual blog post: 1.75rem
- Project page: 1.75rem

#### Section Headings

Section headings define content structure within a page.

**Styling**

- Font size: 1.25rem
- Line height: 1.3
- Margin-top: 2.5rem
- Margin-bottom: 1rem

**Usage**

- Resume sections
- Story milestones
- Blog sections
- Project sections

### Line Height (Vertical Rhythm)

#### Body Text

- Line height: 1.6

**Applies to**

- Paragraphs
- Bulleted lists
- Story narrative
- Resume descriptions
- Project descriptions

This is the core reading rhythm.

#### Headings

| Element          | Line Height |
| ---------------- | ----------- |
| Page titles      | 1.25        |
| Section headings | 1.3         |

Line height affects only the text itself, not spacing around it.

#### Code Blocks

- Font size: 0.9rem
- Line height: 1.5

**Rationale**

- Monospace fonts appear visually larger
- Slightly tighter rhythm improves scan-ability
- Keeps code blocks from dominating the page

### Line Width (Measure)

#### Primary Reading Width

- Max width: 65ch
- Acceptable range: 60--70ch

**Applies to**

- Blog posts
- Story page
- Resume content
- Project descriptions

#### Rules

- Text must never span the full viewport on large screens
- Content is centered horizontally within the viewport
- Reading width is fixed; margins absorb extra space

### Spacing Scale (Global)

All margins and padding must use only the following scale.

| Token | Value   |
| ----- | ------- |
| XS    | 0.25rem |
| SM    | 0.5rem  |
| MD    | 1rem    |
| LG    | 1.5rem  |
| XL    | 2.5rem  |
| XXL   | 4rem    |

#### Rules

- No arbitrary spacing values allowed
- Larger spacing communicates higher-level structure
- Smaller spacing is used within components

### Paragraphs, Lists & Text Blocks

#### Paragraphs

- Margin-bottom: 1em

#### Lists

- Line height: 1.6
- Space between items: 0.5em
- Margin-top: 1em
- Margin-bottom: 1.25em

Lists must read like prose, not UI elements.

### Layout Containers

#### Primary Content Container

- Max width: 65ch
- Horizontal padding: 1.5rem
- Centered horizontally

#### Page Padding

- Top padding: 3rem
- Bottom padding: 4rem

Pages should feel grounded and calm, not cramped or floating.

### Cards, Panels & Grouped Content

Cards are used only when grouping is required (e.g., search results).

#### Card Styling

- Padding: 1.25rem
- Gap between cards: 1.5rem

#### Constraints

- Cards must not replace layout structure
- Cards must not be used on reading-focused pages
- Borders are optional but subtle (see color palette)

### Flow & Direction

#### Rules

- Content flows top-to-bottom only
- No horizontal reading paths
- No multi-column reading layouts
- Horizontal layouts are reserved for navigation or controls only

Scrolling must always feel natural and predictable.

### Density Constraints

#### The Site Must Avoid

- Dashboard-style density
- Compact documentation layouts
- Excessive whitespace for decoration
- Collapsing content unless necessary

#### The Site Must Encourage

- Steady reading pace
- Clear thought separation
- Visual rest between sections

### Accessibility & Scaling

- All spacing scales with font size
- Increasing browser font size must not break layout
- Line length must remain readable at all scales
- No content may rely on fixed pixel assumptions

### Examples (Applied)

#### Blog Post Page

- Page title: 1.75rem, margin-bottom 2rem
- Body text: 1rem, line-height 1.6
- Section headings: 1.25rem, margin-top 2.5rem
- Code blocks: 0.9rem, line-height 1.5
- Max width: 65ch

#### Resume Page

- Page title: 1.75rem
- Section headings: 1.25rem
- Bullets: 1rem
- Metadata: 0.875rem
- Dense but readable, never cramped

### Explicit Non-Goals

- No responsive typography experiments
- No dynamic scaling systems
- No per-page spacing overrides
- No visual trickery to simulate hierarchy

### Sanity Check

If implemented correctly:

- Reading feels calm and professional
- Structure is obvious without decoration
- The UI disappears while reading
- Everything feels deliberate
- Nothing feels accidental

### Next Logical Steps (Optional)

- Code block interaction rules
- Dark mode equivalents

---
