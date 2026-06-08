import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

export const categories = ['branding', 'seo', 'geo', 'aeo', 'luxury', 'estrategia'];
export const outputDir = resolve(process.cwd(), 'src/content/editorial');
export const mediaDir = resolve(process.cwd(), 'public/uploads/editorial');

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


const allowedMediaTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

function mediaExtension(fileName, mimeType) {
  const current = extname(fileName || '').toLowerCase();
  if (current) return current;
  if (mimeType === 'image/jpeg') return '.jpg';
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  if (mimeType === 'image/gif') return '.gif';
  if (mimeType === 'image/svg+xml') return '.svg';
  if (mimeType === 'video/mp4') return '.mp4';
  if (mimeType === 'video/webm') return '.webm';
  if (mimeType === 'video/ogg') return '.ogv';
  if (mimeType === 'video/quicktime') return '.mov';
  return '';
}

export async function saveMedia(data) {
  const fileName = String(data.fileName ?? 'media');
  const mimeType = String(data.mimeType ?? '');
  const base64 = String(data.data ?? '');

  if (!allowedMediaTypes.has(mimeType)) return { ok: false, errors: ['Tipo de midia nao permitido.'] };
  if (!base64) return { ok: false, errors: ['Arquivo vazio.'] };

  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length === 0) return { ok: false, errors: ['Arquivo vazio.'] };

  const extension = mediaExtension(fileName, mimeType);
  const baseName = slugify(fileName.replace(/.[^.]+$/, '')) || 'media';
  const savedName = baseName + '-' + Date.now().toString(36) + extension;
  const filePath = join(mediaDir, savedName);

  await mkdir(mediaDir, { recursive: true });
  await writeFile(filePath, buffer);

  return {
    ok: true,
    filePath,
    publicPath: '/uploads/editorial/' + savedName,
    mediaType: mimeType.startsWith('video/') ? 'video' : 'image',
  };
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


function parseFrontmatterValue(value) {
  const trimmed = String(value ?? '').trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^[.*]$/.test(trimmed)) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^"|"$/g, '').replace(/\\"/g, '"'))
      .filter(Boolean);
  }
  return trimmed.replace(/^"|"$/g, '').replace(/\\"/g, '"');
}

export function parseMarkdownPost(source, slug = '') {
  const match = String(source ?? '').match(new RegExp('^---\\n([\\s\\S]*?)\\n---\\n?([\\s\\S]*)$'));
  if (!match) return { slug, body: String(source ?? '') };

  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    frontmatter[key] = parseFrontmatterValue(value);
  }

  return { slug, ...frontmatter, body: match[2].trim() };
}

export async function listPosts() {
  await mkdir(outputDir, { recursive: true });
  const files = (await readdir(outputDir)).filter((file) => file.endsWith('.md')).sort();
  const posts = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const source = await readFile(join(outputDir, file), 'utf8');
    const post = parseMarkdownPost(source, slug);
    posts.push({
      slug,
      title: post.title || slug,
      description: post.description || '',
      category: post.category || 'estrategia',
      publishedAt: post.publishedAt || '',
      draft: post.draft === true,
      filePath: join(outputDir, file),
    });
  }

  return posts.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)) || a.title.localeCompare(b.title));
}

export async function getPost(slug) {
  const safeSlug = slugify(slug);
  if (!safeSlug) return null;
  const filePath = join(outputDir, safeSlug + '.md');
  if (!existsSync(filePath)) return null;
  const source = await readFile(filePath, 'utf8');
  return { ...parseMarkdownPost(source, safeSlug), filePath };
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
