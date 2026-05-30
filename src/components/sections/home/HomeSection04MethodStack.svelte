<script lang="ts">
  import { onMount } from 'svelte';

  const cards = [
    {
      number: '01',
      title: 'Diagnóstico',
      copy: 'Antes da estética, da campanha ou da otimização, existe leitura. O processo começa investigando negócio, mercado, reputação, diferenciais, público, sinais de confiança e pontos de atrito na experiência atual.',
    },
    {
      number: '02',
      title: 'Direção de marca',
      copy: 'A substância identificada ganha critério: posicionamento, personalidade, linguagem, hierarquia de mensagens e parâmetros para que a marca se manifeste sem cair no genérico.',
    },
    {
      number: '03',
      title: 'Presença digital',
      copy: 'Site, conteúdo, SEO, GEO, AEO e presença local passam a operar como extensão da marca. Cada ponto de contato comunica, organiza e reforça aquilo que o negócio precisa tornar legível.',
    },
    {
      number: '04',
      title: 'Experiência e confiança',
      copy: 'A percepção construída no digital precisa encontrar lastro na realidade: consistência de dados, reputação, avaliações, atendimento, promessa e entrega. Sofisticação só sustenta valor quando é coerente.',
    },
  ];

  let section: HTMLElement;
  let progress = $state(0);
  let viewportHeight = $state(900);

  const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const ease = (value: number) => 1 - Math.pow(1 - value, 4);

  const cardProgress = (index: number) => {
    const start = 0.14 + index * 0.18;
    const end = start + 0.22;
    return ease(clamp((progress - start) / (end - start)));
  };

  const cardStyle = (index: number) => {
    const t = cardProgress(index);
    const finalOffset = index * 72;
    const enterOffset = viewportHeight * 0.78;
    const y = enterOffset + (finalOffset - enterOffset) * t;
    const opacity = 0.18 + t * 0.82;
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
        <h2 id="method-stack-title">Da substância ao sistema.</h2>
        <p>
          Brand-Driven é um método para organizar o que existe de verdadeiro no negócio e fazer dessa substância a base da sua presença digital.
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
    <p>Em vez de adicionar uma camada artificial de comunicação, o método organiza o negócio para ser compreendido com mais precisão e fidelidade pelo cliente certo.</p>
    <a class="moura-button moura-button-light" href="/diagnostico">Iniciar diagnóstico</a>
  </div>
</section>

<style>
  .method-scroll-section {
    position: relative;
    height: 390vh;
    background:
      radial-gradient(circle at 18% 14%, rgba(111, 38, 61, 0.18), transparent 34%),
      radial-gradient(circle at 82% 70%, rgba(167, 124, 61, 0.08), transparent 30%),
      linear-gradient(145deg, #050505 0%, #10100f 48%, #060606 100%);
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
    color: rgba(244, 239, 231, 0.42);
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
    max-width: min(86vw, 34rem);
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(1.02rem, 1.32vw, 1.32rem);
    font-weight: 300;
    line-height: 1.52;
    letter-spacing: 0.01em;
    color: rgba(244, 239, 231, 0.62);
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
    border: 1px solid rgba(244, 239, 231, 0.14);
    border-top-color: rgba(244, 239, 231, 0.26);
    padding: clamp(1.9rem, 3.3vw, 3.1rem);
    background:
      linear-gradient(180deg, rgba(244, 239, 231, 0.045), rgba(244, 239, 231, 0.014)),
      linear-gradient(145deg, rgba(18, 18, 17, 0.98), rgba(6, 6, 6, 0.99));
    box-shadow:
      0 -1.25rem 3.25rem rgba(0, 0, 0, 0.38),
      0 1.5rem 4rem rgba(0, 0, 0, 0.24);
    opacity: var(--card-opacity);
    transform: translate3d(0, var(--card-y), 0) scale(var(--card-scale));
    transform-origin: center top;
    will-change: transform, opacity;
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
    color: rgba(244, 239, 231, 0.58);
  }

  .method-scroll-outro {
    background: #060606;
    color: var(--moura-ivory);
    padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 4vw, 4.5rem) clamp(6rem, 10vw, 10rem);
  }

  .method-scroll-outro-shell {
    display: grid;
    grid-template-columns: minmax(0, 34rem) auto minmax(0, 18rem);
    align-items: center;
    gap: clamp(2rem, 5vw, 5rem);
    width: 100%;
    max-width: 88rem;
    margin-inline: auto;
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
    color: rgba(244, 239, 231, 0.64);
  }

  .method-scroll-outro :global(a) {
    justify-self: center;
    transform: translateX(clamp(8rem, 18vw, 20rem));
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
