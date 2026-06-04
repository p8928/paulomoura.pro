const listEl = document.querySelector('[data-list]');
const detailEl = document.querySelector('[data-detail]');
const searchInput = document.querySelector('[data-search]');
const statusFilter = document.querySelector('[data-status-filter]');
const scoreFilter = document.querySelector('[data-score-filter]');
const totalEl = document.querySelector('[data-total]');
const sourceEl = document.querySelector('[data-source]');

const statusLabels = {
  novo: 'Novo',
  avaliando: 'Avaliando',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
  respondido: 'Respondido',
};

let applications = [];
let selectedId = null;

function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function scoreClass(label) {
  if (label === 'alta aderência') return 'score-high';
  if (label === 'avaliar') return 'score-mid';
  return 'score-low';
}

function searchableText(application) {
  return [
    application.company,
    application.firstName,
    application.lastName,
    application.email,
    application.industry,
    application.budget,
    application.urgency,
    application.context,
    ...(application.reasons ?? []),
  ].join(' ').toLocaleLowerCase('pt-BR');
}

function filteredApplications() {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  const status = statusFilter.value;
  const score = scoreFilter.value;

  return applications.filter((application) => {
    if (query && !searchableText(application).includes(query)) return false;
    if (status && application.status !== status) return false;
    if (score && application.scoreLabel !== score) return false;
    return true;
  });
}

function renderList() {
  const filtered = filteredApplications();
  totalEl.textContent = `${filtered.length} de ${applications.length} candidaturas`;
  listEl.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'application-card';
    empty.innerHTML = '<h3>Nenhuma candidatura encontrada.</h3><p>Ajuste os filtros para ampliar a busca.</p>';
    listEl.append(empty);
    return;
  }

  for (const application of filtered) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `application-card ${application.id === selectedId ? 'active' : ''}`;
    button.innerHTML = `
      <small>${formatDate(application.receivedAt)} / ${statusLabels[application.status] ?? application.status}</small>
      <h3>${application.company}</h3>
      <p>${application.firstName} ${application.lastName} · ${application.industry}</p>
      <div class="card-meta">
        <span class="badge ${scoreClass(application.scoreLabel)}">${application.score} · ${application.scoreLabel}</span>
        <span class="badge">${application.budget}</span>
      </div>
    `;
    button.addEventListener('click', () => selectApplication(application.id));
    listEl.append(button);
  }
}

function field(label, value) {
  return `<div><dt>${label}</dt><dd>${value || 'Não informado'}</dd></div>`;
}

function mailtoHref(application) {
  const subject = `Candidatura Moura - ${application.company}`;
  const body = [
    `Olá, ${application.firstName}.`,
    '',
    'Obrigado pela candidatura. Analisei as informações iniciais e retorno por aqui para alinharmos os próximos passos.',
    '',
    'Atenciosamente,',
    'Paulo Moura',
  ].join('\n');
  return `mailto:${application.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function renderDetail(application) {
  if (!application) return;

  detailEl.innerHTML = `
    <p>${application.scoreLabel}</p>
    <h2>${application.company}</h2>
    <span>${application.firstName} ${application.lastName} · ${formatDate(application.receivedAt)}</span>

    <div class="metrics" aria-label="Resumo da candidatura">
      <div class="metric"><span class="metric-label">Score</span><strong>${application.score}/100</strong></div>
      <div class="metric"><span class="metric-label">Status</span><strong>${statusLabels[application.status]}</strong></div>
      <div class="metric"><span class="metric-label">Orçamento</span><strong>${application.budget}</strong></div>
    </div>

    <div class="detail-columns">
      <dl>
        ${field('Responsável', `${application.firstName} ${application.lastName}`)}
        ${field('E-mail', application.email)}
        ${field('Telefone', application.phone)}
        ${field('CNPJ', application.cnpj)}
        ${field('Site', application.website)}
      </dl>
      <dl>
        ${field('Indústria', application.industry)}
        ${field('Tamanho', application.companySize)}
        ${field('Aquisição atual', application.acquisition)}
        ${field('Urgência', application.urgency)}
        ${field('Fonte', application.source)}
      </dl>
    </div>

    <section>
      <p class="application-detail-kicker">Motivos</p>
      <ul class="detail-list">
        ${(application.reasons ?? []).map((reason) => `<li>${reason}</li>`).join('')}
      </ul>
    </section>

    <section>
      <p class="application-detail-kicker">Contexto</p>
      <p class="detail-copy">${application.context || 'Não informado'}</p>
    </section>

    <section class="detail-actions">
      <label>
        <span class="metric-label">Status interno</span>
        <select data-detail-status>
          ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${application.status === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select>
      </label>
      <label>
        <span class="metric-label">Notas internas</span>
        <textarea data-detail-notes placeholder="Registre avaliação, próximos passos ou objeções.">${application.notes ?? ''}</textarea>
      </label>
      <div class="action-row">
        <button type="button" data-save>Salvar status e notas</button>
        <a href="${mailtoHref(application)}">Responder por e-mail</a>
        <span class="status-message" data-save-status></span>
      </div>
    </section>
  `;

  detailEl.querySelector('[data-save]').addEventListener('click', () => saveState(application.id));
}

function selectApplication(id) {
  selectedId = id;
  renderList();
  renderDetail(applications.find((application) => application.id === id));
}

async function saveState(id) {
  const status = detailEl.querySelector('[data-detail-status]').value;
  const notes = detailEl.querySelector('[data-detail-notes]').value;
  const saveStatus = detailEl.querySelector('[data-save-status]');
  saveStatus.textContent = 'Salvando...';

  const response = await fetch(`/api/applications/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status, notes }),
  });
  const result = await response.json();

  if (!result.ok) {
    saveStatus.textContent = 'Erro ao salvar.';
    return;
  }

  applications = applications.map((application) =>
    application.id === id ? { ...application, status, notes, updatedAt: result.state.updatedAt } : application,
  );
  saveStatus.textContent = 'Salvo.';
  renderList();
}

async function init() {
  const response = await fetch('/api/applications');
  const result = await response.json();
  applications = result.applications ?? [];
  sourceEl.textContent = `Fonte: ${result.source === 'mock' ? 'mock local' : result.source}`;
  selectedId = applications[0]?.id ?? null;
  renderList();
  renderDetail(applications[0]);
}

searchInput.addEventListener('input', renderList);
statusFilter.addEventListener('change', renderList);
scoreFilter.addEventListener('change', renderList);

init().catch((error) => {
  detailEl.innerHTML = `<p>Erro</p><h2>Não foi possível carregar.</h2><span>${error.message}</span>`;
});
