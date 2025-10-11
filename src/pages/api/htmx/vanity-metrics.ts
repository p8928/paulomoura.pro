import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  const html = `
    <style>
      .htmx-content {
        max-width: 700px;
        margin: var(--space-xl) auto;
        padding: var(--space-lg);
        background: var(--color-white);
        border-radius: var(--radius-lg);
        box-shadow: 
          0 8px 20px -8px rgba(0, 0, 0, 0.2),
          0 3px 5px -2px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 1;
        opacity: 0;
        animation: fadeIn 0.8s ease forwards;
      }
      
      .htmx-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--space-xl);
        margin-bottom: var(--space-md);
        padding-bottom: var(--space-sm);
        border-bottom: 1px solid var(--color-border-light);
      }
      
      .htmx-content h3 {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-light);
        letter-spacing: var(--letter-spacing-wide);
        margin: 0;
        color: var(--color-accent-accessible);
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: var(--font-size-xl);
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: var(--space-xs);
        margin: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-round);
        transition: background-color var(--transition-fast);
      }
      
      .close-btn:hover {
        background-color: var(--color-background-secondary);
      }
      
      .htmx-content p {
        font-size: var(--font-size-md);
        line-height: var(--line-height-relaxed);
        margin-bottom: var(--space-md);
        color: var(--color-text-primary);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    </style>
    
    <div class=\"htmx-content\" id=\"vanity-metrics-anchor\">
      <div class=\"htmx-header\">
        <h3>MÉTRICAS DE VAIDADE</h3>
        <button class=\"close-btn\" hx-get=\"/api/htmx/clear-content\" hx-target=\"#htmx-content\" hx-swap=\"innerHTML\">&times;</button>
      </div>
      <p>Se você procura estar em vários canais porque acredita que sua marca deve estar em todos os lugares — à base do \"preciso ser visto para ser lembrado\" — certamente está em busca de reações, compartilhamentos e seguidores.</p>
      <p>Com o tempo, as empresas se veem publicando fotos de confraternização da equipe no Instagram esperando despertar algo genuíno nas pessoas. A verdade é que elas não precisam ser onipresentes. E nem deveriam querer ser.</p>
      <p>O problema central é a busca por aceitação em forma de likes. Se um restaurante publica a foto de um prato e muitas pessoas reagem bem ao post, temos sim um indicador que leva a marca para outras pessoas e trabalha aspectos emocionais relevantes. Mas percebe que o importante aqui não é o like, e sim o despertar de emoções para um produto cuja venda se dá por fatores emocionais? O nome disso é propósito.</p>
      <p>Às vezes, um outro post não causou a mesma repercussão em likes e shares, porém gerou oportunidades de vendas equivalentes ou superiores — porque a intencionalidade surtiu efeito na parte qualificada da sua audiência. É a estratégia por trás do conteúdo que gera vendas e eleva autoridade. Isso significa construir laços e obter lealdade de pessoas que se tornam defensores e promotores da marca.</p>
    </div>
    <script>
      // Atualiza a classe ativa no retângulo correspondente
      document.querySelectorAll('.static-rect').forEach(rect => {
        rect.classList.remove('active');
      });
      const currentRect = document.querySelector('#rect3');
      if (currentRect) {
        currentRect.classList.add('active');
      }
      
      // Rolar para o elemento quando o conteúdo for carregado
      document.addEventListener('htmx:afterOnLoad', function(evt) {
        const element = document.getElementById('vanity-metrics-anchor');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    </script>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};