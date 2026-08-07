# Topclues Doctor Hub - Design System & Aesthetics Guide

## Design Philosophy

The design system for **Topclues Doctor Hub** focuses on **clarity, precision, and radical simplicity**. Since the portal handles clinic growth analytics, content approvals, and financial records for healthcare professionals, the UI prioritizes readability and zero visual clutter.

---

## 1. Color Palette

### Primary Theme: Blue & Green on White

| Token | HEX / Value | Usage |
| font | `var(--font-sans)` | Main body and heading typography |
| `--bg-main` | `#FFFFFF` | Primary background across all pages |
| `--bg-subtle` | `#F9FAFB` / `bg-neutral-50` | Card backgrounds, stat blocks, inputs |
| `--text-main` | `#000000` / `#0A0A0A` | Primary headings, prominent body text |
| `--text-muted` | `#525252` / `text-neutral-600` | Secondary descriptions, subtext |
| `--color-primary` | `#356CB0` (`primary-500`) | CTAs, links, active states, borders, highlights |
| `--color-accent` | `#3A9B47` (`accent-500`) | Success/positive indicators, growth metrics, verified badges |

### Brand Scale (Tailwind v4 tokens in `app/globals.css`)

| Step | Primary (blue) | Accent (green) |
|---|---|---|
| 50  | `#eef3fa` | `#eef8f0` |
| 100 | `#d9e6f5` | `#d5efd9` |
| 200 | `#b5cdeb` | `#aadfb3` |
| 300 | `#8cb0de` | `#79cb87` |
| 400 | `#5e8dcd` | `#55b565` |
| 500 | `#356cb0` | `#3a9b47` |
| 600 | `#2b5a94` | `#2f7f3b` |
| 700 | `#234a7c` | `#276631` |
| 800 | `#1d3e66` | `#205228` |
| 900 | `#182f4f` | `#1a4221` |

### Usage Rules

- **Primary buttons / CTAs:** `bg-primary text-white hover:bg-primary-700 border border-primary` (use shared `Button` primitive, `variant="primary"`)
- **Secondary buttons:** `bg-white text-black hover:bg-neutral-100 border border-primary` (shared `Button`, `variant="secondary"`)
- **Calm portal cards (dashboards, admin):** `bg-white border border-neutral-200 rounded-2xl shadow-card` (shared `Card` primitive / `StatCard`) — hover lifts to `shadow-raised`
- **Editorial marketing cards (landing page):** `border border-primary rounded-xl bg-white hover:shadow-raised` — the landing keeps the strong editorial identity
- **Featured / highlighted cards:** `border-2 border-primary bg-primary text-white` (packages, welcome bars)
- **Active sidebar item:** calm pill — `bg-primary-50 text-primary-700 font-semibold` + left accent bar (`w-0.5 bg-primary`) instead of solid blue block
- **Status pills:** shared `Badge` primitive — `primary` / `accent` / `amber` / `rose` / `neutral` variants; success `accent` uses `bg-accent-50 text-accent-700 border-accent-200`
- **Empty states:** shared `EmptyState` primitive — dashed border, inviting copy ("No content queued right now") with an action link
- **Links & hover:** `hover:text-primary`, `hover:bg-primary`
- **Status colors:** amber = attention, red = overdue/failed, grey = inactive (unchanged)
- **Modal scrims** stay dark (`bg-black/40`–`/60`)
- **Body text** stays near-black (`neutral-900`) for readability; keep `font-mono` labels at `neutral-500`+ for contrast

### Motion & Elevation Tokens (`app/globals.css`)

- Shadows: `shadow-card` (default card), `shadow-raised` (hover lift), `shadow-overlay` (modals), `shadow-primary` (primary CTAs)
- Radius scale: `--radius-sm/md/lg/xl/2xl` (cards use `rounded-2xl`)
- Motion: `animate-fade-up` / `animate-fade-in` / `animate-pulse-line` (ECG trace) / `animate-blink` (live dots); scroll reveals use `motion` `whileInView` with `ease: [0.16, 1, 0.3, 1]` and `viewport: { once: true }`
- **Reduced motion:** `MotionConfig reducedMotion="user"` on the landing page + global CSS `prefers-reduced-motion` kill-switch
- **Focus:** global `:focus-visible` outline in `primary-500` — do not remove

---

## 2. Typography

- **Primary Font**: `Inter`, sans-serif
- **Monospace Font**: `JetBrains Mono` / `ui-monospace` (used for code badges, status tags, module IDs, step numbers)

### Type Scale
- **Display Hero**: `text-5xl` to `text-8xl`, `tracking-tighter`, `font-bold`
- **Section Headings**: `text-3xl` to `text-5xl`, `tracking-tight`, `font-bold`
- **Subheadings / Cards**: `text-xl`, `font-bold`, `tracking-tight`
- **Body Text**: `text-sm` to `text-base`, `text-neutral-600`, `leading-relaxed`
- **Badges & Labels**: `text-xs`, `font-mono`, `uppercase`, `tracking-widest`

---

## 3. UI Component Patterns

### Borders & Frames
- **Primary Cards**: `border border-black p-8`
- **Highlight / Featured Cards**: `border-2 border-black bg-black text-white`
- **Badges**: `border border-black px-3 py-1 text-xs font-mono uppercase`

### Buttons & Interactive Elements
- **Primary CTA**: Solid Black background, White text (`bg-black text-white hover:bg-neutral-800 border border-black`)
- **Secondary CTA**: White background, Black text (`bg-white text-black hover:bg-neutral-100 border border-black`)
- **Action Links**: `hover:underline underline-offset-4 decoration-2`

### Micro-Animations
- Framer Motion / Motion `motion.div` for subtle fade-and-slide entrances on page load.
- Smooth hover scaling for arrow icons (`group-hover:translate-x-1 transition-transform`).

---

## 4. Responsive Layout Standards
- **Container Max Width**: `max-w-6xl mx-auto px-6`
- **Header Height**: `h-20` fixed top header with backdrop blur (`bg-white/90 backdrop-blur-md`)
- **Grid Systems**: 1-column on mobile (`grid-cols-1`), 2 to 4 columns on desktop (`md:grid-cols-3`, `md:grid-cols-4`).
