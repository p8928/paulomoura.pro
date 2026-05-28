import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

const routes = [
  { path: '/m-signature', heading: 'M-Signature' },
  { path: '/m-direction', heading: 'M-Direction' },
  { path: '/processo', heading: 'Da leitura do negocio a presenca digital.' },
  { path: '/sobre', heading: 'Paulo Moura' },
  { path: '/editorial', heading: 'Ideias sobre marca, busca e presenca.' },
  { path: '/editorial/brand-driven', heading: 'O que significa ser conduzido pela marca' },
  { path: '/diagnostico', heading: 'Diagnostico inicial' },
];

test('home renders as a blank reconstruction canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Paulo Moura/);
});

test.describe('site routes', () => {
  for (const route of routes) {
    test(`${route.path} renders expected content`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
      await expect(page.locator('body')).toContainText('Paulo Moura');
    });
  }
});

test('diagnostic flow is reactive across browsers', async ({ page }) => {
  await page.goto('/diagnostico');

  await expect(page.getByRole('heading', { name: 'Uma candidatura guiada por substancia, escopo e momento.' })).toBeVisible();
  await page.getByRole('combobox').first().selectOption('branding e SEO');
  await page.getByRole('button', { name: 'Escopo' }).click();
  await page.getByPlaceholder('Ex.: prefiro informar em conversa').fill('Prefiro alinhar em conversa');
  await page.getByRole('button', { name: 'Agenda' }).click();

  await expect(page.getByText('branding e SEO')).toBeVisible();
  await expect(page.getByText('Prefiro alinhar em conversa')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continuar pelo WhatsApp' })).toBeVisible();
});
