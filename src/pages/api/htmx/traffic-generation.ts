import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  // Retorna o conteúdo HTMX normalmente
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
    
    <div class=\"htmx-content\" id=\"traffic-generation-anchor\">
      <div class=\"htmx-header\">
        <h3>GERAÇÃO DE TRÁFEGO</h3>
        <button class=\"close-btn\" hx-get=\"/api/htmx/clear-content\" hx-target=\"#htmx-content\" hx-swap=\"innerHTML\">&times;</button>
      </div>
      <p>É possível que você tenha tráfego, mas não conversões. A tática adotada foi clara: volume de conteúdo e link patrocinado para aumentar visibilidade.</p>
      <p>De fato, você aparece — mas para o público errado. É uma leitura equivocada que, além de ineficiente pela falta de base estratégica, aumenta seu custo de aquisição consideravelmente.</p>
      <p>Resultado: você mirou a solução, mas encontrou mais problemas. Resolver isso requer quebrar o paradigma do volume. Seu negócio não precisa de mais tráfego. Precisa de visitantes qualificados, propensos a converter.</p>
    </div>
    <script>
      // Atualiza a classe ativa no retângulo correspondente
      document.querySelectorAll('.static-rect').forEach(rect => {
        rect.classList.remove('active');
      });
      const currentRect = document.querySelector('#rect1');
      if (currentRect) {
        currentRect.classList.add('active');
      }
      
      // Rolar para o elemento quando o conteúdo for carregado
      document.addEventListener('htmx:afterOnLoad', function(evt) {
        const element = document.getElementById('traffic-generation-anchor');
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