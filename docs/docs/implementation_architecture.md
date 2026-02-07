# Implementation Architecture Document

## Alfredo's Living Portfolio

**Version:** 1.0  
**Date:** January 22, 2026  
**Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Security & Rate Limiting Strategy](#security--rate-limiting-strategy)
5. [Data Architecture](#data-architecture)
6. [Integration Architecture](#integration-architecture)
7. [Deployment Architecture](#deployment-architecture)
8. [Development Workflow](#development-workflow)
9. [Cost Structure](#cost-structure)
10. [Implementation Phases](#implementation-phases)
11. [Monitoring & Maintenance](#monitoring--maintenance)
12. [Risk Mitigation](#risk-mitigation)

---

## Executive Summary

This document defines the complete technical architecture for a living portfolio website that:

- Automatically syncs projects from GitHub
- Uses AI for content summarization and generation
- Provides live code sandboxes
- Supports rich content editing with code execution
- Maintains strict cost controls through progressive verification
- Scales automatically without manual intervention

**Core Design Principles:**

- Serverless-first (no server management)
- Cost-optimized (pay only for usage)
- Security-layered (defense in depth)
- Performance-focused (global edge delivery)
- Maintainable (single codebase, typed)

**Expected Metrics:**

- Page load: < 1 second
- API response: < 200ms (95th percentile)
- Monthly cost: $8-15 (with protections preventing runaway costs)
- Uptime: 99.9%

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                   (React 19 + TypeScript)                        │
│                                                                   │
│  Pages:                                                          │
│  - Home (entry point)                                            │
│  - Story (narrative + timeline)                                  │
│  - Resume (living document + exports)                            │
│  - Blog Search (discovery)                                       │
│  - Blog Post (rich content)                                      │
│  - Project Search (discovery)                                    │
│  - Project Post (GitHub-synced)                                  │
│                                                                   │
│  Features:                                                       │
│  - Lexical Editor (Markdown, Org-mode, code blocks)             │
│  - Sandpack (live previews)                                      │
│  - Pyodide (code execution)                                      │
│  - Turnstile (CAPTCHA)                                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS / API Calls
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│               (Next.js 15 API Routes - Serverless)              │
│                                                                   │
│  API Endpoints:                                                  │
│  - /api/auth/* (authentication)                                  │
│  - /api/blog/* (CRUD, AI features)                              │
│  - /api/projects/* (GitHub sync)                                │
│  - /api/resume/* (exports, tailoring)                           │
│  - /api/sandbox/* (launch verification)                         │
│  - /api/analytics/* (tracking)                                   │
│  - /api/webhooks/* (GitHub events)                              │
│                                                                   │
│  Middleware:                                                     │
│  - Rate limiting (Upstash Redis)                                │
│  - Trust scoring (PostgreSQL)                                    │
│  - Budget tracking (Redis + DB)                                  │
│  - CAPTCHA verification (Turnstile)                             │
└─────┬────────────┬─────────────┬─────────────┬─────────────────┘
      │            │             │             │
      │            │             │             │
┌─────▼─────┐ ┌───▼─────┐ ┌─────▼──────┐ ┌───▼──────────┐
│ PostgreSQL│ │ Upstash │ │  Supabase  │ │   External   │
│ (Supabase)│ │  Redis  │ │  Storage   │ │   Services   │
│           │ │         │ │            │ │              │
│ - Users   │ │ - Rate  │ │ - Images   │ │ - Claude API │
│ - Blog    │ │   limits│ │ - PDFs     │ │ - GitHub API │
│ - Projects│ │ - Budget│ │ - Exports  │ │ - OpenAI TTS │
│ - Resume  │ │   track │ │            │ │ - Turnstile  │
│ - Trust   │ │ - Cache │ │            │ │              │
└───────────┘ └─────────┘ └────────────┘ └──────────────┘
```

### Request Flow for Expensive Operations

```
User Request (AI Summary / Sandbox / TTS)
    ↓
[1] Global Rate Limit Check (100 req/min per IP)
    ↓
[2] Endpoint-Specific Rate Limit (e.g., 5 AI requests/hour)
    ├─ Trust level adjustment (trusted users get 2x)
    └─ Exceeded? → Record violation
         ↓
[3] Violation Check (3+ in 24 hours?)
    ├─ Yes → Require CAPTCHA challenge
    │        ├─ Token provided? → Verify with Turnstile
    │        │   ├─ Valid → Update trust, reset limits, proceed
    │        │   └─ Invalid → Reject (403)
    │        └─ No token? → Return 403 with captcha_required flag
    └─ No → Return 429 with retry-after
         ↓
[4] Global Budget Check (monthly caps)
    ├─ Within limits → Proceed
    └─ Exceeded → Return 503 (service unavailable)
         ↓
[5] Execute Operation
    ↓
[6] Track Usage (increment budget counter)
    ↓
[7] Return Response (with rate limit headers)
```

---

## Technology Stack

### Frontend Framework

**React 19 + Vite + TypeScript**

**Purpose:** User interface and client-side logic

**Why:**

- Industry standard with massive ecosystem
- Excellent TypeScript support for type safety
- Server components for performance
- Rich library support for all required features

**Key Libraries:**

- **Lexical:** Rich text editor (Markdown, Org-mode, code blocks, LaTeX)
- **Sandpack:** Live code sandboxes (runs entirely in browser)
- **Pyodide:** Python code execution (WebAssembly, client-side)
- **React-PDF:** Resume PDF generation
- **React Markdown:** Blog post rendering
- **Turnstile:** CAPTCHA verification component
- **Date-fns:** Date formatting
- **Zod:** Runtime validation

---

### Styling System

**TailwindCSS v4**

**Purpose:** Design system implementation

**Why:**

- Utility-first maps perfectly to minimal design system
- Only ships CSS actually used (small bundles)
- Enforces design constraints through configuration
- Excellent developer experience

**Configuration Strategy:**

- Restrict color palette to defined monochrome scale
- Lock spacing to approved increments
- Define font families (Source Sans 3, JetBrains Mono)
- Prevent arbitrary values (enforce consistency)

---

### Backend & API Layer

**Next.js 15 API Routes (App Router)**

**Purpose:** Serverless API functions

**Why:**

- Serverless functions (pay per invocation)
- Integrated with frontend (single deployment)
- Edge runtime support (global performance)
- Built-in middleware system
- Zero server management

**Responsibilities:**

- Authentication and authorization
- AI API calls (Claude, OpenAI)
- GitHub API integration
- Database operations
- PDF generation (Puppeteer)
- Rate limiting enforcement
- CAPTCHA verification
- Analytics tracking

---

### Database

**PostgreSQL via Supabase**

**Purpose:** Primary data store

**Why:**

- Managed PostgreSQL (no database administration)
- ACID transactions for data integrity
- JSON support for flexible metadata
- Full-text search built-in
- Row-level security (visitor vs owner boundaries)
- Realtime subscriptions (useful for editing)
- Integrated storage and authentication
- Generous free tier

**Data Model:**

- Users (authentication records)
- Stories (life narrative sections)
- Resumes (version history)
- Blog posts (content, metadata, AI artifacts)
- Projects (GitHub-synced data)
- Analytics (page visits, duration)
- Trust scores (security layer)
- Rate limit violations
- CAPTCHA challenges

---

### Caching & Rate Limiting

**Upstash Redis**

**Purpose:** Distributed caching and rate limiting

**Why:**

- Serverless Redis (pay per operation)
- Global edge locations (low latency)
- Works across serverless function instances
- Built-in rate limiting library
- Analytics dashboard included
- Free tier covers expected usage

**Use Cases:**

- Per-user rate limits (sliding windows)
- Monthly budget tracking
- AI output caching (summaries, audio URLs)
- Session data
- Temporary tokens

---

### Authentication

**NextAuth.js v5 (Auth.js)**

**Purpose:** User authentication and session management

**Why:**

- Free and open source
- Multi-factor authentication support
- Multiple provider support (Google, GitHub, passkeys)
- Built for Next.js
- Flexible authorization rules

**Implementation:**

- Single owner account (your email)
- MFA via passkey or authenticator app
- Playful authentication gate (custom pre-check)
- Session-based (secure cookies)
- Owner-only routes protected via middleware

---

### AI Integration

**Anthropic Claude API (3.5 Sonnet)**

**Purpose:** Content generation and transformation

**Why:**

- Best at summarization and instruction-following
- Excellent with technical content
- Strong reasoning for tailored outputs
- Competitive pricing with prompt caching

**Use Cases:**

1. **Blog summaries** (2-3 sentence overviews)
2. **Resume tailoring** (emphasis shifting, not fabrication)
3. **Tag/category generation** (from blog/project content)
4. **Project metadata extraction** (from GitHub READMEs)
5. **Text-to-speech preparation** (via OpenAI TTS)

**Cost Controls:**

- Prompt caching (90% token reduction)
- Output caching (store results, regenerate only on change)
- Batch API for non-urgent requests (50% discount)
- Monthly budget caps (hard stop at threshold)

---

### Text-to-Speech

**OpenAI TTS API**

**Purpose:** Audio generation for blog posts

**Why:**

- Better quality-to-cost ratio than alternatives
- Multiple voice options
- Fast generation
- Simple API

**Strategy:**

- Generate on-demand (not preemptively)
- Cache audio URLs indefinitely
- Regenerate only when post content changes
- Monthly character limit (1M characters = $15)

---

### Rich Text Editor

**Lexical (Meta)**

**Purpose:** Content authoring for story, resume, and blog

**Why:**

- Built by Meta for production use
- Extensible plugin architecture
- Native React support
- Excellent performance with large documents
- Supports custom nodes (code blocks, diagrams, LaTeX)

**Features:**

- Markdown import/export
- Org-mode parsing (custom plugin)
- Syntax-highlighted code blocks
- Executable code cells (Jupyter-style via Pyodide)
- Image/diagram embedding
- PDF preview
- LaTeX rendering (KaTeX)

---

### Code Sandboxes

**Sandpack (CodeSandbox)**

**Purpose:** Live project previews

**Why:**

- Runs entirely in browser (no server cost)
- Built for React
- Supports multiple frameworks
- Customizable UI
- Fast startup
- Isolated environment (secure)

**Safety:**

- iframe with Content Security Policy
- No backend access
- Configurable network restrictions
- Rate limited (10 launches per 10 minutes)

---

### Code Execution

**Pyodide (Python via WebAssembly)**

**Purpose:** Executable code blocks in blog posts

**Why:**

- Runs Python in browser (no server needed)
- Full scientific stack (NumPy, Pandas, Matplotlib)
- Secure isolation
- Zero backend cost

**For JavaScript:**

- Sandpack with stricter isolation
- No eval() or dangerous APIs

**Limitations:**

- No filesystem access
- No external network requests
- 10-second execution timeout
- Memory limits enforced

---

### GitHub Integration

**Octokit (GitHub REST API)**

**Purpose:** Automatic project synchronization

**Why:**

- Official GitHub SDK
- TypeScript support
- Rate limit handling built-in
- Webhook support

**Workflow:**

1. **Initial sync:** Owner connects GitHub, selects repos to feature
2. **Automatic updates:** GitHub webhook triggers on push events
3. **Data fetched:** README, languages, stars, last commit
4. **AI processing:** Generate tags/categories from README
5. **Database storage:** Cache all data to reduce API calls

**Rate Limits:**

- 5,000 requests/hour (authenticated)
- Webhooks have no rate limit
- All data cached in database

---

### File Storage

**Supabase Storage**

**Purpose:** Images, PDFs, diagrams, exports

**Why:**

- Integrated with database
- CDN included
- Easy access control (public vs owner-only)
- Image transformations built-in
- Free tier: 1GB storage, 2GB bandwidth

**Organization:**

- `/public/blog/images/` - Blog post images
- `/public/projects/thumbnails/` - Project thumbnails
- `/private/exports/resumes/` - Generated resume PDFs (owner-only)
- `/private/exports/posts/` - Blog post PDFs (cached)

---

### PDF Generation

**React-PDF (for resumes) + Puppeteer (for blog/projects)**

**Purpose:** Document exports

**Why React-PDF for Resumes:**

- Pure React components
- Programmatic layout control
- Server-side rendering
- Consistent output
- Fast generation

**Why Puppeteer for Blog/Projects:**

- Renders actual HTML/CSS
- Preserves complex layouts
- Captures screenshots
- Handles rich content (code blocks, diagrams, images)

**Deployment:**

- Use @sparticuz/chromium for serverless environments
- Puppeteer runs in Lambda/Vercel functions
- PDFs cached in Supabase Storage

---

### CAPTCHA

**Cloudflare Turnstile**

**Purpose:** Progressive verification for expensive operations

**Why:**

- Free forever (unlimited verifications)
- Privacy-friendly (no Google tracking)
- Invisible 98% of the time (better UX than reCAPTCHA)
- Excellent accessibility
- No vendor lock-in

**Trigger Conditions:**

- 3+ rate limit violations in 24 hours
- Suspicious user-agent patterns
- Known VPN/proxy IP ranges
- Automated traffic detection

**User Experience:**

- Invisible for normal users
- Shows challenge only for suspicious activity
- Once passed, grants temporary trust (24 hours)
- Resets rate limit counters
- Increases rate limits (2x for verified users)

---

### Analytics

**Custom (PostgreSQL) + Umami (Optional)**

**Purpose:** Traffic tracking and popularity scoring

**Why Custom:**

- Requirements are simple (unique visitors, time spent)
- Full data control
- Privacy-friendly (no cookies)
- Easy custom calculations (popularity scores)
- No external dependencies

**Optional Umami:**

- Self-hosted analytics
- Owner dashboard
- Privacy-focused
- Free forever
- Nice visualization

**Metrics Tracked:**

- Unique visitors per page per day (hashed IP + user-agent)
- Time spent per page (calculated on page unload)
- Popularity score: `unique_visitors × avg_time × min(avg_time / reading_time, 1.2)`

---

### Deployment Platform

**Vercel**

**Purpose:** Hosting and deployment

**Why:**

- Zero-config Next.js deployment
- Automatic HTTPS
- Preview deployments per PR
- Edge functions (global performance)
- Built-in analytics
- Free tier covers expected usage

**Features:**

- Git integration (push to deploy)
- Environment variables per environment
- Automatic rollbacks
- Custom domains
- DDoS protection

**Cost:**

- Hobby Plan: FREE (100GB bandwidth/month)
- Upgrade only if exceeding limits

---

### DNS & CDN

**Cloudflare DNS**

**Purpose:** Domain management and edge caching

**Why:**

- Free forever
- Fast DNS resolution (1.1.1.1)
- DDoS protection included
- Can buy domains at cost (no markup)
- Easy integration with Vercel

**Configuration:**

- A/CNAME records pointing to Vercel
- HTTPS handled by Vercel
- CDN for static assets

---

## Security & Rate Limiting Strategy

### Four-Tier Trust Model

**Tier 1: Free Access (Default)**

- **Who:** All visitors
- **Verification:** None
- **Rate Limits:**
  - AI summaries: 5/hour
  - TTS audio: 10/hour
  - Sandboxes: 10/10min
  - Exports: 10/hour
  - Code execution: 20/hour

**Tier 2: CAPTCHA Required (Suspicious)**

- **Triggers:**
  - 3+ rate limit violations in 24 hours
  - Automated traffic patterns
  - Known bot signatures
- **Verification:** Cloudflare Turnstile
- **Outcome:** If passed, upgrade to Verified tier

**Tier 3: Verified (Trusted)**

- **Achieved by:** Passing CAPTCHA
- **Duration:** 24 hours
- **Rate Limits:** 2x default limits
- **Benefits:** No repeated CAPTCHAs unless new violations

**Tier 4: Owner**

- **Authentication:** NextAuth with MFA
- **Rate Limits:** Unlimited
- **Budget Caps:** Still apply (safety net)

---

### Rate Limiting Implementation

**Layer 1: Global API Protection**

- **Limit:** 100 requests/minute per IP
- **Purpose:** Prevent DDoS
- **Storage:** Upstash Redis
- **Window:** Sliding (fair distribution)

**Layer 2: Endpoint-Specific Limits**

- **AI Summary:** 5/hour (expensive)
- **Resume Tailor:** 3/day (very expensive)
- **TTS Generation:** 10/hour (expensive)
- **Sandbox Launch:** 10/10min (resource-intensive)
- **Code Execution:** 20/hour (resource-intensive)
- **Exports (PDF):** 10/hour (moderate)
- **Storage:** Upstash Redis with trust-adjusted limits

**Layer 3: Trust Score Adjustment**

- Trusted users: 2x limits
- Verified users: 1.5x limits
- Suspicious users: 0.5x limits
- Unknown users: 1x limits (baseline)

**Layer 4: Global Budget Caps**

- **AI Requests:** 10,000/month (prevents $10+ in abuse)
- **TTS Characters:** 1,000,000/month (prevents $15+ in abuse)
- **Sandbox Launches:** 100,000/month (resource limit)
- **PDF Exports:** 5,000/month (resource limit)
- **Storage:** Redis + Database tracking

**Layer 5: CAPTCHA Verification**

- Triggered after repeated violations
- Resets violation counter on pass
- Temporarily upgrades trust level
- Free (Cloudflare Turnstile)

---

### Trust Scoring System

**Database Fields:**

- identifier (IP hash or user ID)
- trust_level (unknown, suspicious, verified, trusted)
- violation_count (increments on rate limit hit)
- last_violation_at (timestamp)
- captcha_passes (increments on successful verification)
- last_captcha_at (timestamp)

**Scoring Logic:**

- **Trusted:** 5+ CAPTCHA passes, <2 violations
- **Verified:** 1+ CAPTCHA pass
- **Suspicious:** 3+ violations without CAPTCHA pass
- **Unknown:** New user or low activity

**Violation Recording:**

- Every rate limit hit increments counter
- Violations older than 7 days decay (50% reduction)
- Successful CAPTCHA pass resets violations to 0

---

### Background Verification (Code Execution)

**Purpose:** Protect against malicious code without user friction

**Checks:**

1. **Pattern Detection:**
   - Block eval(), exec(), subprocess
   - Block network requests (fetch, XMLHttpRequest)
   - Block filesystem access attempts
   - Flag but don't always block (might be legitimate)

2. **Complexity Analysis:**
   - Max code length: 10,000 characters
   - Detect infinite loops (while True, while 1==1)
   - Timeout: 10 seconds max execution

3. **Resource Limits:**
   - Memory cap (enforced by Pyodide)
   - CPU limit (WebAssembly sandbox)

4. **Trust-Based:**
   - Suspicious users require CAPTCHA for risky code
   - Trusted users get benefit of doubt
   - All executions logged for monitoring

---

## Data Architecture

### Core Entities

**Users**

- id (UUID, primary key)
- email (unique)
- name
- auth_provider_id
- created_at
- updated_at

**Stories**

- id (UUID, primary key)
- sections (JSONB array - ordered narrative segments)
- updated_at

**Resumes**

- id (UUID, primary key)
- version (integer, increments on edit)
- content (JSONB - structured resume data)
- updated_at
- published_at

**Resume Exports**

- id (UUID, primary key)
- resume_version (foreign key)
- export_type (standard, tailored)
- prompt (text, nullable - for tailored exports)
- cached_pdf_url (text - Supabase Storage URL)
- created_at

**Blog Posts**

- id (UUID, primary key)
- slug (unique, URL-friendly)
- title (text)
- content (text - Markdown/Org-mode)
- thumbnail_url (text, nullable)
- published_at (timestamp, nullable)
- updated_at (timestamp)
- tags (text array - AI-generated)
- categories (text array - AI-generated)
- ai_summary (text, nullable - cached)
- ai_audio_url (text, nullable - cached)
- estimated_reading_time (integer, minutes)
- is_featured (boolean - for "My Top Picks")

**Projects**

- id (UUID, primary key)
- github_repo (text, unique - format: "owner/repo")
- slug (unique, URL-friendly)
- readme_content (text)
- languages (text array)
- github_stars (integer)
- tags (text array - AI-generated)
- categories (text array - AI-generated)
- last_synced_at (timestamp)
- is_featured (boolean - for "My Top Picks")

**Page Visits (Analytics)**

- id (UUID, primary key)
- visitor_hash (text - hash of IP + user-agent)
- page_type (enum: home, story, resume, blog, project)
- page_id (UUID, nullable - foreign key to blog/project)
- duration_seconds (integer, nullable)
- visited_at (timestamp)

**User Trust Scores**

- id (UUID, primary key)
- identifier (text, unique - IP hash or user ID)
- trust_level (enum: unknown, suspicious, verified, trusted)
- violation_count (integer)
- last_violation_at (timestamp, nullable)
- captcha_passes (integer)
- last_captcha_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**CAPTCHA Challenges**

- id (UUID, primary key)
- identifier (text)
- endpoint (text - which API triggered it)
- challenge_token (text)
- passed (boolean, nullable)
- challenged_at (timestamp)
- responded_at (timestamp, nullable)

**Suspicious Executions**

- id (UUID, primary key)
- identifier (text)
- code_hash (text)
- language (text)
- detected_at (timestamp)

---

### Database Indexes

**Performance-Critical:**

- blog_posts(slug) - unique
- blog_posts(published_at DESC) - list recent
- projects(github_repo) - unique
- projects(slug) - unique
- page_visits(visitor_hash, visited_at) - analytics
- user_trust_scores(identifier) - unique, rate limiting
- captcha_challenges(identifier, challenged_at) - monitoring

**Full-Text Search:**

- blog_posts: GIN index on to_tsvector(title || ' ' || content)
- projects: GIN index on to_tsvector(readme_content)

---

### Data Relationships

**One-to-Many:**

- resumes → resume_exports (one resume version, many exports)
- blog_posts ← page_visits (one post, many visits)
- projects ← page_visits (one project, many visits)

**No Foreign Keys (Loose Coupling):**

- Trust scores are independent (identifier may not be a user)
- CAPTCHA challenges track by identifier (not user FK)

---

### Caching Strategy

**Redis Cache Keys:**

**Rate Limits:**

- `ratelimit:ai:{identifier}` - AI request counter
- `ratelimit:sandbox:{identifier}` - Sandbox launch counter
- `ratelimit:tts:{identifier}` - TTS generation counter
- `ratelimit:export:{identifier}` - Export counter
- `ratelimit:code:{identifier}` - Code execution counter

**Budget Tracking:**

- `budget:{YYYY-MM}` - Monthly usage counters
  ```
  {
    aiRequests: 1234,
    ttsCharacters: 50000,
    sandboxLaunches: 567,
    pdfExports: 89
  }
  ```

**AI Output Cache:**

- `ai:summary:{post_id}:{content_hash}` - Blog summaries
- `ai:tags:{post_id}:{content_hash}` - Generated tags
- `ai:resume:{version}:{prompt_hash}` - Tailored resumes

**Cache Invalidation:**

- On content update (blog/project edit)
- On version change (resume)
- Monthly budget resets automatically (TTL)
- Rate limits use sliding windows (auto-expire)

---

## Integration Architecture

### GitHub Integration

**Initial Connection:**

1. Owner authenticates via GitHub OAuth
2. App requests read-only repo access
3. Owner selects repos to feature
4. System fetches initial data (README, metadata)
5. AI generates tags/categories
6. Data stored in database

**Webhook Setup:**

1. Webhook URL: `https://yourdomain.com/api/webhooks/github`
2. Events: `push` (on main/master branch only)
3. Secret: Stored in environment variables
4. Validates HMAC signature on every webhook

**Automatic Sync Flow:**

1. GitHub sends push event
2. Webhook verifies signature
3. Extracts repo identifier
4. Fetches updated README via Octokit
5. Fetches latest commit, stars, languages
6. AI regenerates tags/categories if README changed
7. Updates database record
8. Invalidates any cached project data
9. No user intervention required

**Fallback:**

- Manual sync button (owner-only)
- Scheduled sync every 24 hours (optional)
- Handles private repo access (if configured)

---

### AI Integration

**Claude API Usage:**

**Blog Summaries:**

- Input: Full blog post content (up to 100k tokens)
- Prompt: "Summarize this blog post in 2-3 concise sentences."
- Output: Cached in database (ai_summary field)
- Regeneration: Only when post content changes

**Tag/Category Generation:**

- Input: Blog post content or project README
- Prompt: "Extract 3-5 relevant tags and 1-2 categories."
- Output: Stored as array in database
- Regeneration: On content change or manual trigger

**Resume Tailoring (Owner-Only):**

- Input: Full resume + custom prompt (e.g., "Emphasize frontend experience")
- Constraint: "Only rephrase existing content, do not fabricate."
- Output: Markdown → React-PDF → PDF file
- Cached: Stores PDF URL in resume_exports table

**Cost Optimization:**

- Prompt caching: Reduces tokens by ~90% on repeated calls
- Batch API: Non-urgent requests (50% discount)
- Output caching: Never regenerate identical inputs
- Monthly cap: Hard stop at 10,000 requests

---

### Text-to-Speech Integration

**OpenAI TTS API:**

**Generation Flow:**

1. User requests audio for blog post
2. Check cache: `ai:audio:{post_id}:{content_hash}`
3. If cached, return URL immediately
4. If not cached:
   - Send post content to OpenAI TTS API
   - Receive audio file (MP3)
   - Upload to Supabase Storage
   - Store URL in database (ai_audio_url)
   - Cache URL in Redis
5. Return audio URL to client

**Voice Selection:**

- Default: "alloy" (neutral, professional)
- Speed: 1.0 (normal)
- Format: MP3 (compressed, web-friendly)

**Cost Control:**

- Only generate on explicit request
- Cache indefinitely
- Regenerate only when content changes
- Monthly character limit: 1M (approximately $15)

---

### Authentication Flow

**Owner Login:**

1. User clicks hidden "Owner Login" (playful gate)
2. Playful pre-check (e.g., "What's the capital of Texas?")
3. Correct answer reveals actual login form
4. NextAuth handles OAuth flow (Google or GitHub)
5. Checks email against `OWNER_EMAIL` environment variable
6. If match, creates authenticated session
7. MFA challenge (if enabled)
8. Sets secure session cookie
9. Redirects to previous page or dashboard

**Session Management:**

- HTTP-only cookies (XSS protection)
- Secure flag (HTTPS only)
- SameSite=Lax (CSRF protection)
- 30-day expiration (sliding window)

**Authorization:**

- Middleware checks session on protected routes
- Owner-only routes: /dashboard/_, /api/edit/_, /api/create/\*
- Public routes: Everything else
- No role system needed (single owner)

---

### Analytics Integration

**Tracking Methodology:**

**Page View:**

1. On page load, record:
   - Hashed identifier (IP + user-agent)
   - Page type (home, story, resume, blog, project)
   - Page ID (if blog/project)
   - Timestamp
2. Store in database (page_visits table)

**Duration Tracking:**

1. On page load, record start time (client-side)
2. On beforeunload event:
   - Calculate duration (end - start)
   - Send to /api/analytics/duration
   - Use keepalive: true (ensures delivery)
3. Update page_visits record

**Popularity Calculation:**

- Formula: `unique_visitors × avg_time × min(avg_time / reading_time, 1.2)`
- Calculated on-demand (not stored)
- Used for sorting in search results
- Prevents manipulation (capped multiplier)

**Privacy:**

- No cookies (cookieless tracking)
- IP addresses hashed (not stored raw)
- No third-party services (no data sharing)
- Owner visits excluded (via session check)

---

## Deployment Architecture

### Environment Structure

**Development:**

- Local machine
- PostgreSQL: Supabase (dev project)
- Redis: Upstash (dev instance)
- Environment: .env.local
- Hot reload enabled
- Debug mode active

**Preview (Staging):**

- Vercel preview deployments
- Unique URL per PR
- PostgreSQL: Supabase (staging project or dev)
- Redis: Upstash (dev instance)
- Environment: Vercel environment variables (preview)
- Useful for testing before merge

**Production:**

- Vercel production deployment
- Custom domain (yourdomain.com)
- PostgreSQL: Supabase (production project)
- Redis: Upstash (production instance)
- Environment: Vercel environment variables (production)
- Auto-deploy on push to main branch
- Automatic HTTPS

---

### Deployment Pipeline

**Continuous Deployment:**

1. **Code Change:**
   - Developer pushes to feature branch
   - Git triggers Vercel build

2. **Preview Build:**
   - Vercel creates preview deployment
   - Unique URL generated
   - Uses preview environment variables
   - Runs build-time checks (TypeScript, ESLint)

3. **Pull Request:**
   - Code review
   - Preview URL shared in PR
   - Automated tests run (optional)

4. **Merge to Main:**
   - PR approved and merged
   - Vercel triggers production build
   - Zero-downtime deployment
   - Automatic rollback on error

5. **Post-Deploy:**
   - Database migrations run (if any)
   - Cache invalidation (if needed)
   - Monitoring alerts enabled

**Rollback Strategy:**

- Instant rollback via Vercel dashboard
- Git revert (automatic re-deploy)
- Keep previous 10 deployments accessible

---

### Environment Variables

**Required Variables:**

**Database:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

**Redis:**

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

**Authentication:**

- `NEXTAUTH_SECRET` (generated, 32+ characters)
- `NEXTAUTH_URL` (https://yourdomain.com)
- `OWNER_EMAIL` (your email address)

**AI Services:**

- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY` (for TTS)

**GitHub:**

- `GITHUB_TOKEN` (personal access token)
- `GITHUB_WEBHOOK_SECRET`

**CAPTCHA:**

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

**Monitoring (Optional):**

- `SENTRY_DSN` (error tracking)
- `ALERT_WEBHOOK_URL` (budget alerts)

---

### Infrastructure Scaling

**Automatic Scaling (No Configuration):**

**Vercel Functions:**

- Auto-scales based on traffic
- No instance management
- Concurrent execution up to plan limits
- Cold start: ~50-200ms

**Supabase (PostgreSQL):**

- Connection pooling (automatic)
- Auto-scales storage
- Upgrade plan if queries slow

**Upstash Redis:**

- Global replication (automatic)
- Pay-per-operation (scales infinitely)
- Sub-10ms latency worldwide

**Supabase Storage:**

- CDN (automatic, global)
- Auto-scales bandwidth
- Image optimization on-the-fly

**No Manual Scaling Required**

---

## Development Workflow

### Local Development Setup

**Prerequisites:**

- Node.js v20+
- Git
- Code editor (VS Code recommended)

**Initial Setup:**

1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Fill in environment variables
5. Run database migrations: `npx supabase db push`
6. Start dev server: `npm run dev`
7. Open http://localhost:3000

**Development Process:**

1. Create feature branch from main
2. Make changes
3. Test locally
4. Commit with descriptive message
5. Push to GitHub
6. Create pull request
7. Review Vercel preview deployment
8. Merge after approval

---

### Testing Strategy

**Unit Tests:**

- Jest + React Testing Library
- Test utilities and helpers
- Test React components in isolation
- Coverage target: 70%+

**Integration Tests:**

- Test API routes
- Test database operations
- Test AI integrations (mocked)
- Test rate limiting logic

**End-to-End Tests:**

- Playwright
- Test critical user flows:
  - Resume download
  - Blog post creation (owner)
  - Project sandbox launch
  - CAPTCHA flow
- Run on CI/CD pipeline

**Manual Testing:**

- Cross-browser (Chrome, Firefox, Safari)
- Mobile responsive
- Accessibility (WAVE, axe DevTools)
- Performance (Lighthouse)

---

### Code Quality Tools

**TypeScript:**

- Strict mode enabled
- No implicit any
- Catch errors at compile-time

**ESLint:**

- Next.js recommended config
- Custom rules for consistency
- Auto-fix on save

**Prettier:**

- Format on save
- Consistent code style
- Integrates with Tailwind

**Husky:**

- Pre-commit hooks
- Run linter before commit
- Prevent broken code from being pushed

---

### Branching Strategy

**Main Branch:**

- Always deployable
- Protected (requires PR + approval)
- Auto-deploys to production

**Feature Branches:**

- Naming: `feature/feature-name`
- Short-lived (1-3 days)
- One feature per branch
- Delete after merge

**Hotfix Branches:**

- Naming: `hotfix/issue-description`
- For urgent production fixes
- Merge directly to main
- Fast-tracked review

---

## Cost Structure

### Monthly Cost Breakdown

**Fixed Costs:**
| Service | Plan | Cost |
|---------|------|------|
| Domain | Annual registration | ~$1/month |
| **Subtotal** | | **$1/month** |

**Variable Costs (Usage-Based):**

| Service              | Free Tier                            | Usage Estimate            | Cost      |
| -------------------- | ------------------------------------ | ------------------------- | --------- |
| **Vercel**           | 100GB bandwidth                      | Within free tier          | $0        |
| **Supabase**         | 500MB DB, 1GB storage, 2GB bandwidth | Within free tier          | $0        |
| **Upstash Redis**    | 10k commands/day                     | ~300k/month = $1          | $1        |
| **Anthropic Claude** | Pay-per-token                        | ~100k tokens              | $5-8      |
| **OpenAI TTS**       | Pay-per-character                    | ~10 blog posts × 2k words | $2        |
| **GitHub**           | Public repos                         | Free                      | $0        |
| **Cloudflare**       | DNS + Turnstile                      | Free                      | $0        |
| **NextAuth**         | Open source                          | Free                      | $0        |
| **Subtotal**         |                                      |                           | **$8-11** |

**Total Estimated Monthly Cost: $9-12**

---

### Cost Optimization Strategies

**AI Costs:**

- Aggressive caching (90% reduction via prompt caching)
- Only regenerate when content changes
- Use batch API for non-urgent requests (50% discount)
- Monthly cap: 10,000 requests (~$10 max)

**Storage Costs:**

- Compress images before upload
- Use image transformations (resize on-demand)
- Delete old exports after 90 days
- Lazy load images on blog/project pages

**Bandwidth Costs:**

- CDN caching (Vercel + Cloudflare)
- Serve static assets from edge
- Gzip compression enabled
- Lazy load components

**Database Costs:**

- Archive old analytics data (>6 months)
- Use connection pooling
- Optimize queries (proper indexes)
- Monitor slow query logs

**Rate Limiting Savings:**

- Prevents abuse (potentially $1000s)
- Global budget caps (safety net)
- CAPTCHA stops bots (free)

---

### Scaling Cost Projections

**At 10x Traffic (10,000 visitors/month):**
| Service | Cost |
|---------|------|
| Vercel | $0-20 (may exceed free tier bandwidth) |
| Supabase | $0-25 (may need Pro plan) |
| AI | $20-30 (more summaries/tailoring) |
| **Total** | **$20-75** |

**At 100x Traffic (100,000 visitors/month):**
| Service | Cost |
|---------|------|
| Vercel | $20 (Pro plan) |
| Supabase | $25 (Pro plan) |
| AI | $50-100 (with budget caps) |
| **Total** | **$95-145** |

**Revenue-Generating Options (Future):**

- Sponsorships (GitHub Sponsors)
- Consulting inquiries
- Premium content (behind email gate)
- Ad revenue (ethical, non-intrusive)

---

## Implementation Phases

### Phase 0 (Day 1): Just GitHub + VS Code

- Start coding immediately
- No account creation needed

### Phase 1 (Weeks 1-2): Add Vercel when you have something to deploy

- Static site working locally
- Want to see it live
- Domain optional (can use vercel.app)

### Phase 2 (Weeks 3-4): Add Supabase when you need data

- Building resume page
- Need database + auth
- Still don't need Redis or AI

### Phase 3 (Weeks 5-7): Add GitHub token when syncing projects

- Just a token (already have account)
- Still no Redis or AI needed

# Phase 4 (Weeks 8-10): Finally add AI accounts

- Anthropic (Claude API)
- OpenAI (TTS)
- Set usage limits immediately!
- Still no Redis yet

### Phase 6 (Week 13): Add security last

- Upstash Redis (rate limiting)
- Cloudflare Turnstile (CAPTCHA)
- Only when you have traffic to protect

---

## Monitoring & Maintenance

### Application Monitoring

**Error Tracking:**

- Tool: Sentry (optional, $0-26/month)
- Tracks runtime errors
- Source maps for debugging
- Alerts on critical errors
- Performance monitoring included

**Uptime Monitoring:**

- Tool: Vercel Analytics (included)
- Tracks availability
- Response time metrics
- Geographic performance

**Custom Monitoring:**

- Budget usage dashboard (owner-only)
- Rate limit violations dashboard
- Trust score distribution
- CAPTCHA challenge success rate
- AI API usage tracking
- Database query performance

---

### Alerting Strategy

**Critical Alerts (Immediate Action):**

- Site down (5xx errors)
- Database connection lost
- AI API budget at 90%
- Storage quota at 90%
- Suspicious activity spike (>100 violations/hour)

**Warning Alerts (Review Soon):**

- AI API budget at 80%
- Unusual traffic pattern
- Slow query detected (>5s)
- High error rate (>5%)

**Info Alerts (Weekly Digest):**

- Weekly usage summary
- Popular content report
- Trust score distribution
- New CAPTCHA challenges

**Delivery:**

- Email (critical + warnings)
- Webhook to Discord/Slack (optional)
- Dashboard (all alerts)

---

### Backup Strategy

**Database Backups:**

- Supabase automatic daily backups (7-day retention)
- Weekly manual backups to external storage (optional)
- Point-in-time recovery (Supabase Pro plan)

**Content Backups:**

- Blog posts: Export to Markdown weekly
- Projects: Synced from GitHub (source of truth)
- Resume: Version history in database
- Story: Export to JSON weekly

**Storage Backups:**

- Images/PDFs backed up by Supabase
- Critical files: Manual download monthly (optional)

**Recovery Time Objective (RTO):**

- Database restore: <1 hour
- Full site restore: <2 hours

---

### Maintenance Tasks

**Daily:**

- Monitor error dashboard
- Check budget usage
- Review suspicious activity

**Weekly:**

- Review analytics
- Check performance metrics
- Review rate limit violations
- Update content (blog/projects as needed)

**Monthly:**

- Review and archive old analytics data
- Check for dependency updates
- Review AI API costs
- Update documentation (if needed)

**Quarterly:**

- Security audit
- Performance optimization
- Backup testing
- Dependency major version updates

---

### Update Strategy

**Security Updates:**

- Critical: Immediate (same day)
- High: Within 1 week
- Medium: Within 1 month
- Low: Next planned release

**Dependency Updates:**

- Patch versions: Auto-merge (if tests pass)
- Minor versions: Review and merge weekly
- Major versions: Evaluate breaking changes, test thoroughly

**Feature Updates:**

- Based on user feedback (if applicable)
- Owner's priorities
- Quarterly planning

---

## Risk Mitigation

### Technical Risks

**Risk: AI Costs Spiral Out of Control**

- **Likelihood:** Medium
- **Impact:** High
- **Mitigation:**
  - Hard monthly caps (10,000 requests)
  - Rate limiting per user
  - CAPTCHA for repeated use
  - Alerts at 80% usage
  - Automatic service pause at 100%
- **Contingency:** Disable AI features temporarily

**Risk: GitHub API Rate Limits**

- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:**
  - Use webhooks (no rate limits)
  - Cache all data locally
  - Only fetch on webhook events
  - Authenticated requests (5000/hour)
- **Contingency:** Manual project updates

**Risk: Sandbox Abuse (Resource Exhaustion)**

- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Client-side execution (Sandpack)
  - Rate limiting (10 per 10 minutes)
  - CAPTCHA for repeated launches
  - No server resources consumed
- **Contingency:** Disable sandboxes temporarily

**Risk: Database Performance Degradation**

- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:**
  - Proper indexing
  - Connection pooling
  - Query optimization
  - Archive old data
- **Contingency:** Upgrade Supabase plan

**Risk: Storage Quota Exceeded**

- **Likelihood:** Low
- **Impact:** Low
- **Mitigation:**
  - Image compression
  - Delete old exports (>90 days)
  - Monitor usage
- **Contingency:** Upgrade storage plan

**Risk: Vercel Bandwidth Exceeded**

- **Likelihood:** Low (with free tier: 100GB/month)
- **Impact:** Medium
- **Mitigation:**
  - CDN caching
  - Image optimization
  - Lazy loading
- **Contingency:** Upgrade to Pro plan ($20/month)

**Risk: Security Breach (Authentication)**

- **Likelihood:** Very Low
- **Impact:** High
- **Mitigation:**
  - MFA required
  - Secure session cookies
  - NextAuth best practices
  - Environment variable protection
- **Contingency:** Force logout, reset credentials

---

### Operational Risks

**Risk: Deployment Failure**

- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:**
  - Preview deployments before production
  - Automated checks (TypeScript, ESLint)
  - Instant rollback capability
- **Contingency:** Revert to previous deployment

**Risk: Data Loss**

- **Likelihood:** Very Low
- **Impact:** High
- **Mitigation:**
  - Supabase automatic backups
  - Version history for resume/blog
  - Projects synced from GitHub
- **Contingency:** Restore from backup

**Risk: Dependency Vulnerability**

- **Likelihood:** Medium
- **Impact:** Low-Medium
- **Mitigation:**
  - Automated Dependabot alerts
  - Regular security audits
  - Quick patching process
- **Contingency:** Immediate patch and deploy

**Risk: Third-Party Service Outage**

- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:**
  - Graceful degradation (AI features optional)
  - Cached data (Redis, database)
  - Static content always available
- **Contingency:** Display friendly error messages

---

### Business/Personal Risks

**Risk: Time/Energy for Maintenance**

- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Automation (GitHub sync, AI features)
  - Serverless (no server management)
  - Minimal manual updates required
- **Contingency:** Portfolio remains functional without updates

**Risk: Content Staleness**

- **Likelihood:** Medium
- **Impact:** Low
- **Mitigation:**
  - Projects auto-sync from GitHub
  - Resume easy to update
  - Blog updates as desired (not required)
- **Contingency:** Content ages gracefully (intentional design)

**Risk: Reputation Damage (Site Issues)**

- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:**
  - High uptime (Vercel infrastructure)
  - Error monitoring (Sentry)
  - Quick incident response
- **Contingency:** Temporary maintenance mode

---

## Appendix: Key Decisions & Rationale

### Why Serverless Over Traditional Server?

- No server management or maintenance
- Automatic scaling (handles traffic spikes)
- Pay only for actual usage
- Global edge deployment (faster)
- Better for portfolio (modern, relevant skill)

### Why PostgreSQL Over NoSQL?

- Structured data with clear relationships
- ACID transactions (data integrity)
- Full-text search built-in
- Mature ecosystem
- Easier to query (SQL vs NoSQL syntax)

### Why Next.js Over Other React Frameworks?

- Best-in-class developer experience
- Server components for performance
- API routes (no separate backend needed)
- Vercel integration (zero-config deployment)
- Large community and ecosystem

### Why Upstash Redis Over Alternatives?

- Serverless (pay per operation)
- Global edge locations (fast everywhere)
- Works across serverless instances
- Built-in rate limiting library
- Free tier sufficient for needs

### Why Cloudflare Turnstile Over reCAPTCHA?

- Free forever (unlimited)
- Better user experience (invisible)
- Privacy-friendly (no Google tracking)
- Better accessibility
- No vendor lock-in

### Why Claude Over GPT-4?

- Better at summarization
- Better instruction-following
- Excellent with technical content
- Prompt caching (90% cost reduction)
- Competitive pricing

### Why React-PDF + Puppeteer Over Single Solution?

- React-PDF better for structured documents (resumes)
- Puppeteer better for rich content (blog posts)
- Different use cases need different tools
- Both work in serverless environment

### Why Lexical Over Other Editors?

- Built by Meta for production use
- Best performance with large documents
- Native React support
- Extensible plugin architecture
- Modern, actively maintained

### Why Supabase Over AWS RDS?

- Managed PostgreSQL (no administration)
- Integrated storage and auth
- Better developer experience
- Generous free tier
- Realtime subscriptions included

### Why Vercel Over Alternatives?

- Zero-config Next.js deployment
- Best integration with framework
- Preview deployments per PR
- Edge functions included
- Free tier sufficient for start

---

## Glossary

**Serverless:** Computing model where infrastructure is managed by provider; you only write code and pay for execution time.

**Edge Computing:** Running code on servers geographically close to users for lower latency.

**Rate Limiting:** Controlling how many requests a user can make in a time period.

**CAPTCHA:** Challenge-response test to distinguish humans from bots.

**Trust Scoring:** System that assigns reputation scores based on user behavior.

**Progressive Verification:** Security strategy that adds friction only for suspicious activity.

**Sliding Window:** Rate limit calculation that considers a rolling time period rather than fixed intervals.

**Prompt Caching:** AI optimization that reuses parts of previous prompts to reduce tokens and cost.

**Webhook:** HTTP callback triggered by external events (e.g., GitHub push).

**Graceful Degradation:** Design principle where features fail without breaking core functionality.

**Defense in Depth:** Security strategy using multiple overlapping layers of protection.

---

## Next Steps

1. **Review this document** - Ensure understanding of all architecture decisions
2. **Set up accounts** - Vercel, Supabase, Upstash, Anthropic, OpenAI, Cloudflare
3. **Register domain** - Choose and purchase domain name
4. **Initialize project** - Create Next.js app with recommended configuration
5. **Begin Phase 1** - Implement core structure and home page
6. **Iterate** - Follow implementation phases sequentially

---

**Document Control:**

- **Version:** 1.0
- **Last Updated:** January 22, 2026
- **Next Review:** After Phase 3 completion
- **Owner:** Alfredo
- **Status:** Approved for Implementation

---

**End of Document**
