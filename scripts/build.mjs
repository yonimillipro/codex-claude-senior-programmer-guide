import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = path.join(root, 'dist');
if (!path.isAbsolute(target) || path.dirname(target) !== path.resolve(root) || path.basename(target) !== 'dist') throw new Error('Unexpected build output path');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
// Explicit public allowlist: server code, secrets, tests and dependencies are never
// copied into the static output. Vercel bundles api/chat.js separately.
for (const file of ['index.html', 'styles.css', 'app.js', 'mastery.css', 'mastery.js', 'motion.css', 'motion.js', 'collaboration-scene.js', 'chat.css', 'chat.js', 'favicon.svg', 'vendor', 'presentation']) {
  await cp(path.join(root, file), path.join(target, file), { recursive: true });
}
console.log('Built public site in dist/; server files excluded.');
