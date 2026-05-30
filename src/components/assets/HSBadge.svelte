<script lang="ts">
  export let size: 'small' | 'medium' | 'large' | 'compact' = 'compact';
  export let scale = 1;

  const sizeScale = {
    compact: 1,
    small: 1.18,
    medium: 1.55,
    large: 2.15,
  };

  $: badgeScale = sizeScale[size] * scale;
</script>

<div class="hs-badge" style={'--hs-scale: ' + badgeScale}>
  <div class="hs-content-wrap">
    <div class="hs-content">
      <div class="hs-text">HS</div>
      <div class="hs-divider"></div>
    </div>
    <p class="high-standards">High<br />Standards</p>
  </div>
</div>

<style>
  .hs-badge {
    position: relative;
    width: calc(56px * var(--hs-scale));
    padding: calc(4px * var(--hs-scale)) calc(6px * var(--hs-scale));
    overflow: hidden;
    border: 1px solid rgba(220, 38, 38, 0.58);
    border-radius: calc(6px * var(--hs-scale));
    background: linear-gradient(to bottom, #0a0a0a, #000, #0a0a0a);
    color: #fff;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transition: all 0.4s ease;
  }

  .hs-badge::before {
    content: "M";
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: transparent;
    font-size: calc(280px * var(--hs-scale));
    font-weight: 700;
    line-height: 1;
    user-select: none;
    background:
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0 1px, transparent 1px 2px),
      linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(0, 0, 0, 0.1) 100%);
    -webkit-background-clip: text, text;
    background-clip: text, text;
    box-shadow: inset 0 0 60px rgba(220, 38, 38, 0.24);
    filter: drop-shadow(0 0 40px rgba(220, 38, 38, 0.58));
    opacity: 1;
    transition: box-shadow 0.4s ease, filter 0.4s ease;
  }

  .hs-badge:hover {
    border-color: rgba(220, 38, 38, 0.58);
    transform: translateY(-2px) scale(1.03);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 8px 20px rgba(220, 38, 38, 0.18);
  }

  .hs-content-wrap {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: calc(6px * var(--hs-scale));
  }

  .hs-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(4px * var(--hs-scale));
  }

  .hs-text {
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(28px * var(--hs-scale));
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.05em;
    color: #fff;
    text-shadow:
      0 0 40px rgba(255, 255, 255, 0.3),
      0 0 10px rgba(255, 255, 255, 0.5),
      0 4px 8px rgba(0, 0, 0, 0.8);
  }

  .hs-divider {
    width: calc(24px * var(--hs-scale));
    height: calc(2px * var(--hs-scale));
    background: linear-gradient(to right, transparent, #dc2626, transparent);
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.72);
    transition: all 0.4s ease;
  }

  .high-standards {
    margin: 0;
    color: #e4e4e7;
    font-size: calc(5px * var(--hs-scale));
    line-height: 1.25;
    letter-spacing: 0.35em;
    text-align: center;
    text-transform: uppercase;
  }
</style>
