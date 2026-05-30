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

<div class="hs-badge" style={'--hs-scale: ' + badgeScale} role="img" aria-label="Moura High Standards">
  <div class="hs-badge-inner">
    <div class="hs-mark">HS</div>
    <div class="hs-divider"></div>
    <p>High<br />Standards</p>
  </div>
</div>

<style>
  .hs-badge {
    position: relative;
    width: calc(56px * var(--hs-scale));
    min-height: calc(60px * var(--hs-scale));
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgba(220, 38, 38, 0.64);
    border-radius: calc(6px * var(--hs-scale));
    background:
      radial-gradient(circle at 50% 8%, rgba(255, 255, 255, 0.12), transparent 28%),
      radial-gradient(circle at 18% 82%, rgba(220, 38, 38, 0.2), transparent 34%),
      linear-gradient(180deg, #101010 0%, #020202 50%, #0b0304 100%);
    color: #fff;
    box-shadow:
      0 26px 58px rgba(0, 0, 0, 0.26),
      inset 0 0 42px rgba(220, 38, 38, 0.14);
    transition: all 0.4s ease;
  }

  .hs-badge:hover {
    border-color: rgba(220, 38, 38, 0.86);
    transform: translateY(-2px) scale(1.03);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 8px 20px rgba(220, 38, 38, 0.2),
      inset 0 0 48px rgba(220, 38, 38, 0.18);
  }

  .hs-badge::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(118deg, transparent 0%, rgba(255, 255, 255, 0.1) 44%, transparent 56%),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.024) 0 1px, transparent 1px 2px);
    opacity: 0.7;
  }

  .hs-badge::after {
    content: "M";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(250px * var(--hs-scale) / 2.15);
    font-weight: 700;
    line-height: 1;
    color: transparent;
    background: linear-gradient(180deg, rgba(220, 38, 38, 0.18), rgba(244, 239, 231, 0.025));
    -webkit-background-clip: text;
    background-clip: text;
  }

  .hs-badge-inner {
    position: relative;
    z-index: 2;
    display: grid;
    justify-items: center;
    gap: calc(5px * var(--hs-scale));
    padding: calc(5px * var(--hs-scale));
  }

  .hs-mark {
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(28px * var(--hs-scale));
    font-weight: 100;
    line-height: 0.9;
    letter-spacing: -0.05em;
    color: #fff;
    text-shadow:
      0 0 20px rgba(255, 255, 255, 0.24),
      0 0 16px rgba(220, 38, 38, 0.28),
      0 5px 14px rgba(0, 0, 0, 0.78);
  }

  .hs-divider {
    width: calc(24px * var(--hs-scale));
    height: 1px;
    background: linear-gradient(to right, transparent, #dc2626, transparent);
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.72);
  }

  .hs-badge p {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: calc(5.3px * var(--hs-scale));
    font-weight: 300;
    line-height: 1.18;
    letter-spacing: 0.34em;
    text-align: center;
    text-transform: uppercase;
    color: rgba(244, 239, 231, 0.84);
  }
</style>
