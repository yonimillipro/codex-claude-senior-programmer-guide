import { HANDOFFS } from './guide-update.js';

const container = document.querySelector('#handoff-templates');
for (const handoff of HANDOFFS) {
  const detail = document.createElement('details');
  const summary = document.createElement('summary'); summary.textContent = handoff.title;
  const body = document.createElement('div'); body.className = 'handoff-body';
  const pre = document.createElement('pre'); pre.tabIndex = 0;
  const code = document.createElement('code'); code.textContent = handoff.prompt; pre.append(code);
  const button = document.createElement('button'); button.type = 'button'; button.className = 'button button-small'; button.textContent = 'Copy handoff';
  button.setAttribute('aria-label', `Copy handoff: ${handoff.title}`);
  const status = document.createElement('span'); status.className = 'copy-status'; status.role = 'status'; status.setAttribute('aria-live', 'polite');
  button.addEventListener('click', async () => {
    if (button.disabled) return;
    button.disabled = true;
    try { await navigator.clipboard.writeText(handoff.prompt); status.textContent = 'Copied. Replace the brackets before using it.'; }
    catch {
      const selection = getSelection(); const range = document.createRange(); range.selectNodeContents(code);
      selection.removeAllRanges(); selection.addRange(range); pre.focus({ preventScroll: true });
      status.textContent = 'Automatic copy was blocked. The text is selected; copy it from your device’s menu or use Ctrl+C / Cmd+C.';
    } finally { button.disabled = false; }
  });
  body.append(pre, button, status); detail.append(summary, body); container.append(detail);
}

