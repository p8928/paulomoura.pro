<script lang="ts">
  import { onMount } from 'svelte';

  const cards = [
    {
      number: '01',
      title: 'Diagnóstico',
      copy: 'O processo começa pela leitura do negócio: operação, mercado, atendimento, reputação, diferenciais percebidos, público e pontos de atrito na experiência atual.',
    },
    {
      number: '02',
      title: 'Direção de marca',
      copy: 'Verdades e impressões são separadas. O que sustenta autoridade vira posicionamento, linguagem, hierarquia de mensagens e critérios para a marca se manifestar sem cair no genérico.',
    },
    {
      number: '03',
      title: 'Presença digital',
      copy: 'Site, conteúdo, SEO, GEO, AEO e presença local passam a organizar os sinais que clientes, Google e IA precisam reconhecer.',
    },
    {
      number: '04',
      title: 'Experiência e confiança',
      copy: 'A percepção construída no digital precisa encontrar lastro na realidade: consistência de dados, avaliações, atendimento, promessa e entrega.',
    },
  ];

  let section: HTMLElement;
  let progress = $state(0);
  let viewportHeight = $state(900);

  const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const ease = (value: number) => value < 0.5 ? 4 * Math.pow(value, 3) : 1 - Math.pow(-2 * value + 2, 3) / 2;

  const cardProgress = (index: number) => {
    const start = 0.16 + index * 0.17;
    const end = start + 0.32;
    return ease(clamp((progress - start) / (end - start)));
  };

  const cardStyle = (index: number) => {
    const t = cardProgress(index);
    const finalOffset = index * 84;
    const enterOffset = viewportHeight * 0.92;
    const y = enterOffset + (finalOffset - enterOffset) * t;
    const opacity = 0.12 + t * 0.88;
    const scale = 0.985 + t * 0.015;

    return '--card-y: ' + y + 'px; --card-opacity: ' + opacity + '; --card-scale: ' + scale + '; --card-z: ' + (index + 1) + ';';
  };


  onMount(() => {
    let frame = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      frame = 0;
      viewportHeight = window.innerHeight;

      if (reduceMotion.matches) {
        progress = 1;
        return;
      }

      const start = section.offsetTop;
      const end = start + section.offsetHeight - window.innerHeight;
      progress = clamp((window.scrollY - start) / Math.max(1, end - start));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    reduceMotion.addEventListener('change', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      reduceMotion.removeEventListener('change', requestUpdate);
    };
  });
</script>

<section bind:this={section} class="method-scroll-section" aria-labelledby="method-stack-title" data-dark-surface data-nav-surface="dark">
  <div class="method-scroll-panel">
    <div class="method-scroll-shell">
      <div class="method-scroll-intro">
        <p class="method-scroll-kicker">Método</p>
        <h2 id="method-stack-title">Antes da execução, a leitura.</h2>
        <p>
          Depois da tese, vem o trabalho: investigar, decidir, estruturar e sustentar uma presença digital compatível com o que a empresa entrega.
        </p>
      </div>

      <div class="method-scroll-stage" aria-label="Etapas do método Brand-Driven">
        {#each cards as card, index}
          <article class="method-scroll-card" style={cardStyle(index)}>
            <span>{card.number}</span>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<section data-nav-surface="dark" class="method-scroll-outro">
  <div class="method-scroll-outro-shell">
    <p>O método interpreta o negócio antes de organizar sua presença. A tecnologia amplia a leitura, mas a direção continua humana.</p>
    <a class="moura-button moura-button-outline-light" href="/candidatura">
    Iniciar candidatura</a>
  </div>
</section>

<style>
  .method-scroll-section {
    position: relative;
    height: 460vh;
    background: #060606;
    color: var(--moura-ivory);
  }

  .method-scroll-panel {
    position: sticky;
    top: 0;
    display: grid;
    min-height: 100vh;
    overflow: clip;
    padding: clamp(8.5rem, 12vw, 11rem) clamp(1.5rem, 4vw, 4.5rem) clamp(4rem, 7vw, 7rem);
  }

  .method-scroll-shell {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(22rem, 0.78fr);
    gap: clamp(3rem, 8vw, 9rem);
    width: 100%;
    max-width: 88rem;
    margin-inline: auto;
  }

  .method-scroll-intro {
    display: grid;
    align-content: start;
    gap: clamp(0.65rem, 1.2vw, 1rem);
  }

  .method-scroll-kicker {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(0.68rem, 0.78vw, 0.82rem);
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(244, 239, 231, 0.72);
  }

  .method-scroll-intro h2 {
    max-width: 9.5ch;
    margin: 0;
    font-family: "Outfit", "Avenir Next", "Segoe UI", sans-serif;
    font-size: clamp(4rem, 9.6vw, 10.8rem);
    font-weight: 100;
    line-height: 0.9;
    letter-spacing: 0;
    color: rgba(244, 239, 231, 0.92);
  }

  .method-scroll-intro p:not(.method-scroll-kicker) {
    max-width: min(86vw, 32rem);
    margin: clamp(1.8rem, 4vw, 3.4rem) 0 0;
    border-top: 1px solid rgba(167, 124, 61, 0.26);
    padding-top: clamp(1.1rem, 2vw, 1.6rem);
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(1.02rem, 1.32vw, 1.32rem);
    font-weight: 300;
    line-height: 1.52;
    letter-spacing: 0.01em;
    color: rgba(244, 239, 231, 0.72);
  }

  .method-scroll-stage {
    position: relative;
    min-height: min(70vh, 48rem);
    align-self: start;
    margin-top: calc(clamp(5rem, 12vh, 8rem) - 2rem);
  }

  .method-scroll-card {
    position: absolute;
    inset: 0 0 auto;
    z-index: var(--card-z);
    display: grid;
    min-height: clamp(20rem, 38vh, 28rem);
    align-content: end;
    gap: clamp(1.15rem, 1.9vw, 1.65rem);
    border: 1px solid rgba(244, 239, 231, 0.12);
    border-top-color: rgba(167, 124, 61, 0.42);
    padding: clamp(1.8rem, 3.2vw, 3rem);
    background:
      linear-gradient(180deg, rgba(244, 239, 231, 0.035), rgba(244, 239, 231, 0.012)),
      #080808;
    box-shadow:
      0 -0.75rem 2.4rem rgba(0, 0, 0, 0.26),
      0 1.35rem 3.4rem rgba(0, 0, 0, 0.18);
    opacity: var(--card-opacity);
    transform: translate3d(0, var(--card-y), 0) scale(var(--card-scale));
    transform-origin: center top;
    will-change: transform, opacity;
  }

  .method-scroll-card::before {
    content: "";
    position: absolute;
    top: clamp(1.1rem, 2vw, 1.8rem);
    right: clamp(1.8rem, 3.2vw, 3rem);
    left: clamp(1.8rem, 3.2vw, 3rem);
    height: 1px;
    background: linear-gradient(90deg, rgba(167, 124, 61, 0.5), rgba(244, 239, 231, 0.16), transparent);
    pointer-events: none;
  }

  .method-scroll-card span {
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(0.68rem, 0.78vw, 0.82rem);
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.2em;
    color: rgba(167, 124, 61, 0.7);
  }

  .method-scroll-card h3 {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(2.2rem, 4vw, 4.5rem);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: 0;
    color: rgba(244, 239, 231, 0.9);
  }

  .method-scroll-card p {
    max-width: min(100%, 31rem);
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(0.94rem, 1.02vw, 1.08rem);
    font-weight: 300;
    line-height: 1.62;
    letter-spacing: 0.01em;
    color: rgba(244, 239, 231, 0.72);
  }

  .method-scroll-outro {
    background: #060606;
    color: var(--moura-ivory);
    padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 4vw, 4.5rem) clamp(6rem, 10vw, 10rem);
  }

  .method-scroll-outro-shell {
    display: grid;
    grid-template-columns: minmax(0, 42rem) auto;
    align-items: center;
    gap: clamp(2rem, 5vw, 5rem);
    width: 100%;
    max-width: 88rem;
    margin-inline: auto;
    border-top: 1px solid rgba(167, 124, 61, 0.28);
    padding-top: clamp(1.5rem, 3vw, 2.5rem);
  }

  .method-scroll-outro p {
    max-width: min(72vw, 34rem);
    margin: 0;
    border-left: 1px solid rgba(167, 124, 61, 0.34);
    padding-left: clamp(1rem, 1.8vw, 1.5rem);
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(1rem, 1.24vw, 1.22rem);
    font-weight: 300;
    line-height: 1.52;
    letter-spacing: 0.01em;
    color: rgba(244, 239, 231, 0.72);
  }

  .method-scroll-outro :global(a) {
    justify-self: end;
  }

  @media (max-width: 980px) {
    .method-scroll-section {
      height: auto;
    }

    .method-scroll-panel {
      position: static;
      overflow: visible;
      padding-block: 6.5rem;
    }

    .method-scroll-shell {
      grid-template-columns: 1fr;
      gap: 4rem;
    }

    .method-scroll-stage {
      display: grid;
      gap: 1.5rem;
      min-height: auto;
    }

    .method-scroll-card {
      position: static;
      min-height: auto;
      opacity: 1;
      transform: none;
      box-shadow: none;
    }

    .method-scroll-outro-shell {
      grid-template-columns: 1fr;
    }

    .method-scroll-outro p {
      max-width: 100%;
    }

    .method-scroll-outro :global(a) {
      justify-self: start;
      transform: none;
    }
  }

  @media (max-width: 767px) {
    .method-scroll-intro h2 {
      max-width: 8.5ch;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .method-scroll-section {
      height: auto;
    }

    .method-scroll-panel {
      position: static;
      overflow: visible;
    }

    .method-scroll-stage {
      display: grid;
      gap: 1.5rem;
      min-height: auto;
    }

    .method-scroll-card {
      position: static;
      opacity: 1;
      transform: none;
      box-shadow: none;
    }
  }
</style>
