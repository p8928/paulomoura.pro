---
// API endpoint to handle blog post display toggle
import { json } from 'astro/response';

const allBlogPosts = [
  {
    id: 1,
    title: "A Importância da Marca no Mundo Digital",
    excerpt: "Descubra como a construção de uma marca forte é essencial para o sucesso no ambiente digital contemporâneo.",
    date: "2024-01-15",
    href: "/blog/importancia-da-maca-no-mundo-digital/",
    category: "Branding",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 2,
    title: "Marketing de Conteúdo Estratégico",
    excerpt: "Estratégias eficazes para criar conteúdo que converta e engaje seu público-alvo de forma consistente.",
    date: "2024-01-22",
    href: "/blog/marketing-de-conteudo-estrategico/",
    category: "Marketing",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 3,
    title: "Design Sustentável e Responsabilidade Social",
    excerpt: "Como o design pode promover práticas sustentáveis e impacto social positivo nas marcas contemporâneas.",
    date: "2024-02-05",
    href: "/blog/design-sustentavel-e-responsabilidade/",
    category: "Design",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 4,
    title: "Branding e Experiência do Cliente",
    excerpt: "A intersecção entre branding e experiência do cliente na construção de relacionamentos duradouros.",
    date: "2024-02-12",
    href: "/blog/branding-e-experiencia-do-cliente/",
    category: "Experiência",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 5,
    title: "Tendências de Design em 2024",
    excerpt: "As principais tendências de design que estão moldando o futuro da comunicação visual.",
    date: "2024-02-19",
    href: "/blog/tendencias-de-design-em-2024/",
    category: "Design",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 6,
    title: "O Poder da Narrativa Visual",
    excerpt: "Como as marcas estão utilizando o storytelling visual para criar conexões emocionais com seus públicos.",
    date: "2024-03-01",
    href: "/blog/poder-da-narrativa-visual/",
    category: "Branding",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 7,
    title: "Estratégias de Crescimento para Startups",
    excerpt: "Dicas práticas para impulsionar o crescimento de startups com orçamentos limitados.",
    date: "2024-03-08",
    href: "/blog/estrategias-de-crescimento/",
    category: "Growth",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 8,
    title: "A Revolução do E-mail Marketing",
    excerpt: "Como o e-mail marketing evoluiu e se tornou uma das ferramentas mais eficazes de relacionamento.",
    date: "2024-03-15",
    href: "/blog/revolucao-do-email-marketing/",
    category: "Marketing",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 9,
    title: "UX e a Fidelização de Clientes",
    excerpt: "O impacto da experiência do usuário na retenção e lealdade do cliente.",
    date: "2024-03-22",
    href: "/blog/ux-e-fidelizacao/",
    category: "UX",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 10,
    title: "Branding e Sustentabilidade",
    excerpt: "Como as marcas estão integrando práticas sustentáveis em suas estratégias de marca.",
    date: "2024-03-29",
    href: "/blog/branding-e-sustentabilidade/",
    category: "Sustentabilidade",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 11,
    title: "O Futuro do Marketing Digital",
    excerpt: "Previsões e tendências que moldarão o marketing digital nos próximos anos.",
    date: "2024-04-05",
    href: "/blog/futuro-do-marketing-digital/",
    category: "Marketing",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 12,
    title: "Design Inclusivo: Acessibilidade e Experiência",
    excerpt: "A importância do design inclusivo na criação de experiências digitais acessíveis.",
    date: "2024-04-12",
    href: "/blog/design-inclusivo/",
    category: "Design",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 13,
    title: "SEO e Branding: Uma Combinação Poderosa",
    excerpt: "Como otimizar o SEO com estratégias de branding para aumentar a visibilidade da marca.",
    date: "2024-04-19",
    href: "/blog/seo-e-branding/",
    category: "SEO",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 14,
    title: "Inteligência Artificial e Criação de Conteúdo",
    excerpt: "O papel da IA na produção de conteúdo criativo e sua influência nas estratégias de marketing.",
    date: "2024-04-26",
    href: "/blog/inteligencia-artificial-e-criacao/",
    category: "Tecnologia",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  },
  {
    id: 15,
    title: "Transformação Digital e Cultura Organizacional",
    excerpt: "Como as organizações estão adaptando sua cultura para acompanhar a transformação digital.",
    date: "2024-05-03",
    href: "/blog/transformacao-digital-e-cultura/",
    category: "Transformação",
    thumbnail: "https://placehold.co/400x200/0066cc/white?text=Imagem+de+Blog"
  }
];

export async function GET({ request }) {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('showAll') === 'true';
  
  let posts = allBlogPosts;
  if (!showAll) {
    posts = allBlogPosts.slice(0, 12);
  }
  
  return json({ posts, showAll });
}