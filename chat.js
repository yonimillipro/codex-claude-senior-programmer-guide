import { FAQS, searchGuide, buildChatGPTPrompt } from './guide-help-data.js';

const $ = id => document.getElementById(`ask-ai-${id}`);
const launcher = $('launcher'); const panel = $('panel'); const input = $('input');
let composing = false;
let copyPending = false;
let copyRevision = 0;

function announce(text) { $('status').textContent = text; }
function grow() { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 80)}px`; }
function viewport() {
  const view = window.visualViewport;
  panel.style.setProperty('--chat-viewport-height', `${view?.height || innerHeight}px`);
  panel.style.setProperty('--chat-keyboard-inset', `${Math.max(0, innerHeight - (view?.height || innerHeight) - (view?.offsetTop || 0))}px`);
  panel.dataset.compact = String((view?.height || innerHeight) < 480);
}
function closePanel() {
  panel.hidden = true; launcher.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('chat-is-open'); launcher.focus({ preventScroll: true });
}
function clearHandoff() {
  copyRevision++; $('handoff').hidden = true; $('prompt').value = '';
  $('copy-feedback').textContent = ''; $('copy').disabled = false; copyPending = false;
}
function render() {
  const query = input.value.trim(); const found = searchGuide(query);
  $('input-clear').hidden = !input.value; $('prepare').disabled = !query;
  $('error').hidden = true; input.removeAttribute('aria-invalid');
  $('count').textContent = query ? `${found.length} matching guide answer${found.length === 1 ? '' : 's'}` : `${FAQS.length} prepared guide answers`;
  $('no-results').hidden = found.length > 0;
  $('results').replaceChildren();
  found.forEach(faq => {
    const detail = document.createElement('details'); detail.className = 'guide-faq';
    const summary = document.createElement('summary'); summary.textContent = faq.title;
    const category = document.createElement('p'); category.className = 'guide-faq-category'; category.textContent = faq.category;
    const answer = document.createElement('p'); answer.textContent = faq.answer;
    const content = document.createElement('div'); content.className = 'guide-faq-content'; content.append(category, answer);
    if (faq.anchor) {
      const link = document.createElement('a'); link.href = faq.anchor;
      link.textContent = faq.id === 'powerpoint' ? 'Download PowerPoint ↗' : 'Read the guide section →';
      if (faq.id === 'powerpoint') link.download = '';
      link.addEventListener('click', () => { if (faq.id !== 'powerpoint') closePanel(); });
      content.append(link);
    }
    detail.append(summary, content); $('results').append(detail);
  });
}
function changeQuestion() { clearHandoff(); grow(); render(); }
function showHandoff() {
  if (!input.value.trim()) {
    $('error').hidden = false; $('error').textContent = 'Enter a question first, then prepare your ChatGPT prompt.';
    input.setAttribute('aria-invalid', 'true'); input.focus(); return;
  }
  $('prompt').value = buildChatGPTPrompt(input.value);
  $('handoff').hidden = false; $('copy-feedback').textContent = '';
  $('handoff').scrollIntoView({ block: 'start', behavior: 'instant' });
  $('handoff-title').focus({ preventScroll: true });
  announce('Prompt ready to review. Copy it, open ChatGPT, then paste and send it there.');
}
launcher.hidden = false;
launcher.addEventListener('click', () => {
  if (!panel.hidden) return closePanel();
  panel.hidden = false; launcher.setAttribute('aria-expanded', 'true'); document.body.classList.add('chat-is-open');
  viewport(); grow(); input.focus({ preventScroll: true });
});
$('close').addEventListener('click', closePanel);
panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closePanel(); } });
window.visualViewport?.addEventListener('resize', viewport);
window.visualViewport?.addEventListener('scroll', viewport);
window.addEventListener('resize', viewport);
input.addEventListener('compositionstart', () => { composing = true; });
input.addEventListener('compositionend', () => { composing = false; changeQuestion(); });
input.addEventListener('input', event => { if (!composing && !event.isComposing) changeQuestion(); });
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229 && !composing) { event.preventDefault(); $('form').requestSubmit(); }
});
$('form').addEventListener('submit', event => {
  event.preventDefault(); if (composing) return;
  render(); $('count').focus({ preventScroll: true }); $('results').scrollIntoView({ block: 'nearest', behavior: 'instant' });
});
$('input-clear').addEventListener('click', () => { input.value = ''; composing = false; changeQuestion(); input.focus({ preventScroll: true }); announce('Search cleared. All prepared guide answers are available.'); });
document.querySelectorAll('[data-guide-question]').forEach(button => button.addEventListener('click', () => { input.value = button.dataset.guideQuestion; changeQuestion(); input.focus({ preventScroll: true }); }));
$('prepare').addEventListener('click', showHandoff);
$('handoff-close').addEventListener('click', () => { clearHandoff(); $('prepare').focus({ preventScroll: true }); });
$('copy').addEventListener('click', async () => {
  if (copyPending || !$('prompt').value) return;
  const revision = ++copyRevision; const prompt = $('prompt').value;
  copyPending = true; $('copy').disabled = true; $('copy-feedback').textContent = 'Copying prompt…';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(prompt);
    if (revision === copyRevision) $('copy-feedback').textContent = 'Copied. Open ChatGPT, paste the prompt, then send it.';
  } catch {
    if (revision === copyRevision) {
      $('prompt').focus({ preventScroll: true }); $('prompt').select();
      $('copy-feedback').textContent = 'Automatic copy was blocked. The prompt is selected: use Copy from your device’s menu, or Ctrl+C / Cmd+C.';
    }
  } finally { if (revision === copyRevision) { copyPending = false; $('copy').disabled = false; } }
});
render();
