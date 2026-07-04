# Hirex Job Board — Full Feature Documentation

> **Live Site:** [https://hirex-job-board.vercel.app](https://hirex-job-board.vercel.app)
> **Repository:** [https://github.com/Naveen-2002-Tanguturu/Job-Dashboard](https://github.com/Naveen-2002-Tanguturu/Job-Dashboard)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [Pages](#3-pages)
   - [3.1 Homepage (index.html)](#31-homepage-indexhtml)
   - [3.2 Jobs Listing (jobs.html)](#32-jobs-listing-jobshtml)
   - [3.3 Job Detail (job-detail.html)](#33-job-detail-job-detailhtml)
   - [3.4 Apply (apply.html)](#34-apply-applyhtml)
   - [3.5 Saved Jobs (saved-jobs.html)](#35-saved-jobs-saved-jobshtml)
   - [3.6 404 Page (404.html)](#36-404-page-404html)
4. [JavaScript Modules](#4-javascript-modules)
   - [4.1 jobs-data.js — Data Layer](#41-jobs-datajs--data-layer)
   - [4.2 storage.js — localStorage API](#42-storagejs--localstorage-api)
   - [4.3 ui.js — UI Utilities](#43-uijs--ui-utilities)
   - [4.4 render.js — Render Engine](#44-renderjs--render-engine)
   - [4.5 filters.js — Filter & Search Engine](#45-filtersjs--filter--search-engine)
   - [4.6 app-home.js — Homepage Logic](#46-app-homejs--homepage-logic)
   - [4.7 app-jobs.js — Jobs Page Logic](#47-app-jobsjs--jobs-page-logic)
   - [4.8 app-detail.js — Detail Page Logic](#48-app-detailjs--detail-page-logic)
   - [4.9 app-apply.js — Application Form Logic](#49-app-applyjs--application-form-logic)
   - [4.10 app-saved.js — Saved Jobs Logic](#410-app-savedjs--saved-jobs-logic)
5. [CSS Design System](#5-css-design-system)
   - [5.1 variables.css — Design Tokens](#51-variablescss--design-tokens)
   - [5.2 base.css — Reset & Foundations](#52-basecss--reset--foundations)
   - [5.3 components.css — UI Components](#53-componentscss--ui-components)
   - [5.4 layout.css — Page Layouts](#54-layoutcss--page-layouts)
   - [5.5 animations.css — Motion & Transitions](#55-animationscss--motion--transitions)
6. [Feature Deep-Dives](#6-feature-deep-dives)
   - [6.1 Search & Filtering System](#61-search--filtering-system)
   - [6.2 Save Jobs (Bookmarks)](#62-save-jobs-bookmarks)
   - [6.3 Job Application Flow](#63-job-application-flow)
   - [6.4 Dark / Light Theme](#64-dark--light-theme)
   - [6.5 Toast Notification System](#65-toast-notification-system)
   - [6.6 Skeleton Loading States](#66-skeleton-loading-states)
   - [6.7 URL State Management](#67-url-state-management)
   - [6.8 Pagination](#68-pagination)
   - [6.9 Animated Stats Counter](#69-animated-stats-counter)
   - [6.10 Share Job Link](#610-share-job-link)
   - [6.11 Similar Jobs Sidebar](#611-similar-jobs-sidebar)
   - [6.12 Responsive & Mobile Navigation](#612-responsive--mobile-navigation)
7. [Data Schema](#7-data-schema)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Deployment](#9-deployment)
10. [Security & Performance](#10-security--performance)

---

## 1. Project Overview

**Hirex** is a fully client-side, static job board built with pure **HTML, CSS, and JavaScript** — no frameworks, no build step, no back end required. It ships as a set of flat HTML files and can be deployed to any static host.

### Key Stats

| Metric | Value |
|---|---|
| Job Listings | 37 mock jobs |
| Companies | 28+ top-tier companies |
| Job Categories | 10 (Engineering, Design, Marketing, Product, Finance, Data, HR, Operations, Sales, DevOps) |
| Pages | 6 HTML pages |
| JavaScript Modules | 10 files |
| CSS Files | 5 files |
| Total Source | ~120 KB unminified |

### Design Principles

- **Zero dependencies** — everything is vanilla JS and CSS
- **Dark-first** — beautiful dark mode as default, with a full light mode
- **Accessible** — semantic HTML5, ARIA labels, keyboard navigation
- **URL-driven state** — filters and pagination are reflected in the URL (shareable/bookmarkable)
- **localStorage persistence** — saved jobs and theme preference survive page reloads

---

## 2. Architecture & File Structure

```
d:\Job Board\
├── index.html           ← Homepage (Hero, Categories, Featured Jobs)
├── jobs.html            ← Jobs listing with sidebar filters
├── job-detail.html      ← Single job detail view
├── apply.html           ← Multi-step application form
├── saved-jobs.html      ← User's bookmarked jobs
├── 404.html             ← Custom not-found page
│
├── css/
│   ├── variables.css    ← All CSS custom properties (design tokens)
│   ├── base.css         ← CSS reset + typography foundations
│   ├── components.css   ← Reusable components (buttons, badges, cards, toasts)
│   ├── layout.css       ← Page-level layouts (header, hero, grid, footer)
│   └── animations.css   ← Keyframes and transition utilities
│
├── js/
│   ├── jobs-data.js     ← All 37 job objects + helper functions
│   ├── storage.js       ← localStorage abstraction (saved, applied, theme)
│   ├── ui.js            ← Shared UI utilities (theme, toast, skeleton, nav)
│   ├── render.js        ← HTML-building render functions (cards, badges, etc.)
│   ├── filters.js       ← Filter state machine + URL sync
│   ├── app-home.js      ← Homepage page controller
│   ├── app-jobs.js      ← Jobs listing page controller
│   ├── app-detail.js    ← Job detail page controller
│   ├── app-apply.js     ← Multi-step form controller
│   └── app-saved.js     ← Saved jobs page controller
│
├── .github/workflows/
│   └── ci-cd.yml        ← GitHub Actions CI/CD pipeline
│
├── vercel.json          ← Vercel deployment configuration
├── .htmlvalidate.json   ← HTML linting config
├── .stylelintrc.json    ← CSS linting config
├── eslint.config.js     ← JavaScript linting config
└── .gitignore
```

### Script Loading Order

Each HTML page loads scripts in dependency order:

```html
<!-- Always loaded first — globals available to all subsequent scripts -->
<script src="js/jobs-data.js"></script>   <!-- defines JOBS_DATA, CATEGORIES, helpers -->
<script src="js/storage.js"></script>      <!-- defines Storage object -->
<script src="js/ui.js"></script>           <!-- defines UI object -->
<script src="js/render.js"></script>       <!-- defines Render object -->

<!-- Then the page-specific controller (differs per page) -->
<script src="js/app-home.js"></script>     <!-- or app-jobs.js, app-detail.js, etc. -->
```

> [!NOTE]
> All modules communicate through **global objects** (`JOBS_DATA`, `Storage`, `UI`, `Render`, `Filters`) since there is no module bundler. This is intentional for simplicity and zero-dependency deployment.

---

## 3. Pages

### 3.1 Homepage (`index.html`)

The entry point and marketing page of Hirex.

**Sections (top to bottom):**

| Section | Description |
|---|---|
| **Header** | Logo, navigation links, theme toggle, "Browse Jobs" CTA, mobile hamburger menu |
| **Hero** | Large headline with gradient text, dual-field search bar (keyword + location), popular search tags |
| **Stats Bar** | Animated counters: 37+ Active Jobs, 28+ Top Companies, 10 Categories, 95% Placement Rate |
| **Browse by Category** | Grid of 9 category cards, each showing icon, name, and live job count |
| **Featured Jobs** | 6-card grid of hand-picked featured listings, with 400ms skeleton loader effect |
| **How It Works** | 3-step process cards (Search & Filter → Save & Compare → Apply in Minutes) |
| **CTA Banner** | Full-width gradient banner with "Browse All Jobs" and "My Saved Jobs" buttons |
| **Footer** | Brand description, Browse/Categories/Account link columns, social icons, copyright |

**Scripts loaded:** `jobs-data.js`, `storage.js`, `ui.js`, `render.js`, `app-home.js`

---

### 3.2 Jobs Listing (`jobs.html`)

The core browsing and filtering experience.

**Layout:** Two-column — left sidebar (filters) + right content area (results grid)

**Sidebar Filter Panels (all collapsible):**
- **Search** — text input with 300ms debounce
- **Category** — 9 radio-style checkboxes (Engineering, Design, Marketing, Product, Finance, Data, HR, Operations, Sales)
- **Job Type** — Full-time, Part-time, Contract, Internship, Freelance
- **Work Mode** — Remote, Hybrid, On-site
- **Experience Level** — Entry, Mid-level, Senior, Lead, Executive
- **Salary Range** — dual-handle range slider ($0–$500k)
- **Clear All Filters** button

**Results Area:**
- Result count: "Showing X of Y jobs"
- Active filter chips (removable, shows currently applied filters)
- Sort dropdown: Newest, Oldest, Salary (High→Low), Salary (Low→High), Relevance
- Job cards grid (12 per page)
- Pagination controls
- Empty state with "Clear filters" CTA when no results

**Mobile:** Sidebar is hidden by default; toggled via a "Filters" button above the grid.

**Scripts loaded:** `jobs-data.js`, `storage.js`, `ui.js`, `render.js`, `filters.js`, `app-jobs.js`

---

### 3.3 Job Detail (`job-detail.html`)

Full detail view for a single job listing. The job is identified via `?id=job-XXX` in the URL.

**Left Column:**
- **Breadcrumb** — Home > Jobs > Company / Job Title
- **Job Header** — Company avatar, title (h1), company link (opens new tab), location, posted date, category/featured/applied badges, type/remote/level badges
- **Job Description** — full paragraph overview
- **What You'll Do** — bulleted responsibilities list
- **What We're Looking For** — bulleted requirements list
- **Nice to Have** — bulleted preferred qualifications list
- **Skills** — tag chips for each required skill
- **Benefits & Perks** — tag chips for all benefits

**Right Sidebar:**
- **Apply CTA** — "Apply Now" button (links to apply.html) or "✓ Applied" if already submitted
- **Save Job** button — toggles bookmark state with toast feedback
- **Share** — "Copy Link" button that writes the URL to clipboard
- **Job Info Card** — Salary Range, Job Type, Work Mode, Level, Industry, Team Size
- **Company Card** — Avatar, name, industry, description blurb, "Visit [Company]" external link
- **Similar Jobs** — Up to 3 mini job cards from the same category

**Error handling:** If `?id` is missing or invalid, an empty state with "Browse all jobs" CTA is rendered.

**Scripts loaded:** `jobs-data.js`, `storage.js`, `ui.js`, `render.js`, `app-detail.js`

---

### 3.4 Apply (`apply.html`)

A 4-step guided application form. The job is identified via `?id=job-XXX`.

**Step Indicator:** Visual progress bar with numbered circles (active, completed, upcoming states).

**Step 1 — Personal Info:**
- Full Name (required)
- Email Address (required)
- Phone Number (required)
- LinkedIn Profile URL
- Current Location

**Step 2 — Resume & Cover Letter:**
- Resume Upload — drag-and-drop zone OR click-to-browse; shows file name + size on selection; supports any file type; border turns green on success
- Cover Letter — multi-line textarea (optional)

**Step 3 — Screening Questions:**
- Dynamically rendered from the job's `screening_questions` array
- Supports `textarea` type (free-form answer) and `select` type (dropdown choice)
- Each question is marked required

**Step 4 — Review & Submit:**
- Summary table showing all entered values
- "Submit Application" button

**Validation:** Each step runs required-field validation before advancing. Invalid fields get a red border and an inline error message. A toast notification prompts the user to fix errors.

**On Submit:** Saves the application to `localStorage` via `Storage.saveApplication()`. Replaces the form with a success state ("Application Submitted! 🎉"). Shows a 5-second toast notification.

**Scripts loaded:** `jobs-data.js`, `storage.js`, `ui.js`, `render.js`, `app-apply.js`

---

### 3.5 Saved Jobs (`saved-jobs.html`)

Displays all jobs the user has bookmarked.

**Features:**
- Shows count: "X saved jobs"
- Renders full job cards (same as jobs.html) with an extra footer row per card containing:
  - **View Job** button → links to job-detail.html
  - **Apply Now** button → links to apply.html (or "✓ Applied" badge if already submitted)
  - **Remove** (trash icon) button → removes from saved list with a fade-out animation + toast
- **Empty State:** If no jobs are saved, shows an illustration with "Browse Jobs" CTA

**Scripts loaded:** `jobs-data.js`, `storage.js`, `ui.js`, `render.js`, `app-saved.js`

---

### 3.6 404 Page (`404.html`)

Custom not-found page with:
- Animated "404" heading
- Friendly error message
- Links back to Homepage and Jobs listing

---

## 4. JavaScript Modules

### 4.1 `jobs-data.js` — Data Layer

The single source of truth for all job data.

**Exports (globals):**
- `JOBS_DATA` — Array of 37 job objects (see [Data Schema](#7-data-schema))
- `CATEGORIES` — Array of 10 category strings
- Helper functions:

```javascript
getJobById(id)         // Returns a single job object by its id string
getFeaturedJobs()      // Returns array of jobs where featured === true
getSimilarJobs(id, n)  // Returns up to n jobs in the same category, excluding jobId
filterJobs(filters)    // Applies a filters object and returns matching jobs
```

---

### 4.2 `storage.js` — localStorage API

Thin abstraction over `localStorage`. Uses three keys:

| Key | Purpose |
|---|---|
| `hirex_saved_jobs` | JSON array of saved job ID strings |
| `hirex_applied_jobs` | JSON array of application objects |
| `hirex_theme` | String: `"dark"` or `"light"` |

**API:**

```javascript
// Saved Jobs
Storage.getSavedJobs()          // → string[]
Storage.saveJob(id)             // adds id to saved list
Storage.unsaveJob(id)           // removes id from saved list
Storage.isJobSaved(id)          // → boolean
Storage.toggleSaveJob(id)       // toggle + returns new state (boolean)

// Applications
Storage.getAppliedJobs()        // → object[] (each has jobId, appliedAt, form fields)
Storage.saveApplication(jobId, formData) // upserts application
Storage.isJobApplied(id)        // → boolean

// Theme
Storage.getTheme()              // → "dark" | "light"
Storage.setTheme(theme)         // saves preference
```

> [!NOTE]
> All methods are wrapped in try/catch to gracefully handle environments where `localStorage` is unavailable (e.g., private browsing with strict settings).

---

### 4.3 `ui.js` — UI Utilities

Shared utilities initialized on every page via `UI.init()`.

```javascript
UI.init()                          // Calls initTheme, initScrollHeader, initMobileNav, setActiveNav

UI.initTheme()                     // Reads saved theme, applies it, wires toggle button
UI.applyTheme(theme)               // Sets data-theme on <html>, swaps icon (sun/moon)

UI.initScrollHeader()              // Adds header--scrolled class after 10px scroll (backdrop blur effect)
UI.initMobileNav()                 // Wires hamburger button to toggle mobile-nav open class
UI.setActiveNav()                  // Marks current page's nav link as active

UI.showToast(title, msg, type, duration)
// type: "success" | "error" | "info" | "warning"
// duration: milliseconds before auto-dismiss (default 3500ms)
// Creates a toast element, appends to #toast-container, removes after duration

UI.renderSkeletons(container, count)
// Fills container with count skeleton card placeholders during loading

UI.initCollapsibles()              // Makes filter-section headers toggle their bodies open/closed

UI.scrollToTop()                   // window.scrollTo({ top: 0, behavior: 'smooth' })

UI.formatSalary(min, max)          // "$160k – $220k" | "$160k+" | "Salary not listed"
UI.relativeDate(dateStr)           // "Today" | "2 days ago" | "3 weeks ago" | "2 months ago"
UI.capitalize(str)                 // Capitalizes first character
```

---

### 4.4 `render.js` — Render Engine

All HTML construction lives here. Returns HTML strings (never touches the DOM directly).

```javascript
Render.companyAvatar(company, size)
// Renders a colored circle with the company's initials
// size: '' | 'lg' | 'xl'

Render.typeBadge(type)     // "Full-time", "Part-time", "Contract", "Internship", "Freelance"
Render.remoteBadge(remote) // "Remote", "Hybrid", "On-site"
Render.categoryBadge(cat)  // Category name with matching color class
Render.levelBadge(level)   // "Entry", "Mid-level", "Senior", "Lead", "Executive"

Render.jobCard(job)
// Full job card HTML — company avatar, title, meta (location, salary),
// excerpt, badge row (type/remote/level/top 4 skills),
// footer (posted date, applied badge, featured badge), save button

Render.miniJobCard(job)
// Compact 1-row card used in the "Similar Jobs" sidebar

Render.toggleSave(jobId, btn)
// Called directly from the save button's onclick
// Toggles storage, updates icon, shows toast

Render.pagination(currentPage, totalPages, onPageFn)
// Prev button, up to 5 page numbers (with … ellipsis), Next button
// Calls onPageFn(pageNumber) when a page is clicked

Render.filterChip(label, onRemove)
// A removable pill tag showing the active filter value

Render.emptyState(title, desc, ctaHtml)
// Centered empty state with search icon, title, description, optional CTA button
```

---

### 4.5 `filters.js` — Filter & Search Engine

A **state machine** that manages all filter state, applies it to `JOBS_DATA`, and syncs with the URL.

**State object:**

```javascript
Filters.state = {
  search:    '',          // free-text search query
  category:  '',          // e.g. 'Engineering'
  type:      '',          // e.g. 'full-time'
  remote:    '',          // 'remote' | 'hybrid' | 'onsite'
  level:     '',          // 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  salaryMin: 0,           // minimum salary in dollars
  salaryMax: 500000,      // maximum salary in dollars
  sort:      'newest',    // 'newest' | 'oldest' | 'salary-high' | 'salary-low' | 'relevance'
  page:      1,           // current pagination page
  perPage:   12           // results per page
}
```

**Search logic** (`Filters.apply()`): Matches against job **title**, **company name**, **category**, **skills array**, **location**, and **excerpt** — case-insensitive substring match.

**Sorting options:**

| Value | Behavior |
|---|---|
| `newest` | Sort by `posted` date descending |
| `oldest` | Sort by `posted` date ascending |
| `salary-high` | Sort by `salary.max` descending |
| `salary-low` | Sort by `salary.min` ascending |
| `relevance` | Featured jobs first |

**URL sync:**
- `Filters.fromURL()` — reads all URL params on page load (supports deep linking / sharing)
- `Filters.toURL()` — writes current state to URL via `history.replaceState()` (no page reload)

**Active filter chips:** `Filters.getActiveFilters()` returns an array of `{ label, key }` objects for every active filter, used to render removable chip tags above the results grid.

---

### 4.6 `app-home.js` — Homepage Logic

```javascript
// On DOMContentLoaded:
UI.init()
renderFeaturedJobs()      // Shows 6 skeleton cards for 400ms, then renders featured job cards
renderCategoryGrid()      // Builds 9 category cards with live job counts from JOBS_DATA
initHeroSearch()          // Hero form submit → navigates to jobs.html?q=...
initStatsCounter()        // Starts IntersectionObserver for animated number counters
```

**Hero Search:** On form submit, builds a `URLSearchParams` from the keyword and location inputs, then navigates to `jobs.html?q={query}`. Popular tag clicks navigate directly to pre-filtered URLs.

**Animated Stats Counter:**
- Uses `IntersectionObserver` with `threshold: 0.3` — starts counting when 30% of the element enters the viewport
- Easing: cubic ease-out (`1 - (1 - progress)³`)
- Duration: 1800ms
- Fires only once (observer unsubscribes after trigger)

---

### 4.7 `app-jobs.js` — Jobs Page Logic

The most complex controller — manages the entire filter-driven jobs list.

```javascript
// On DOMContentLoaded:
UI.init()
Filters.fromURL()         // Restore state from URL params
syncFormToState()         // Pre-fill form inputs from restored state
renderJobs()              // Initial render
initFilterListeners()     // Checkbox handlers for category/type/remote/level
initSortListener()        // Sort dropdown change handler
initSearchBar()           // Text input with 300ms debounce
UI.initCollapsibles()     // Collapsible filter sections
initSalarySlider()        // Dual-range salary slider
initClearFilters()        // "Clear All" button handler
initMobileFilterToggle()  // Mobile filter sidebar toggle
```

**Debounced Search:** The search input waits 300ms after the user stops typing before calling `renderJobs()`. Pressing Enter triggers immediately.

**Salary Slider:** Two `<input type="range">` elements ($0–$500k). If the min handle exceeds the max, they auto-swap. Displays formatted salary range in real time and updates results live.

**Checkbox Filter Behavior:** Each group (category, type, remote, level) behaves like a **radio group** — checking one unchecks all others in the same group. Unchecking the active one clears the filter.

---

### 4.8 `app-detail.js` — Detail Page Logic

```javascript
// On DOMContentLoaded:
UI.init()
// Reads ?id param, calls getJobById()
// If not found → renders emptyState
renderJobDetail(job)       // Header, description, sidebar cards
renderSimilarJobs(jobId)   // Up to 3 mini cards (same category, different id)
initSaveButton(jobId)      // Wires the Save/Saved toggle button
initShareButtons(job)      // Wires the "Copy Link" button
document.title = ...       // Dynamic page title: "Job Title at Company — Hirex"
```

---

### 4.9 `app-apply.js` — Application Form Logic

**Multi-step state:**
```javascript
let currentStep = 1;     // 1–4
const totalSteps = 4;
let formData = {};        // Accumulates field values across steps
```

**Step flow:**
1. `updateStep(n)` — activates step n's form panel, updates progress indicator, shows/hides Prev/Next/Submit buttons
2. `validateStep(n)` — checks all `[required]` fields in step n; shows inline errors and a toast if invalid
3. `collectStepData(n)` — reads all `input`, `textarea`, `select` from step n and merges into `formData`
4. Before showing Step 4 (Review), calls `renderReview()` to populate the summary table
5. `submitApplication()` → `Storage.saveApplication(jobId, formData)` → renders success state

**File Upload (`initFileUpload()`):**
- Click the drop zone → triggers hidden `<input type="file">`
- Drag a file over → `dragover` adds `drag-over` class (dashed blue border)
- Drop or select → stores `file.name` in `formData.resume_filename`, updates status text, turns border green, shows success toast

---

### 4.10 `app-saved.js` — Saved Jobs Logic

```javascript
// On DOMContentLoaded:
UI.init()
renderSavedJobs()
// Reads saved IDs from Storage, maps them to job objects via getJobById(),
// renders full job cards with extra action buttons

removeSaved(jobId, cardEl)
// Called from the trash icon button
// Unsaves job, animates card out (opacity + scale), then re-renders
```

---

## 5. CSS Design System

### 5.1 `variables.css` — Design Tokens

All values are defined as CSS custom properties on `:root` for the **dark theme** (default), with overrides in `[data-theme="light"]`.

**Color palette:**

| Token | Dark Value | Purpose |
|---|---|---|
| `--bg-primary` | `#0d0f14` | Main page background |
| `--bg-secondary` | `#111318` | Section backgrounds |
| `--bg-card` | `#161a23` | Card surfaces |
| `--bg-elevated` | `#1e2330` | Elevated surfaces (modals, sidebars) |
| `--accent` | `#6366f1` | Indigo — primary brand color |
| `--accent-hover` | `#4f46e5` | Darker indigo on hover |
| `--text-primary` | `#f1f5f9` | Main text |
| `--text-secondary` | `#94a3b8` | Subdued text |
| `--text-muted` | `#64748b` | Muted labels |
| `--border` | `#2d3347` | Default borders |
| `--success` | `#10b981` | Green — success states |
| `--warning` | `#f59e0b` | Amber — warning states |
| `--error` | `#ef4444` | Red — error states |

**Category colors** (used for badge tinting and category card icons):
`--cat-engineering: #6366f1` · `--cat-design: #ec4899` · `--cat-marketing: #f59e0b` · `--cat-product: #06b6d4` · `--cat-finance: #10b981` · `--cat-data: #8b5cf6` · `--cat-hr: #f97316` · `--cat-operations: #64748b` · `--cat-sales: #14b8a6` · `--cat-devops: #84cc16`

**Spacing scale:** 8 steps from `--sp-1 (4px)` to `--sp-24 (96px)`

**Border radius:** 7 steps from `--r-xs (4px)` to `--r-full (9999px)`

**Transition speeds:** `--t-fast (120ms)` · `--t (220ms)` · `--t-slow (380ms)` · `--t-spring (300ms cubic-bezier)`

---

### 5.2 `base.css` — Reset & Foundations

- CSS reset (box-sizing, margin/padding zero)
- Body: Inter font, `--bg-primary` background, `--text-primary` color, smooth scrolling
- Link styles, selection highlight (indigo tint)
- Helper utilities: `.flex`, `.grid`, `.items-center`, `.gap-*`, `.w-*`, `.hidden`
- Scrollbar styling (dark thin scrollbar matching the theme)

---

### 5.3 `components.css` — UI Components

Every reusable component is defined here:

| Component | Classes |
|---|---|
| **Buttons** | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-success`, `.btn-sm`, `.btn-lg`, `.btn-icon` |
| **Badges** | `.badge`, `.badge-fulltime`, `.badge-remote`, `.badge-hybrid`, `.badge-engineering`, `.badge-featured`, `.badge-applied`, `.badge-{level}` etc. |
| **Job Card** | `.job-card`, `.job-card__header`, `.job-card__company-info`, `.job-card__save-btn`, `.job-card__meta`, `.job-card__excerpt`, `.job-card__tags`, `.job-card__footer` |
| **Company Avatar** | `.company-avatar`, `.company-avatar.lg`, `.company-avatar.xl` |
| **Filter Sidebar** | `.filter-section`, `.filter-section__header`, `.filter-section__body`, `.filter-chip`, `.filter-chip__remove` |
| **Tags** | `.tag` — skill/benefit pill chip |
| **Toast** | `.toast-container`, `.toast`, `.toast.success/.error/.info/.warning`, `.toast-icon`, `.toast-body`, `.toast-close` |
| **Skeleton** | `.skeleton`, `.skeleton-card`, `.skeleton-avatar`, `.skeleton-text`, `.skeleton-badge` |
| **Form Elements** | `.input-group`, `.input-label`, `.input`, `.textarea`, `.select`, `.checkbox`, `.field-error` |
| **Pagination** | `.pagination`, `.pagination__btn`, `.pagination__btn.active` |
| **Detail Page** | `.detail-card`, `.detail-info-grid`, `.detail-info-item`, `.job-description` |
| **Category Card** | `.category-card`, `.category-card__icon`, `.category-card__name`, `.category-card__count` |
| **Step Cards** | `.step-card`, `.step-card__number`, `.step-card__title`, `.step-card__desc` |
| **Empty State** | `.empty-state`, `.empty-state__icon`, `.empty-state__title`, `.empty-state__desc` |
| **Success State** | `.success-state`, `.success-icon` |
| **File Upload** | `.file-upload-area`, `.file-upload-area.drag-over`, `.file-upload-text` |
| **Apply Stepper** | `.step-item`, `.step-item.active`, `.step-item.completed`, `.step-form`, `.step-form.active` |

---

### 5.4 `layout.css` — Page Layouts

- **Header** — fixed top, glassmorphism backdrop blur, logo, nav, actions. Adds `header--scrolled` class (stronger shadow) when page is scrolled
- **Mobile Nav** — full-width dropdown hidden by default, shown when `.open`
- **Hero** — full-viewport-height section with radial gradient background, centered content, hero search bar with two fields and submit button
- **Stats Bar** — 4-column grid of stat items with top border
- **Categories Grid** — responsive `auto-fill` grid with `minmax(200px, 1fr)` columns
- **Steps Grid** — 3-column layout for "How It Works" section
- **Jobs Layout** — CSS grid with 280px fixed sidebar + flexible main area; on mobile sidebar collapses
- **Detail Layout** — 2-column (3fr / 1fr) grid on desktop, single column on mobile
- **Apply Layout** — centered single card, max-width 640px
- **Footer** — 4-column brand + link columns grid, bottom bar with copyright and social links
- **Section utilities** — `.section`, `.section-header`, `.container` (max-width 1280px, centered)

---

### 5.5 `animations.css` — Motion & Transitions

| Class / Keyframe | Description |
|---|---|
| `@keyframes fadeUp` | Slides element from `translateY(20px) opacity(0)` to natural position |
| `@keyframes fadeIn` | Simple opacity 0→1 |
| `@keyframes shimmer` | Sliding gradient for skeleton loaders |
| `@keyframes pulse` | Subtle scale pulse for loading indicators |
| `.anim-fade-up` | Applies `fadeUp` 0.5s ease, `fill: both` |
| `.delay-1` through `.delay-6` | Staggered delays: 0.1s, 0.2s, 0.3s, 0.4s, 0.5s, 0.6s |
| `.gradient-text` | Indigo-to-purple gradient applied to text (hero headline) |
| `.chip-enter` | Entry animation for filter chips when added |
| `.removing` | Exit animation for toast before DOM removal |
| `[data-theme]` transition | All CSS custom property changes animate at 220ms |

---

## 6. Feature Deep-Dives

### 6.1 Search & Filtering System

**How it works end-to-end:**

1. User types in search box → 300ms debounce fires → `Filters.set('search', value)` → `renderJobs()`
2. `renderJobs()` calls `Filters.apply(JOBS_DATA)` which chains:
   - Text search (title, company, category, skills, location, excerpt)
   - Category filter (`===` match)
   - Type filter (`===` match)
   - Remote filter (`===` match)
   - Level filter (`===` match)
   - Salary range filter (`salary.min <= salaryMax && salary.max >= salaryMin`)
   - Sort (date, salary, or relevance)
3. `Filters.paginate(filtered)` slices the result to `perPage: 12` for the current `page`
4. `Filters.toURL()` writes the new state to the URL bar (no navigation, just `history.replaceState`)
5. Results grid and pagination are re-rendered, active filter chips are updated

**Clearing filters:**
- Clicking × on a chip → sets that single filter key to empty, re-renders
- "Clear all" button → `Filters.clear()` resets all state, re-renders

**URL deep-linking example:**
```
/jobs.html?category=Engineering&remote=remote&level=senior&sort=salary-high&page=2
```
This URL fully restores the exact filter state when shared or bookmarked.

---

### 6.2 Save Jobs (Bookmarks)

- Each job card has a bookmark icon button (`Render.toggleSave`)
- Clicking it: calls `Storage.toggleSaveJob(id)`, updates the button icon (outline → filled), shows a toast
- State is stored in `localStorage` as a JSON array of job ID strings
- Saved status is checked on every card render — saved cards show a filled bookmark icon
- The "Applied" badge is similarly checked and shown on cards where an application exists

---

### 6.3 Job Application Flow

```
jobs.html (Browse) 
    → job-detail.html?id=X (Read details, decide to apply)
        → apply.html?id=X (4-step form)
            → Success State (in-page, form replaced)
```

After submission:
- `Storage.saveApplication(jobId, formData)` saves to `localStorage`
- Job cards on all pages show a `✓ Applied` green badge
- The Apply button on the detail page changes to `✓ Applied` (non-clickable)

---

### 6.4 Dark / Light Theme

- Default theme is **dark** (`data-theme="dark"` on `<html>`)
- Theme is stored in `localStorage` via `Storage.getTheme()` / `Storage.setTheme()`
- On page load, `UI.initTheme()` reads the saved value and applies it before any render
- The toggle button in the header switches between sun icon (dark mode) and moon icon (light mode)
- All colors are CSS custom properties — switching `data-theme` instantly repaints the entire UI
- Light mode overrides are defined in `[data-theme="light"]` in `variables.css`

---

### 6.5 Toast Notification System

Toasts are dynamically created and appended to a `#toast-container` div (auto-created if missing).

**Four types with distinct colors and icons:**
- `success` — green checkmark
- `error` — red X
- `info` — blue info circle
- `warning` — amber triangle

**Lifecycle:**
1. Toast element appended to container → slides in via CSS animation
2. After `duration` ms (default 3500ms) → `removing` class added → fade-out animation plays
3. After 280ms → element removed from DOM
4. User can dismiss early via the × close button

---

### 6.6 Skeleton Loading States

On the homepage's Featured Jobs section, before real data loads:
1. `UI.renderSkeletons(container, 6)` fills the grid with 6 animated skeleton cards
2. Each skeleton card mimics the shape of a real job card (avatar placeholder, text bars, badge bars)
3. A CSS `shimmer` gradient animation sweeps left-to-right giving a "loading" feel
4. After 400ms (`setTimeout`), real job cards replace the skeletons

This prevents layout shift and provides visual feedback during the brief async delay.

---

### 6.7 URL State Management

The jobs page uses `history.replaceState()` to keep the URL in sync with filter state without any page reload. This enables:

- **Browser back/forward** — navigation history still works
- **Bookmarking** — users can save a filtered view
- **Sharing** — paste the URL and get the same filtered results
- **Deep linking** — popular tag links on homepage pre-filter the jobs page

URL params supported:

| Param | Type | Example |
|---|---|---|
| `q` | string | `?q=react` |
| `category` | string | `?category=Engineering` |
| `type` | string | `?type=full-time` |
| `remote` | string | `?remote=remote` |
| `level` | string | `?level=senior` |
| `sort` | string | `?sort=salary-high` |
| `page` | number | `?page=3` |
| `salMin` | number | `?salMin=100000` |
| `salMax` | number | `?salMax=200000` |

---

### 6.8 Pagination

- **12 jobs per page** (configurable via `Filters.state.perPage`)
- Renders: Prev button, up to 5 page numbers (with `…` ellipsis for gaps), Next button
- Active page highlighted with accent color
- Prev/Next disabled when at first/last page
- Clicking any page: calls `Filters.set('page', n)`, `Filters.toURL()`, `renderJobs()`, `UI.scrollToTop()`

---

### 6.9 Animated Stats Counter

On the homepage stats bar, each number (37, 28, 10, 95) animates from 0 up using:
- `IntersectionObserver` — starts only when the element enters the viewport (30% threshold)
- **Cubic ease-out** easing: `ease = 1 - (1 - progress)³` — starts fast, decelerates to final value
- `requestAnimationFrame` loop over 1800ms duration
- `toLocaleString()` for formatted numbers, `data-suffix` attribute for `%` suffix
- Fires only once per page load (observer unsubscribes after trigger)

---

### 6.10 Share Job Link

On the job detail page, a "Copy Link" button uses the **Clipboard API**:
```javascript
navigator.clipboard.writeText(location.href).then(() => {
  UI.showToast('Link copied!', 'Job link copied to clipboard.', 'success');
});
```

The URL is already a stable deep-link (e.g., `/job-detail.html?id=job-001`), so the shared link opens the exact same job.

---

### 6.11 Similar Jobs Sidebar

On the detail page, `getSimilarJobs(jobId)` finds up to 3 other jobs in the same category (excluding the current job). These are displayed as compact `miniJobCard` rows with a company avatar, title, salary, and arrow icon. Each links to that job's detail page.

If no similar jobs exist, the entire sidebar card is hidden via `display: none`.

---

### 6.12 Responsive & Mobile Navigation

**Breakpoints** (defined in `layout.css`):
- Desktop: `> 1024px` — full sidebar + main grid layout
- Tablet: `768px–1024px` — narrower sidebar, adjusted font sizes
- Mobile: `< 768px` — single column layout, hidden sidebar, hamburger menu

**Mobile-specific behaviors:**
- Header nav links hidden, replaced by hamburger button
- Tapping hamburger adds `.open` class to `#mobile-nav` → slides down below header
- On the jobs page, "Filters" button shown above the grid → clicking toggles sidebar visibility
- All grids collapse to single column
- Hero search bar stacks fields vertically

---

## 7. Data Schema

Each job in `JOBS_DATA` follows this structure:

```javascript
{
  id: "job-001",                  // Unique string ID
  title: "Senior Frontend Engineer",
  company: {
    name: "Stripe",
    color: "#635BFF",             // Brand color for avatar background
    initials: "ST",               // 1-2 char initials for avatar
    size: "1,000–5,000",          // Employee count range
    industry: "Fintech",
    website: "stripe.com",        // Used for external link (no https://)
    description: "..."            // Company overview blurb
  },
  location: "San Francisco, CA",
  remote: "hybrid",               // "remote" | "hybrid" | "onsite"
  type: "full-time",              // "full-time" | "part-time" | "contract" | "internship" | "freelance"
  level: "senior",                // "entry" | "mid" | "senior" | "lead" | "executive"
  category: "Engineering",        // One of the 10 CATEGORIES
  salary: { min: 160000, max: 220000 },
  posted: "2026-06-28",           // ISO date string
  featured: true,                 // Shows on homepage + gets ⭐ badge
  excerpt: "...",                 // 1–2 sentence card summary
  description: "...",             // Full overview paragraph
  responsibilities: [...],        // Array of strings
  requirements: [...],            // Array of strings
  nice_to_have: [...],            // Array of strings
  skills: [...],                  // Array of skill strings (top 4 shown on card)
  benefits: [...],                // Array of benefit strings
  screening_questions: [          // Dynamically rendered on apply.html
    {
      id: "q1",
      question: "...",
      type: "textarea"            // "textarea" | "select"
    },
    {
      id: "q2",
      question: "...",
      type: "select",
      options: ["1-2 years", "3-4 years", "5+ years"]
    }
  ]
}
```

---

## 8. CI/CD Pipeline

**File:** [`.github/workflows/ci-cd.yml`](file:///d:/Job%20Board/.github/workflows/ci-cd.yml)

**Trigger:** On every `push` to `main` and every `pull_request` targeting `main`.

### Job 1 — Lint & Validate (all events)

| Step | Tool | What it checks |
|---|---|---|
| Validate HTML | `html-validate` | Valid HTML5, attribute quoting, semantic structure |
| Lint CSS | `stylelint` | Valid properties, no duplicate selectors, no invalid hex |
| Lint JS | `eslint` | No undefined variables, no unreachable code, semicolons, `eqeqeq` |
| Broken links | bash grep | Every `href="*.html"` in HTML files exists as an actual file |

### Job 2 — Preview Deploy (PRs only)

Deploys to a unique Vercel preview URL. Posts the URL as a comment on the PR.

```
vercel pull --environment=preview
vercel build
vercel deploy --prebuilt
→ posts comment with preview URL to the PR
```

### Job 3 — Production Deploy (push to main only, after Job 1 passes)

```
vercel pull --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
→ updates https://hirex-job-board.vercel.app
```

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel team/organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

---

## 9. Deployment

### Vercel (Production)

- **URL:** [https://hirex-job-board.vercel.app](https://hirex-job-board.vercel.app)
- **Config:** [`vercel.json`](file:///d:/Job%20Board/vercel.json)
- **Framework:** Static (no build step)

**Routes configured in `vercel.json`:**

| Pattern | Destination |
|---|---|
| `/` | `/index.html` |
| `/jobs` | `/jobs.html` |
| `/job-detail` | `/job-detail.html` |
| `/apply` | `/apply.html` |
| `/saved-jobs` | `/saved-jobs.html` |
| `/*` (catchall) | File system, then 404.html |

**Security headers applied to all routes:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Cache headers for assets:**
- `/css/*` and `/js/*` — `Cache-Control: public, max-age=31536000, immutable` (1 year)

### Local Development

```bash
# Python (no install needed)
cd "d:\Job Board"
python -m http.server 8000
# → http://localhost:8000
```

---

## 10. Security & Performance

### Security

- No back-end, no user authentication, no sensitive data transmitted
- All data is read-only mock data bundled in `jobs-data.js`
- Form submissions save only to `localStorage` (client-side only)
- External links use `rel="noopener"` to prevent tab-napping
- Security headers set via `vercel.json` on the CDN layer
- No inline event handlers except where required by the dynamic render pattern (`onclick` in template literals)

### Performance

- **Zero runtime dependencies** — no React, Vue, jQuery, or any CDN libraries to load
- **CSS custom properties** — theme switching is instant (no JS class toggling)
- **Lazy rendering** — skeleton loaders prevent layout shift; real data renders after a brief microtask
- **Debounced search** — 300ms debounce prevents excessive re-renders during typing
- **IntersectionObserver** — stats counter only animates when in viewport (no wasted animation)
- **Passive scroll listeners** — `{ passive: true }` on all scroll event listeners for smooth performance
- **Asset caching** — JS/CSS assets cached for 1 year on Vercel's edge network
- **Image-free design** — company avatars are CSS-rendered colored circles with text initials, eliminating all image HTTP requests
- **SVG icons** — all icons are inline SVGs (no icon font or sprite sheet HTTP request)
- **`font-display: swap`** — Google Fonts Inter loaded with swap to avoid invisible text during font load
