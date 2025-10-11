import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  const html = `
    <style>
      .htmx-contact-content {
        max-width: 700px;
        margin: var(--space-xl) auto;
        padding: var(--space-xl);
        background: var(--color-white);
        border-radius: var(--radius-lg);
        box-shadow: 
          0 8px 20px -8px rgba(0, 0, 0, 0.2),
          0 3px 5px -2px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 1;
        opacity: 0;
        animation: fadeIn 0.8s ease forwards;
        text-align: center;
      }
      
      .htmx-contact-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--space-xl);
        margin-bottom: var(--space-md);
        padding-bottom: var(--space-sm);
        border-bottom: 1px solid var(--color-border-light);
      }
      
      .htmx-contact-content h3 {
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
      
      .htmx-contact-content p {
        font-size: var(--font-size-md);
        line-height: var(--line-height-relaxed);
        margin-bottom: var(--space-md);
        color: var(--color-text-primary);
      }
      
      .contact-cta {
        display: inline-block;
        margin-top: var(--space-lg);
        padding: var(--space-md) var(--space-xl);
        background: var(--color-accent);
        color: var(--color-text-primary);
        border: 1px solid var(--color-accent);
        font-family: var(--font-family-primary);
        font-size: 1rem;
        font-weight: var(--font-weight-medium);
        text-decoration: none;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        border-radius: 0;
      }
      
      .contact-cta:hover {
        background: var(--color-accent-accessible);
        border-color: var(--color-accent-accessible);
        transform: translateY(-3px);
        box-shadow: var(--shadow-hover);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    </style>
    
    <div class="htmx-contact-content" id="contact-anchor">
      <div class="htmx-contact-header">
        <h3>VAMOS CONVERSAR</h3>
        <button class="close-btn" hx-get="/api/htmx/clear-content" hx-target="#htmx-content" hx-swap="innerHTML">&times;</button>
      </div>
      <p>Você está pronto para dar o próximo passo e transformar sua presença digital com nossa metodologia Brand-Led?</p>
      <p>Nossa equipe está pronta para entender seu negócio e criar uma estratégia personalizada que conecte sua essência com o algoritmo do Google.</p>
      <a href="/contato" class="contact-cta">CONTATO COMERCIAL</a>
    </div>
    <script>
      // Rolar para o elemento quando o conteúdo for carregado
      document.addEventListener('htmx:afterOnLoad', function(evt) {
        const element = document.getElementById('contact-anchor');
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