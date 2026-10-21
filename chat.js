const $ = id => document.getElementById(`ask-ai-${id}`);
const launcher = $('launcher');
const panel = $('panel');
const input = $('input');
const thread = $('thread');
const messages = [];
let ready = false;
let busy = false;
let request = null;
let connectionRequest = null;
let retryText = '';
let stickToBottom = true;

function announce(text) { $('status').textContent = text; }
function grow() { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 112)}px`; }
function controls() {
  $('send').disabled = !ready || busy || !input.value.trim();
  $('send').hidden = busy;
  $('stop').hidden = !busy;
  $('clear').disabled = busy || !messages.length;
  $('retry').disabled = busy || !ready || !retryText;
  input.setAttribute('aria-busy', String(busy));
}
function showError(text) { $('error').hidden = !text; $('error-text').textContent = text; }
function scrollToEnd() { if (stickToBottom) thread.scrollTop = thread.scrollHeight; }
function renderText(target, text) {
  // Only text nodes and code blocks: model output is never interpreted as HTML.
  target.replaceChildren();
  const pieces = text.split(/```[^\n]*\n([\s\S]*?)(?:```|$)/g);
  pieces.forEach((piece, i) => {
    if (i % 2) { const pre = document.createElement('pre'); const code = document.createElement('code'); code.textContent = piece; pre.append(code); target.append(pre); }
    else target.append(document.createTextNode(piece));
  });
}
function addMessage(role, content) {
  const item = document.createElement('article');
  item.className = `ask-ai-message ask-ai-message--${role}`;
  const label = document.createElement('span'); label.className = 'ask-ai-message-label'; label.textContent = role === 'user' ? 'You' : 'Guide assistant';
  const body = document.createElement('div'); body.className = 'ask-ai-message-body'; body.textContent = content;
  const state = document.createElement('span'); state.className = 'ask-ai-message-state';
  item.append(label, body, state); $('messages').append(item); $('welcome').hidden = true;
  const message = { role, content, complete: role === 'user', item, body, state };
  messages.push(message); scrollToEnd(); controls(); return message;
}
function history() {
  const recent = messages.filter(m => m.complete).map(({ role, content }) => ({ role, content })).slice(-9);
  while (recent[0]?.role === 'assistant') recent.shift();
  while (recent.length > 1 && recent.reduce((sum, m) => sum + m.content.length, 0) > 9000) recent.splice(0, 2);
  return recent;
}
async function checkConnection() {
  connectionRequest?.abort();
  const current = new AbortController(); connectionRequest = current;
  ready = false; controls(); $('notice').hidden = false; $('reconnect').hidden = true;
  $('notice-text').textContent = 'Checking the AI connection…';
  try {
    const response = await fetch('/api/chat', { cache: 'no-store', signal: AbortSignal.any([current.signal, AbortSignal.timeout(8000)]) });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('connection');
    const data = await response.json(); if (connectionRequest !== current) return;
    ready = data.ready === true;
    $('notice').hidden = ready;
    $('notice-text').textContent = ready ? '' : 'AI chat is not connected yet. The site owner is setting it up.';
    $('reconnect').hidden = ready;
  } catch (error) {
    if (current.signal.aborted) return;
    $('notice-text').textContent = 'AI chat is unavailable right now. Check your connection and try again.';
    $('reconnect').hidden = false;
  } finally { if (connectionRequest === current) { connectionRequest = null; controls(); } }
}
function viewport() {
  const view = window.visualViewport;
  panel.style.setProperty('--chat-viewport-height', `${view?.height || innerHeight}px`);
  panel.style.setProperty('--chat-keyboard-inset', `${Math.max(0, innerHeight - (view?.height || innerHeight) - (view?.offsetTop || 0))}px`);
  panel.dataset.compact = String((view?.height || innerHeight) < 480);
}
function closePanel() {
  if (panel.hidden) return;
  request?.abort(); connectionRequest?.abort();
  panel.hidden = true; launcher.setAttribute('aria-expanded', 'false'); document.body.classList.remove('chat-is-open');
  launcher.focus({ preventScroll: true });
}
launcher.hidden = false;
launcher.addEventListener('click', () => {
  if (!panel.hidden) { closePanel(); return; }
  panel.hidden = false; launcher.setAttribute('aria-expanded', 'true'); document.body.classList.add('chat-is-open');
  viewport(); grow(); input.focus({ preventScroll: true }); checkConnection();
});
$('close').addEventListener('click', closePanel);
panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closePanel(); } });
window.visualViewport?.addEventListener('resize', viewport);
window.visualViewport?.addEventListener('scroll', viewport);
thread.addEventListener('scroll', () => { stickToBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 70; }, { passive: true });
$('reconnect').addEventListener('click', checkConnection);
document.querySelectorAll('[data-chat-question]').forEach(button => button.addEventListener('click', () => { input.value = button.dataset.chatQuestion; grow(); controls(); input.focus({ preventScroll: true }); }));
input.addEventListener('input', () => { grow(); controls(); input.removeAttribute('aria-invalid'); });
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229) { event.preventDefault(); $('form').requestSubmit(); }
});
async function send(text, retry = false) {
  if (busy || !ready) return;
  text = text.trim(); if (!text) { showError('Enter a question before sending.'); input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
  if (text.length > 2000) { showError('Keep your question under 2,000 characters.'); input.setAttribute('aria-invalid', 'true'); return; }
  showError(''); $('clear-confirm').hidden = true; retryText = text; stickToBottom = true;
  const question = retry ? messages.findLast(m => m.role === 'user' && m.content === text) : addMessage('user', text);
  if (!question) return;
  question.complete = true;
  const payload = history();
  const answer = addMessage('assistant', ''); answer.state.textContent = 'Thinking…';
  const current = new AbortController(); request = current; busy = true; controls(); announce('AI is generating a reply.');
  input.value = ''; grow();
  try {
    const response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: payload }),
      signal: AbortSignal.any([current.signal, AbortSignal.timeout(55000)])
    });
    if (!response.ok) {
      let message = 'The AI could not reply. Your question is saved here; try again.';
      try { const data = await response.json(); if (typeof data.error === 'string') message = data.error; } catch {}
      throw new Error(message);
    }
    if (!response.headers.get('content-type')?.includes('application/x-ndjson') || !response.body) throw new Error('The chat service returned an unexpected response. Try again later.');
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let finished = false; let truncated = false;
    const processLine = line => {
      if (!line.trim()) return;
      const event = JSON.parse(line);
      if (event.type === 'delta' && typeof event.text === 'string') { answer.content += event.text; answer.body.textContent = answer.content; answer.state.textContent = 'Writing…'; scrollToEnd(); }
      if (event.type === 'error') throw new Error(typeof event.message === 'string' ? event.message : 'The reply was interrupted. Please retry.');
      if (event.type === 'done') { finished = true; truncated = event.truncated === true; }
    };
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) { buffer += decoder.decode(); if (buffer.trim()) processLine(buffer); break; }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n'); buffer = lines.pop(); lines.forEach(processLine);
      }
    } finally { await reader.cancel().catch(() => {}); }
    if (!finished || !answer.content.trim()) throw new Error('The reply was interrupted. Please retry your question.');
    answer.complete = true; answer.state.textContent = truncated ? 'Reply length limit reached. Ask a follow-up for more.' : ''; renderText(answer.body, answer.content); announce('Guide assistant replied. ' + answer.content);
  } catch (error) {
    question.complete = false;
    if (current.signal.aborted) { answer.state.textContent = 'Response stopped'; input.value = text; grow(); announce('Response stopped.'); }
    else {
      answer.state.textContent = answer.content ? 'Incomplete reply' : 'No reply received';
      showError(error.name === 'TimeoutError' ? 'The reply took too long. Please try again.' : error.message);
      input.value = text; grow(); announce('The AI could not finish. Your question is available to retry.');
    }
  } finally {
    if (request === current) { request = null; busy = false; controls(); scrollToEnd(); if (!panel.hidden && document.activeElement === $('stop')) input.focus({ preventScroll: true }); }
  }
}
$('form').addEventListener('submit', event => { event.preventDefault(); send(input.value); });
$('stop').addEventListener('click', () => request?.abort());
$('retry').addEventListener('click', () => { if (retryText) send(retryText, true); });
$('clear').addEventListener('click', () => { $('clear-confirm').hidden = false; $('clear-no').focus({ preventScroll: true }); });
$('clear-no').addEventListener('click', () => { $('clear-confirm').hidden = true; $('clear').focus({ preventScroll: true }); });
$('clear-yes').addEventListener('click', () => {
  if (busy) return;
  messages.length = 0; $('messages').replaceChildren(); $('welcome').hidden = false;
  $('clear-confirm').hidden = true; retryText = ''; showError(''); input.value = ''; grow(); controls();
  announce('Chat cleared from this page.'); input.focus({ preventScroll: true });
});
window.addEventListener('pagehide', () => { request?.abort(); connectionRequest?.abort(); });
