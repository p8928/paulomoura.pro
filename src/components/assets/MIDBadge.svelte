<script lang="ts">
  export let scale = 1;
</script>

<div class="id-badge" style={'--id-scale: ' + scale} role="img" aria-label="Moura Identity">
  <div class="id-badge-inner">
    <div class="id-mark">ID</div>
    <div class="id-divider"></div>
    <p>Moura<br />Identity</p>
  </div>
</div>

<style>
  .id-badge {
    position: relative;
    width: calc(56px * 2.15 * var(--id-scale));
    min-height: calc(60px * 2.15 * var(--id-scale));
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgba(92, 132, 146, 0.62);
    border-radius: calc(6px * 2.15 * var(--id-scale));
    background:
      radial-gradient(circle at 50% 8%, rgba(178, 214, 224, 0.12), transparent 28%),
      radial-gradient(circle at 82% 78%, rgba(45, 58, 66, 0.36), transparent 38%),
      linear-gradient(180deg, #0f1112 0%, #020303 50%, #071014 100%);
    box-shadow:
      0 26px 58px rgba(0, 0, 0, 0.26),
      inset 0 0 42px rgba(92, 132, 146, 0.12);
    transition: all 0.4s ease;
  }

  .id-badge:hover {
    border-color: rgba(134, 181, 194, 0.76);
    transform: translateY(-2px) scale(1.03);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 8px 20px rgba(92, 132, 146, 0.18),
      inset 0 0 48px rgba(92, 132, 146, 0.16);
  }

  .id-badge::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(118deg, transparent 0%, rgba(178, 214, 224, 0.1) 44%, transparent 56%),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.024) 0 1px, transparent 1px 2px);
    opacity: 0.68;
  }

  .id-badge::after {
    content: "M";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(250px * var(--id-scale));
    font-weight: 700;
    line-height: 1;
    color: transparent;
    background: linear-gradient(180deg, rgba(92, 132, 146, 0.16), rgba(244, 239, 231, 0.025));
    -webkit-background-clip: text;
    background-clip: text;
  }

  .id-badge-inner {
    position: relative;
    z-index: 2;
    display: grid;
    justify-items: center;
    gap: calc(5px * 2.15 * var(--id-scale));
    padding: calc(5px * 2.15 * var(--id-scale));
  }

  .id-mark {
    font-family: "Outfit", "Avenir Next", sans-serif;
    font-size: calc(27px * 2.15 * var(--id-scale));
    font-weight: 100;
    line-height: 0.9;
    letter-spacing: -0.04em;
    color: #edf6f7;
    text-shadow:
      0 0 16px rgba(178, 214, 224, 0.24),
      0 5px 14px rgba(0, 0, 0, 0.75);
  }

  .id-divider {
    width: calc(24px * 2.15 * var(--id-scale));
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(134, 181, 194, 0.95), transparent);
    box-shadow: 0 0 10px rgba(92, 132, 146, 0.52);
  }

  .id-badge p {
    margin: 0;
    font-family: "Neue Haas Display", "Outfit", sans-serif;
    font-size: calc(5.3px * 2.15 * var(--id-scale));
    font-weight: 300;
    line-height: 1.18;
    letter-spacing: 0.3em;
    text-align: center;
    text-transform: uppercase;
    color: rgba(237, 246, 247, 0.84);
  }
</style>
