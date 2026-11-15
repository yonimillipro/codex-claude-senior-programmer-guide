import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { publicFiles, publicDirectories, renderServiceWorker } from './pwa-assets.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = path.join(root, 'dist');
if (!path.isAbsolute(target) || path.dirname(target) !== path.resolve(root) || path.basename(target) !== 'dist') throw new Error('Unexpected build output path');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
// Explicit public allowlist: server code, secrets, tests and dependencies are never
// copied into the static output. Vercel bundles api/chat.js separately.
for (const file of [...publicFiles, ...publicDirectories]) {
  await cp(path.join(root, file), path.join(target, file), { recursive: true });
}
await writeFile(path.join(target, 'sw.js'), await renderServiceWorker(target));
console.log('Built public site in dist/; server files excluded.');
