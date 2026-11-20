import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { HANDOFFS, NEW_FAQS, REVIEWED_AT } from '../guide-update.js';
import { searchGuide } from '../guide-help-data.js';
import { renderServiceWorker } from '../scripts/pwa-assets.mjs';

test('current handoffs retain a read-only reviewer and explicit release authority', () => {
  assert.equal(REVIEWED_AT, '2026-11-20');
  assert.equal(HANDOFFS.length, 3);
  assert.match(HANDOFFS[1].prompt, /do not modify files, commit, merge or deploy/);
  assert.match(HANDOFFS[2].prompt, /Do not merge or deploy unless separately authorized/);
  assert.ok(HANDOFFS.every(item => item.title && item.prompt.includes('[')));
});

test('new guide topics are searchable and keep provenance and access distinctions', () => {
  assert.equal(NEW_FAQS.length, 8);
  assert.ok(searchGuide('GPT 6.2').some(item => item.id === 'gpt-62'));
  assert.ok(searchGuide('RAG retrieval').some(item => item.id === 'retrieval'));
  assert.ok(searchGuide('prompt injection').some(item => item.id === 'agent-security'));
  assert.match(NEW_FAQS.find(item => item.id === 'gpt-62').answer, /ordinary Chat/);
});

test('all new module dependencies are included in the offline release', async () => {
  const worker = await renderServiceWorker(fileURLToPath(new URL('..', import.meta.url)));
  for (const asset of ['guide-update.js', 'practice.js', 'practice.css']) assert.ok(worker.includes(`"${asset}"`));
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /October Version 2 PowerPoint/);
  assert.match(html, /id="source-register"/);
  const js = await readFile(new URL('../practice.js', import.meta.url), 'utf8');
  assert.doesNotMatch(js, /\bfetch\s*\(|innerHTML|localStorage|sessionStorage/);
});
