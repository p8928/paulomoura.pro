<script lang="ts">
  const items = [
    {
      title: 'A empresa já entrega acima da média?',
      copy: 'A análise começa pelo que existe na prática: atendimento, reputação, diferenciais percebidos, maturidade digital e ambição. A candidatura só avança quando há base real para um trabalho Brand-Driven.',
    },
    {
      title: 'Há disponibilidade para uma revisão profunda?',
      copy: 'O processo exige acesso ao negócio, escuta e decisões estratégicas. A agenda é limitada porque a direção é próxima e conduzida por Paulo Moura.',
    },
    {
      title: 'Faz sentido avançar para uma proposta?',
      copy: 'A candidatura não funciona como pedido automático de orçamento. Ela permite avaliar prioridade, potencial e nível de exigência antes de qualquer proposta.',
    },
  ];

  let openIndex = $state(0);
</script>

<section data-nav-surface="light" class="application-section" aria-labelledby="application-title">
  <div class="application-shell">
    <div class="application-heading">
      <p class="application-kicker">Candidatura</p>
      <h2 id="application-title">
        <span>O próximo passo é uma avaliação de compatibilidade.</span>
      </h2>
    </div>

    <div class="application-accordion" aria-label="Critérios de candidatura">
      {#each items as item, index}
        <article class="application-accordion-item" class:is-open={openIndex === index}>
          <h3>
            <button
              type="button"
              aria-expanded={openIndex === index}
              aria-controls={"application-panel-" + index}
              onclick={() => (openIndex = index)}
            >
              <span>{item.title}</span>
              <span class="application-accordion-marker" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            id={"application-panel-" + index}
            class="application-accordion-panel"
            aria-hidden={openIndex !== index}
          >
            <p>{item.copy}</p>
          </div>
        </article>
      {/each}
    </div>

    <div class="application-action">
      <p class="application-action-title">Se houver aderência, o diagnóstico é o primeiro movimento.</p>
      <p class="application-action-copy">A partir dele, marca, presença e confiança digital passam a ser tratadas sob a mesma direção.</p>
      <a class="moura-button moura-button-dark" href="/candidatura">
      Iniciar candidatura</a>
    </div>
  </div>
</section>

<style>
  .application-section {
    position: relative;
    min-height: 100vh;
    background: var(--moura-ivory);
    color: var(--moura-black);
    padding: clamp(8rem, 12vw, 12rem) clamp(1.5rem, 4vw, 4.5rem) clamp(7rem, 11vw, 11rem);
    box-shadow: 0 -2rem 5rem rgba(0, 0, 0, 0.28);
  }

  .application-section::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 1px;
    background: rgba(8, 8, 8, 0.12);
    pointer-events: none;
  }

  .application-shell {
    display: grid;
    width: 100%;
    max-width: 88rem;
    margin-inline: auto;
    gap: clamp(4rem, 8vw, 7rem);
  }

  .application-heading {
    display: grid;
    gap: clamp(1rem, 2vw, 1.5rem);
  }

  .application-kicker {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(0.68rem, 0.78vw, 0.82rem);
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(8, 8, 8, 0.42);
  }

  .application-heading h2 {
    display: grid;
    gap: clamp(0.25rem, 0.8vw, 0.75rem);
    max-width: 15ch;
    margin: 0;
    font-family: "Outfit", "Avenir Next", "Segoe UI", sans-serif;
    font-size: clamp(3.5rem, 7.6vw, 8.8rem);
    font-weight: 100;
    line-height: 0.92;
    letter-spacing: 0;
    color: rgba(8, 8, 8, 0.9);
  }

  .application-heading h2 span {
    min-width: 0;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  .application-accordion {
    display: grid;
    max-width: 82rem;
    margin-left: auto;
    border-top: 1px solid rgba(8, 8, 8, 0.16);
  }

  .application-accordion-item {
    border-bottom: 1px solid rgba(8, 8, 8, 0.16);
  }

  .application-accordion-item h3 {
    margin: 0;
  }

  .application-accordion-item button {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 2rem;
    align-items: center;
    width: 100%;
    padding: clamp(1.35rem, 2.6vw, 2.35rem) 0;
    border: 0;
    background: transparent;
    color: rgba(8, 8, 8, 0.86);
    cursor: pointer;
    text-align: left;
  }

  .application-accordion-item button span:first-child {
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(2rem, 4.8vw, 5.6rem);
    font-weight: 300;
    line-height: 0.96;
    letter-spacing: 0;
    transition:
      color 520ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 520ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .application-accordion-marker {
    position: relative;
    width: clamp(2rem, 3vw, 3rem);
    height: clamp(2rem, 3vw, 3rem);
    border: 1px solid rgba(8, 8, 8, 0.28);
    border-radius: 999px;
    transition:
      border-color 520ms cubic-bezier(0.16, 1, 0.3, 1),
      background-color 520ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 520ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .application-accordion-marker::before,
  .application-accordion-marker::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 42%;
    height: 1px;
    background: rgba(8, 8, 8, 0.64);
    transform: translate(-50%, -50%);
    transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1), background-color 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .application-accordion-marker::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }

  .application-accordion-panel {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
      grid-template-rows 720ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 520ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .application-accordion-panel p {
    max-width: min(80vw, 42rem);
    min-height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(1rem, 1.16vw, 1.16rem);
    font-weight: 300;
    line-height: 1.6;
    letter-spacing: 0.01em;
    color: rgba(8, 8, 8, 0.6);
    transition: padding 720ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .application-accordion-item.is-open button span:first-child,
  .application-accordion-item button:hover span:first-child {
    color: rgba(8, 8, 8, 0.92);
    transform: translateX(0.05em);
  }

  .application-accordion-item.is-open .application-accordion-marker,
  .application-accordion-item button:hover .application-accordion-marker {
    border-color: rgba(111, 38, 61, 0.42);
    background: rgba(8, 8, 8, 0.025);
    transform: rotate(90deg);
  }

  .application-accordion-item.is-open .application-accordion-marker::after {
    opacity: 0;
  }

  .application-accordion-item.is-open .application-accordion-marker::before,
  .application-accordion-item.is-open .application-accordion-marker::after,
  .application-accordion-item button:hover .application-accordion-marker::before,
  .application-accordion-item button:hover .application-accordion-marker::after {
    background: rgba(111, 38, 61, 0.68);
  }

  .application-accordion-item.is-open .application-accordion-panel {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .application-accordion-item.is-open .application-accordion-panel p {
    padding: 0 0 clamp(1.4rem, 2.6vw, 2.4rem) 0;
  }

  .application-action {
    display: grid;
    justify-items: center;
    gap: clamp(1rem, 1.8vw, 1.4rem);
    max-width: min(86vw, 42rem);
    margin-inline: auto;
    padding-top: clamp(1rem, 2vw, 2rem);
    text-align: center;
  }

  .application-action-title,
  .application-action-copy {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-weight: 300;
    letter-spacing: 0.01em;
  }

  .application-action-title {
    font-size: clamp(1.5rem, 2.4vw, 2.55rem);
    line-height: 1.08;
    color: rgba(8, 8, 8, 0.84);
  }

  .application-action-copy {
    max-width: 34rem;
    font-size: clamp(0.96rem, 1.14vw, 1.1rem);
    line-height: 1.56;
    color: rgba(8, 8, 8, 0.58);
  }

  .application-action :global(a) {
    margin-top: clamp(1rem, 2.4vw, 2rem);
  }

  @media (max-width: 980px) {
    .application-accordion {
      margin-left: 0;
    }
  }

  @media (max-width: 767px) {
    .application-section {
      min-height: auto;
      padding-block: 6.5rem;
    }

    .application-heading h2 {
      max-width: 11ch;
      font-size: clamp(2.35rem, 9.5vw, 3.4rem);
      line-height: 1.02;
    }

    .application-accordion-item button {
      gap: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .application-accordion-item button span:first-child,
    .application-accordion-marker,
    .application-accordion-panel,
    .application-accordion-panel p {
      transition: none;
    }
  }
</style>
