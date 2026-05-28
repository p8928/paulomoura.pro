<script lang="ts">
  import { onMount } from 'svelte';

  let open = $state(false);
  let lightSurface = $state(false);

  onMount(() => {
    let frame = 0;

    const updateTheme = () => {
      frame = 0;
      lightSurface = window.scrollY >= window.innerHeight - 96;
    };

    const requestThemeUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateTheme);
    };

    updateTheme();
    window.addEventListener('scroll', requestThemeUpdate, { passive: true });
    window.addEventListener('resize', requestThemeUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestThemeUpdate);
      window.removeEventListener('resize', requestThemeUpdate);
    };
  });

  const darkMode = $derived(open || lightSurface);
  const logoSrc = $derived(darkMode ? '/images/logo/main_logo_dark.svg' : '/images/logo/main_logo_white.svg');
</script>

<a
  href="/"
  aria-label="Moura - pagina inicial"
  class="fixed left-6 top-6 z-50 block transition duration-500 lg:left-10 lg:top-8"
>
  <img src={logoSrc} alt="Moura" class="h-auto w-20 lg:w-24" />
</a>

<button
  class="group fixed right-6 top-6 z-50 grid h-11 w-14 place-items-center lg:right-10 lg:top-8"
  type="button"
  aria-label={open ? 'Fechar menu' : 'Abrir menu'}
  aria-expanded={open}
  aria-controls="hero-overlay-menu"
  onclick={() => (open = !open)}
>
  <span class="relative block h-5 w-10" aria-hidden="true">
    <span
      class={`absolute right-0 top-0 h-px transition-all duration-500 ease-out ${darkMode ? 'bg-moura-black' : 'bg-ivory'} ${open ? 'w-10 translate-y-[9px] rotate-45' : 'w-10 group-hover:w-8'}`}
    ></span>
    <span
      class={`absolute right-0 top-[9px] h-px transition-all duration-500 ease-out ${darkMode ? 'bg-moura-black' : 'bg-ivory'} ${open ? 'w-0 opacity-0' : 'w-6 group-hover:w-10'}`}
    ></span>
    <span
      class={`absolute right-0 top-[18px] h-px transition-all duration-500 ease-out ${darkMode ? 'bg-moura-black' : 'bg-ivory'} ${open ? 'w-10 -translate-y-[9px] -rotate-45' : 'w-8 group-hover:w-5'}`}
    ></span>
  </span>
</button>

<div
  id="hero-overlay-menu"
  class={`fixed inset-0 z-40 bg-ivory transition duration-700 ease-out ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
  aria-hidden={!open}
></div>
