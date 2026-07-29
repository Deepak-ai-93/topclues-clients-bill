# Topclues Doctor Hub - Design System & Aesthetics Guide

## Design Philosophy

The design system for **Topclues Doctor Hub** focuses on **clarity, precision, and radical simplicity**. Since the portal handles clinic growth analytics, content approvals, and financial records for healthcare professionals, the UI prioritizes readability and zero visual clutter.

---

## 1. Color Palette

### Primary Theme: High-Contrast Monochrome

| Token | HEX / Value | Usage |
| font | `var(--font-sans)` | Main body and heading typography |
| `--bg-main` | `#FFFFFF` | Primary background across all pages |
| `--bg-subtle` | `#F9FAFB` / `bg-neutral-50` | Card backgrounds, stat blocks, inputs |
| `--text-main` | `#000000` / `#0A0A0A` | Primary headings, prominent body text |
| `--text-muted` | `#525252` / `text-neutral-600` | Secondary descriptions, subtext |
| `--border-accent` | `#000000` | High-contrast borders, active states, keyframes |
| `--border-subtle` | `rgba(0,0,0,0.1)` | Divider lines, grid borders |

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
