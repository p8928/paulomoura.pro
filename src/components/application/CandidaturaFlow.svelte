<script lang="ts">
  import { onMount } from 'svelte';
  import { createApplicationId, readAttribution, type AttributionRecord } from '@scripts/attribution';
  type FormData = {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    cnpj: string;
    cnpjLater: boolean;
    website: string;
    noWebsite: boolean;
    budget: string;
    industry: string;
    companySize: string;
    acquisition: string;
    urgency: string;
    reasons: string[];
    context: string;
  };

  type Step = {
    eyebrow: string;
    title: string;
    copy: string;
    fields: string[];
  };

  const budgetOptions = [
    'Até R$ 5 mil',
    'Entre R$ 5 mil e R$ 10 mil',
    'Entre R$ 10 mil e R$ 20 mil',
    'Entre R$ 20 mil e R$ 40 mil',
    'Acima de R$ 40 mil',
    'Prefiro orientar pelo diagnóstico',
  ];

  const industryOptions = [
    'Arquitetura e interiores',
    'Clínica médica ou saúde',
    'Consultoria',
    'Restaurante ou hospitalidade',
    'Tecnologia',
    'E-commerce',
    'Jurídico',
    'Educação',
    'Imobiliário',
    'Outro segmento premium',
  ];

  const companySizeOptions = [
    'Profissional independente',
    '2 a 10 pessoas',
    '11 a 50 pessoas',
    '51 a 200 pessoas',
    'Acima de 200 pessoas',
  ];


  const acquisitionOptions = [
    'Indicação',
    'Google / busca orgânica',
    'Meta Ads',
    'Google Ads',
    'Instagram / social',
    'Marketplaces ou plataformas',
    'Prospecção ativa',
    'Ainda não tenho canal previsível',
  ];

  const urgencyOptions = [
    'Quero iniciar imediatamente',
    'Nas próximas 4 semanas',
    'Nos próximos 3 meses',
    'Estou pesquisando com calma',
  ];

  const reasonOptions = [
    'Não estou obtendo resultados com SEO',
    'Preciso reduzir CAC',
    'Site precisa de reformulação',
    'Branding não condiz com os valores da empresa',
    'Presença digital parece genérica',
    'Dependo demais de tráfego pago',
    'Google Business Profile está fraco',
    'Quero ser melhor entendido por IA e motores de busca',
    'Preciso atrair leads mais qualificados',
    'Minha comunicação não transmite premium/luxury',
    'Agência anterior não entregou profundidade',
    'Preciso organizar conteúdo e autoridade digital',
  ];

  const steps: Step[] = [
    {
      eyebrow: '01 / Responsável',
      title: 'Quem conduz a candidatura?',
      copy: 'Informe quem responde pela decisão e pelo contexto do negócio.',
      fields: ['firstName', 'lastName', 'email', 'phone'],
    },
    {
      eyebrow: '02 / Empresa',
      title: 'Qual empresa será analisada?',
      copy: 'A avaliação cruza operação real, sinais públicos e estrutura digital existente.',
      fields: ['company', 'cnpj', 'website', 'industry', 'companySize'],
    },
    {
      eyebrow: '03 / Momento',
      title: 'Que tipo de projeto faz sentido agora?',
      copy: 'Investimento, urgência e aquisição indicam aderência antes da conversa comercial.',
      fields: ['budget', 'acquisition', 'urgency'],
    },
    {
      eyebrow: '04 / Motivo',
      title: 'Por que esta candidatura existe?',
      copy: 'Marque os pontos centrais e acrescente contexto apenas se necessário.',
      fields: ['reasons', 'context'],
    },
    {
      eyebrow: '05 / Revisão',
      title: 'Revise antes de enviar.',
      copy: 'As informações serão organizadas para avaliação inicial.',
      fields: [],
    },
  ];

  let current = $state(0);
  let touched = $state(false);
  const formspreeEndpoint = 'https://formspree.io/f/meewojoa';
  const localDashboardEndpoint = 'http://127.0.0.1:4181/api/applications';

  let submitted = $state(false);
  let submitting = $state(false);
  let submitError = $state('');
  let submittedAt = $state('');
  let applicationId = $state('');
  let botField = $state('');
  let form = $state<FormData>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    cnpj: '',
    cnpjLater: false,
    website: '',
    noWebsite: false,
    budget: '',
    industry: '',
    companySize: '',
    acquisition: '',
    urgency: '',
    reasons: [],
    context: '',
  });

  const progress = $derived(((current + 1) / steps.length) * 100);
  const step = $derived(steps[current]);
  const missingFields = $derived(getMissingFields(current));
  const canContinue = $derived(missingFields.length === 0);
  const submittedLabel = $derived(submittedAt || 'Agora');

  onMount(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      const isEditable = !!target?.closest('[contenteditable="true"]');
      const inputType = target instanceof HTMLInputElement ? target.type : '';
      const isTextInput =
        tagName === 'INPUT' &&
        !['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'range', 'color'].includes(inputType);
      const isSelect = tagName === 'SELECT';
      const isTextarea = tagName === 'TEXTAREA';
      const isModifier = event.metaKey || event.ctrlKey || event.altKey;

      if (event.key === 'Escape') {
        if (submitted) {
          event.preventDefault();
          resetFlow();
          return;
        }

        if (current > 0) {
          event.preventDefault();
          back();
        }

        return;
      }

      if (event.key !== 'Enter' || isModifier || isEditable || isTextarea) return;
      if (!isTextInput && !isSelect) return;

      event.preventDefault();

      if (submitted) {
        resetFlow();
        return;
      }

      if (current < steps.length - 1) {
        next();
        return;
      }

      if (canContinue && !submitting) {
        void submit();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  function getMissingFields(stepIndex: number) {
    if (stepIndex === 0) {
      return [
        !form.firstName.trim() && 'nome',
        !form.lastName.trim() && 'sobrenome',
        !form.email.trim() && 'email',
        !form.phone.trim() && 'telefone',
      ].filter(Boolean) as string[];
    }

    if (stepIndex === 1) {
      return [
        !form.company.trim() && 'empresa',
        !form.cnpjLater && !form.cnpj.trim() && 'cnpj',
        !form.noWebsite && !form.website.trim() && 'site',
        !form.industry && 'indústria',
        !form.companySize && 'tamanho',
      ].filter(Boolean) as string[];
    }

    if (stepIndex === 2) {
      return [
        !form.budget && 'orçamento',
        !form.acquisition && 'aquisição',
        !form.urgency && 'urgência',
      ].filter(Boolean) as string[];
    }

    if (stepIndex === 3) {
      return [form.reasons.length === 0 && 'motivo'].filter(Boolean) as string[];
    }

    return [];
  }

  function next() {
    touched = true;
    if (!canContinue) return;
    current = Math.min(current + 1, steps.length - 1);
    touched = false;
  }

  function back() {
    current = Math.max(current - 1, 0);
    touched = false;
  }

  function setSingle(field: keyof FormData, value: string) {
    form[field] = value as never;
  }

  function toggleReason(reason: string) {
    form.reasons = form.reasons.includes(reason)
      ? form.reasons.filter((item) => item !== reason)
      : [...form.reasons, reason];
  }

  function getSubmissionEndpoint() {
    if (typeof window === 'undefined') return formspreeEndpoint;
    return ['localhost', '127.0.0.1'].includes(window.location.hostname) ? localDashboardEndpoint : formspreeEndpoint;
  }

  function buildEmailBody(submissionId = '', attribution: AttributionRecord | null = null) {
    const cnpj = form.cnpjLater ? 'Prefere informar depois' : form.cnpj;
    const site = form.noWebsite ? 'Empresa ainda não tem site' : form.website;
    const touch = attribution?.lastTouch;

    return [
      'Candidatura Moura',
      `ID: ${submissionId || 'Não gerado'}`,
      '',
      `Responsável: ${form.firstName} ${form.lastName}`,
      `Empresa: ${form.company}`,
      `Email: ${form.email}`,
      `Telefone: ${form.phone}`,
      `CNPJ: ${cnpj}`,
      `Site: ${site}`,
      `Indústria: ${form.industry}`,
      `Tamanho: ${form.companySize}`,
      `Orçamento: ${form.budget}`,
      `Canal de aquisição atual: ${form.acquisition}`,
      `Urgência: ${form.urgency}`,
      '',
      'Atribuição:',
      `Visitor ID: ${attribution?.visitorId || 'Não autorizado'}`,
      `Landing inicial: ${attribution?.firstTouch.landingPath || 'Não registrada'}`,
      `Último touch: ${touch?.landingPath || 'Não registrado'}`,
      `Origem / mídia: ${touch?.utm_source || 'Não informada'} / ${touch?.utm_medium || 'Não informada'}`,
      `Campanha: ${touch?.utm_campaign || 'Não informada'}`,
      `Termo: ${touch?.utm_term || 'Não informado'}`,
      `GCLID: ${touch?.gclid || 'Não informado'}`,
      '',
      'Motivos:',
      ...form.reasons.map((reason) => `- ${reason}`),
      '',
      'Contexto adicional:',
      form.context || 'Não informado',
    ].join('\n');
  }

  async function submit() {
    submitError = '';

    if (botField) {
      submitted = true;
      return;
    }

    const now = new Date();
    const submissionId = applicationId || createApplicationId();
    const attribution = readAttribution();
    const touch = attribution?.lastTouch;
    const summary = buildEmailBody(submissionId, attribution);
    applicationId = submissionId;
    const payload = {
      _subject: `Candidatura Moura - ${form.company || form.firstName}`,
      applicationId: submissionId,
      visitorId: attribution?.visitorId || '',
      attributionConsent: Boolean(attribution),
      attribution,
      landingPage: attribution?.firstTouch.landingPath || '',
      gclid: touch?.gclid || '',
      gbraid: touch?.gbraid || '',
      wbraid: touch?.wbraid || '',
      utmSource: touch?.utm_source || '',
      utmMedium: touch?.utm_medium || '',
      utmCampaign: touch?.utm_campaign || '',
      utmTerm: touch?.utm_term || '',
      utmContent: touch?.utm_content || '',
      name: `${form.firstName} ${form.lastName}`.trim(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      cnpj: form.cnpjLater ? 'Prefere informar depois' : form.cnpj,
      website: form.noWebsite ? 'Empresa ainda não tem site' : form.website,
      budget: form.budget,
      industry: form.industry,
      companySize: form.companySize,
      acquisition: form.acquisition,
      urgency: form.urgency,
      reasons: form.reasons.join(', '),
      context: form.context || 'Não informado',
      message: summary,
      submittedAt: now.toISOString(),
    };

    submitting = true;

    try {
      const response = await fetch(getSubmissionEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('O endpoint recusou o envio.');
      }

      submittedAt = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(now);

      localStorage.setItem(
        'moura:candidatura:last',
        JSON.stringify({
          applicationId: submissionId,
          submittedAt: now.toISOString(),
          form,
          attribution,
          summary,
        }),
      );

      window.dispatchEvent(new CustomEvent('moura:candidatura-submitted', {
        detail: {
          applicationId: submissionId,
          visitorId: attribution?.visitorId || null,
        },
      }));

      submitted = true;
      touched = false;
    } catch {
      submitError = 'Não foi possível enviar a candidatura agora. Verifique a conexão e tente novamente.';
    } finally {
      submitting = false;
    }
  }

  function resetFlow() {
    submitted = false;
    submitting = false;
    submitError = '';
    submittedAt = '';
    applicationId = '';
    botField = '';
    current = 0;
    touched = false;
  }
</script>

<section class="application-flow" aria-labelledby="application-flow-title">
  <div class="application-frame">
    {#if submitted}
      <div class="application-thanks" role="status" aria-live="polite">
        <p>Candidatura recebida</p>
        <h2 id="application-flow-title">Obrigado. Sua candidatura foi enviada para avaliação.</h2>
        <div>
          <span>Registro local: {submittedLabel}</span>
          <span>Responderemos pelo e-mail informado caso exista aderência inicial ao método.</span>
        </div>
        <dl>
          <div><dt>Responsável</dt><dd>{form.firstName} {form.lastName}</dd></div>
          <div><dt>Empresa</dt><dd>{form.company}</dd></div>
          <div><dt>Contato</dt><dd>{form.email}</dd></div>
        </dl>
        <button class="ghost" type="button" onclick={resetFlow}>Enviar outra candidatura</button>
      </div>
    {:else}
    <header class="application-status">
      <div>
        <p>{step.eyebrow}</p>
        <h2 id="application-flow-title">{step.title}</h2>
      </div>
      <span>{Math.round(progress)}%</span>
    </header>

    <div class="application-progress" aria-hidden="true">
      <span style={`width: ${progress}%`}></span>
    </div>

    <div class="application-step">
      <label class="application-honeypot">
        <span>Não preencha este campo</span>
        <input bind:value={botField} name="_gotcha" tabindex="-1" autocomplete="off" aria-label="Não preencha este campo" />
      </label>

      <p class="application-copy">{step.copy}</p>

      {#if current === 0}
        <div class="application-grid two">
          <label>
            <span>Nome</span>
            <input bind:value={form.firstName} autocomplete="given-name" placeholder="John" />
          </label>
          <label>
            <span>Sobrenome</span>
            <input bind:value={form.lastName} autocomplete="family-name" placeholder="Doe" />
          </label>
          <label>
            <span>E-mail</span>
            <input bind:value={form.email} autocomplete="email" inputmode="email" placeholder="você@empresa.com" />
          </label>
          <label>
            <span>Telefone</span>
            <input bind:value={form.phone} autocomplete="tel" inputmode="tel" placeholder="(11) 99999-9999" />
          </label>
        </div>
      {/if}

      {#if current === 1}
        <div class="application-grid two">
          <label class="wide">
            <span>Empresa</span>
            <input bind:value={form.company} autocomplete="organization" placeholder="Nome da empresa" />
          </label>
          <label class:disabled={form.cnpjLater}>
            <span>CNPJ</span>
            <input bind:value={form.cnpj} disabled={form.cnpjLater} inputmode="numeric" placeholder="00.000.000/0001-00" />
          </label>
          <label class="application-check">
            <input type="checkbox" bind:checked={form.cnpjLater} />
            <span>Prefiro informar depois</span>
          </label>
          <label class:disabled={form.noWebsite}>
            <span>Site</span>
            <input bind:value={form.website} disabled={form.noWebsite} inputmode="url" placeholder="https://empresa.com.br" />
          </label>
          <label class="application-check">
            <input type="checkbox" bind:checked={form.noWebsite} />
            <span>Minha empresa não tem site</span>
          </label>
        </div>

        <div class="application-choice-group">
          <span>Indústria</span>
          <div class="application-chip-grid">
            {#each industryOptions as option}
              <button class:active={form.industry === option} type="button" onclick={() => setSingle('industry', option)}>{option}</button>
            {/each}
          </div>
        </div>

        <div class="application-choice-group compact">
          <span>Tamanho aproximado</span>
          <div class="application-chip-grid compact">
            {#each companySizeOptions as option}
              <button class:active={form.companySize === option} type="button" onclick={() => setSingle('companySize', option)}>{option}</button>
            {/each}
          </div>
        </div>
      {/if}

      {#if current === 2}
        <div class="application-choice-group">
          <span>Orçamento previsto</span>
          <div class="application-chip-grid budget">
            {#each budgetOptions as option}
              <button class:active={form.budget === option} type="button" onclick={() => setSingle('budget', option)}>{option}</button>
            {/each}
          </div>
        </div>


        <div class="application-choice-group compact">
          <span>Canal de aquisição atual</span>
          <div class="application-chip-grid compact">
            {#each acquisitionOptions as option}
              <button class:active={form.acquisition === option} type="button" onclick={() => setSingle('acquisition', option)}>{option}</button>
            {/each}
          </div>
        </div>

        <div class="application-choice-group compact">
          <span>Urgência</span>
          <div class="application-chip-grid compact">
            {#each urgencyOptions as option}
              <button class:active={form.urgency === option} type="button" onclick={() => setSingle('urgency', option)}>{option}</button>
            {/each}
          </div>
        </div>
      {/if}

      {#if current === 3}
        <div class="application-choice-group">
          <span>Motivos da candidatura</span>
          <div class="application-chip-grid reasons">
            {#each reasonOptions as option}
              <button class:active={form.reasons.includes(option)} type="button" onclick={() => toggleReason(option)}>{option}</button>
            {/each}
          </div>
        </div>

        <label class="application-textarea">
          <span>Contexto adicional</span>
          <textarea bind:value={form.context} rows="7" placeholder="Explique brevemente o momento da empresa, o que já foi tentado e o que precisa mudar."></textarea>
        </label>
      {/if}

      {#if current === 4}
        <div class="application-summary">
          <dl>
            <div><dt>Responsável</dt><dd>{form.firstName} {form.lastName}</dd></div>
            <div><dt>Empresa</dt><dd>{form.company}</dd></div>
            <div><dt>Contato</dt><dd>{form.email}<br />{form.phone}</dd></div>
            <div><dt>CNPJ</dt><dd>{form.cnpjLater ? 'Prefiro informar depois' : form.cnpj}</dd></div>
            <div><dt>Site</dt><dd>{form.noWebsite ? 'Minha empresa não tem site' : form.website}</dd></div>
            <div><dt>Indústria</dt><dd>{form.industry}</dd></div>
            <div><dt>Orçamento</dt><dd>{form.budget}</dd></div>
              <div><dt>Motivos</dt><dd>{form.reasons.join(', ')}</dd></div>
          </dl>
        </div>
      {/if}
    </div>

    {#if touched && !canContinue}
      <p class="application-missing">Antes de continuar, preencha: {missingFields.join(', ')}.</p>
    {/if}

    {#if submitError}
      <p class="application-submit-error" role="alert">{submitError}</p>
    {/if}

    <footer class="application-controls">
      <button class="ghost" type="button" onclick={back} disabled={current === 0}>Voltar</button>
      {#if current < steps.length - 1}
        <button class="primary" type="button" onclick={next}>Continuar</button>
      {:else}
        <button class="primary" type="button" onclick={submit} disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar candidatura'}</button>
      {/if}
    </footer>
    {/if}
  </div>
</section>

<style>
  .application-flow {
    width: min(100% - clamp(2rem, 7vw, 8rem), 88rem);
    margin: 0 auto;
  }

  .application-frame {
    min-height: clamp(42rem, 76vh, 58rem);
    border: 1px solid rgba(244, 239, 231, 0.12);
    background:
      linear-gradient(145deg, rgba(167, 124, 61, 0.055), transparent 36%),
      linear-gradient(180deg, rgba(244, 239, 231, 0.052), rgba(244, 239, 231, 0.02));
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.34);
    padding: clamp(1.2rem, 3.2vw, 3rem);
  }

  .application-status {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: start;
  }

  .application-status p,
  .application-status span,
  label > span,
  .application-choice-group > span,
  .application-textarea > span,
  .application-summary dt,
  .application-thanks p,
  .application-thanks dt,
  .application-missing {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: 0.74rem;
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .application-status p,
  .application-choice-group > span,
  label > span,
  .application-textarea > span,
  .application-thanks p,
  .application-thanks dt {
    color: rgba(167, 124, 61, 0.78);
  }

  .application-status h2,
  .application-thanks h2 {
    max-width: min(13ch, 100%);
    overflow-wrap: anywhere;
    margin: 1rem 0 0;
    color: rgba(244, 239, 231, 0.94);
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(2.8rem, 5.6vw, 6.4rem);
    font-weight: 100;
    letter-spacing: 0;
    line-height: 0.92;
  }

  .application-status span {
    display: block;
    max-width: 100%;
    color: rgba(244, 239, 231, 0.72);
    overflow-wrap: anywhere;
  }

  .application-progress {
    height: 1px;
    margin-top: clamp(1.5rem, 3vw, 2.5rem);
    background: rgba(244, 239, 231, 0.14);
  }

  .application-progress span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #8f8a80, #a77c3d);
    transition: width 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .application-thanks {
    display: grid;
    align-content: center;
    gap: clamp(1.4rem, 3vw, 2.4rem);
    min-height: calc(clamp(42rem, 76vh, 58rem) - clamp(2.4rem, 6.4vw, 6rem));
  }

  .application-thanks p,
  .application-thanks h2 {
    margin: 0;
  }

  .application-thanks > div {
    display: grid;
    gap: 0.65rem;
    max-width: 42rem;
    border-top: 1px solid rgba(244, 239, 231, 0.16);
    padding-top: 1.2rem;
  }

  .application-thanks span {
    color: rgba(244, 239, 231, 0.74);
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: clamp(1rem, 1.16vw, 1.18rem);
    font-weight: 300;
    line-height: 1.62;
  }

  .application-thanks dl {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 0;
    border-top: 1px solid rgba(244, 239, 231, 0.14);
    border-left: 1px solid rgba(244, 239, 231, 0.14);
  }

  .application-thanks dl div {
    border-right: 1px solid rgba(244, 239, 231, 0.14);
    border-bottom: 1px solid rgba(244, 239, 231, 0.14);
    padding: 1rem;
  }

  .application-thanks dd {
    margin: 0.7rem 0 0;
    color: rgba(244, 239, 231, 0.74);
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .application-thanks .ghost {
    justify-self: start;
    min-width: 13rem;
    border: 1px solid rgba(244, 239, 231, 0.2);
    border-radius: 0;
    background: transparent;
    color: rgba(244, 239, 231, 0.74);
    cursor: pointer;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: 0.75rem;
    font-weight: 300;
    letter-spacing: 0;
    padding: 1rem 1.2rem;
    text-transform: uppercase;
    transition: border-color 240ms ease, color 240ms ease;
  }

  .application-thanks .ghost:hover {
    border-color: rgba(167, 124, 61, 0.72);
    color: rgba(244, 239, 231, 0.94);
  }

  .application-step {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2.2rem);
    margin-top: clamp(1.6rem, 3vw, 2.8rem);
  }

  .application-copy {
    max-width: 50rem;
    margin: 0;
    color: rgba(244, 239, 231, 0.76);
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: clamp(1rem, 1.16vw, 1.18rem);
    font-weight: 300;
    line-height: 1.65;
  }

  .application-grid {
    display: grid;
    gap: 1rem;
  }

  .application-grid.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .wide {
    grid-column: 1 / -1;
  }

  label,
  .application-textarea {
    display: grid;
    gap: 0.72rem;
  }

  label.disabled {
    opacity: 0.5;
  }

  input,
  textarea {
    width: 100%;
    border: 0;
    border-bottom: 1px solid rgba(244, 239, 231, 0.24);
    border-radius: 0;
    background: transparent;
    color: rgba(244, 239, 231, 0.94);
    font: inherit;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: clamp(1.2rem, 2vw, 1.85rem);
    font-weight: 300;
    line-height: 1.35;
    padding: 0.85rem 0;
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(244, 239, 231, 0.74);
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: rgba(167, 124, 61, 0.78);
  }

  input:disabled {
    cursor: not-allowed;
  }

  textarea {
    min-height: 11rem;
    resize: vertical;
    font-size: clamp(1rem, 1.3vw, 1.24rem);
    line-height: 1.65;
  }

  .application-check {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    min-height: 100%;
    border: 1px solid rgba(244, 239, 231, 0.14);
    padding: 1rem;
  }

  .application-check input {
    width: auto;
    accent-color: #a77c3d;
  }

  .application-choice-group {
    display: grid;
    gap: 1rem;
  }

  .application-choice-group.compact {
    gap: 0.85rem;
  }

  .application-chip-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.72rem;
  }

  .application-chip-grid.budget button {
    min-width: min(100%, 17rem);
  }

  .application-chip-grid.reasons button {
    max-width: 24rem;
  }

  .application-chip-grid button {
    border: 1px solid rgba(244, 239, 231, 0.18);
    border-radius: 999px;
    background: rgba(244, 239, 231, 0.045);
    color: rgba(244, 239, 231, 0.72);
    cursor: pointer;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: 0.98rem;
    font-weight: 300;
    line-height: 1.25;
    padding: 0.82rem 1rem;
    text-align: left;
    transition:
      background-color 240ms ease,
      border-color 240ms ease,
      color 240ms ease,
      transform 240ms ease;
  }

  .application-chip-grid button:hover,
  .application-chip-grid button.active {
    border-color: rgba(167, 124, 61, 0.72);
    background: rgba(167, 124, 61, 0.14);
    color: rgba(244, 239, 231, 0.96);
    transform: translateY(-1px);
  }

  .application-summary dl {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
    margin: 0;
    border-top: 1px solid rgba(244, 239, 231, 0.14);
    border-left: 1px solid rgba(244, 239, 231, 0.14);
  }

  .application-summary div {
    border-right: 1px solid rgba(244, 239, 231, 0.14);
    border-bottom: 1px solid rgba(244, 239, 231, 0.14);
    padding: 1rem;
  }

  .application-summary dt {
    color: rgba(167, 124, 61, 0.78);
  }

  .application-summary dd {
    margin: 0.7rem 0 0;
    color: rgba(244, 239, 231, 0.72);
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.5;
  }

  .application-honeypot {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .application-missing,
  .application-submit-error {
    margin: 1.2rem 0 0;
    color: #e37b72;
  }

  .application-controls {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: clamp(1.6rem, 3vw, 2.8rem);
    border-top: 1px solid rgba(244, 239, 231, 0.14);
    padding-top: 1.25rem;
  }

  .application-controls button {
    min-width: 11rem;
    border: 1px solid rgba(244, 239, 231, 0.2);
    border-radius: 0;
    cursor: pointer;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: 0.75rem;
    font-weight: 300;
    letter-spacing: 0;
    padding: 1rem 1.2rem;
    text-transform: uppercase;
    transition:
      background-color 240ms ease,
      border-color 240ms ease,
      color 240ms ease,
      opacity 240ms ease;
  }

  .application-controls button:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }

  .application-controls .ghost {
    background: transparent;
    color: rgba(244, 239, 231, 0.74);
  }

  .application-controls .primary {
    border-color: rgba(167, 124, 61, 0.54);
    background: rgba(244, 239, 231, 0.92);
    color: #080808;
  }

  .application-controls .primary:hover {
    background: #ffffff;
  }

  @media (max-width: 760px) {
    .application-flow {
      width: min(100% - 1.5rem, 88rem);
    }

    .application-frame {
      min-height: auto;
      padding: 1rem;
    }

    .application-status {
      display: grid;
      gap: 1rem;
    }

    .application-grid.two,
    .application-summary dl,
    .application-thanks dl {
      grid-template-columns: 1fr;
    }

    .application-check {
      min-height: auto;
    }

    .application-chip-grid button,
    .application-chip-grid.budget button {
      width: 100%;
      max-width: none;
    }

    .application-controls {
      position: sticky;
      bottom: 0;
      margin-inline: -1rem;
      background: rgba(8, 8, 8, 0.94);
      padding: 1rem;
    }

    .application-controls button {
      min-width: 0;
      flex: 1;
    }
  }
</style>
