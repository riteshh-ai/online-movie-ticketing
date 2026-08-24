---
name: design-system-vfx-cinemas
description: "Implementation-ready design-system guidance for QFX Cinemas — tokens, component states, and accessibility rules. Use when creating or updating UI specs, component rules, or design-system docs."
---
<!-- E2F_MANAGED_START -->

# VFX Cinemas

## Mission

Deliver implementation-ready design-system guidance for QFX Cinemas that applies consistently across the web app.

## Brand

- Product / brand: QFX Cinemas
- URL: https://www.qfxcinemas.com/
- Audience: product users and operators
- Product surface: web app

## Style Foundations

- Visual style: dark, structured, tokenized, component-first
- Layout: `layout.mode=Stack`, `layout.contentWidth=1920px`, `layout.framing=Open`, `layout.grid=Subtle`, `layout.columns=5`
- Heading system: `font.family.heading=BwModelicaBold`, `font.size.heading=40px`, `font.weight.heading=700`, `font.lineHeight.heading=1.4`, `font.letterSpacing.heading=0.013em`
- Body system: `font.family.body=BwModelicaRegular`, `font.size.body=13px`, `font.weight.body=600`, `font.lineHeight.body=1.2`, `font.letterSpacing.body=0.038em`
- Primary font: `font.family.primary=BwModelicaRegular`, `font.size.base=14px`, `font.weight.base=600`, `font.lineHeight.base=21px`
- Type scale: `font.size.xs=9px`, `font.size.sm=10px`, `font.size.md=11px`, `font.size.lg=12px`, `font.size.xl=13px`, `font.size.2xl=14px`, `font.size.3xl=16px`, `font.size.4xl=18px`
- Colour roles: `color.primary=#00AAD3`, `color.secondary=#259486`, `color.tertiary=#007AFF`, `color.neutral=#808080`
- Color palette: `color.text.primary=#FFFFFF`, `color.text.secondary=#EDF0F3`, `color.text.tertiary=#ACA8B7`, `color.text.inverse=#00AAD3`, `color.surface.base=#414042`, `color.surface.raised=#25AAD3`, `color.surface.strong=#259486`, `color.border.default=rgb(128, 128, 128)`
- Spacing scale: `space.1=0px`, `space.2=5px`, `space.3=8px`, `space.4=10px`, `space.5=12px`, `space.6=15px`, `space.7=18px`, `space.8=20px`
- Base unit: `space.base=4.9px` _(84% of spacing values are multiples)_
- Component spacing: `space.padding.base=10px`, `space.gap.base=20px`
- Radius / shadow / motion: `radius.xs=5px`, `radius.sm=7px`, `radius.md=10px`, `radius.lg=15px`, `radius.xl=20px`, `radius.2xl=50px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`, `motion.duration.normal=250ms`, `motion.duration.slow=300ms`, `motion.duration.slower=500ms`
- Motion: `motion.level=Expressive`, `motion.easing.standard=ease`, `motion.easing.secondary=ease-in-out`, `motion.hover=Border, Background, Color, Text`, `motion.scroll=Swiper`, `motion.reducedMotion=honoured`

## Layout System

- Page layout: Stack — sections stack vertically in a single column.
- Content width: contained to `layout.contentWidth=1920px`; full-bleed sections must still align their inner content to that measure.
- Framing: Open — sections bleed to the viewport edge; do not frame page-level regions as cards.
- Grid strength: Subtle on a 5-column track — 30% of section children share two column edges.
- Base spacing unit: `space.base=4.9px`; every spacing value must be a multiple.
- Breakpoints: 100, 320, 350, 400, 480, 481, 576, 600, 601, 700, 720, 750, 760, 765, 767, 768, 800, 801, 820, 821, 850, 860, 900, 920, 990, 991, 992, 1000, 1021, 1024, 1090, 1099, 1199, 1200, 1201, 1242, 1250, 1255, 1281, 1300, 1349, 1350, 1400, 1500, 1501, 2049, 5464 (px).

## Accessibility

- Target: WCAG 2.2 AA.
- Keyboard-first interaction is required for every control.
- A visible focus indicator (focus-visible) is required and must not be removed.
- Text and essential UI must meet AA contrast minimums.
- Measured on this page: 149 text samples, 78 pass / 71 fail at AA.
- `prefers-reduced-motion` IS respected in the page CSS; keep that guarantee for any new motion.

## Writing Tone

Clear, confident, and implementation-focused.

## Rules: Do

- Reference semantic tokens, never raw hex or pixel values, in component guidance.
- Define every interactive state: default, hover, focus-visible, active, disabled, loading, and error.
- Specify responsive behaviour and edge cases for each component family.
- Document keyboard, pointer, and touch interaction for interactive components.
- Write accessibility acceptance criteria that are testable in implementation.

## Rules: Don't

- Don't ship low-contrast text or hidden focus indicators.
- Don't introduce one-off spacing, radius, or typography values outside the scale.
- Don't use ambiguous labels or non-descriptive actions.
- Don't document a component without explicit state coverage.

## Guideline Authoring Workflow

1. Restate the design intent in one sentence.
2. Define the foundations and semantic tokens in play.
3. Define component anatomy, variants, interactions, and state behaviour.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Note anti-patterns, migration notes, and edge cases.
6. Close with a QA checklist.

## Required Output Structure

- Context and goals.
- Design tokens and foundations.
- Component rules: anatomy, variants, states, responsive behaviour.
- Accessibility requirements with testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations

- Cover keyboard, pointer, and touch behaviour.
- State the spacing and typography tokens each component uses.
- Handle long content, overflow, and empty states.
- Detected component density on this page: buttons (33), links (21), inputs (1), headings (13).
- Motion level is Expressive; use `motion.easing.standard` with the `motion.duration.*` tokens for every state change.
- Hover changes Border, Background, Color, Text on this page; keep hover affordances in those channels rather than inventing new ones.
- `prefers-reduced-motion` is honoured in the page CSS; every new animation must ship a reduced-motion fallback.

## Quality Gates

- Every non-negotiable rule uses "must".
- Every recommendation uses "should".
- Every accessibility rule is testable in implementation.
- Prefer system consistency over one-off visual exceptions.

---

_Generated by [Export to Figma](https://www.exporttofigma.com)._

_Sampled 719 DOM nodes · 22 colours · 8 type sizes · 289 hover rules · 1 motion libraries._

<!-- E2F_MANAGED_END -->
