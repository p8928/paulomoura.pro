# Guia de configuracao eficiente do Playwright

Este guia define um padrao pratico para configurar Playwright em projetos web. Ele foi escrito para humanos e IAs, com foco em evitar configuracoes frageis, downloads desnecessarios e falsos positivos entre Chromium, Firefox e viewports responsivos.

## Objetivo

Use Playwright para validar que o projeto renderiza, navega e responde a interacoes essenciais em mais de um motor de navegador.

A configuracao minima recomendada cobre:

- Chromium desktop;
- Firefox desktop;
- Chromium mobile;
- Firefox em viewport estreito.

Firefox em viewport estreito nao deve ser tratado como Firefox mobile real. Ele apenas valida layout responsivo em largura pequena usando o motor Gecko.

## Dependencia

Instale o Playwright como dependencia de desenvolvimento:

```bash
npm install -D @playwright/test
```

Adicione scripts ao `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

## Browsers gerenciados vs browsers locais

Preferencia geral:

1. Use browsers gerenciados pelo Playwright em CI e validacoes confiaveis.
2. Use browsers locais apenas como fallback em maquinas onde downloads do CDN falham.
3. Evite depender de Chrome/Chromium instalado pelo sistema quando a equipe precisa de resultados identicos.

Instalacao recomendada:

```bash
npx playwright install chromium firefox
```

Se o download de Chromium falhar, mas houver um Chromium local, configure `executablePath` por variavel de ambiente ou fallback explicito.

Exemplos comuns no Linux:

```bash
which chromium
which firefox
```

Possiveis caminhos:

```txt
/snap/bin/chromium
/usr/bin/firefox
/snap/bin/firefox
```

Atenção: browsers instalados via Snap podem funcionar, mas tambem podem travar ou se comportar de forma diferente sob automacao. Se houver instabilidade, prefira o browser gerenciado pelo Playwright.

## Configuracao base

Crie `playwright.config.ts` na raiz do projeto:

```ts
import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4321';
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/snap/bin/chromium';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'reports/playwright' }]],
  use: {
    baseURL,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    colorScheme: 'light',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4321',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        viewport: { width: 1440, height: 1000 },
        launchOptions: {
          executablePath: chromiumPath,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 7'],
        browserName: 'chromium',
        launchOptions: {
          executablePath: chromiumPath,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    {
      name: 'firefox-narrow',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
```

Se os browsers gerenciados estiverem instalados corretamente, remova `executablePath` do Chromium para manter versoes totalmente controladas pelo Playwright.

## Reduced motion

Nem toda versao/tipo do Playwright aceita `reducedMotion` diretamente no `use` sem conflito de tipos. A forma mais estavel e aplicar por teste:

```ts
import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});
```

Use isso especialmente se o projeto tiver GSAP, Lenis, scroll-driven animations ou transicoes relevantes.

## Estrutura de testes

Use uma pasta dedicada:

```txt
tests/
  e2e/
    site.spec.ts
```

Exemplo de teste base:

```ts
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

const routes = [
  { path: '/', heading: 'Pagina inicial' },
  { path: '/sobre', heading: 'Sobre' },
];

test.describe('site routes', () => {
  for (const route of routes) {
    test(`${route.path} renders expected content`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
    });
  }
});
```

Para componentes interativos, teste comportamento real do usuario:

```ts
test('form flow is interactive', async ({ page }) => {
  await page.goto('/contato');
  await page.getByLabel('Nome').fill('Cliente Teste');
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByText('Mensagem enviada')).toBeVisible();
});
```

Prefira seletores acessiveis:

- `getByRole`;
- `getByLabel`;
- `getByPlaceholder`;
- `getByText` apenas quando o texto for parte estavel da UI.

Evite seletores acoplados a CSS, como `.card:nth-child(3)`, salvo para verificacoes visuais muito especificas.

## O que testar primeiro

Comece pequeno:

1. Todas as rotas principais renderizam.
2. O heading principal de cada rota aparece.
3. A navegacao basica funciona.
4. Um fluxo interativo critico funciona.
5. O layout mobile nao bloqueia conteudo essencial.

Depois adicione:

- screenshots visuais seletivos;
- testes de formularios;
- testes de menu mobile;
- testes de componentes Svelte/React/Vue hidratados;
- validacoes de SEO basicas no DOM.

## Artefatos e gitignore

Adicione ao `.gitignore`:

```gitignore
reports/
test-results/
playwright-report/
```

Se o projeto ainda nao tiver `.gitignore`, inclua tambem:

```gitignore
node_modules/
dist/
.astro/
.env
.env.*
.DS_Store
```

## Validacao recomendada

Apos configurar:

```bash
npm run check
npm run build
npm run test:e2e
```

Para depurar com navegador visivel:

```bash
npm run test:e2e:headed
```

Para interface visual do Playwright:

```bash
npm run test:e2e:ui
```

Para listar testes sem executar:

```bash
npx playwright test --list
```

## Problemas comuns

### Browser nao encontrado

Erro comum:

```txt
Executable doesn't exist at ~/.cache/ms-playwright/...
```

Solucao:

```bash
npx playwright install chromium firefox
```

Se o CDN falhar, use temporariamente um browser local com `executablePath`.

### FFmpeg ausente

Se `video: retain-on-failure` estiver ativo, Playwright pode exigir FFmpeg:

```txt
Video rendering requires ffmpeg binary.
```

Solucoes:

- remova `video` da configuracao;
- ou rode `npx playwright install ffmpeg`.

Para suites iniciais, screenshots e traces costumam bastar.

### Firefox do sistema trava

Se `/usr/bin/firefox` ou `/snap/bin/firefox` travar sob automacao, use Firefox gerenciado pelo Playwright. Ele tende a ser mais previsivel.

### Chromium Snap funciona, mas nao e ideal

`/snap/bin/chromium` pode funcionar com:

```ts
launchOptions: {
  executablePath: '/snap/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
}
```

Use como fallback local, nao como padrao definitivo de CI.

## Regras para IAs

Ao configurar Playwright em outro projeto:

1. Leia primeiro `package.json`, stack e porta de dev server.
2. Nao assuma que browsers gerenciados ja estao instalados.
3. Rode `npx playwright test --list` antes da suite completa.
4. Se todos os testes falharem instantaneamente, investigue browser/binario antes de alterar testes.
5. Se a falha mencionar FFmpeg, remova video ou instale FFmpeg.
6. Use `page.emulateMedia({ reducedMotion: 'reduce' })` para projetos com animacao.
7. Nao misture teste visual amplo com teste funcional no inicio.
8. Mantenha a matriz pequena ate o projeto estabilizar.
9. Sempre finalize com `npm run check`, `npm run build` e `npm run test:e2e`.
10. Documente qualquer fallback local de browser no proprio config ou no README.

## Padrao recomendado para este tipo de projeto

Para sites Astro com conteudo editorial, SEO forte e poucas islands interativas:

- mantenha a maior parte da validacao em rotas e conteudo renderizado;
- teste islands client-side apenas onde ha estado real;
- rode Chromium e Firefox em desktop sempre;
- rode pelo menos uma viewport estreita por motor;
- evite video por padrao;
- use screenshots apenas em falha ou em testes visuais deliberados.
