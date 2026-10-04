const phases = [
  {
    number: 1,
    symbol: "REQ",
    title: "Define requirements",
    owner: "claude",
    ownerLabel: "Claude-led",
    summary: "Turn the product goal into explicit requirements, assumptions, and non-goals.",
    before: ["Capture the business objective", "Identify users and critical journeys", "Separate facts from assumptions"],
    during: ["Write functional and non-functional requirements", "Define security and accessibility expectations", "Record unresolved decisions"],
    after: ["Publish the PRD", "Confirm measurable acceptance criteria", "List explicit non-goals"],
    evidence: "PRD, user journeys, assumptions log, non-goals",
  },
  {
    number: 2,
    symbol: "ARC",
    title: "Design architecture",
    owner: "claude",
    ownerLabel: "Claude-led",
    summary: "Design the architecture, data model, API boundaries, security, and testing strategy.",
    before: ["Read the approved requirements", "Map platform and deployment constraints", "Identify sensitive data and trust boundaries"],
    during: ["Design components and data flow", "Define database and API contracts", "Plan auth, rollback, and test strategy"],
    after: ["Document trade-offs", "Mark open architecture decisions", "Produce an implementation sequence"],
    evidence: "Architecture, database, API, security, and testing documents",
  },
  {
    number: 3,
    symbol: "VAL",
    title: "Validate feasibility",
    owner: "codex",
    ownerLabel: "Codex-led",
    summary: "Check the proposed design against the actual stack, dependencies, and delivery constraints.",
    before: ["Read every approved contract", "Inspect framework and dependency versions", "Locate current scripts and build paths"],
    during: ["Check implementation complexity", "Identify migration and deployment risks", "Find missing acceptance criteria"],
    after: ["Report feasible areas and blockers", "Recommend the safest implementation order", "Request contract corrections"],
    evidence: "Feasibility report tied to repository evidence",
  },
  {
    number: 4,
    symbol: "A",
    title: "Approve the contract",
    owner: "human",
    ownerLabel: "Human gate",
    summary: "Resolve assumptions and approve architecture, scope, and sensitive decisions before code.",
    before: ["Review risks and alternatives", "Confirm product priorities", "Compare Claude and Codex findings"],
    during: ["Resolve disagreements", "Approve data and authorization design", "Choose the first deployable slice"],
    after: ["Record the decision", "Freeze the contract for the slice", "Authorize implementation scope"],
    evidence: "Approved contract, decision log, implementation order",
  },
  {
    number: 5,
    symbol: "MAP",
    title: "Investigate repository",
    owner: "claude",
    ownerLabel: "Claude-led",
    summary: "Trace the real codebase in read-only mode and define a testable feature specification.",
    before: ["Start with the approved scope", "Identify likely entry points", "Keep the first pass read-only"],
    during: ["Map routes, auth, data access, state, and tests", "Cite relevant files and execution paths", "Separate evidence from hypotheses"],
    after: ["Write the repository map", "Define UI, data, error, and auth states", "Finalize the vertical-slice specification"],
    evidence: "Repository map, current-state report, feature specification",
  },
  {
    number: 6,
    symbol: "</>",
    title: "Implement one vertical slice",
    owner: "codex",
    ownerLabel: "Codex-led",
    summary: "Deliver a working end-to-end slice that proves the approved approach.",
    before: ["Read AGENTS.md and approved specifications", "Inspect reusable code and list affected files", "Identify security, migration, and integration risks"],
    during: ["Follow approved API and database contracts", "Build loading, empty, error, and success states", "Keep changes small, typed, accessible, and focused"],
    after: ["Run typecheck, lint, tests, and build", "Test actual runtime behavior", "Review the final diff and report unresolved risks"],
    evidence: "Changed files, command results, runtime proof, final diff",
  },
  {
    number: 7,
    symbol: "CHK",
    title: "Self-verify the slice",
    owner: "codex",
    ownerLabel: "Codex-led",
    summary: "Challenge the implementation before asking another agent to review it.",
    before: ["Re-read acceptance criteria", "List high-risk behavior", "Check for unrelated changes"],
    during: ["Probe invalid input, authorization, and race conditions", "Review responsive and accessibility states", "Inspect tests for behavioral coverage"],
    after: ["Fix confirmed issues only", "Rerun every affected check", "Prepare a concise evidence handoff"],
    evidence: "Passing checks, runtime notes, diff review, risk list",
  },
  {
    number: 8,
    symbol: "REV",
    title: "Review independently",
    owner: "claude",
    ownerLabel: "Claude-led",
    summary: "Review the requirements, contracts, diff, and evidence without trusting the implementer’s reasoning.",
    before: ["Open a separate review worktree", "Read approved requirements and contracts", "Keep the first pass report-only"],
    during: ["Check architecture, auth, data, state, and tests", "Require exact file evidence", "Distinguish confirmed, unverified, and not tested"],
    after: ["Rank findings by severity", "Give the smallest safe correction", "Request runtime evidence where needed"],
    evidence: "Independent findings with severity, evidence, consequence, and confidence",
  },
  {
    number: 9,
    symbol: "B",
    title: "Triage findings",
    owner: "human",
    ownerLabel: "Human gate",
    summary: "Treat reviewer findings as evidence to assess, not automatic instructions to change code.",
    before: ["Read every finding and its evidence", "Identify disputed or sensitive items", "Check product and release context"],
    during: ["Classify must-fix, defer, false positive, or reproduce", "Approve sensitive architecture changes", "Set remediation order"],
    after: ["Record decisions", "Authorize only confirmed fixes", "Preserve deferred risk visibility"],
    evidence: "Finding disposition and approved remediation list",
  },
  {
    number: 10,
    symbol: "FIX",
    title: "Remediate confirmed issues",
    owner: "codex",
    ownerLabel: "Codex-led",
    summary: "Apply only approved corrections and prove they resolve the identified behavior.",
    before: ["Read the approved finding list", "Reproduce each confirmed defect", "Choose the smallest safe change"],
    during: ["Correct the root cause", "Add regression coverage", "Avoid opportunistic refactoring"],
    after: ["Rerun affected checks", "Update runtime evidence", "Review the complete diff again"],
    evidence: "Reproduction, focused fix, regression test, rerun results",
  },
  {
    number: 11,
    symbol: "PR",
    title: "Prepare and review the PR",
    owner: "codex",
    ownerLabel: "Codex-led",
    summary: "Connect the approved specification to the final diff, command evidence, and rollback plan.",
    before: ["Confirm the branch contains only intended work", "Collect screenshots and command output", "Describe data, API, and security impact"],
    during: ["Open a clear draft pull request", "Link the feature specification and review report", "Ask Claude for a final PR review"],
    after: ["Resolve blocking findings", "List verified and unverified requirements", "Provide a release recommendation"],
    evidence: "Draft PR, screenshots, exact command results, final review",
  },
  {
    number: 12,
    symbol: "C",
    title: "Release intentionally",
    owner: "human",
    ownerLabel: "Human gate",
    summary: "Verify the product, read the diff, approve risk, and control merge and deployment.",
    before: ["Review the complete diff", "Confirm blocking findings are resolved", "Check rollback readiness"],
    during: ["Verify product behavior", "Approve migration and release timing", "Merge through the protected path"],
    after: ["Monitor the release", "Capture follow-up work", "Own the production outcome"],
    evidence: "Human approval, release record, rollback and monitoring evidence",
  },
];

const prompts = {
  architecture: `Act as the solution architect for this project.

Do not write application code.

Create:
1. Product requirements and user journeys
2. Architecture and data-flow proposal
3. Database and API contracts
4. Authentication and authorization design
5. Security risks and mitigations
6. Testing and deployment strategy
7. A phased implementation plan
8. Explicit assumptions and non-goals

Separate verified requirements from assumptions.
Record unresolved decisions clearly.`,
  implementation: `Act as the implementation lead.

Read the approved requirements, architecture, API contract,
database design, and feature specification.

Objective:
Implement one independently deployable vertical slice.

Before editing:
1. Inspect the relevant implementation.
2. Explain current behavior.
3. List affected files and implementation order.
4. Identify security, data, and migration risks.

Constraints:
- Follow existing architecture and conventions.
- Use strict typing and validate external input.
- Include loading, empty, error, and success states.
- Preserve accessibility and responsive behavior.
- Avoid unrelated refactoring and package changes.

After implementation:
Run typecheck, lint, relevant tests, production build,
runtime verification, and a final diff review.
Report exact evidence and unresolved risks.`,
  review: `Act as an independent senior reviewer.

Review the feature branch against the base branch.
Read the approved requirements, architecture, contracts,
complete diff, test evidence, and runtime evidence.

Check:
- requirement and non-goal coverage
- architecture and API consistency
- authentication and authorization
- database integrity and input validation
- race conditions and state behavior
- accessibility and responsive behavior
- test quality and backward compatibility

For every finding include severity, file, exact evidence,
consequence, reproduction method, smallest safe correction,
and confidence level.

First pass: report only. Do not modify files.
Distinguish verified, failed, not tested, and insufficient data.`,
  debugging: `Investigate this defect using evidence.

Observed behavior:
[Describe exact symptom and environment]

Expected behavior:
[Describe the correct result]

Required process:
1. Reproduce the failure.
2. Capture console, network, logs, and account context.
3. Trace the execution path from entry point to failure.
4. Identify the first point actual behavior diverges.
5. Separate confirmed evidence from hypotheses.
6. Apply the smallest safe correction.
7. Add a regression test where practical.
8. Rerun relevant checks and verify runtime behavior.

Report: symptom → reproduction → evidence → root cause →
fix → verification → remaining uncertainty.`,
};

const modelViews = {
  openai: {
    title: "OpenAI’s current developer family",
    summary: "Start with GPT-6.1 Sol, escalate to Astra when ambiguity or risk is high, and route bounded volume to Luna.",
    command: "codex --model gpt-6.1-sol",
    models: [
      {
        name: "GPT-6 Astra",
        role: "Highest capability",
        description: "For demanding, ambiguous reasoning, difficult coding, architecture, and high-risk final review.",
        use: "Use when the cost of a wrong answer exceeds the cost of a deeper run.",
      },
      {
        name: "GPT-6.1 Sol",
        role: "Developer default",
        description: "Near-Astra capability at lower cost for repository implementation, long-running agent work, and verification.",
        use: "Use for most serious feature, refactor, migration, and debugging tasks.",
      },
      {
        name: "GPT-6 Luna",
        role: "Fast + efficient",
        description: "For focused edits, repeatable automation, extraction, triage, and latency-sensitive product experiences.",
        use: "Use only after the task is bounded and the acceptance test is clear.",
      },
    ],
    foot: "Shared developer capabilities include large context, structured outputs, tool use, computer/file workflows, persisted reasoning, compaction, and reasoning controls. Check the exact model page before relying on a feature.",
  },
  claude: {
    title: "Claude’s current developer family",
    summary: "Use Sonnet 5.5 for daily coding, Opus 5.5 for the hardest general work, and Fable 5.1 only when access and evaluations justify it.",
    command: "claude --model sonnet",
    models: [
      {
        name: "Claude Sonnet 5.5",
        role: "Daily default",
        description: "Strongest at well-scoped everyday work, bug fixing, and polished documents, slides, and spreadsheets.",
        use: "Use for normal Claude Code implementation, investigation, and review loops.",
      },
      {
        name: "Claude Opus 5.5",
        role: "Complex work",
        description: "Anthropic’s leading general model for difficult coding, architecture, deep analysis, and review.",
        use: "Escalate selectively when Sonnet cannot close the task with evidence.",
      },
      {
        name: "Claude Fable 5.1",
        role: "Frontier coding",
        description: "A frontier option for coding and knowledge work where account access enables it.",
        use: "Benchmark it against Opus on your own repository before making it the default.",
      },
      {
        name: "Claude Mythos 5.1",
        role: "Restricted research",
        description: "The same underlying model as Fable with different safeguards for trusted-access programs and Claude Security.",
        use: "It is not a general Claude Code default.",
      },
    ],
    foot: "Claude Code accepts model aliases such as sonnet, opus, haiku, and fable, plus full model IDs. Run Claude Code and Codex as separate sessions against the same repository; use one writer per worktree and keep the first review pass read-only.",
  },
};

const comparisonRows = [
  ["End-to-end repository change", "Codex + GPT-6.1 Sol", "Integrated execution, tests, runtime checks, and Git handoff"],
  ["Hard architecture or ambiguous failure", "Test Astra and Opus / Fable", "Domain-specific evaluation matters more than brand"],
  ["Focused bug fix", "Sol or Sonnet 5.5", "Reproduction quality and tool evidence decide the winner"],
  ["Independent code review", "Claude Sonnet 5.5", "Useful separation from a Codex implementation pass"],
  ["Cross-app or browser workflow", "Codex", "Computer and browser integration favor the Codex surface"],
  ["High-volume automation", "GPT-6 Luna", "Optimize for cost, latency, retry rate, and intervention"],
  ["Deepest final review", "Astra + Opus 5.5", "Dual review makes disagreement visible before release"],
];

function modelCards(models) {
  return models
    .map(
      (model) => `
        <article class="model-card">
          <div><span>${model.role}</span><h4>${model.name}</h4></div>
          <p>${model.description}</p>
          <small>${model.use}</small>
        </article>`,
    )
    .join("");
}

function renderModelView(name) {
  const panel = document.querySelector("#model-panel");
  if (!panel) return;

  if (name === "compare") {
    panel.innerHTML = `
      <div class="model-panel-header">
        <div><h3>Which is better for a developer?</h3><p>There is no universal winner. Match the product surface and model to the job, then verify with your own tasks.</p></div>
        <code>quality × latency × cost × retries</code>
      </div>
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead><tr><th>Developer job</th><th>Better default</th><th>Decision reason</th></tr></thead>
          <tbody>${comparisonRows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
      <p class="model-foot"><strong>Recommended stack:</strong> Codex with GPT-6.1 Sol for implementation, Claude Sonnet 5.5 for an independent read-only review, and a human owner for scope, secrets, merge, deployment, and rollback.</p>`;
    return;
  }

  const view = modelViews[name];
  panel.innerHTML = `
    <div class="model-panel-header">
      <div><h3>${view.title}</h3><p>${view.summary}</p></div>
      <code>${view.command}</code>
    </div>
    <div class="model-card-row">${modelCards(view.models)}</div>
    <p class="model-foot">${view.foot}</p>`;
}

document.querySelectorAll(".model-tabs button").forEach((button, index, buttons) => {
  button.addEventListener("click", () => {
    buttons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });
    renderModelView(button.dataset.modelView);
  });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + buttons.length) % buttons.length;
    buttons[next].click();
    buttons[next].focus();
  });
});

const html = document.documentElement;
const phaseRail = document.querySelector("#phase-rail");
const phaseDetail = document.querySelector("#phase-detail");
const promptText = document.querySelector("#prompt-text");
const toast = document.querySelector("#toast");
let selectedPhase = 6;
let toastTimer;

function ownerColor(owner) {
  return `var(--${owner === "human" ? "mint" : owner === "claude" ? "violet" : "cyan"})`;
}

function renderPhaseRail() {
  phaseRail.innerHTML = phases
    .map(
      (phase) => `
        <button
          class="phase-card${phase.number === selectedPhase ? " is-selected" : ""}"
          type="button"
          role="listitem"
          data-phase="${phase.number}"
          data-owner="${phase.owner}"
          aria-pressed="${phase.number === selectedPhase}"
        >
          <span class="phase-number">${String(phase.number).padStart(2, "0")}</span>
          <span class="phase-symbol" aria-hidden="true">${phase.symbol}</span>
          <strong>${phase.title}</strong>
        </button>`,
    )
    .join("");

  phaseRail.querySelectorAll(".phase-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPhase = Number(button.dataset.phase);
      renderPhaseRail();
      applyPhaseFilter(document.querySelector(".filter-button.is-active")?.dataset.filter || "all");
      renderPhaseDetail();
    });
  });
}

function renderPhaseDetail() {
  const phase = phases.find((item) => item.number === selectedPhase);
  phaseDetail.style.setProperty("--owner-color", ownerColor(phase.owner));
  phaseDetail.innerHTML = `
    <div class="phase-detail-header">
      <div class="phase-detail-title">
        <span class="phase-symbol" aria-hidden="true">${phase.symbol}</span>
        <div>
          <h3>Phase ${phase.number} — ${phase.title}</h3>
          <p>${phase.summary}</p>
        </div>
      </div>
      <span class="owner-badge">${phase.ownerLabel}</span>
    </div>
    <div class="phase-detail-grid">
      ${[
        ["Before", phase.before],
        ["During", phase.during],
        ["After", phase.after],
      ]
        .map(
          ([label, items]) => `
            <section class="detail-column">
              <h4>${label}</h4>
              <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
            </section>`,
        )
        .join("")}
    </div>
    <div class="evidence-line"><strong>Required evidence:</strong> ${phase.evidence}</div>`;
}

function applyPhaseFilter(filter) {
  phaseRail.querySelectorAll(".phase-card").forEach((card) => {
    card.classList.toggle("is-muted", filter !== "all" && card.dataset.owner !== filter);
  });
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    applyPhaseFilter(button.dataset.filter);
  });
});

function setPrompt(name) {
  promptText.textContent = prompts[name];
  document.querySelectorAll(".prompt-tabs button").forEach((button) => {
    const isActive = button.dataset.prompt === name;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
}

document.querySelectorAll(".prompt-tabs button").forEach((button, index, buttons) => {
  button.addEventListener("click", () => setPrompt(button.dataset.prompt));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + buttons.length) % buttons.length;
    buttons[next].focus();
    setPrompt(buttons[next].dataset.prompt);
  });
});

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

async function copyCurrentPrompt() {
  const value = promptText.textContent;
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  const label = document.querySelector("#copy-prompt span");
  label.textContent = "Copied";
  showToast("Prompt copied to your clipboard.");
  window.setTimeout(() => (label.textContent = "Copy prompt"), 1600);
}

document.querySelector("#copy-prompt").addEventListener("click", copyCurrentPrompt);

const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const themeStatus = document.querySelector("#theme-status");
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeQuery = window.matchMedia("(prefers-color-scheme: light)");
const themeModes = ["system", "light", "dark"];

function resolveTheme(mode) {
  return mode === "system" ? (themeQuery.matches ? "light" : "dark") : mode;
}

function applyThemeMode(mode, { persist = true, announce = false } = {}) {
  const safeMode = themeModes.includes(mode) ? mode : "system";
  const resolved = resolveTheme(safeMode);
  const nextMode = themeModes[(themeModes.indexOf(safeMode) + 1) % themeModes.length];
  const label = safeMode[0].toUpperCase() + safeMode.slice(1);
  const nextLabel = nextMode[0].toUpperCase() + nextMode.slice(1);

  html.dataset.themeMode = safeMode;
  html.dataset.theme = resolved;
  themeLabel.textContent = label;
  themeStatus.textContent = safeMode === "system" ? `Theme follows your system setting and is currently ${resolved}.` : `${label} theme selected.`;
  themeToggle.setAttribute("aria-label", `Theme: ${label}. Activate to switch to ${nextLabel} theme.`);
  themeToggle.title = `Theme: ${label}`;
  themeColor.content = resolved === "light" ? "#ffffff" : "#07111f";

  if (persist) {
    localStorage.setItem("workflow-theme-mode", safeMode);
    localStorage.removeItem("workflow-theme");
  }
  if (announce) showToast(`${label} theme selected.`);
}

themeToggle.addEventListener("click", () => {
  const current = themeModes.includes(html.dataset.themeMode) ? html.dataset.themeMode : "system";
  const next = themeModes[(themeModes.indexOf(current) + 1) % themeModes.length];
  applyThemeMode(next, { announce: true });
});

themeQuery.addEventListener?.("change", () => {
  if (html.dataset.themeMode === "system") applyThemeMode("system", { persist: false });
});

const savedThemeMode = localStorage.getItem("workflow-theme-mode") || localStorage.getItem("workflow-theme") || "system";
applyThemeMode(savedThemeMode, { persist: false });

const checkboxes = [...document.querySelectorAll(".check-grid input")];
const savedChecks = JSON.parse(localStorage.getItem("workflow-checks") || "[]");
checkboxes.forEach((checkbox, index) => {
  checkbox.checked = Boolean(savedChecks[index]);
  checkbox.addEventListener("change", () => {
    localStorage.setItem("workflow-checks", JSON.stringify(checkboxes.map((item) => item.checked)));
  });
});

document.querySelector("#reset-checks").addEventListener("click", () => {
  checkboxes.forEach((checkbox) => (checkbox.checked = false));
  localStorage.removeItem("workflow-checks");
  showToast("Verification checklist reset.");
});

const menuButton = document.querySelector("#menu-button");
const mainNav = document.querySelector("#main-nav");
const menuLabel = document.querySelector("#menu-label");

function setMenuState(isOpen) {
  mainNav.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuLabel.textContent = isOpen ? "Close navigation" : "Open navigation";
}

menuButton.addEventListener("click", () => {
  setMenuState(!mainNav.classList.contains("is-open"));
});
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
    setMenuState(false);
    menuButton.focus();
  }
});

window.matchMedia("(min-width: 1181px)").addEventListener?.("change", (event) => {
  if (event.matches) setMenuState(false);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const navLinks = [...mainNav.querySelectorAll("a")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    navLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${active.target.id}`));
  },
  { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.2, 0.5] },
);
document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

function updateReadingProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.querySelector("#reading-progress").style.width = `${Math.min(100, Math.max(0, progress))}%`;
}
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);

renderPhaseRail();
renderPhaseDetail();
renderModelView("openai");
setPrompt("implementation");
updateReadingProgress();
