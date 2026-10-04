# Codex + Claude Senior Programmer Guide

An interactive learning resource and companion PowerPoint for senior developers using Codex, Claude Code, ChatGPT/OpenAI models, and Claude models in one evidence-driven engineering workflow.

Updated: October 2026.

## Repository contents

- `index.html` — standalone learning landing page
- `styles.css` — responsive light/dark visual system
- `app.js` — model explorer, workflow filters, prompt library, and verification interactions
- `favicon.svg` — site icon
- `presentation/` — the complete 46-slide PowerPoint guide

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
