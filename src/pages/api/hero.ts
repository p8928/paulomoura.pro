// src/pages/api/hero.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Redirect to the main page
  return new Response(
    `<script>
      window.location.href = '/';
    </script>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  );
};