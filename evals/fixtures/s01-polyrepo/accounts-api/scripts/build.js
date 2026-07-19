import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'dist');

const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

await mkdir(outDir, { recursive: true });
await writeFile(
  join(outDir, 'build-info.json'),
  `${JSON.stringify({ name: manifest.name, version: manifest.version }, null, 2)}\n`
);

console.log(`built ${manifest.name}@${manifest.version}`);
