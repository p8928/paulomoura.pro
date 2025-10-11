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
      
      .quote-highlight {
        font-style: italic;
        padding: var(--space-md) var(--space-lg);
        margin: var(--space-md) 0;
        border-left: 3px solid var(--color-accent-accessible);
        background-color: var(--color-background-secondary);
        border-radius: 0 var(--radius-md) var(--radius-md) 0;
        color: var(--color-text-primary);
      }
      
      .quote-highlight footer {
        display: block;
        text-align: right;
        font-style: normal;
        font-weight: var(--font-weight-bold);
        margin-top: var(--space-sm);
        color: var(--color-accent-accessible);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    </style>
    
    <div class=\"htmx-content\" id=\"keywords-anchor\">
      <div class=\"htmx-header\">
        <h3>PESQUISA DE PALAVRA-CHAVE</h3>
        <button class=\"close-btn\" hx-get=\"/api/htmx/clear-content\" hx-target=\"#htmx-content\" hx-swap=\"innerHTML\">&times;</button>
      </div>
      <p>Analizar desempenho de palavras-chave é útil para estimativas. Quando usamos esse tipo de informação para guiar esforços de SEO, estamos diante de uma visão obsoleta.</p>
      <p>Mas vamos supor que você ainda acredite no potencial da correspondência por termos de pesquisa. Já pensou em quantas outras empresas do seu segmento tomaram a mesma iniciativa nos últimos 10 anos? Você está diante do que chamamos oceano vermelho.</p>
      <blockquote class=\"quote-highlight\">
        \"Concentrar-se nos oceanos vermelhos é aceitar os principais fatores restritivos da guerra — território limitado e necessidade de derrotar o inimigo para realizar os objetivos — e negar a força diferenciadora do mundo dos negócios: a capacidade de criar novos espaços inexplorados.\"
        <footer>Kim & Mauborgne, \"A Estratégia do Oceano Azul\"</footer>
      </blockquote>
      <p>Sobressair-se com uma estratégia tão atrasada gera trabalho árduo e caro. Você pode estar gastando muito com um time de escritores \"programados\" para postar conteúdo em massa e ainda ver concorrentes inferiores aparecerem na sua frente no Google.</p>
      <p>É hora de libertar-se do que atrasa seu crescimento. Deixe de lado a corrida contra seus concorrentes, vista a identidade que melhor te define e vá ao encontro do público que perceberá rapidamente seu valor, tendo o Google como chofer. Deixe seu branding fazer esse trabalho.</p>
    </div>
    <script>
      // Atualiza a classe ativa no retângulo correspondente
      document.querySelectorAll('.static-rect').forEach(rect => {
        rect.classList.remove('active');
      });
      const currentRect = document.querySelector('#rect2');
      if (currentRect) {
        currentRect.classList.add('active');
      }
      
      // Rolar para o elemento quando o conteúdo for carregado
      document.addEventListener('htmx:afterOnLoad', function(evt) {
        const element = document.getElementById('keywords-anchor');
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