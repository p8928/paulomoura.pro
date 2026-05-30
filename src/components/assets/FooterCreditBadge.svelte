<script lang="ts">
  import HSBadge from './HSBadge.svelte';

  export let href = 'https://paulomoura.pro/m-high-standards-klout/';
  export let label = 'MOURA High Standards';
  export let text = 'MOURA';
  export let showText = true;
  export let badgeSize: 'small' | 'medium' | 'large' | 'compact' = 'compact';
  export let scale = 1;
</script>

<a
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  class="footer-credit"
  aria-label={label}
>
  <div class="credit-badge">
    <HSBadge size={badgeSize} scale={scale} />
  </div>
  {#if showText}
    <span class="credit-text">{text}</span>
  {/if}
</a>

<style>
  .footer-credit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
    color: hsl(214, 40%, 60%);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .credit-badge {
    margin-bottom: 0;
  }

  .credit-text {
    font-family: 'Proxima Nova', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: hsl(0, 0%, 88%);
    background: linear-gradient(
      180deg,
      hsl(0, 0%, 96%) 0%,
      hsl(0, 0%, 82%) 48%,
      hsl(214, 10%, 68%) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.28em;
    line-height: 1;
    text-transform: uppercase;
    text-decoration: none;
    text-shadow:
      0 0 14px hsla(0, 0%, 100%, 0.08),
      0 0 28px hsla(214, 18%, 82%, 0.08);
  }

  .footer-credit .credit-text {
    color: hsl(0, 0%, 88%);
  }

  .footer-credit:hover {
    color: hsl(42, 34%, 62%);
  }
</style>
