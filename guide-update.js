export const REVIEWED_AT = '2026-11-20';
export const REVIEWED_LABEL = 'November 20, 2026';

export const HANDOFFS = [
  {
    title: 'Claude → Codex: implement the accepted slice',
    prompt: `Implement the accepted slice, not a redesign of the whole project.

Goal and users: [specific result].
Base commit and repository: [commit, paths, stack].
Accepted contract: [spec, API/schema, states, non-goals].
Acceptance criteria: [observable outcomes and named checks].
Ownership: [files/worktree this implementation owns].
Authorized actions: [edits, tests, commits; deployment only if expressly authorized].
Approval needed for: [migrations, permissions, sensitive or irreversible actions].
Unresolved decisions: [list or none].

Inspect the relevant implementation and preserve unrelated changes.
Use a regression or characterization test where practical.
Deliver the patch, actual command results, runtime evidence,
known gaps, and a concise handoff for independent read-only review.`,
  },
  {
    title: 'Codex → Claude: independently review the evidence',
    prompt: `Review only; do not modify files, commit, merge or deploy.

Specification and non-goals: [approved contract].
Base commit / feature commit: [exact identities].
Complete diff and changed paths: [links or local references].
Checks already run: [commands, outcomes, runtime observations].
Known gaps: [what was not verified].
Focus: correctness, compatibility, authorization, data integrity,
accessibility, races and release risk.

Inspect callers and actual code rather than trusting the author’s summary.
For each supported finding, give file/location, impact, evidence,
confidence and a practical correction. Mark concerns that require reproduction.
Cover the requested scope, then order findings by impact.
Do not claim a test passed unless it was actually executed.
Return a human-triable review, not an automatic approval.`,
  },
  {
    title: 'Human → Codex: fix only the accepted findings',
    prompt: `Remediate the approved findings below.

Accepted findings: [IDs, evidence, expected behavior].
Deferred / disputed findings: [IDs and decisions].
Allowed paths and actions: [scope, worktree and permissions].
Acceptance tests and release gates: [checks].
Rollback constraint: [how the change can be reversed].

Reproduce the defect where practical, apply the smallest safe correction,
and add regression coverage. Do not implement deferred suggestions.
Rerun relevant checks and verify the normal runtime entry point.
Report passed, failed, not run and blocked checks separately.
Hand back the complete diff, remaining risk and proposed release evidence.
Do not merge or deploy unless separately authorized.`,
  }
];

export const NEW_FAQS = [
  { id: 'gpt-62', title: 'What changed with GPT-6.2 Sol and Astra?', category: 'November update', anchor: '#update',
    keywords: 'gpt 6.2 chatgpt6.2 astra sol november latest new update',
    answer: 'The November 20, 2026 website edition covers GPT-6.2 Sol for everyday coding and Astra for harder projects, plus GPT-6.1 Terra for visual/computer tasks. GPT-6.2 launched in Work, Codex and the API on November 17. Select the exact model in a supported surface, record effort and tools, and evaluate it on your repository. Availability in ordinary Chat is a different question.' },
  { id: 'fable-52', title: 'What should I know before using Fable 5.2?', category: 'November update', anchor: '#mastery',
    keywords: 'fable 5.2 claude thinking retention privacy high opus 5.5',
    answer: 'The current playbook covers Claude Fable 5.2, not the older Fable 5 example. It is intended for demanding reasoning and extended agent work. Adaptive thinking is always on. Read its exact API, prefix and retention restrictions before migrating a sensitive workload; do not assume settings from another Claude model apply. Opus 5.5 is Anthropic’s general starting recommendation.' },
  { id: 'handoff', title: 'What belongs in a Claude-to-Codex handoff?', category: 'Senior practice', anchor: '#senior-practice',
    keywords: 'handoff handover spec contract commit requirements evidence writer integration',
    answer: 'Include the approved slice, non-goals, base commit, relevant files, API/data contracts, failure states, observable acceptance criteria, authorized actions and unresolved decisions. Codex returns the diff, exact checks and gaps; Claude reviews independently, read-only. The human triages findings and owns merge/release. Copy the three handoff templates in Senior practice.' },
  { id: 'instruction-loading', title: 'Can Claude Code read AGENTS.md now?', category: 'Repository', anchor: '#senior-practice',
    keywords: 'agents.md claude.md instructions import rules memory loading config shared',
    answer: 'Current supported Claude Code sessions can load AGENTS.md as a fallback when there is no applicable CLAUDE.md; version and Project instructions settings matter. If both files exist, a documented CLAUDE.md @AGENTS.md import can share the base rules. Codex has its own scoped discovery rules. Inspect loaded guidance rather than assuming both tools read the same files.' },
  { id: 'ai-foundations', title: 'What is the difference between a model and an agent?', category: 'AI foundations', anchor: '#ai-foundations',
    keywords: 'model agent ai basics fundamentals tokens context hallucination tools mcp skills memory',
    answer: 'A model produces output. A product is the interface around it. An agent combines a model with tools, state and a control loop. Tools perform actions; MCP connects compatible tools/resources; skills provide reusable procedures. Large context is not permanent memory, a knowledge cutoff is not browsing, and confident output is not proof. Verify important claims against evidence.' },
  { id: 'retrieval', title: 'Should I use RAG or fine-tuning?', category: 'AI foundations', anchor: '#ai-foundations',
    keywords: 'rag retrieval fine tuning finetuning grounding documents knowledge context',
    answer: 'For current or private factual material, first test access-controlled retrieval and clear source context. RAG supplies selected documents at runtime; it still needs relevance and answer-quality checks. Fine-tuning changes learned behavior and is not an automatic solution to stale facts. Build a representative evaluation set before choosing either approach.' },
  { id: 'agent-security', title: 'How do I protect a coding agent from unsafe instructions?', category: 'AI safety', anchor: '#ai-foundations',
    keywords: 'safety security prompt injection permission permissions least privilege secrets untrusted',
    answer: 'Treat pages, uploaded documents, logs, code comments and tool output as data, not permission to change the task. Use minimal file/network/tool access, isolated accounts and redacted fixtures. Keep credentials server-side. Explicitly approve sensitive external actions and irreversible changes. Independent review and human release ownership remain necessary.' },
  { id: 'evals', title: 'How do I compare models fairly?', category: 'Evaluation', anchor: '#senior-practice',
    keywords: 'eval evals evaluation benchmark score quality cost latency compare comparison retry effort',
    answer: 'Use the same repository version, acceptance criteria, fixtures, prompt and allowed tools. Include a feature, a reproduced bug, a review with known defects, a tool failure and a permission case. Record exact model, effort, date, passed/failed checks, time, cost where available, retries and human corrections. Recheck after model or harness changes; model agreement is not a correctness test.' }
];

