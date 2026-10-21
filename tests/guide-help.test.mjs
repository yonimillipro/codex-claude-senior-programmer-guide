import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { FAQS, searchGuide, buildChatGPTPrompt, GUIDE_URL } from '../guide-help-data.js';

test('all prepared answers are browsable; each has a unique ID and valid guide destination', async () => {
  assert.equal(FAQS.length, 16); assert.equal(new Set(FAQS.map(faq => faq.id)).size, 16);
  assert.deepEqual(searchGuide('  '), FAQS);
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const faq of FAQS) {
    assert.ok(faq.title && faq.category && faq.answer && faq.keywords);
    if (!faq.anchor) continue; // Helper-specific explanations have no unrelated section link.
    if (faq.anchor.startsWith('#')) assert.ok(html.includes(`id="${faq.anchor.slice(1)}"`));
    else await access(new URL('../' + faq.anchor, import.meta.url));
    assert.equal(new URL(faq.anchor, GUIDE_URL).origin, new URL(GUIDE_URL).origin);
  }
});
test('search ranks specific content and supports aliases, casing and full-width input', () => {
  for (const term of ['PPTX', 'slides', 'ＰｏｗｅｒＰｏｉｎｔ']) assert.equal(searchGuide(term)[0].id, 'powerpoint');
  assert.equal(searchGuide('coding prompt')[0].id, 'prompting');
  assert.equal(searchGuide('testing verification')[0].id, 'verification');
  assert.equal(searchGuide('AGENTS.md')[0].id, 'repo-instructions');
  assert.equal(searchGuide('Claude inside Codex')[0].id, 'inside-codex');
});
test('unsupported questions and stop-word-only queries do not invent an answer', () => {
  assert.deepEqual(searchGuide('What is the weather in Nairobi today?'), []);
  assert.deepEqual(searchGuide('how do I'), []);
  assert.deepEqual(searchGuide('<script>alert(12345)</script>'), []);
});
test('prompt includes the exact question, dated relevant references and no more than three FAQs', () => {
  const prompt = buildChatGPTPrompt('What should I test before release?');
  assert.ok(prompt.includes('My question:\nWhat should I test before release?'));
  assert.ok(prompt.includes('HTTP 200')); assert.ok(prompt.includes('October 10, 2026'));
  assert.ok(prompt.includes(GUIDE_URL)); assert.ok(prompt.includes('#verification'));
  assert.ok((prompt.match(/Guide reference:/g) || []).length <= 3);
  assert.equal(buildChatGPTPrompt('  '), '');
});
test('unmatched and long questions preserve an honest fallback with bounded prompt length', () => {
  assert.match(buildChatGPTPrompt('zebra habitat?'), /No matching prepared answer/);
  const prompt = buildChatGPTPrompt('x'.repeat(3000));
  assert.ok(prompt.includes('x'.repeat(2000))); assert.ok(!prompt.includes('x'.repeat(2001)));
});
test('free frontend has no network generation or persistent question storage; handoff uses a plain safe link', async () => {
  const js = await readFile(new URL('../chat.js', import.meta.url), 'utf8');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|\/api\/chat/);
  assert.ok(html.includes('href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"'));
  assert.ok(html.includes('prepared guide answers—not live AI'));
  assert.ok(js.includes('event.isComposing')); assert.ok(js.includes('revision === copyRevision'));
});
