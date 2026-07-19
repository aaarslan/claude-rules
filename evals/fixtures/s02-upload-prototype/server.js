import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = join(fileURLToPath(new URL('.', import.meta.url)), 'public');
const port = Number(process.env.PORT ?? 3000);

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function resolvePath(url) {
  const pathname = new URL(url, 'http://localhost').pathname;
  const relative = normalize(pathname === '/' ? '/index.html' : pathname);
  if (relative.includes('..')) {
    return null;
  }
  return join(publicDir, relative);
}

const server = createServer(async (req, res) => {
  const filePath = resolvePath(req.url ?? '/');
  if (!filePath) {
    res.writeHead(400, { 'content-type': 'text/plain' });
    res.end('bad request');
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, {
      'content-type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
});

server.listen(port, () => {
  console.log(`upload prototype on http://localhost:${port}`);
});
