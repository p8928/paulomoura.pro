import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export const categories = ['branding', 'seo', 'geo', 'aeo', 'luxury', 'estrategia'];
export const outputDir = resolve(process.cwd(), 'src/content/editorial');

export function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function validatePost(data) {
  const errors = [];

  if (!data.title?.trim()) errors.push('Titulo obrigatorio.');
  if (!data.description?.trim()) errors.push('Descricao obrigatoria.');
  if (!categories.includes(data.category)) errors.push('Categoria invalida.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.publishedAt ?? '')) errors.push('Data deve usar YYYY-MM-DD.');
  if (!data.body?.trim()) errors.push('Corpo do post obrigatorio.');

  const slug = slugify(data.slug || data.title || '');
  if (!slug) errors.push('Slug obrigatorio.');

  return { errors, slug };
}

function escapeFrontmatter(value) {
  return String(value).replace(/"/g, '\"');
}

function parseKeywords(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalFrontmatterLine(key, value) {
  const trimmed = String(value ?? '').trim();
  return trimmed ? key + ': "' + escapeFrontmatter(trimmed) + '"\n' : '';
}

function keywordsFrontmatter(value) {
  const keywords = parseKeywords(value);
  if (keywords.length === 0) return '';
  return 'keywords: [' + keywords.map((keyword) => '"' + escapeFrontmatter(keyword) + '"').join(', ') + ']\n';
}

function isLikelyHeading(line) {
  const plainLine = line.replace(/^#{1,6}\s+/, '').replace(/:$/, '').trim();
  const hasTerminalPunctuation = /[.!?]$/.test(plainLine);
  const isShort = plainLine.length > 0 && plainLine.length <= 72;
  const isAllCaps = plainLine === plainLine.toLocaleUpperCase('pt-BR') && /[A-ZÀ-Ý]/.test(plainLine);
  return isShort && !hasTerminalPunctuation && (line.endsWith(':') || isAllCaps || /^#{1,6}\s+/.test(line));
}

function normalizeMarkdownMarker(line) {
  return line
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[-*•]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .trim();
}

function convertPlainTextBlock(block) {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return '';

  const allBullets = lines.every((line) => /^[-*•]\s+/.test(line));
  if (allBullets) return lines.map((line) => `- ${normalizeMarkdownMarker(line)}`).join('\n');

  const allNumbered = lines.every((line) => /^\d+[.)]\s+/.test(line));
  if (allNumbered) return lines.map((line, index) => `${index + 1}. ${normalizeMarkdownMarker(line)}`).join('\n');

  if (lines.length === 1 && isLikelyHeading(lines[0])) {
    return `## ${normalizeMarkdownMarker(lines[0]).replace(/:$/, '')}`;
  }

  return lines.join(' ').replace(/\s+/g, ' ');
}

export function normalizeBodyToMarkdown(body) {
  return String(body ?? '')
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((block) => convertPlainTextBlock(block.trim()))
    .filter(Boolean)
    .join('\n\n');
}

export function createMarkdown(data) {
  const draft = data.draft === true || data.draft === 'true';

  return `---
title: "${escapeFrontmatter(data.title.trim())}"
description: "${escapeFrontmatter(data.description.trim())}"
${optionalFrontmatterLine('seoTitle', data.seoTitle)}${optionalFrontmatterLine('metaDescription', data.metaDescription)}${keywordsFrontmatter(data.keywords)}${optionalFrontmatterLine('canonicalPath', data.canonicalPath)}publishedAt: ${data.publishedAt}
category: "${data.category}"
draft: ${draft}
---

${normalizeBodyToMarkdown(data.body)}
`;
}

export async function savePost(data) {
  const { errors, slug } = validatePost(data);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const filePath = join(outputDir, `${slug}.md`);

  if (existsSync(filePath) && !data.overwrite) {
    return { ok: false, errors: [`Arquivo ja existe: ${filePath}`] };
  }

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, createMarkdown({ ...data, slug }), 'utf8');

  return { ok: true, slug, filePath };
}
