import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export const publicFiles = ['index.html', 'styles.css', 'app.js', 'mastery.css', 'mastery.js', 'motion.css', 'motion.js', 'collaboration-scene.js', 'chat.css', 'chat.js', 'guide-help-data.js', 'favicon.svg', 'manifest.webmanifest', 'pwa.js', 'pwa.css', 'offline.html'];
export const publicDirectories = ['vendor', 'presentation', 'pwa'];
const precacheDirectories = ['vendor', 'presentation', 'pwa'];

export async function renderServiceWorker(root) {
  const template = await readFile(new URL('./service-worker.js', import.meta.url), 'utf8');
  const extra = await Promise.all(precacheDirectories.map(async dir =>
    (await readdir(path.join(root, dir), { withFileTypes: true }))
      .filter(entry => entry.isFile() && !/\.(?:md|txt)$/i.test(entry.name))
      .map(entry => `${dir}/${entry.name}`)));
  const assets = [...publicFiles, ...extra.flat()].sort();
  const hash = createHash('sha256').update(template);
  const contents = await Promise.all(assets.map(asset => readFile(path.join(root, asset))));
  assets.forEach((asset, i) => { hash.update(JSON.stringify([asset, contents[i].length])); hash.update(contents[i]); });
  return template.replace('/* @RELEASE@ */ null', JSON.stringify(hash.digest('hex').slice(0, 20)))
    .replace('/* @ASSETS@ */ []', JSON.stringify(assets));
}
