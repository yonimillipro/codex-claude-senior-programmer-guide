# Codex + Claude Senior Programmer Guide

An interactive learning resource and companion PowerPoint for senior developers using Codex, Claude Code, ChatGPT/OpenAI models, and Claude models in one evidence-driven engineering workflow.

Website Version 4, updated November 27, 2026. The core model catalog was checked
November 20. The downloadable PowerPoint is the October Version 2 edition.

[Build with free AI](https://codex-claude-senior-programmer-guid.vercel.app/#free-ai)
shows how to plan, implement, verify, release and maintain a first product using
ChatGPT Free, available Codex desktop access, Claude Free web chat and local
development tools. It includes product examples, three reusable prompts and a
checkpoint for continuing when an AI allowance runs out.

[Gemini design workflow](https://codex-claude-senior-programmer-guid.vercel.app/#gemini-workflow) includes a copyable design brief and the [Version 4 PDF](presentation/Codex-and-Claude-Code-Senior-Programmer-Guide-Version-4.pdf).

## Current models and practical engineering

The model explorer covers GPT-6.2 Sol and Astra, GPT-6.1 Terra, Luna, Claude
Fable 5.2, Opus 5.5, Sonnet 5.5 and Haiku 5.5. Restricted Mythos access is
labelled separately. Choose by measured task results, access, latency, cost and
risk; the guide's role assignments are recommendations, not model limitations.

`mastery.js` provides four current playbooks with build/debug/review examples,
effort guidance, exercises and primary sources. New senior-practice sections
cover shared instructions, isolated parallel work, durable checkpoints, API
migration pitfalls, task evaluations and release evidence. Three copyable handoff
contracts make the Claude review / Codex implementation workflow concrete.

AI foundations explain models versus products versus agents, tokens/context,
retrieval, tools/MCP/skills, effort and verification. Safety guidance covers
untrusted content, permissions, secrets, data retention and bounded AI features.
The source register records the review date and maintenance checklist; this is
a dated editorial guide, not a live model availability feed.

Production: https://codex-claude-senior-programmer-guid.vercel.app/#mastery

The blue PowerPoint contains 58 editable slides from October. It covers roles,
workflow and verification, but has not received this November model update.

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

## Free guide helper

The fixed **Ask AI** pill now opens a clearly labelled **Guide helper**, not a
live chatbot. It searches 27 prepared answers about roles, the workflow,
prompting, debugging, review, verification, repository guidance, parallel work,
model playbooks, the PowerPoint, themes, animation, costs and privacy. Native
disclosures expand each answer and link to its guide section or deck download.

Search is immediate, local, case-insensitive and IME-safe, with common keyword
aliases, a clear button and an honest no-results state. All 27 answers are
browsable without a query. The question and current results stay in page memory,
not local storage, URLs, analytics or a database. The helper makes **no calls to
`/api/chat` or an AI provider**, including connection/readiness checks. It needs
no API key, Redis account, ChatGPT Plus subscription or AI API credit.

For an open-ended question, **Ask in ChatGPT** prepares a reviewable prompt with
the question, up to three relevant guide answers, source links and the guide's
content date. Visitors explicitly choose **Copy prompt**, then **Open ChatGPT**
in a new tab and paste/send it themselves. The plain `https://chatgpt.com/` link
contains no question or context, uses `noopener noreferrer`, and sends no referrer.
Visitors use their own ChatGPT access and limits; no account sharing or sign-in
integration is implemented. Clipboard denial shows a selectable manual-copy
fallback. Changing the question clears the old prompt; stale clipboard feedback
cannot overwrite a newer state. No HTML is interpreted from user text.

`chat.js` owns the existing accessible, non-modal panel and `chat.css` preserves
its reference pill, themes, mobile bounds, reduced motion and focus handling.
`guide-help-data.js` owns prepared content, deterministic search and prompt
assembly. This deliberately replaces the former live-chat UI; paid generation
remains disabled (`CHAT_ENABLED=false`). The existing API code is retained only
as an optional future backend, with no frontend path to it.

<details>
<summary>Optional future paid backend — not used by the free helper</summary>

`api/chat.js` is a Vercel Node.js Function; `server/` contains private server
code. It uses the OpenAI Responses API through AI SDK 7 and `@ai-sdk/openai`.
The default model is `gpt-6-luna`, verified against the
[official model documentation](https://developers.openai.com/api/docs/models/gpt-6-luna)
on October 21, 2026. It uses no reasoning for this short-answer use case. If you
change models, verify support for that setting and account access first.

The assistant gets a curated reference for this guide in `server/guide-context.js`.
It has **no browsing, code execution, file access, or account tools**. Guide
model information is explicitly treated as a dated snapshot, not live knowledge.
Responses are rendered as text/code, never HTML.

### Connect the owner's API privately

The chat ships **disabled** until configured. Never paste API keys into chat,
public source, browser scripts or public-prefixed environment variables. Follow
[OpenAI's server-side authentication guidance](https://developers.openai.com/api/reference/overview).

In the existing Vercel project's **Settings → Environment Variables**, set:

| Variable | Value / purpose |
| --- | --- |
| `OPENAI_API_KEY` | Owner's OpenAI project API key, stored as a Secret |
| `UPSTASH_REDIS_REST_URL` | HTTPS REST endpoint for the owner's Redis database |
| `UPSTASH_REDIS_REST_TOKEN` | Redis write-capable token, stored as a Secret |
| `CHAT_DAILY_REQUEST_LIMIT` | Owner-approved whole-site daily request allowance (1–10,000) |
| `CHAT_IP_HOURLY_LIMIT` | Per-address hourly allowance; default 20, maximum 100 |
| `CHAT_MODEL` | Optional model override; default `gpt-6-luna` |
| `CHAT_ENABLED` | Set `true` only after credentials, allowance and provider spend controls are ready |

Choose Production scope for production credentials and separate Development
values for local work. Redeploy after changing variables. No secret values are
returned by `GET /api/chat`, which exposes only `{ ready: boolean }`.

Shared Redis quotas are required, not an in-memory limiter that resets on cold
starts. One atomic Lua operation reserves both per-address hourly and whole-site
daily quotas. The daily window resets at midnight **Africa/Nairobi**. Only
short-lived counters and an HMAC of the network address are stored, not messages
or raw addresses. Provider failures still consume an allowance slot; automatic
provider retries are disabled. Redis failure disables generation rather than
bypassing limits. Configure a non-evicting, persistent database and monitor it.

Request quotas are **not a guaranteed dollar budget**. Choose the allowance with
current model prices and configure provider-side spend controls. No paid service,
API key or billing budget is provisioned automatically by this project.

### Recommended small-site launch settings

Start with `CHAT_DAILY_REQUEST_LIMIT=100` for the whole site and
`CHAT_IP_HOURLY_LIMIT=10` per network address. This is a conservative starting
recommendation, not a universal website standard. Visitors behind the same
network share the hourly allowance. Adjust only after reviewing real usage.
The daily quota can be exhausted by abusive traffic: it bounds exposure but
is not authentication or bot verification. Add a managed challenge or sign-in
before raising limits for a larger public audience.

For an initial API trial, consider $5 of prepaid credit with auto-reload **off**,
and review provider usage each day. This is a starting balance, not $5 per day
or an instantaneous hard cutoff: billing processing can lag. See
[OpenAI's prepaid billing guide](https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing).
ChatGPT subscription billing is distinct from API usage. Eligible Pro and
Business plans may claim API credits under the current
[credit terms](https://developers.openai.com/api/docs/guides/chatgpt-api-credits);
do not assume Plus includes credits or that any subscription supplies unlimited API usage.

Activation checklist (the owner completes private account steps):

1. Create a dedicated OpenAI project and its server API key in the API platform.
   Review billing, model access, budget alerts and available spend controls.
2. Create an Upstash Redis database; review its plan, storage/command limits and
   billing before accepting. Copy its REST URL and write-capable REST token.
3. Add `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, and
   `UPSTASH_REDIS_REST_TOKEN` to Vercel's Production environment. Mark both tokens
   Sensitive. Do not paste them into a conversation or GitHub.
4. Set the two request allowances above. Keep `CHAT_ENABLED=false` until all
   credentials and billing controls have been reviewed.
5. Set `CHAT_ENABLED=true`, redeploy Production, and send one short test question.
   This test incurs API usage. Confirm the answer and provider usage record.
6. If replies fail, check the credential names, model access, Redis connectivity,
   and billing in the private dashboards. To disable chat, set
   `CHAT_ENABLED=false` and redeploy; revoke the key if compromise is suspected.

Requests validate their origin, message roles, number of turns and body size.
Questions are limited to 2,000 characters, history to 9 messages / 9,000 characters,
and output to 600 tokens. The model and tools cannot be chosen by visitors.
Upstream requests time out and stop on client cancellation. `store: false` avoids
OpenAI response-state storage; it is **not** a claim that the provider retains no
data. Any future paid frontend must disclose that messages go to the provider.

An alternative is [Vercel AI Gateway with OIDC](https://vercel.com/docs/ai-gateway/authentication-and-byok),
which can avoid manually managing an OpenAI key. That is **not enabled in this
implementation** and needs a deliberate provider/auth/budget configuration;
the website cannot share an owner's ChatGPT login with visitors. Enabling this
backend alone does not convert the free helper into a live chatbot; a deliberate
frontend integration and new verification would also be needed.

</details>

## Install as a web app

Open the [live guide](https://codex-claude-senior-programmer-guid.vercel.app/) online
and choose **Install app** near the title. The in-page install button appears when
the browser offers it; **How to install on your device** lists the browser-menu
alternatives. On iPhone or iPad, open the link in Safari and choose
**Share → Add to Home Screen** (enable **Open as Web App** if offered).

Wait for **Saved for offline reading** before disconnecting. The entire guide,
model playbooks, prompt library, local FAQ helper, illustrations, animation assets,
and PowerPoint are saved together. Theme and checklist preferences keep their
existing browser-local behavior. External links and ChatGPT require a connection;
the optional AI endpoint is neither called by the helper nor cached.
Browsers can evict offline data, or remove it when the user clears site data.

`manifest.webmanifest` defines the standalone app, identity and scope, install
icons, desktop/mobile screenshots and three deep-link shortcuts. Shortcut and
screenshot support varies by browser. The generated `sw.js` precaches only
allowlisted public files and uses a content-derived release ID; it never stores
API requests or responses, external content or form inputs. A failed precache
leaves the previous release intact. A completed update waits until open guide
windows close, or until the reader chooses **Update and reload**. An uncached
navigation without a connection offers a link back to the saved guide.
Push notifications, background sync, and permissions are intentionally not used:
the guide has no background jobs or user data to sync.

## Run the landing page locally

Use Node.js 24 and pnpm (no environment variables are needed for the free helper):

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:4176. The prepared guide answers and PWA work without API setup.
`pnpm test` covers the free helper and the dormant backend; provider tests use the
SDK's mock model and fake Redis transport, making no paid AI calls.
`pnpm build` creates the allowlisted public site in `dist/`, excluding secrets,
server source, tests, dependencies and configuration. Vercel bundles the API
Function separately. `DESIGN.md` documents the existing tokens and chat behavior.

The static site and free helper can also be served without Node:

```powershell
python -m http.server 4173
```

Then visit http://localhost:4173.

The Python server supports the free helper, but not the optional AI endpoint.
Serve the generated `dist/` directory with it to test the PWA; the raw source root
does not contain the generated service worker.
Opening `index.html` directly provides the static guide; serve over HTTP for
JavaScript modules, the helper and animation. Offline use works after the page's
assets have loaded; there is no service worker or guarantee of an offline reload.

## GitHub Pages

The static page remains at the repository root and can be served by GitHub Pages,
but GitHub Pages cannot run `api/chat.js`. Vercel is the configured full deployment.

## Source freshness

Model names, availability, and retirement dates can change. Recheck the official OpenAI and Anthropic documentation before making long-lived production decisions.
