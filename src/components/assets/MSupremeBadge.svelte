<script lang="ts">
  export let scale = 1;
</script>

<div class="supreme-badge" style={'--supreme-scale: ' + scale} role="img" aria-label="Moura Supreme">
  <div class="supreme-badge-inner">
    <div class="supreme-monogram">M</div>
    <div class="supreme-divider"></div>
    <p>Supreme</p>
  </div>
</div>

<style>
  .supreme-badge {
    position: relative;
    width: calc(56px * 2.15 * var(--supreme-scale));
    min-height: calc(60px * 2.15 * var(--supreme-scale));
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgba(167, 124, 61, 0.58);
    border-radius: calc(6px * 2.15 * var(--supreme-scale));
    background:
      radial-gradient(circle at 50% 8%, rgba(255, 230, 170, 0.2), transparent 28%),
      linear-gradient(180deg, #111 0%, #020202 48%, #0a0908 100%);
    box-shadow:
      0 26px 58px rgba(0, 0, 0, 0.26),
      inset 0 0 42px rgba(167, 124, 61, 0.12);
    transition: all 0.4s ease;
  }

  .supreme-badge:hover {
    border-color: rgba(167, 124, 61, 0.72);
    transform: translateY(-2px) scale(1.03);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 8px 20px rgba(167, 124, 61, 0.16),
      inset 0 0 48px rgba(167, 124, 61, 0.16);
  }

  .supreme-badge::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(115deg, transparent 0%, rgba(255, 244, 212, 0.12) 44%, transparent 56%),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 2px);
    opacity: 0.72;
  }

  .supreme-badge::after {
    content: "M";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(250px * var(--supreme-scale));
    font-weight: 700;
    line-height: 1;
    color: transparent;
    background: linear-gradient(180deg, rgba(167, 124, 61, 0.12), rgba(255, 255, 255, 0.025));
    -webkit-background-clip: text;
    background-clip: text;
  }

  .supreme-badge-inner {
    position: relative;
    z-index: 2;
    display: grid;
    justify-items: center;
    gap: calc(5px * 2.15 * var(--supreme-scale));
    padding: calc(5px * 2.15 * var(--supreme-scale));
  }

  .supreme-monogram {
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(28px * 2.15 * var(--supreme-scale));
    font-weight: 100;
    line-height: 0.9;
    color: #f5ead3;
    text-shadow:
      0 0 18px rgba(255, 234, 188, 0.24),
      0 5px 14px rgba(0, 0, 0, 0.75);
  }

  .supreme-divider {
    width: calc(24px * 2.15 * var(--supreme-scale));
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(167, 124, 61, 0.95), transparent);
    box-shadow: 0 0 10px rgba(167, 124, 61, 0.46);
  }

  .supreme-badge p {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: calc(5.6px * 2.15 * var(--supreme-scale));
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: rgba(244, 239, 231, 0.82);
  }
</style>
