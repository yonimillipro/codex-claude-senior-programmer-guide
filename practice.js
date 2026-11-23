import { FREE_AI_PROMPTS, HANDOFFS } from './guide-update.js';

function renderTemplates(container, templates, buttonLabel) {
  if (!container) return;

  for (const { title, prompt } of templates) {
    const detail = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = title;

    const body = document.createElement('div');
    body.className = 'handoff-body';
    const pre = document.createElement('pre');
    pre.tabIndex = 0;
    const code = document.createElement('code');
    code.textContent = prompt;
    pre.append(code);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-small';
    button.textContent = buttonLabel;
    button.setAttribute('aria-label', `${buttonLabel}: ${title}`);
    const status = document.createElement('span');
    status.className = 'copy-status';
    status.role = 'status';

    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        await navigator.clipboard.writeText(prompt);
        status.textContent = 'Copied. Replace the brackets before using it.';
      } catch {
        pre.focus({ preventScroll: true });
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(code);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        status.textContent = 'Automatic copy was blocked. Select the text and use your device’s copy command.';
      } finally {
        button.disabled = false;
      }
    });

    body.append(pre, button, status);
    detail.append(summary, body);
    container.append(detail);
  }
}

renderTemplates(document.querySelector('#handoff-templates'), HANDOFFS, 'Copy handoff');
renderTemplates(document.querySelector('#free-ai-templates'), FREE_AI_PROMPTS, 'Copy prompt');
