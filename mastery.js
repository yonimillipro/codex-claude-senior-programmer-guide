(() => {
  const playbooks = {
    astra: {
      name: "ChatGPT Astra",
      model: "GPT-6 Astra · gpt-6-astra",
      color: "var(--blue)",
      summary: "Give the hardest problem a clear destination.",
      bestFor: "Complex work across code, apps, and research that needs sustained judgment.",
      effort: "Start with Light (low in CLI). Increase effort when deeper analysis helps. Max adds single-task depth; Ultra fits substantial independent workstreams where supported.",
      tips: [
        ["Lead with the outcome", "Supply the result, sources, constraints, and acceptance criteria. Let Astra choose the steps unless a process is essential."],
        ["Keep context useful", "Point to relevant documents and tools. Keep AGENTS.md and skills concise, current, and specific to the work."],
        ["Give it room to act", "Remove old instructions that force every file read or repeated check. Specify required release gates without prescribing unnecessary rituals."],
        ["Bring in the real environment", "For repository work, open the project in Codex. For work across sources and apps, connect the necessary tools in Work."],
      ],
      avoid: "More instructions and maximum effort do not automatically produce a better result. Tune the brief and evaluate the output before adding scaffolding.",
      source: "https://learn.chatgpt.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra",
      sourceName: "Official Astra prompting guidance",
      steer: "Choose an approach suited to this task. If a design decision affects the result, explain the tradeoff briefly and recommend one approach.",
      exercise: "Design and implement an invitation flow with expiring tokens, duplicate-request behavior, and a working UI. Supply the existing API contract and compare the final behavior with your acceptance criteria.",
    },
    sol: {
      name: "ChatGPT Sol mode",
      model: "GPT-6 Sol · gpt-6-sol / GPT-6.1 Sol · gpt-6.1-sol",
      color: "var(--cyan)",
      summary: "Make everyday engineering repeatable.",
      bestFor: "Repeated work across code, apps, and documents. GPT-6.1 Sol offers near-Astra capability at a lower cost where available.",
      effort: "Start at your client’s default effort. Use a faster setting for focused changes and a deeper setting when the problem has unresolved tradeoffs.",
      tips: [
        ["Name the exact Sol version", "Record the model shown in the picker. GPT-6 Sol and GPT-6.1 Sol are separate versions; availability varies."],
        ["Scope one useful result", "For a developer task, specify the desired behavior, relevant paths, constraints, and a way to check success."],
        ["Use concrete failure evidence", "Give exact reproduction steps, observed versus expected behavior, and relevant errors. Avoid a broad ‘fix everything’ request."],
        ["Refine the same task", "Add corrections and missing context through follow-up messages. Reuse the prompt once it produces reliable results."],
      ],
      avoid: "Escalate effort or model because a measured result is inadequate, rather than because the first answer is short. Check the behavior you asked for.",
      source: "https://learn.chatgpt.com/docs/prompting",
      sourceName: "Official ChatGPT and Codex prompting guidance",
      steer: "Keep this change focused on the requested behavior. Follow the existing project conventions and report the affected files and relevant command results.",
      exercise: "Fix a settings toggle that reports success but resets after refresh. Give the reproduction, relevant component and API paths, and the expected persisted state.",
    },
    fable: {
      name: "Claude Fable 5",
      model: "Exact requested model · claude-fable-5",
      color: "var(--violet)",
      summary: "Turn a long, difficult task into evidenced progress.",
      bestFor: "Hard, ambiguous work that spans many steps or long sessions, including complex implementation and investigation.",
      effort: "High is the usual starting point; try xhigh for demanding work and medium or low for routine tasks. Fable 5 uses adaptive thinking, not manual thinking budgets.",
      tips: [
        ["Explain why the work matters", "Provide the larger objective and intended user so Fable can make informed decisions across the task."],
        ["Anchor progress to evidence", "Require status claims to reference actual tool results. Use checkpoints against the specification during extended runs."],
        ["Support a long run", "In an API or agent harness, allow sufficient time, stream responses, and retain task state. Specify where durable lessons belong."],
        ["State the boundaries", "Define what may be changed and when input is required. Delegate independent work only when your environment supports it and the task warrants it."],
      ],
      avoid: "Request concise conclusions and evidence rather than a transcript of private reasoning. Tighten scope if a narrow task turns into unrequested refactoring.",
      source: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5",
      sourceName: "Official Fable 5 prompting guide",
      steer: "Report progress using completed actions and tool evidence. Preserve the accepted requirements across checkpoints and record unresolved decisions in the task notes.",
      exercise: "Migrate one legacy service behind its existing API contract. Supply behavior fixtures, migration constraints, and a checkpoint record; verify each completed milestone before proceeding to the next.",
    },
    opus: {
      name: "Claude Opus 5",
      model: "Exact requested model · claude-opus-5",
      color: "var(--mint)",
      summary: "Hand over the complete specification, then calibrate scope.",
      bestFor: "Difficult features, multi-file refactors, reviews, and complex agent work.",
      effort: "Begin at high and compare lower effort on your own tasks. Use xhigh when demanding work needs it. Keep thinking enabled and reduce effort to manage cost.",
      tips: [
        ["Provide the whole specification", "Include the desired behavior and constraints up front, then allow Opus to complete the work."],
        ["Set output length separately", "Effort controls thinking, not response length. Ask for a concise explanation and specify the size of written deliverables."],
        ["Constrain task scope", "Say what the change includes. Remove redundant ‘double-check everything’ instructions that can cause excess verification."],
        ["Calibrate review and delegation", "Ask for supported findings before filtering by severity. Reserve subagents for sizeable independent tracks and cap their number when cost matters."],
      ],
      avoid: "Repeated self-check instructions can multiply work. Ask for a brief explanation of the result, rather than disclosure of internal reasoning.",
      source: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5",
      sourceName: "Official Opus 5 prompting guide",
      steer: "Complete the requested scope and keep the final report concise. Make routine implementation choices yourself, and raise only decisions that materially affect the requested result.",
      exercise: "Review a multi-file change to session expiry. Supply the complete diff, expected behavior, and call sites. Triage the supported findings after the review instead of hiding lower-severity bugs up front.",
    },
  };

  const scenarios = {
    build: {
      label: "Build a feature",
      prompt: `Implement [feature] for [user and problem].

Repository and stack: [paths, framework, language, runtime].
Relevant specification: [file or attached document].
Required behavior: [inputs, outputs, loading/error/success states].
Acceptance criteria: [observable outcomes and relevant project checks].
Constraints: [public contracts, design rules, files in scope].
Authorized actions: [local edits / commands / commits / deployment].

Deliver the working change and a concise handoff with changed files, actual results, and any unresolved requirement.`,
    },
    debug: {
      label: "Debug a failure",
      prompt: `Resolve [specific defect] in [component or service].

Environment: [OS, browser, runtime, branch, affected account type].
Reproduction: [steps, inputs, exact observed failure].
Expected behavior: [correct result].
Evidence: [log, stack trace, screenshot, failed command].
Constraints: [compatibility and scope boundaries].
Authorized actions: [local edits and relevant execution].

Find the cause and deliver a focused correction. Explain what the evidence establishes, how the behavior changed, and what remains unverified.`,
    },
    review: {
      label: "Review a change",
      prompt: `Review [branch or complete diff] against [base and specification].

Relevant context: [architecture, contracts, callers, deployment environment].
Focus: [correctness, state, data integrity, access control, accessibility].
Deliver supported findings with file and location, impact, evidence, and a practical correction. Distinguish observed defects from concerns that need investigation.

First pass is assessment only. Keep files unchanged. Include findings across severity levels, then order them by impact so I can triage.`,
    },
  };

  const panel = document.querySelector("#mastery-panel");
  const tabs = [...document.querySelectorAll("[data-mastery]")];
  let selected = "astra";
  let scenario = "build";

  function currentPrompt() {
    return `${scenarios[scenario].prompt}\n\nWorking preference for ${playbooks[selected].name}:\n${playbooks[selected].steer}`;
  }

  function render() {
    const book = playbooks[selected];
    panel.style.setProperty("--mastery-accent", book.color);
    panel.setAttribute("aria-labelledby", `mastery-tab-${selected}`);
    panel.innerHTML = `
      <div class="mastery-title"><div><span class="mastery-eyebrow">${book.model}</span><h3>${book.name}</h3><p>${book.summary}</p></div><span class="mastery-chip">Developer playbook</span></div>
      <dl class="mastery-settings"><div><dt>Best fit</dt><dd>${book.bestFor}</dd></div><div><dt>Effort &amp; controls</dt><dd>${book.effort}</dd></div></dl>
      <div class="mastery-tips">${book.tips.map(([title, body], index) => `<section><span class="mastery-number">0${index + 1}</span><h4>${title}</h4><p>${body}</p></section>`).join("")}</div>
      <p class="mastery-note"><strong>Calibration tip:</strong> ${book.avoid}</p>
      <a class="mastery-source" href="${book.source}" target="_blank" rel="noreferrer">${book.sourceName} ↗</a>
      <div class="mastery-prompt"><div class="mastery-prompt-heading"><div><h4>Make it practical</h4><p>Choose a task, replace the brackets, then paste into your selected model. These are editable examples, not automatic model calls.</p></div><div><label for="mastery-scenario">Prompt scenario</label><select id="mastery-scenario">${Object.entries(scenarios).map(([key, value]) => `<option value="${key}"${key === scenario ? " selected" : ""}>${value.label}</option>`).join("")}</select></div></div>
      <pre><code id="mastery-prompt-text"></code></pre>
      <div class="mastery-copy-row"><button type="button" class="button button-small" id="mastery-copy">Copy prompt</button><span id="mastery-copy-status" role="status" aria-live="polite"></span></div></div>
      <details class="mastery-exercise"><summary>Try a real developer exercise</summary><p>${book.exercise}</p></details>`;
    panel.querySelector("#mastery-prompt-text").textContent = currentPrompt();
    panel.querySelector("#mastery-scenario").addEventListener("change", (event) => {
      scenario = event.target.value;
      panel.querySelector("#mastery-prompt-text").textContent = currentPrompt();
      panel.querySelector("#mastery-copy-status").textContent = "";
      panel.querySelector("#mastery-copy").textContent = "Copy prompt";
    });
    panel.querySelector("#mastery-copy").addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const status = panel.querySelector("#mastery-copy-status");
      try {
        await navigator.clipboard.writeText(currentPrompt());
        button.textContent = "Copied";
        status.textContent = `${book.name} ${scenarios[scenario].label.toLowerCase()} prompt copied.`;
      } catch {
        button.textContent = "Copy prompt";
        status.textContent = "Clipboard unavailable. Select the prompt text above and copy it manually.";
      }
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selected = tab.dataset.mastery;
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      render();
    });
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].click();
      tabs[next].focus();
    });
  });
  render();
})();
