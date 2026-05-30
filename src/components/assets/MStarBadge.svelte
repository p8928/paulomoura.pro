<script lang="ts">
  export let scale = 1;
</script>

<div class="star-badge" style={'--star-scale: ' + scale} role="img" aria-label="Moura Star">
  <div class="star-badge-inner">
    <div class="star-symbol">★</div>
    <div class="star-divider"></div>
    <p>M-Star</p>
  </div>
</div>

<style>
  .star-badge {
    position: relative;
    width: calc(56px * 2.15 * var(--star-scale));
    min-height: calc(60px * 2.15 * var(--star-scale));
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgba(165, 34, 50, 0.64);
    border-radius: calc(6px * 2.15 * var(--star-scale));
    background:
      radial-gradient(circle at 50% 6%, rgba(216, 197, 154, 0.15), transparent 28%),
      radial-gradient(circle at 18% 82%, rgba(165, 34, 50, 0.22), transparent 34%),
      linear-gradient(180deg, #11100f 0%, #030202 50%, #100609 100%);
    box-shadow:
      0 26px 58px rgba(0, 0, 0, 0.26),
      inset 0 0 42px rgba(165, 34, 50, 0.12);
    transition: all 0.4s ease;
  }

  .star-badge:hover {
    border-color: rgba(165, 34, 50, 0.84);
    transform: translateY(-2px) scale(1.03);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 8px 20px rgba(165, 34, 50, 0.18),
      inset 0 0 48px rgba(165, 34, 50, 0.16);
  }

  .star-badge::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(118deg, transparent 0%, rgba(216, 197, 154, 0.1) 44%, transparent 56%),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.022) 0 1px, transparent 1px 2px);
    opacity: 0.68;
  }

  .star-badge::after {
    content: "M";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(250px * var(--star-scale));
    font-weight: 700;
    line-height: 1;
    color: transparent;
    background: linear-gradient(180deg, rgba(165, 34, 50, 0.16), rgba(216, 197, 154, 0.025));
    -webkit-background-clip: text;
    background-clip: text;
  }

  .star-badge-inner {
    position: relative;
    z-index: 2;
    display: grid;
    justify-items: center;
    gap: calc(5px * 2.15 * var(--star-scale));
    padding: calc(5px * 2.15 * var(--star-scale));
  }

  .star-symbol {
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(24px * 2.15 * var(--star-scale));
    font-weight: 300;
    line-height: 0.9;
    color: #d8c59a;
    text-shadow:
      0 0 16px rgba(216, 197, 154, 0.28),
      0 0 22px rgba(165, 34, 50, 0.22),
      0 5px 14px rgba(0, 0, 0, 0.75);
  }

  .star-divider {
    width: calc(24px * 2.15 * var(--star-scale));
    height: 1px;
    background: linear-gradient(to right, transparent, #a52232 45%, #d8c59a 55%, transparent);
    box-shadow: 0 0 10px rgba(165, 34, 50, 0.52);
  }

  .star-badge p {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: calc(5.6px * 2.15 * var(--star-scale));
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgba(244, 234, 215, 0.84);
  }
</style>
