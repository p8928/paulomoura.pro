# Guia Completo para Criação de Posts no Blog Moura

Este guia explica como criar e gerenciar posts no blog do site Moura, utilizando os diferentes métodos disponíveis e boas práticas.

## 1. Estrutura do Blog

O blog Moura suporta dois métodos principais para criar posts:

1. **Conteúdo baseado em coleção (Content Collection)** - Usando arquivos `.md` em `/src/content/blog/`
2. **Páginas standalone (MDX ou Astro)** - Usando arquivos em `/src/pages/blog/`

## 2. Método 1: Conteúdo Baseado em Coleção

Este método é ideal para posts que seguem um padrão consistente e precisam aparecer automaticamente na página `/blog`.

### 2.1 Criando um Post com Conteúdo Baseado em Coleção

Crie um arquivo em `/src/content/blog/nome-do-post.md`:

```markdown
---
title: "Título do Seu Post"
description: "Descrição curta do conteúdo do post"
publishDate: 2024-11-05
tags: ["Tag1", "Tag2"]
author: "Seu Nome"
image:
  url: "/img/blog/seu-post-thumb.jpg"  # Caminho para a imagem do card (opcional)
  alt: "Descrição da imagem"           # Texto alternativo para acessibilidade
---

# Seu Título Principal

Seu conteúdo em Markdown começa aqui...

## Seções e Conteúdo

Você pode usar todo o Markdown normal:
- Listas
- Cabeçalhos
- Parágrafos
- Blocos de código
- etc.

Texto normal do post...
```

### 2.2 Dimensões da Imagem do Card

- **Dimensão recomendada**: 600x400 pixels ou superior mantendo a proporção
- A imagem será exibida com `height: 180px` e `object-fit: cover`, então centralize elementos importantes
- Coloque as imagens no diretório `/public/img/blog/`

## 3. Método 2: Páginas Standalone (Astro ou MDX)

Este método é ideal para posts com conteúdo rico, componentes interativos e layouts personalizados.

### 3.1 Criando um Post Standalone Astro

1. Copie o arquivo `exemplo-post.astro`
2. Modifique os dados e conteúdo
3. Salve em `/src/pages/blog/nome-do-post.astro`

Exemplo:

```astro
---
import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/nav/Navigation.astro';
import Footer from '../../components/footer/Footer.astro';
import BlogPost from '../../components/blog/BlogPost.astro';
import HighlightedContent from '../../components/blog/HighlightedContent.astro';
import TableOfContents from '../../components/blog/TableOfContents.astro';
import Button from '../../components/ui/Button.astro';
import ShareOverlay from '../../components/ui/share_overlay/ShareOverlay.astro';

// Dados do post - customize conforme necessário
const post = {
  data: {
    title: "Título do Seu Post",
    description: "Descrição do seu post",
    publishDate: new Date('2024-11-05'),
    tags: ["Tag1", "Tag2"],
    author: "Seu Nome",
    image: {
      url: "/img/blog/seu-post.jpg",  // Caminho para imagem do post
      alt: "Descrição da imagem"
    }
  },
  slug: 'nome-do-post'
};

// Pegar posts relacionados
import { getCollection } from 'astro:content';
const allPosts = await getCollection('blog');
const relatedPosts = allPosts
  .filter(p => p.slug !== post.slug)
  .slice(0, 3);
---

<Layout title={`${post.data.title} - Blog - Moura | Marketing e Comunicação Digital`}>

  <BlogPost post={post} relatedPosts={relatedPosts} slot="rest-content">
    <div class="post-content" slot="content">
      
      <!-- Conteúdo do post -->
      <h1>{post.data.title}</h1>
      
      <p>Conteúdo do seu post em HTML/JSX...</p>
      
      <HighlightedContent type="tip">
        Um componente destacado
      </HighlightedContent>
      
      <h2 id="subtitulo">Subtítulo</h2>
      <p>Mais conteúdo...</p>
      
    </div>

    <TableOfContents slot="toc">
      <li><a href="#subtitulo">Subtítulo</a></li>
      <!-- Mais itens conforme necessário -->
    </TableOfContents>
    
  </BlogPost>

  <div slot="overlay">
    <ShareOverlay post={post} url={Astro.url.href} />
  </div>

  <Footer slot="rest-content" />

</Layout>
```

### 3.2 Criando um Post MDX

Para posts MDX em `/src/pages/blog/`:

```mdx
---
title: "Título do Seu Post MDX"
description: "Descrição do seu post MDX"
publishDate: 2024-11-05
tags: ["Tag1", "Tag2"]
author: "Seu Nome"
---

import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/nav/Navigation.astro';
import Footer from '../../components/footer/Footer.astro';
// Importe outros componentes conforme necessário

<Layout>
  <Navigation slot="nav" />
  
  <article className="blog-content" slot="rest-content">
    # Título do Post MDX
    
    Este é um exemplo de conteúdo em **MDX** com componentes Astro.
    
    <ComponentePersonalizado />
    
    ## Outra Seção
    
    Mais conteúdo...
  </article>
  
  <Footer slot="rest-content" />
</Layout>
```

## 4. Fazendo Posts Aparecerem na Página /blog

### 4.1 Posts de Coleção de Conteúdo

Posts criados em `/src/content/blog/` aparecem automaticamente na página `/blog` porque o componente `BlogCard` os carrega dinamicamente.

### 4.2 Posts Standalone

Para que posts standalone apareçam na página `/blog`, você precisa criar um arquivo correspondente em `/src/content/blog/` com os mesmos dados de frontmatter, para que apareçam na listagem do blog.

Exemplo:
- `/src/pages/blog/seu-post.astro` (contém o layout completo)
- `/src/content/blog/seu-post.md` (contém apenas metadados e resumo para a listagem)

## 5. Componentes Disponíveis

### 5.1 HighlightedContent

```astro
<HighlightedContent type="tip">
  Texto para destaque do tipo "dica"
</HighlightedContent>
```

Tipos disponíveis: `tip`, `caution`, `note`, `highlight`

### 5.2 TableOfContents

```astro
<TableOfContents slot="toc">
  <li><a href="#secao-1">Seção 1</a></li>
  <li><a href="#secao-2">Seção 2</a></li>
</TableOfContents>
```

### 5.3 Botões

```astro
<Button href="/pagina" variant="primary">Texto do Botão</Button>
```

Variantes: `primary`, `secondary`, `ghost`, etc.

## 6. Metadados e SEO

### 6.1 Adicionando Metadados

Você pode adicionar metadados SEO específicos para posts standalone em frente ao `<head>` no arquivo Astro:

```astro
<Layout title="Título Personalizado - Página" description="Descrição para SEO">
  <!-- conteúdo -->
</Layout>
```

### 6.2 Analytics e Schema Markup

Para scripts globais como Google Analytics, adicione no componente `Layout.astro`:

```astro
<head>
  <!-- Outros elementos head -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_TRACKING_ID');
  </script>
</head>
```

Para schema markup específico de posts, adicione dentro do arquivo individual ou estenda o componente `BlogPost` para gerar automaticamente.

## 7. Dicas e Melhores Práticas

1. **Consistência**: Use nomes de arquivos consistentes e descritivos
2. **Imagens**: Sempre forneça imagens de qualidade adequada para os cards
3. **Tags**: Use tags relevantes e consistentes para agrupamento e SEO
4. **Frontmatter**: Sempre inclua publishDate no formato YYYY-MM-DD
5. **Conteúdo**: Escreva descrições atraentes para melhorar as taxas de cliques
6. **Linkagem Interna**: Conecte posts relacionados para melhor experiência do usuário e SEO

## 8. Exemplo Completo: Adicionando um Novo Post

### Opção A: Método Content Collection
1. Crie `/src/content/blog/novo-topico.md` com frontmatter e conteúdo
2. O post aparece automaticamente em `/blog`

### Opção B: Método Standalone + Content Collection
1. Crie `/src/pages/blog/novo-topico.astro` com rich content
2. Crie `/src/content/blog/novo-topico.md` com metadados e resumo
3. O post aparece em `/blog` e tem página individual rica

Este guia cobre os principais métodos para criar e gerenciar conteúdo no blog Moura. Escolha o método que melhor se adapta às necessidades do seu conteúdo.