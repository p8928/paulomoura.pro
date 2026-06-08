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
const richEditor = document.querySelector('[data-rich-editor]');
const blockFormat = document.querySelector('[data-block-format]');
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
  if (/^\x60\x60\x60/.test(lines[0])) return block;

  const allBullets = lines.every((line) => /^[-*•]\s+/.test(line));
  if (allBullets) return lines.map((line) => '- ' + normalizeMarkdownMarker(line)).join('\n');

  const allNumbered = lines.every((line) => /^\d+[.)]\s+/.test(line));
  if (allNumbered) return lines.map((line, index) => String(index + 1) + '. ' + normalizeMarkdownMarker(line)).join('\n');

  if (lines.length === 1 && isLikelyHeading(lines[0])) return '## ' + normalizeMarkdownMarker(lines[0]).replace(/:$/, '');

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

function markdownInlineToFragment(text) {
  const fragment = document.createDocumentFragment();
  const pattern = /(\x60[^\x60]+\x60|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > lastIndex) fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));

    const token = match[0];
    const element = document.createElement(token.startsWith('**') ? 'strong' : token.startsWith('*') ? 'em' : 'code');
    element.textContent = token
      .replace(/^\*\*|\*\*$/g, '')
      .replace(/^\*|\*$/g, '')
      .replace(/^\x60|\x60$/g, '');
    fragment.append(element);
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) fragment.append(document.createTextNode(text.slice(lastIndex)));
  return fragment;
}

function escapeMarkdownInline(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function inlineNodeToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const tag = node.tagName.toLowerCase();
  const content = Array.from(node.childNodes).map(inlineNodeToMarkdown).join('');

  if (tag === 'strong' || tag === 'b') return content ? '**' + content + '**' : '';
  if (tag === 'em' || tag === 'i') return content ? '*' + content + '*' : '';
  if (tag === 'code') return content ? '\x60' + content.replace(/\x60/g, '') + '\x60' : '';
  if (tag === 'br') return '\n';
  return content;
}

function hasNestedBlock(element) {
  return Array.from(element.children).some((child) => ['ul', 'ol', 'pre', 'h2', 'h3', 'h4'].includes(child.tagName.toLowerCase()));
}

function mixedBlockToMarkdown(element) {
  const blocks = [];
  let inlineNodes = [];

  function flushInline() {
    const text = escapeMarkdownInline(inlineNodes.map(inlineNodeToMarkdown).join(''));
    if (text) blocks.push(text);
    inlineNodes = [];
  }

  for (const node of element.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE && ['ul', 'ol', 'pre', 'h2', 'h3', 'h4'].includes(node.tagName.toLowerCase())) {
      flushInline();
      const nested = blockToMarkdown(node);
      if (nested) blocks.push(nested);
    } else {
      inlineNodes.push(node);
    }
  }

  flushInline();
  return blocks.join('\\n\\n');
}

function blockToMarkdown(element) {
  const tag = element.tagName.toLowerCase();

  if ((tag === 'p' || tag === 'div') && hasNestedBlock(element)) return mixedBlockToMarkdown(element);

  if (tag === 'ul') {
    return Array.from(element.children)
      .filter((child) => child.tagName.toLowerCase() === 'li')
      .map((item) => '- ' + escapeMarkdownInline(Array.from(item.childNodes).map(inlineNodeToMarkdown).join('')))
      .join('\n');
  }

  if (tag === 'ol') {
    return Array.from(element.children)
      .filter((child) => child.tagName.toLowerCase() === 'li')
      .map((item, index) => String(index + 1) + '. ' + escapeMarkdownInline(Array.from(item.childNodes).map(inlineNodeToMarkdown).join('')))
      .join('\n');
  }

  if (tag === 'pre') {
    const code = element.textContent.replace(/\n+$/g, '');
    return code ? '\x60\x60\x60\n' + code + '\n\x60\x60\x60' : '';
  }

  const text = escapeMarkdownInline(Array.from(element.childNodes).map(inlineNodeToMarkdown).join(''));
  if (!text) return '';
  if (tag === 'h2') return '## ' + text;
  if (tag === 'h3') return '### ' + text;
  if (tag === 'h4') return '#### ' + text;
  return text;
}

function editorHtmlToMarkdown() {
  const blocks = [];
  let inlineNodes = [];

  function flushInline() {
    const text = escapeMarkdownInline(inlineNodes.map(inlineNodeToMarkdown).join(''));
    if (text) blocks.push(text);
    inlineNodes = [];
  }

  for (const node of richEditor.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      flushInline();
      const block = blockToMarkdown(node);
      if (block) blocks.push(block);
    } else {
      inlineNodes.push(node);
    }
  }

  flushInline();
  return blocks.join('\n\n');
}

function syncEditorToBody() {
  bodyInput.value = editorHtmlToMarkdown();
}

function ensureEditorBlock() {
  if (richEditor.childNodes.length === 0) {
    const paragraph = document.createElement('p');
    paragraph.append(document.createElement('br'));
    richEditor.append(paragraph);
  }
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

    if (/^#{2,4}\s+/.test(firstLine)) {
      const heading = document.createElement('h3');
      heading.textContent = firstLine.replace(/^#{2,4}\s+/, '');
      previewBody.append(heading);
      continue;
    }

    if (/^\x60\x60\x60/.test(firstLine)) {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = block.replace(/^\x60\x60\x60\n?/, '').replace(/\n?\x60\x60\x60$/, '');
      pre.append(code);
      previewBody.append(pre);
      continue;
    }

    if (lines.every((line) => /^-\s+/.test(line))) {
      const list = document.createElement('ul');
      for (const line of lines) {
        const item = document.createElement('li');
        item.append(markdownInlineToFragment(line.replace(/^-\s+/, '')));
        list.append(item);
      }
      previewBody.append(list);
      continue;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      const list = document.createElement('ol');
      for (const line of lines) {
        const item = document.createElement('li');
        item.append(markdownInlineToFragment(line.replace(/^\d+\.\s+/, '')));
        list.append(item);
      }
      previewBody.append(list);
      continue;
    }

    const paragraph = document.createElement('p');
    paragraph.append(markdownInlineToFragment(block));
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

  syncEditorToBody();
  previewTitle.textContent = titleInput.value.trim() || 'Sem título';
  previewDescription.textContent = description || 'Descrição ainda não definida.';
  previewMetaDescription.textContent = metaDescription || description || 'Usando descrição editorial.';
  previewKeywords.textContent = keywords.length > 0 ? keywords.join(', ') : 'Nenhuma keyword definida.';
  previewMeta.textContent = (categoryLabels[categoryInput.value] ?? 'categoria') + ' / ' + (dateInput.value || 'data');
  renderPreviewBody(normalizeBodyToMarkdown(bodyInput.value));
}

function getSelectionRange() {
  richEditor.focus();
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

function placeCaretAfter(node) {
  const selection = document.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function placeCaretInside(node) {
  const selection = document.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function currentBlock() {
  const selection = document.getSelection();
  let node = selection?.anchorNode;
  if (!node || node === richEditor) return richEditor.lastElementChild || richEditor.firstElementChild;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  return node?.closest?.('p, h2, h3, h4, pre, li, div') || richEditor.lastElementChild || richEditor.firstElementChild;
}

function wrapSelection(tagName, fallbackText) {
  const range = getSelectionRange();
  if (!range) return;

  const element = document.createElement(tagName);
  element.textContent = range.collapsed ? fallbackText : range.toString();
  range.deleteContents();
  range.insertNode(element);

  const spacer = document.createTextNode(' ');
  element.after(spacer);
  placeCaretAfter(spacer);
}

function replaceBlockTag(tagName) {
  const block = currentBlock();
  if (!block || block === richEditor) return;
  const replacement = document.createElement(tagName);
  replacement.innerHTML = block.innerHTML || '<br>';
  block.replaceWith(replacement);
  placeCaretInside(replacement);
}

function makeBulletList() {
  const block = currentBlock();
  if (!block || block === richEditor) return;

  const list = document.createElement('ul');
  const item = document.createElement('li');
  item.innerHTML = block.textContent.trim() ? block.innerHTML : '<br>';
  list.append(item);
  block.replaceWith(list);
  placeCaretInside(item);
}

function runEditorCommand(command) {
  if (command === 'bold') wrapSelection('strong', 'strong');
  if (command === 'italic') wrapSelection('em', 'ênfase');
  if (command === 'code') wrapSelection('code', 'código');
  if (command === 'insertUnorderedList') makeBulletList();
  updatePreview();
}

function applyBlockFormat(value) {
  replaceBlockTag(value === 'p' ? 'p' : value);
  updatePreview();
}

function insertPlainText(text) {
  const range = getSelectionRange();
  if (!range) return;
  const node = document.createTextNode(text);
  range.deleteContents();
  range.insertNode(node);
  placeCaretAfter(node);
  updatePreview();
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
  ensureEditorBlock();
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

richEditor.addEventListener('input', updatePreview);

richEditor.addEventListener('paste', (event) => {
  event.preventDefault();
  insertPlainText(event.clipboardData?.getData('text/plain') ?? '');
});

richEditor.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
    event.preventDefault();
    runEditorCommand('bold');
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
    event.preventDefault();
    runEditorCommand('italic');
  }
});

document.querySelectorAll('[data-editor-command]').forEach((button) => {
  button.addEventListener('click', () => runEditorCommand(button.dataset.editorCommand));
});

blockFormat.addEventListener('change', () => applyBlockFormat(blockFormat.value));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('Normalizando texto e salvando...');
  syncEditorToBody();

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

  setStatus('Texto convertido para Markdown e salvo em ' + result.filePath, 'success');
});

init().catch((error) => setStatus(error.message, 'error'));
