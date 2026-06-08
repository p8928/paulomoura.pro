<script lang="ts">
  import { onMount } from 'svelte';

  let open = $state(false);
  let lightSurface = $state(false);
  let darkSurface = $state(true);
  let logoLink: HTMLAnchorElement;
  let menuButton: HTMLButtonElement;

  const overlayLinks = [
    { label: 'Moura', href: '/moura' },
    { label: 'Brand-Driven', href: '/brand-driven' },
    { label: 'M-Signature', href: '/m-signature' },
    { label: 'M-Direction', href: '/m-direction' },
    { label: 'Editorial', href: '/editorial' },
  ];

  const socialLinks = [
    {
      label: 'Instagram',
      href: '#',
      path: 'M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0',
    },
    {
      label: 'Facebook',
      href: '#',
      path: 'M16,2c-7.732,0-14,6.268-14,14,0,6.566,4.52,12.075,10.618,13.588v-9.31h-2.887v-4.278h2.887v-1.843c0-4.765,2.156-6.974,6.835-6.974,.887,0,2.417,.174,3.043,.348v3.878c-.33-.035-.904-.052-1.617-.052-2.296,0-3.183,.87-3.183,3.13v1.513h4.573l-.786,4.278h-3.787v9.619c6.932-.837,12.304-6.74,12.304-13.897,0-7.732-6.268-14-14-14Z',
    },
    {
      label: 'LinkedIn',
      href: '#',
      path: 'M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z',
    },
  ];

  onMount(() => {
    let frame = 0;
    const getSurface = (x: number, y: number) => {
      for (const element of document.elementsFromPoint(x, y)) {
        const surface = element.closest<HTMLElement>('[data-nav-surface]');
        if (surface) return surface;
      }

      return null;
    };

    const updateTheme = () => {
      frame = 0;

      if (!logoLink || !menuButton) {
        darkSurface = true;
        lightSurface = false;
        return;
      }

      const logoBox = logoLink.getBoundingClientRect();
      const menuBox = menuButton.getBoundingClientRect();
      const logoSurface = getSurface(logoBox.left + logoBox.width / 2, logoBox.top + logoBox.height / 2);
      const menuSurface = getSurface(menuBox.left + menuBox.width / 2, menuBox.top + menuBox.height / 2);
      const surface = menuSurface || logoSurface;
      const navSurface = surface?.dataset.navSurface;

      darkSurface = navSurface !== 'light';
      lightSurface = navSurface === 'light';
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
  const lightMode = $derived(!open && darkSurface);
  const logoSrc = $derived(darkMode ? '/images/logo/main_logo_dark.svg' : '/images/logo/main_logo_silver.svg');

  $effect(() => {
    document.documentElement.classList.toggle('is-overlay-open', open);
    document.body.classList.toggle('is-overlay-open', open);
    window.dispatchEvent(new CustomEvent('moura:scroll-lock', { detail: open }));

    return () => {
      document.documentElement.classList.remove('is-overlay-open');
      document.body.classList.remove('is-overlay-open');
      window.dispatchEvent(new CustomEvent('moura:scroll-lock', { detail: false }));
    };
  });
</script>

<a
  bind:this={logoLink}
  href="/"
  aria-label="Moura - pagina inicial"
  class="fixed left-6 top-6 z-50 block transition duration-500 lg:left-10 lg:top-8"
>
  <img src={logoSrc} alt="Moura" class="h-auto w-20 lg:w-24" />
</a>

<button
  bind:this={menuButton}
  class={`group fixed right-6 top-6 z-50 grid h-11 w-14 place-items-center lg:right-10 lg:top-8 ${open ? 'is-close-button' : ''}`}
  type="button"
  aria-label={open ? 'Fechar menu' : 'Abrir menu'}
  aria-expanded={open}
  aria-controls="hero-overlay-menu"
  onclick={() => (open = !open)}
>
  <span class="relative block h-5 w-10" aria-hidden="true">
    <span
      class={`absolute right-0 top-0 h-px transition-all duration-500 ease-out ${lightMode ? 'hamburger-line-silver' : 'hamburger-line-dark'} ${open ? 'w-10 translate-y-[9px] rotate-45' : 'w-10 group-hover:w-8'}`}
    ></span>
    <span
      class={`absolute right-0 top-[9px] h-px transition-all duration-500 ease-out ${lightMode ? 'hamburger-line-silver' : 'hamburger-line-dark'} ${open ? 'w-0 opacity-0' : 'w-6 group-hover:w-10'}`}
    ></span>
    <span
      class={`absolute right-0 top-[18px] h-px transition-all duration-500 ease-out ${lightMode ? 'hamburger-line-silver' : 'hamburger-line-dark'} ${open ? 'w-10 -translate-y-[9px] -rotate-45' : 'w-8 group-hover:w-5'}`}
    ></span>
  </span>
</button>

<div
  id="hero-overlay-menu"
  class={`fixed inset-0 z-40 bg-ivory text-moura-black transition duration-700 ease-out ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
  aria-hidden={!open}
>
  <div class="relative min-h-screen px-6 lg:px-10">
    <nav aria-label="Menu aberto" class="absolute left-6 top-1/2 translate-y-[calc(-50%+2rem)] lg:left-10">
      <ul class="grid gap-2 lg:gap-3">
        {#each overlayLinks as link, index}
          <li
            class={`overlay-menu-item ${open ? 'overlay-menu-item-open' : ''}`}
            style={`--item-index: ${index}`}
          >
            <a class="overlay-menu-link" href={link.href} onclick={() => (open = false)}>{link.label}</a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="absolute bottom-8 right-6 text-right lg:right-10">
      <div class="overlay-contact">
        <p>telefone: <a href="tel:+5511922305905">(11) 92230—5905</a></p>
        <p>e-mail: <a href="mailto:contato@paulomoura.pro">contato@paulomoura.pro</a></p>
      </div>
      <div class="mt-7 flex justify-end gap-4">
        {#each socialLinks as social}
          <a class="overlay-social-link" href={social.href} aria-label={social.label}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d={social.path} fill-rule={social.label === 'LinkedIn' ? 'evenodd' : undefined}></path>
            </svg>
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .hamburger-line-silver {
    background: linear-gradient(105deg, #d2cec5 0%, #eee9df 42%, #c7c2b9 100%);
    background-size: 120% 100%;
    background-position: 50% 50%;
  }

  .hamburger-line-dark {
    background: #090909;
  }

  .overlay-menu-item {
    opacity: 0;
    transform: translateY(18px);
    transition:
      opacity 680ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 680ms cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--item-index) * 72ms + 180ms);
  }

  .overlay-menu-item-open {
    opacity: 1;
    transform: translateY(0);
  }

  .overlay-menu-link {
    display: inline-flex;
    align-items: center;
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(3.05rem, 8vw, 8.4rem);
    font-weight: 700;
    min-height: 44px;
    line-height: 0.86;
    letter-spacing: 0;
    color: rgba(8, 8, 8, 0.9);
    transition: color 420ms cubic-bezier(0.16, 1, 0.3, 1), transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .overlay-menu-link:hover {
    color: rgba(8, 8, 8, 0.56);
    transform: translateX(0.12em);
  }

  .overlay-contact {
    font-family: "Neue Haas Display", "Outfit", "Avenir Next", sans-serif;
    font-size: clamp(0.85rem, 1.05vw, 1rem);
    font-weight: 300;
    line-height: 1.75;
    letter-spacing: 0.04em;
    color: rgba(8, 8, 8, 0.7);
  }

  .overlay-contact a,
  .overlay-social-link {
    color: rgba(8, 8, 8, 0.9);
    transition: color 360ms cubic-bezier(0.16, 1, 0.3, 1), opacity 360ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .overlay-contact a:hover,
  .overlay-social-link:hover {
    color: rgba(8, 8, 8, 0.56);
  }

  .overlay-social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    opacity: 0.84;
  }

  .overlay-contact a {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
  }

  @media (max-width: 640px) {
    .overlay-menu-link {
      min-height: 48px;
      line-height: 0.94;
    }

    .overlay-contact {
      line-height: 1.25;
    }
  }


  .is-close-button {
    transition: transform 520ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .is-close-button:hover {
    transform: rotate(90deg) scale(0.92);
  }

  .is-close-button:hover span span:first-child,
  .is-close-button:hover span span:last-child {
    box-shadow: 0 0 14px rgba(8, 8, 8, 0.18);
  }
</style>
