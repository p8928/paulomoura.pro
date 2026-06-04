import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const port = Number(process.env.PORT || 4181);
const root = new URL('.', import.meta.url).pathname;
const publicRoot = new URL('../../public/', import.meta.url).pathname;
const mockFile = join(root, 'data/mock-applications.json');
const stateFile = join(root, 'data/state.json');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

async function parseBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await mkdir(join(root, 'data'), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function scoreApplication(application) {
  let score = 0;
  const budget = application.budget ?? '';
  const reasons = application.reasons ?? [];
  const urgency = application.urgency ?? '';

  if (/Acima de R\$ 40 mil/.test(budget)) score += 30;
  else if (/20 mil e R\$ 40 mil/.test(budget)) score += 26;
  else if (/10 mil e R\$ 20 mil/.test(budget)) score += 18;
  else if (/5 mil e R\$ 10 mil/.test(budget)) score += 10;

  if (/imediatamente|próximas 4 semanas/i.test(urgency)) score += 14;
  if (application.website && !/não tem site/i.test(application.website)) score += 8;
  if (application.companySize && !/independente/i.test(application.companySize)) score += 8;

  const highIntentReasons = [
    'Preciso reduzir CAC',
    'Dependo demais de tráfego pago',
    'Minha comunicação não transmite premium/luxury',
    'Quero ser melhor entendido por IA e motores de busca',
    'Branding não condiz com os valores da empresa',
  ];

  score += reasons.filter((reason) => highIntentReasons.includes(reason)).length * 5;
  return Math.min(score, 100);
}

function scoreLabel(score) {
  if (score >= 72) return 'alta aderência';
  if (score >= 48) return 'avaliar';
  return 'baixa aderência';
}

async function listApplications() {
  const applications = await readJson(mockFile, []);
  const state = await readJson(stateFile, {});

  return applications
    .map((application) => {
      const score = scoreApplication(application);
      return {
        ...application,
        score,
        scoreLabel: scoreLabel(score),
        status: state[application.id]?.status ?? 'novo',
        notes: state[application.id]?.notes ?? '',
        updatedAt: state[application.id]?.updatedAt ?? null,
      };
    })
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

function sendJson(response, status, data) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://localhost:${port}`);

    if (request.method === 'GET' && url.pathname === '/api/applications') {
      sendJson(response, 200, { ok: true, applications: await listApplications(), source: 'mock' });
      return;
    }

    const statusMatch = url.pathname.match(/^\/api\/applications\/([^/]+)$/);
    if (request.method === 'PATCH' && statusMatch) {
      const id = decodeURIComponent(statusMatch[1]);
      const payload = await parseBody(request);
      const state = await readJson(stateFile, {});
      state[id] = {
        status: String(payload.status ?? state[id]?.status ?? 'novo'),
        notes: String(payload.notes ?? state[id]?.notes ?? ''),
        updatedAt: new Date().toISOString(),
      };
      await writeJson(stateFile, state);
      sendJson(response, 200, { ok: true, state: state[id] });
      return;
    }

    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    let filePath = join(root, pathname.replace(/^\//, ''));
    let content;

    try {
      content = await readFile(filePath);
    } catch {
      filePath = join(publicRoot, pathname.replace(/^\//, ''));
      content = await readFile(filePath);
    }

    response.writeHead(200, { 'content-type': mime[extname(filePath)] ?? 'text/plain; charset=utf-8' });
    response.end(content);
  } catch (error) {
    sendJson(response, 500, { ok: false, errors: [error instanceof Error ? error.message : 'Erro desconhecido'] });
  }
});

server.on('error', (error) => {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
    console.log(`Dashboard de candidaturas ja esta ativo: http://127.0.0.1:${port}`);
    process.exit(0);
  }

  throw error;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Dashboard de candidaturas: http://127.0.0.1:${port}`);
});
