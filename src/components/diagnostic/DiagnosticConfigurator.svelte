<script lang="ts">
  type Stage = 'contexto' | 'escopo' | 'agenda';

  let stage = $state<Stage>('contexto');
  let budget = $state('');
  let region = $state('Sao Paulo capital');
  let need = $state('reposicionamento');
  let timeline = $state('30 a 60 dias');

  const stages: { id: Stage; label: string }[] = [
    { id: 'contexto', label: 'Contexto' },
    { id: 'escopo', label: 'Escopo' },
    { id: 'agenda', label: 'Agenda' },
  ];

  const summary = $derived(
    `Lead interessado em ${need}, na regiao ${region}, com horizonte de ${timeline}. Orcamento declarado: ${budget || 'nao informado'}.`
  );
</script>

<section class="border border-line bg-panel p-5 lg:p-7" aria-labelledby="diagnostic-title">
  <div class="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
    {#each stages as item}
      <button
        class={`border px-3 py-2 ${stage === item.id ? 'border-ink text-ink' : 'border-line text-muted'}`}
        type="button"
        onclick={() => (stage = item.id)}
      >
        {item.label}
      </button>
    {/each}
  </div>

  <div class="mt-8 grid gap-6">
    <div>
      <p class="text-sm uppercase tracking-[0.18em] text-gold">Diagnostico consultivo</p>
      <h2 id="diagnostic-title" class="mt-3 font-serif text-4xl leading-tight">
        Uma candidatura guiada por substancia, escopo e momento.
      </h2>
    </div>

    {#if stage === 'contexto'}
      <label class="grid gap-2 text-sm text-muted">
        Necessidade dominante
        <select bind:value={need} class="border border-line bg-paper px-4 py-3 text-ink">
          <option value="reposicionamento">Reposicionamento</option>
          <option value="branding e SEO">Branding e SEO</option>
          <option value="site de alta performance">Site de alta performance</option>
          <option value="presenca local">Presenca local</option>
        </select>
      </label>
      <label class="grid gap-2 text-sm text-muted">
        Regiao
        <select bind:value={region} class="border border-line bg-paper px-4 py-3 text-ink">
          <option>Sao Paulo capital</option>
          <option>Jundiai</option>
          <option>Sorocaba</option>
          <option>Campinas</option>
          <option>Brasil, empresa digital</option>
        </select>
      </label>
    {:else if stage === 'escopo'}
      <label class="grid gap-2 text-sm text-muted">
        Horizonte desejado
        <select bind:value={timeline} class="border border-line bg-paper px-4 py-3 text-ink">
          <option>30 a 60 dias</option>
          <option>60 a 90 dias</option>
          <option>90 a 120 dias</option>
          <option>Sem urgencia</option>
        </select>
      </label>
      <label class="grid gap-2 text-sm text-muted">
        Estimativa de orcamento reservada pelo cliente
        <input
          bind:value={budget}
          class="border border-line bg-paper px-4 py-3 text-ink"
          placeholder="Ex.: prefiro informar em conversa"
        />
      </label>
    {:else}
      <div class="grid gap-3 text-sm text-muted">
        <p class="border border-line bg-paper p-4 text-ink">{summary}</p>
        <p>Primeiros horarios disponiveis devem respeitar uma janela minima de 9 dias.</p>
        <a class="inline-flex w-fit border border-ink px-5 py-3 text-ink transition hover:bg-ink hover:text-panel" href="https://wa.me/" rel="noreferrer">
          Continuar pelo WhatsApp
        </a>
      </div>
    {/if}
  </div>
</section>
