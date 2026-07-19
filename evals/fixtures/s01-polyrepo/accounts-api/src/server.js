import { createServer } from 'node:http';
import { createSessionRegistry } from './sessionRoutes.js';

const registry = createSessionRegistry();
const port = Number(process.env.PORT ?? 4010);

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url?.startsWith('/sessions/')) {
    const token = req.url.slice('/sessions/'.length);
    const session = registry.lookup(token);
    res.writeHead(session ? 200 : 404, { 'content-type': 'application/json' });
    res.end(JSON.stringify(session ?? { error: 'not found' }));
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(port, () => {
  console.log(`accounts-api listening on http://localhost:${port}`);
});
