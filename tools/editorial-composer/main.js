const form = document.querySelector('[data-composer-form]');
const statusMessage = document.querySelector('[data-status]');
const titleInput = form.elements.title;
const slugInput = form.elements.slug;
const descriptionInput = form.elements.description;
const metaDescriptionInput = form.elements.metaDescription;
const keywordsInput = form.elements.keywords;
const categoryInput = form.elements.category;
const dateInput = form.elements.publishedAt;
const bodyInput = form.elements.body;
const previewTitle = document.querySelector('[data-preview-title]');
const previewMeta = document.querySelector('[data-preview-meta]');
const previewDescription = document.querySelector('[data-preview-description]');
const previewMetaDescription = document.querySelector('[data-preview-meta-description]');
const previewKeywords = document.querySelector('[data-preview-keywords]');
const previewBody = document.querySelector('[data-preview-body]');
let slugTouched = false;

const categoryLabels = {
  branding: 'Marca',
  seo: 'SEO',
  geo: 'GEO',
  aeo: 'AEO',
  luxury: 'Luxury',
  estrategia: 'Estratégia',
};

function setStatus(message, tone = 'neutral') {
  statusMessage.textContent = message;
  statusMessage.dataset.tone = tone;
}

async function createSlug(title) {
  const response = await fetch('/api/slug', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  return data.slug;
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

  if (lines.length === 1 && isLikelyHeading(lines[0])) return `## ${normalizeMarkdownMarker(lines[0]).replace(/:$/, '')}`;

  return lines.join(' ').replace(/\s+/g, ' ');
}

function normalizeBodyToMarkdown(body) {
  return String(body ?? '')
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((block) => convertPlainTextBlock(block.trim()))
    .filter(Boolean)
    .join('\n\n');
}

function renderPreviewBody(markdown) {
  previewBody.replaceChildren();

  if (!markdown) {
    const empty = document.createElement('em');
    empty.textContent = 'O corpo do texto aparece aqui enquanto você escreve.';
    previewBody.append(empty);
    return;
  }

  for (const block of markdown.split(/\n{2,}/)) {
    const lines = block.split('\n');
    const firstLine = lines[0] ?? '';

    if (/^##\s+/.test(firstLine)) {
      const heading = document.createElement('h3');
      heading.textContent = firstLine.replace(/^##\s+/, '');
      previewBody.append(heading);
      continue;
    }

    if (lines.every((line) => /^-\s+/.test(line))) {
      const list = document.createElement('ul');
      for (const line of lines) {
        const item = document.createElement('li');
        item.textContent = line.replace(/^-\s+/, '');
        list.append(item);
      }
      previewBody.append(list);
      continue;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      const list = document.createElement('ol');
      for (const line of lines) {
        const item = document.createElement('li');
        item.textContent = line.replace(/^\d+\.\s+/, '');
        list.append(item);
      }
      previewBody.append(list);
      continue;
    }

    const paragraph = document.createElement('p');
    paragraph.textContent = block;
    previewBody.append(paragraph);
  }
}

function updatePreview() {
  const description = descriptionInput.value.trim();
  const metaDescription = metaDescriptionInput.value.trim();
  const keywords = keywordsInput.value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  previewTitle.textContent = titleInput.value.trim() || 'Sem título';
  previewDescription.textContent = description || 'Descrição ainda não definida.';
  previewMetaDescription.textContent = metaDescription || description || 'Usando descrição editorial.';
  previewKeywords.textContent = keywords.length > 0 ? keywords.join(', ') : 'Nenhuma keyword definida.';
  previewMeta.textContent = `${categoryLabels[categoryInput.value] ?? 'categoria'} / ${dateInput.value || 'data'}`;
  renderPreviewBody(normalizeBodyToMarkdown(bodyInput.value));
}

async function init() {
  const response = await fetch('/config');
  const config = await response.json();

  for (const category of config.categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = categoryLabels[category] ?? category;
    categoryInput.append(option);
  }

  categoryInput.value = 'estrategia';
  dateInput.value = config.today;
  updatePreview();
}

titleInput.addEventListener('input', async () => {
  if (!slugTouched) slugInput.value = await createSlug(titleInput.value);
  updatePreview();
});

slugInput.addEventListener('input', () => {
  slugTouched = true;
});

descriptionInput.addEventListener('input', updatePreview);
metaDescriptionInput.addEventListener('input', updatePreview);
keywordsInput.addEventListener('input', updatePreview);
categoryInput.addEventListener('change', updatePreview);
dateInput.addEventListener('change', updatePreview);
bodyInput.addEventListener('input', updatePreview);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('Normalizando texto e salvando...');

  const payload = Object.fromEntries(new FormData(form));
  payload.draft = form.elements.draft.checked;
  payload.overwrite = form.elements.overwrite.checked;

  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!result.ok) {
    setStatus(result.errors.join(' '), 'error');
    return;
  }

  setStatus(`Texto convertido para Markdown e salvo em ${result.filePath}`, 'success');
});

init().catch((error) => setStatus(error.message, 'error'));
