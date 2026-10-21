---
version: alpha
name: Senior Developer Workflow Guide
description: An engineering field guide with a free prepared-answer helper and explicit ChatGPT handoff.
colors:
  primary: "#3b82f6"
  background: "#07111f"
  surface: "#0c1b31"
  text: "#f8fafc"
  muted: "#aebbd0"
  cyan: "#22d3ee"
  violet: "#9b6dfb"
  success: "#46d89a"
  danger: "#fb7185"
  launcherBackground: "#f4f4f4"
  launcherText: "#0b1323"
typography:
  sans:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
  mono:
    fontFamily: "Cascadia Code, SFMono-Regular, Consolas, monospace"
rounded:
  DEFAULT: "10px"
  chat: "18px"
  pill: "999px"
spacing:
  page-max: "1480px"
  floating-inset: "24px"
  chat-width: "420px"
components:
  ask-ai-launcher: {}
  guide-chat: {}
---

## Overview

An engineering field manual for developers learning an evidence-driven Codex and
Claude workflow. The existing cyan/violet 3D collaboration scene remains the
signature. This is a content-site shell with a small product-style chat overlay,
not a redesign or a new multi-screen application. English is the current UI
language; no market-specific legal or identity flows are introduced.

Token ownership is Model B: `styles.css` is canonical for the existing theme,
font, border, radius and shadow variables. This file records the observed system.
`chat.css` consumes those variables and owns only chat geometry, launcher and
overlay/scrollbar tokens. There is no token generator or parallel theme provider.

## Colors

Dark and light themes retain the semantic roles in `styles.css`. Light mode uses
background `#ffffff`, text `#0b1323`, muted `#526177`, blue `#2563eb`, cyan `#0891b2`,
violet `#7c3aed`, mint `#059669`, and error `#e11d48`. Chat surfaces use `--bg`,
`--bg-elevated`, `--surface-strong`, `--line` and `--line-strong` in both themes.
The launcher deliberately stays a light pill with dark text in both themes,
matching the user's supplied reference; `--chat-launch-background` and
`--chat-launch-text` are its single runtime owner.

## Typography

Preserve the existing sans/mono stacks through `--font-sans` and `--font-mono`.
The composer uses 16px text to avoid focus zoom on mobile. The panel uses 14px
body text, a 20px title and a restrained mono caption; code is a real `<pre><code>`.

## Layout

Do not change the guide's sections, navigation or hero for chat. A fixed bottom-right
launcher opens a 420px non-modal panel above it. At narrow widths the panel fits
the viewport minus 24–32px, respects safe areas and the visual viewport, and keeps
the composer reachable above the keyboard. Only the helper's answer/prompt body scrolls;
the page's document scroll remains available. No body scroll locking.
The free-answer variant raises the maximum panel height to 700px (still bounded
by the visual viewport) and uses a compact welcome so answers remain visible
above the question field. This is an approved behavior replacement, not a rebrand.

## Elevation & Depth

Use the existing `--shadow`, tonal surfaces and hairline borders. Chat layer
`--z-chat: 110` is above the existing sticky header (80) and reading progress
(100), below `--z-toast: 120`. Existing toast placement is raised to avoid the
launcher and moves above the panel while chat is open. No duplicate toast system.

## Shapes

Preserve the guide's 10px component radius. The panel uses an 18px radius (14px
on phones) and the reference launcher is a pill. This is an explicit component
variant, not a change to all buttons or cards.

## Components

- Canonical chat owner: `chat.js` + `chat.css` and the `ask-ai-*` markup in `index.html`.
- Fields: native labelled textarea; no custom select/date primitives are introduced.
- Free-helper states: all prepared answers, local filtered results, no matches,
  expanded FAQ, prompt review, copying, copied, and clipboard-denied/manual copy.
  Search is IME-safe; clearing is immediate. The transient question is deliberately
  excluded from URL state and browser storage because it may contain sensitive text.
- Non-modal dialog: no backdrop, focus trap or inert page. Focus enters the composer;
  Escape and Close dismiss it and restore the launcher. Normal document Tab order
  remains available. Closing preserves the question only for this page's lifetime.
- Prepared content is explicitly labelled, never presented as live AI. Search does
  not call the backend or provider. The previous paid backend is dormant and disabled.
- Ask in ChatGPT prepares question + relevant guide context for review in the panel.
  Copy prompt is explicit. Clipboard denial exposes selectable text and a recovery
  hint. Open ChatGPT is a separate plain-link new-tab action, with no prompt in its
  URL and no referrer. Nothing is pasted or submitted automatically. External plan
  access/limits are the visitor's; the helper never promises unlimited free AI.
- Output uses text nodes and native details/summary, never interpreted user HTML.
  This bounded 16-answer collection intentionally renders all default results.
  Clipboard feedback is local, polite and guarded against stale completions.
- Native buttons define hover, active, visible focus and disabled states. Touch
  actions are at least 44px where practical. Reduced motion removes panel animation.
- Scrollbar ownership: `chat.css` supplies one document-wide baseline with inherited
  semantic thumb/track/hover/active colors and a forced-colors path.

## Do's and Don'ts

- Do preserve the field-guide palette and existing controls; let the provided pill
  reference define the launcher's silhouette.
- Do distinguish prepared guide answers from live AI. Keep external handoff explicit.
- Don't expose API keys, accept a browser-selected model, or enable paid public
  requests without configured credentials and distributed quotas.
- Don't claim a request-count quota is a guaranteed dollar spending cap.
