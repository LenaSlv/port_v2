import { copyFile, lstat, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
const entries = [
  ['index.html', 'index.html'],
  ['src', 'static'],
  ['transport-case', 'transport-case'],
  ['corporate-transport', 'corporate-transport'],
  ['monitoring-case', 'monitoring-case'],
  ['soul-case', 'soul-case'],
  ['cashier-case', 'cashier-case'],
];
const textExtensions = new Set(['.html', '.css', '.js']);
const publicExtensions = new Set([...textExtensions, '.png', '.svg', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2', '.ttf']);
let count = 0;

async function copyPublic(source, target) {
  const info = await lstat(source);
  if (info.isSymbolicLink()) throw new Error(`Unexpected symbolic link: ${source}`);
  if (info.isDirectory()) {
    for (const name of await readdir(source)) {
      await copyPublic(join(source, name), join(target, name));
    }
    return;
  }
  const extension = extname(source).toLowerCase();
  const isFontLicense = /(?:^|[\\/])fonts[\\/][^\\/]+-OFL\.txt$/.test(source);
  if (!publicExtensions.has(extension) && !isFontLicense) return;
  await mkdir(dirname(target), { recursive: true });
  if (textExtensions.has(extension)) {
    // Keep the same nesting so script-relative URLs continue to work.
    const content = (await readFile(source, 'utf8')).replaceAll('src/', 'static/');
    await writeFile(target, content);
  } else {
    await copyFile(source, target);
  }
  count += 1;
}

// Only the generated directory next to the source tree may be replaced.
if (dirname(output) !== resolve(root)) throw new Error('Output must stay inside the project');
const existing = await lstat(output).catch(error => {
  if (error.code !== 'ENOENT') throw error;
});
if (existing?.isSymbolicLink()) throw new Error('dist must not be a symbolic link');
await rm(output, { recursive: true, force: true });
for (const [source, target] of entries) {
  await copyPublic(resolve(root, source), resolve(output, target));
}
console.log(`Prepared dist: ${count} public files.`);
