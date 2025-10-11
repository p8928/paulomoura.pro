import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  // Retorna um script para limpar o conteúdo e remover classes ativas
  const html = `
    <script>
      // Limpa o conteúdo e remove classes ativas
      document.querySelectorAll('.static-rect').forEach(rect => {
        rect.classList.remove('active');
      });
      // Fecha o conteúdo HTMX
      document.querySelector('#htmx-content').innerHTML = '';
    </script>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};