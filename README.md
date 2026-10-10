# Codex + Claude Senior Programmer Guide

An interactive learning resource and companion PowerPoint for senior developers using Codex, Claude Code, ChatGPT/OpenAI models, and Claude models in one evidence-driven engineering workflow.

Version 2 — updated October 10, 2026.

## Version 2 model mastery

The landing page includes an interactive developer playbook for ChatGPT Astra,
ChatGPT Sol mode (with exact Sol version guidance), Claude Fable 5, and Claude
Opus 5. Each playbook includes model-specific tips, effort guidance, an exercise,
official source links, and copyable build/debug/review prompt examples.

`mastery.js` powers the playbooks; `mastery.css` provides responsive styling in
both light and dark themes. The Claude playbooks intentionally cover the exact
Fable 5 and Opus 5 versions requested, separately from the newer model catalog.

Production: https://codex-claude-senior-programmer-guid.vercel.app/#mastery

The matching blue PowerPoint now contains 58 editable slides. The Version 2
addition covers platform/model controls, exact versus newer versions, four
model playbooks, three developer prompt scenarios, and a practice/evaluation
loop. Relevant slide notes contain official sources and full prompt examples.
The current Claude catalog also includes Haiku 5.5, released October 7, 2026,
with its official overview linked on the page.

[Download the Version 2 PowerPoint](presentation/Codex-and-Claude-Senior-Programmer-Guide-Updated-2026-10.pptx)

## Repository contents

- `index.html` — standalone learning landing page
- `styles.css` — responsive light/dark visual system
- `app.js` — model explorer, workflow filters, prompt library, and verification interactions
- `favicon.svg` — site icon
- `presentation/` — the complete 58-slide Version 2 PowerPoint guide
- `mastery.js` and `mastery.css` — interactive, responsive model playbooks
- `motion.js`, `motion.css`, and `collaboration-scene.js` — GSAP + Three.js hero animation
- `vendor/` — pinned, self-hosted GSAP 3.15.0 and Three.js 0.186.1 with license notices

## Collaboration animation

The hero visual brings the operating model to life: violet Claude and cyan Codex
orbit ribbons around a faceted shared core, with a mint human approval checkpoint.
GSAP drives packet movement and subtle pointer parallax; Three.js renders the scene.
The existing role labels, typography, and light/dark theme stay intact.

Use **Pause animation** to stop motion, or **Resume animation** to restart it.
System reduced-motion preferences display a still scene. Animation pauses offscreen
and in hidden tabs, caps pixel density, and uses fewer ribbon strands and particles
on phones. A static SVG remains visible when WebGL or JavaScript is unavailable.

The animation requires HTTP serving because it uses JavaScript modules. Opening
`index.html` directly still provides the learning page and static hero fallback.
There is no runtime CDN dependency, texture download, or build step.

## What the guide covers

- Current OpenAI and Claude model families and developer-oriented routing
- Choosing models by task, latency, cost, risk, and evaluation evidence
- Claude Code and Codex responsibilities inside the same repository
- A 12-phase senior development workflow
- Prompting playbooks for architecture, implementation, debugging, and review
- Worktree and file-ownership safety
- Web, mobile, and desktop verification checklists
- Human approval, merge, deployment, and rollback gates

## Run the landing page locally

No installation or build step is required. Open `index.html` directly, or serve the folder:

```powershell
python -m http.server 4173
```

Then visit http://localhost:4173.

## GitHub Pages

The website is intentionally stored at the repository root so it can be published from the `main` branch with GitHub Pages without a build process.

## Source freshness

Model names, availability, and retirement dates can change. Recheck the official OpenAI and Anthropic documentation before making long-lived production decisions.
