<script lang="ts">
  let open = $state(false);
</script>

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
      class={`absolute right-0 top-0 h-px bg-ivory transition-all duration-500 ease-out ${open ? 'w-10 translate-y-[9px] rotate-45 bg-moura-black' : 'w-10 group-hover:w-8'}`}
    ></span>
    <span
      class={`absolute right-0 top-[9px] h-px bg-ivory transition-all duration-500 ease-out ${open ? 'w-0 opacity-0' : 'w-6 group-hover:w-10'}`}
    ></span>
    <span
      class={`absolute right-0 top-[18px] h-px bg-ivory transition-all duration-500 ease-out ${open ? 'w-10 -translate-y-[9px] -rotate-45 bg-moura-black' : 'w-8 group-hover:w-5'}`}
    ></span>
  </span>
</button>

<div
  id="hero-overlay-menu"
  class={`fixed inset-0 z-40 bg-ivory transition duration-700 ease-out ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
  inert={!open}
></div>
