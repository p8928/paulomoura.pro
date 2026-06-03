import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { categories, savePost, slugify, todayISO } from './editorial-utils.mjs';

const port = Number(process.env.PORT || 4177);
const root = new URL('.', import.meta.url).pathname;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

async function parseBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://localhost:${port}`);

    if (request.method === 'GET' && url.pathname === '/config') {
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ categories, today: todayISO() }));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/posts') {
      const payload = await parseBody(request);
      const result = await savePost(payload);
      response.writeHead(result.ok ? 200 : 400, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify(result));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/slug') {
      const payload = await parseBody(request);
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ slug: slugify(payload.title ?? '') }));
      return;
    }

    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = join(root, pathname.replace(/^\//, ''));
    const content = await readFile(filePath);
    response.writeHead(200, { 'content-type': mime[extname(filePath)] ?? 'text/plain; charset=utf-8' });
    response.end(content);
  } catch (error) {
    response.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ ok: false, errors: [error instanceof Error ? error.message : 'Erro desconhecido'] }));
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Composer editorial local: http://127.0.0.1:${port}`);
});
