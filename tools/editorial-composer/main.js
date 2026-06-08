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
const mediaUploadInput = document.querySelector('[data-media-upload]');
const previewTitle = document.querySelector('[data-preview-title]');
const previewMeta = document.querySelector('[data-preview-meta]');
const previewDescription = document.querySelector('[data-preview-description]');
const previewMetaDescription = document.querySelector('[data-preview-meta-description]');
const previewKeywords = document.querySelector('[data-preview-keywords]');
const previewBody = document.querySelector('[data-preview-body]');
const editorView = document.querySelector('[data-editor-view]');
const libraryView = document.querySelector('[data-library-view]');
const postList = document.querySelector('[data-post-list]');
const refreshPostsButton = document.querySelector('[data-refresh-posts]');
const viewButtons = document.querySelectorAll('[data-composer-view]');
const filterButtons = document.querySelectorAll('[data-library-filter]');
const bodyStats = {
  characters: document.querySelector('[data-body-stat="characters"]'),
  words: document.querySelector('[data-body-stat="words"]'),
  lines: document.querySelector('[data-body-stat="lines"]'),
  paragraphs: document.querySelector('[data-body-stat="paragraphs"]'),
};
let slugTouched = false;
let libraryFilter = 'all';
let libraryPosts = [];
let pendingMediaType = 'image';

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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function markdownInlineToHtml(text) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => '<a href="' + escapeAttribute(url) + '">' + label + '</a>')
    .replace(/\x60([^\x60]+)\x60/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function isEmbeddableVideoUrl(url) {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)/i.test(String(url ?? ''));
}

function videoEmbedUrl(url) {
  const value = String(url ?? '').trim();
  const youtube = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/i);
  if (youtube) return 'https://www.youtube.com/embed/' + youtube[1];
  const vimeo = value.match(/vimeo\.com\/(\d+)/i);
  if (vimeo) return 'https://player.vimeo.com/video/' + vimeo[1];
  return value;
}

function mediaHtml(type, url, label = '') {
  const safeUrl = escapeHtml(url);
  const safeLabel = escapeHtml(label);
  const labelAttr = safeLabel ? ' data-label="' + safeLabel + '"' : '';

  const removeButton = '<button type="button" class="composer-media-remove" data-remove-media aria-label="Remover mídia">Remover</button>';

  if (type === 'image') {
    return '<figure class="composer-media-block" data-media-type="image" data-src="' + safeUrl + '"' + labelAttr + '>' + removeButton + '<img src="' + safeUrl + '" alt="' + safeLabel + '"><figcaption>' + (safeLabel || 'Imagem') + '</figcaption></figure>';
  }

  return '<figure class="composer-media-block" data-media-type="video" data-src="' + safeUrl + '"' + labelAttr + '>' + removeButton + '<div class="composer-media-video">Vídeo</div><figcaption>' + (safeLabel || safeUrl) + '</figcaption></figure>';
}

function markdownToEditorHtml(markdown) {
  const blocks = String(markdown ?? '').replace(/\r\n?/g, '\n').split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  if (blocks.length === 0) return '<p><br></p>';

  return blocks.map((block) => {
    const lines = block.split('\n');
    const firstLine = lines[0] ?? '';

    if (/^####\s+/.test(firstLine)) return '<h4>' + markdownInlineToHtml(firstLine.replace(/^####\s+/, '')) + '</h4>';
    if (/^###\s+/.test(firstLine)) return '<h3>' + markdownInlineToHtml(firstLine.replace(/^###\s+/, '')) + '</h3>';
    if (/^##\s+/.test(firstLine)) return '<h2>' + markdownInlineToHtml(firstLine.replace(/^##\s+/, '')) + '</h2>';

    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) return mediaHtml('image', image[2], image[1]);

    const video = block.match(/^<video controls src="([^"]+)"(?: title="([^"]*)")?><\/video>$/i);
    if (video) return mediaHtml('video', video[1], video[2] || '');

    const iframe = block.match(/^<iframe src="([^"]+)"(?: title="([^"]*)")?[\s\S]*?><\/iframe>$/i);
    if (iframe) return mediaHtml('video', iframe[1], iframe[2] || '');

    if (/^\x60\x60\x60/.test(firstLine)) {
      return '<pre>' + escapeHtml(block.replace(/^\x60\x60\x60\n?/, '').replace(/\n?\x60\x60\x60$/, '')) + '</pre>';
    }

    if (lines.every((line) => /^-\s+/.test(line))) {
      return '<ul>' + lines.map((line) => '<li>' + markdownInlineToHtml(line.replace(/^-\s+/, '')) + '</li>').join('') + '</ul>';
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      return '<ol>' + lines.map((line) => '<li>' + markdownInlineToHtml(line.replace(/^\d+\.\s+/, '')) + '</li>').join('') + '</ol>';
    }

    return '<p>' + markdownInlineToHtml(block.replace(/\n/g, ' ')) + '</p>';
  }).join('');
}

function markdownInlineToFragment(text) {
  const fragment = document.createDocumentFragment();
  const pattern = /(\[[^\]]+\]\([^)]+\)|\x60[^\x60]+\x60|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > lastIndex) fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));

    const token = match[0];
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const element = document.createElement('a');
      element.href = link[2];
      element.textContent = link[1];
      fragment.append(element);
      lastIndex = match.index + token.length;
      continue;
    }

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
  if (tag === 'a') {
    const href = node.getAttribute('href') || '';
    return content && href ? '[' + content.replace(/[\[\]]/g, '') + '](' + href + ')' : content;
  }
  if (tag === 'br') return '\n';
  return content;
}

function hasNestedBlock(element) {
  return Array.from(element.children).some((child) => ['ul', 'ol', 'pre', 'h2', 'h3', 'h4', 'figure'].includes(child.tagName.toLowerCase()));
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
    if (node.nodeType === Node.ELEMENT_NODE && ['ul', 'ol', 'pre', 'h2', 'h3', 'h4', 'figure'].includes(node.tagName.toLowerCase())) {
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

  if (tag === 'figure' && element.dataset.mediaType === 'image') {
    const src = element.dataset.src || element.querySelector('img')?.getAttribute('src') || '';
    const label = element.dataset.label || element.querySelector('img')?.getAttribute('alt') || '';
    return src ? '![' + escapeMarkdownInline(label) + '](' + src + ')' : '';
  }

  if (tag === 'figure' && element.dataset.mediaType === 'video') {
    const src = element.dataset.src || '';
    const label = element.dataset.label || '';
    if (!src) return '';
    if (isEmbeddableVideoUrl(src) || /\/embed\//.test(src)) {
      return '<iframe src="' + videoEmbedUrl(src) + '" title="' + escapeMarkdownInline(label || 'Vídeo') + '" loading="lazy" allowfullscreen></iframe>';
    }
    return '<video controls src="' + src + '" title="' + escapeMarkdownInline(label || 'Vídeo') + '"></video>';
  }

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

function updateBodyMetrics(markdown) {
  const text = String(markdown ?? '').trim();
  const plain = text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g, (match) => match.replace(/\x60/g, ''))
    .replace(/[\*_\x60]/g, '')
    .trim();

  const paragraphs = text ? text.split(/\n{2,}/).filter((block) => block.trim()).length : 0;
  const lines = text ? text.split('\n').filter((line) => line.trim()).length : 0;
  const words = plain ? (plain.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? []).length : 0;

  bodyStats.characters.textContent = String(plain.length);
  bodyStats.words.textContent = String(words);
  bodyStats.lines.textContent = String(lines);
  bodyStats.paragraphs.textContent = String(paragraphs);
}

function syncEditorToBody() {
  bodyInput.value = editorHtmlToMarkdown();
  updateBodyMetrics(bodyInput.value);
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

    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = image[2];
      img.alt = image[1];
      figure.append(img);
      if (image[1]) {
        const caption = document.createElement('figcaption');
        caption.textContent = image[1];
        figure.append(caption);
      }
      previewBody.append(figure);
      continue;
    }

    const video = block.match(/^<video controls src="([^"]+)"(?: title="([^"]*)")?><\/video>$/i);
    if (video) {
      const element = document.createElement('video');
      element.controls = true;
      element.src = video[1];
      if (video[2]) element.title = video[2];
      previewBody.append(element);
      continue;
    }

    const iframe = block.match(/^<iframe src="([^"]+)"(?: title="([^"]*)")?[\s\S]*?><\/iframe>$/i);
    if (iframe) {
      const element = document.createElement('iframe');
      element.src = iframe[1];
      element.title = iframe[2] || 'Vídeo';
      element.loading = 'lazy';
      element.allowFullscreen = true;
      previewBody.append(element);
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

function normalizeUrl(value) {
  const url = String(value ?? '').trim();
  if (!url) return '';
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(url)) return url;
  return 'https://' + url;
}

function insertLink() {
  const range = getSelectionRange();
  if (!range) return;

  const selectedText = range.toString().trim();
  const label = selectedText || window.prompt('Texto do link');
  if (!label) return;

  const href = normalizeUrl(window.prompt('URL do link'));
  if (!href) return;

  const element = document.createElement('a');
  element.href = href;
  element.textContent = label;
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

function insertMediaBlock(type, url, label = '') {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = mediaHtml(type, url.trim(), label.trim());
  const media = wrapper.firstElementChild;
  const block = currentBlock();

  if (block && block !== richEditor) block.after(media);
  else richEditor.append(media);

  const next = document.createElement('p');
  next.append(document.createElement('br'));
  media.after(next);
  placeCaretInside(next);
  updatePreview();
}

function insertMediaFromUrl(type) {
  const url = window.prompt(type === 'image' ? 'URL da imagem' : 'URL do vídeo');
  if (!url) return;
  const label = window.prompt(type === 'image' ? 'Texto alternativo / legenda' : 'Título do vídeo') || '';
  insertMediaBlock(type, url, label);
}

function chooseMediaFile(type) {
  pendingMediaType = type;
  mediaUploadInput.accept = type === 'image' ? 'image/*' : 'video/*';
  mediaUploadInput.value = '';
  mediaUploadInput.click();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result).split(',')[1] || ''));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

async function uploadMediaFile(file) {
  setStatus('Enviando mídia local...');
  const data = await fileToBase64(file);
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, mimeType: file.type, data }),
  });
  const result = await response.json();

  if (!result.ok) throw new Error(result.errors.join(' '));
  return result;
}

function runEditorCommand(command) {
  if (command === 'bold') wrapSelection('strong', 'strong');
  if (command === 'italic') wrapSelection('em', 'ênfase');
  if (command === 'code') wrapSelection('code', 'código');
  if (command === 'link') insertLink();
  if (command === 'insertUnorderedList') makeBulletList();
  if (command === 'image') chooseMediaFile('image');
  if (command === 'video') chooseMediaFile('video');
  if (command === 'imageUrl') insertMediaFromUrl('image');
  if (command === 'videoUrl') insertMediaFromUrl('video');
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

function showView(view) {
  const isLibrary = view === 'library';
  editorView.hidden = isLibrary;
  libraryView.hidden = !isLibrary;

  viewButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.composerView === view));
  });

  if (isLibrary) loadPosts();
}

function renderPostList() {
  postList.replaceChildren();
  const posts = libraryPosts.filter((post) => {
    if (libraryFilter === 'draft') return post.draft;
    if (libraryFilter === 'published') return !post.draft;
    return true;
  });

  if (posts.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Nenhum conteúdo encontrado para este filtro.';
    postList.append(empty);
    return;
  }

  for (const post of posts) {
    const card = document.createElement('article');
    card.className = 'composer-post-card';

    const copy = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = post.title;
    const description = document.createElement('p');
    description.textContent = post.description || 'Sem descrição editorial.';
    const meta = document.createElement('div');
    meta.className = 'composer-post-meta';

    for (const value of [post.draft ? 'Rascunho' : 'Publicado', categoryLabels[post.category] ?? post.category, post.publishedAt || 'Sem data', post.slug]) {
      const item = document.createElement('span');
      item.textContent = value;
      meta.append(item);
    }

    copy.append(title, description, meta);

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Editar';
    button.addEventListener('click', () => loadPost(post.slug));

    card.append(copy, button);
    postList.append(card);
  }
}

async function loadPosts() {
  postList.replaceChildren();
  const loading = document.createElement('p');
  loading.textContent = 'Carregando conteúdos...';
  postList.append(loading);

  const response = await fetch('/api/posts');
  const result = await response.json();
  if (!result.ok) throw new Error(result.errors?.join(' ') || 'Falha ao listar conteúdos.');
  libraryPosts = result.posts;
  renderPostList();
}

function fillPostForm(post) {
  titleInput.value = post.title || '';
  slugInput.value = post.slug || '';
  descriptionInput.value = post.description || '';
  metaDescriptionInput.value = post.metaDescription || '';
  keywordsInput.value = Array.isArray(post.keywords) ? post.keywords.join(', ') : (post.keywords || '');
  categoryInput.value = post.category || 'estrategia';
  dateInput.value = post.publishedAt || '';
  form.elements.draft.checked = post.draft === true;
  form.elements.overwrite.checked = true;
  richEditor.innerHTML = markdownToEditorHtml(post.body || '');
  slugTouched = true;
  updatePreview();
}

async function loadPost(slug) {
  setStatus('Carregando conteúdo para edição...');
  const response = await fetch('/api/posts/' + encodeURIComponent(slug));
  const result = await response.json();
  if (!result.ok) {
    setStatus(result.errors.join(' '), 'error');
    return;
  }

  fillPostForm(result.post);
  showView('editor');
  setStatus('Editando ' + result.post.filePath, 'success');
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

richEditor.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-media]');
  if (!button) return;

  const media = button.closest('.composer-media-block');
  if (!media) return;

  const next = media.nextElementSibling;
  media.remove();
  if (next?.matches('p') && !next.textContent.trim() && next.querySelector('br')) next.remove();
  ensureEditorBlock();
  updatePreview();
  setStatus('Mídia removida do corpo do texto.', 'success');
});

mediaUploadInput.addEventListener('change', async () => {
  const file = mediaUploadInput.files?.[0];
  if (!file) return;

  try {
    const result = await uploadMediaFile(file);
    const label = window.prompt(result.mediaType === 'image' ? 'Texto alternativo / legenda' : 'Título do vídeo', file.name.replace(/.[^.]+$/, '')) || '';
    insertMediaBlock(result.mediaType || pendingMediaType, result.publicPath, label);
    setStatus('Mídia adicionada em ' + result.publicPath, 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

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

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    runEditorCommand('link');
  }
});

document.querySelectorAll('[data-editor-command]').forEach((button) => {
  button.addEventListener('click', () => runEditorCommand(button.dataset.editorCommand));
});

blockFormat.addEventListener('change', () => applyBlockFormat(blockFormat.value));

viewButtons.forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.composerView));
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    libraryFilter = button.dataset.libraryFilter;
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderPostList();
  });
});

refreshPostsButton.addEventListener('click', () => loadPosts().catch((error) => setStatus(error.message, 'error')));

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
