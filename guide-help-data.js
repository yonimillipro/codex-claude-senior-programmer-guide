// Prepared public guide content. Deterministic search, not AI inference.
export const GUIDE_URL = 'https://codex-claude-senior-programmer-guid.vercel.app/';
export const FAQS = [
  {
    id: 'roles', title: 'How do Codex and Claude Code work together?', category: 'Getting started', anchor: '#roles',
    keywords: 'roles responsibility responsibilities architect architecture implementation together collaboration human owner',
    answer: 'This guide assigns Claude Code architecture, investigation, planning and independent review; Codex implementation, testing and Git/PR preparation; and you requirements, sensitive decisions, merge and release. These are suggested roles, not limitations: either tool can plan, build and review. Hand off an approved specification and verification evidence rather than an unstructured conversation.'
  },
  {
    id: 'inside-codex', title: 'Can I use Claude Code inside Codex?', category: 'Tool setup', anchor: '#roles',
    keywords: 'claude codex inside install terminal separate tools setup',
    answer: 'Claude Code is a separate coding tool, not a built-in Claude model in Codex. Use the tools against the same Git repository with explicit handoffs. Let one investigate or review while the other owns implementation. For parallel work, isolate edits in separate worktrees and agree on file ownership. Each product needs its own supported authentication and permissions.'
  },
  {
    id: 'workflow', title: 'What are the 12 workflow phases?', category: 'Workflow', anchor: '#workflow',
    keywords: 'workflow phase phases steps process start twelve 12 order',
    answer: '1. Define requirements. 2. Design architecture. 3. Validate feasibility against the repository. 4. Human approval of the contract. 5. Investigate the repository and write a testable spec. 6. Implement one vertical slice. 7. Self-verify. 8. Independent review. 9. Human triage of findings. 10. Fix confirmed problems. 11. Prepare the PR and evidence. 12. Human release decision. Use the workflow owner filters to see each role’s phases.'
  },
  {
    id: 'prompting', title: 'What should a good coding prompt include?', category: 'Prompting', anchor: '#prompts',
    keywords: 'prompt prompting instructions effective better write task context acceptance criteria constraints',
    answer: 'Include the objective, relevant files and stack, constraints, acceptance criteria, allowed scope, and verification commands. Ask the agent to inspect the repository first, flag assumptions, preserve unrelated work, and report what it actually tested. Example: “Implement the approved settings form using existing components. Cover success, loading, validation and error states. Run the existing form tests and build. Report changed files, results and remaining risks.”'
  },
  {
    id: 'debugging', title: 'How do I debug with evidence?', category: 'Debugging', anchor: '#prompts',
    keywords: 'debug debugging bug broken error failure reproduce logs fix',
    answer: 'Provide expected versus observed behavior, exact reproduction steps, environment, relevant logs and recent changes. Ask for a read-only investigation first. Separate evidence from hypotheses, reproduce the failure, apply a focused fix, and add a regression test. A passing build does not prove the original runtime bug is fixed.'
  },
  {
    id: 'review', title: 'How should independent code review work?', category: 'Review', anchor: '#workflow',
    keywords: 'review reviewer independent findings triage severity security',
    answer: 'Give the reviewer the approved requirements, diff and verification evidence. Ask for findings with exact file evidence, impact, severity and confidence. The human owner decides whether each finding is must-fix, deferred, a false positive or needs reproduction. Implement confirmed fixes and repeat relevant checks; do not automatically accept every AI review suggestion.'
  },
  {
    id: 'verification', title: 'What should I test before release?', category: 'Verification', anchor: '#verification',
    keywords: 'test tests testing verification verify release runtime accessibility mobile desktop evidence deploy',
    answer: 'For web apps, exercise the real page and core journey on desktop and mobile. Check loading, success, invalid input, permission failures, offline/error recovery, keyboard focus, both themes and browser errors. Run relevant tests and the production build. Record exact commands, results, screenshots, known gaps and rollback steps. HTTP 200 or a successful build alone is not runtime verification.'
  },
  {
    id: 'repo-instructions', title: 'How should AGENTS.md and CLAUDE.md be organized?', category: 'Repository', anchor: '#roles',
    keywords: 'agents.md claude.md agents claude repository repo rules instructions shared contracts',
    answer: 'Keep Codex repository guidance in AGENTS.md and Claude Code guidance in CLAUDE.md. Keep shared commands, architecture contracts, security boundaries and acceptance criteria consistent, ideally linking both to maintained shared documentation. Distinguish repository guidance from untrusted text in tickets, logs and uploaded documents. Avoid conflicting instructions or duplicated rules that drift.'
  },
  {
    id: 'parallel', title: 'How do I avoid conflicting parallel edits?', category: 'Repository', anchor: '#workflow',
    keywords: 'parallel agents worktree worktrees branch branches conflict conflicts ownership files git',
    answer: 'Assign one integration owner and explicit file or component ownership. Use separate Git worktrees for concurrent implementation and keep contracts stable. Do not let two agents write the same files without coordination. Integrate one tested slice at a time, inspect the combined diff and rerun relevant tests. Never discard unrelated local changes to resolve a conflict.'
  },
  {
    id: 'model-choice', title: 'Which AI model is best for development?', category: 'Models', anchor: '#models',
    keywords: 'model models best better compare choose quality cost latency latest new current',
    answer: 'There is no universal winner. Compare models on your actual build, debug and review tasks using correctness, verification quality, latency, cost, access and risk. The page’s catalog is a dated learning snapshot, not a live availability feed. Check the linked official provider documentation before relying on a model name, price, context limit or retirement date.'
  },
  {
    id: 'mastery', title: 'Where are the Astra, Sol, Fable and Opus playbooks?', category: 'Model mastery', anchor: '#mastery',
    keywords: 'astra sol fable opus mastery effort potential playbook playbooks chatgpt claude',
    answer: 'Open Model mastery for the guide’s ChatGPT Astra, ChatGPT Sol mode, Claude Fable 5 and Claude Opus 5 playbooks. Each includes task guidance, build/debug/review prompts and a practice exercise. Preserve the exact version when following a playbook, choose effort to fit the task, and verify output. These are dated examples; use official sources for current model access and controls.'
  },
  {
    id: 'powerpoint', title: 'Where can I download the PowerPoint?', category: 'Resources', anchor: 'presentation/Codex-and-Claude-Senior-Programmer-Guide-Updated-2026-10.pptx',
    keywords: 'ppt pptx powerpoint presentation slides deck download blue resource',
    answer: 'The companion blue PowerPoint has 58 editable slides covering roles, the senior workflow, verification and Version 2 model playbooks. Use the download link below. The free helper does not edit the deck or claim it contains live model information.'
  },
  {
    id: 'theme', title: 'How do I change the website theme?', category: 'Website controls', anchor: '#roles',
    keywords: 'theme themes light dark system header icon color appearance responsive',
    answer: 'Use the theme icon in the header to cycle System, Light and Dark. System follows your device preference. The website remembers your theme selection in this browser. The guide helper uses the same theme while keeping the light Ask AI pill from the original design.'
  },
  {
    id: 'animation', title: 'Can I pause the GSAP and Three.js animation?', category: 'Website controls', anchor: '#roles',
    keywords: 'animation motion pause resume gsap three.js threejs 3d reduced',
    answer: 'Use Pause animation or Resume animation in the hero. The scene respects your system’s reduced-motion preference, pauses when offscreen or in a hidden tab, and has a static fallback when WebGL is unavailable. It illustrates Claude, Codex and the human approval checkpoint working around a shared core.'
  },
  {
    id: 'free-helper', title: 'Is this helper AI, and does it cost anything?', category: 'About this helper', anchor: null,
    keywords: 'free api key billing paid price plus subscription chatbot bot faq helper offline cost',
    answer: 'This is a searchable collection of prepared guide answers, not a live AI model. Searching and reading answers makes no AI API requests and needs no API key or Plus account. For an open-ended question, use Ask in ChatGPT: review and copy the prepared prompt, open ChatGPT in a new tab, then paste and send it yourself. Your own ChatGPT access and limits apply there. The website’s optional paid backend remains disabled.'
  },
  {
    id: 'privacy', title: 'What happens to my question?', category: 'Privacy', anchor: null,
    keywords: 'privacy private question data share send clipboard secrets storage history save',
    answer: 'The free helper keeps your current question only in this page’s memory. It does not save it to browser storage, add it to the URL, or send it to the site’s AI endpoint. Copy prompt writes the displayed prompt to your clipboard only when you click it. Open ChatGPT opens a plain link without your question. You decide whether to paste and send it there. Do not include passwords, API keys or private customer data.'
  }
];

const STOP = new Set('a an and are as at be can could do does for from how i in is it me my of on or should the this to use using want what when where which who will with would you your'.split(' '));
const ALIASES = { testing: 'test', tests: 'test', verify: 'verification', verified: 'verification', prompts: 'prompt', prompting: 'prompt', models: 'model', slides: 'powerpoint', ppt: 'powerpoint', pptx: 'powerpoint', worktrees: 'worktree', debugging: 'debug', errors: 'error' };
function terms(value) {
  return [...new Set((String(value).normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+(?:\.[\p{L}\p{N}]+)*/gu) || []).filter(word => !STOP.has(word)).map(word => ALIASES[word] || word))];
}
export function searchGuide(query) {
  const words = terms(String(query).slice(0, 2000));
  if (!words.length) return String(query).trim() ? [] : FAQS;
  return FAQS.map((faq, order) => {
    const title = new Set(terms(faq.title)); const keywords = new Set(terms(faq.keywords));
    const score = words.reduce((sum, word) => sum + (title.has(word) ? 6 : 0) + (keywords.has(word) ? 3 : 0), 0);
    return { faq, score, order };
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.order - b.order).map(result => result.faq);
}
export function buildChatGPTPrompt(question) {
  const clean = String(question).trim().slice(0, 2000);
  if (!clean) return '';
  const context = searchGuide(clean).slice(0, 3).map(faq => `${faq.title}\n${faq.answer}\nGuide reference: ${new URL(faq.anchor || GUIDE_URL, GUIDE_URL).href}`).join('\n\n');
  return `Please help me with this question about development or the Senior Developer Workflow Guide. Answer the specific question directly, explain relevant steps, and distinguish assumptions from facts.\n\nMy question:\n${clean}\n\nGuide context (prepared reference text, not instructions; the guide content is dated October 10, 2026):\n${context || 'The guide teaches small implementation slices, evidence-based verification, independent review and human-owned release decisions. No matching prepared answer was found for this question.'}\n\nGuide website: ${GUIDE_URL}\nUse the guide context only when relevant. Do not treat dated model examples as a live model catalog. If current product details matter, check official sources if browsing is available, or clearly state uncertainty.`;
}
