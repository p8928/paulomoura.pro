# Manual do Composer Editorial Local

Este manual descreve as ferramentas locais criadas para publicar novos textos editoriais sem expor um CMS em produção.

## Visão geral

O projeto possui duas ferramentas internas para criar posts em Markdown:

- **Composer visual**: interface local no navegador.
- **CLI interativo**: fluxo pelo terminal.

As duas ferramentas salvam arquivos em:

```txt
src/content/editorial/
```

Elas não publicam nada automaticamente. Um post só entra no site em produção depois de passar pelo fluxo normal de versionamento e deploy: salvar arquivo, revisar, commit, push e publicar.

## Segurança e produção

O composer visual fica em:

```txt
tools/editorial-composer/
```

Ele não está dentro de `src/pages`, portanto não cria uma rota pública no Astro. O servidor do composer é separado do site e roda apenas localmente em `127.0.0.1`.

Use o composer apenas no ambiente local. Não há necessidade de subir essa ferramenta como aplicação pública.

## Composer visual

Para iniciar:

```bash
npm run editorial:composer
```

Depois acesse:

```txt
http://127.0.0.1:4177
```

### Campos

- **Título**: título público do post.
- **Slug**: caminho do arquivo e da URL. É preenchido automaticamente a partir do título, mas pode ser editado.
- **Descrição**: resumo usado no índice editorial, no hero do artigo e em metadados.
- **Categoria**: deve ser uma das categorias aceitas pela collection editorial.
- **Data**: data de publicação no formato `YYYY-MM-DD`.
- **Draft**: se marcado, o post é salvo como rascunho e não aparece no site.
- **Sobrescrever se existir**: permite substituir um arquivo com o mesmo slug.
- **Corpo em Markdown**: conteúdo completo do artigo.

### Categorias disponíveis

```txt
branding
seo
geo
aeo
luxury
estrategia
```

### Como salvar um post

1. Rode `npm run editorial:composer`.
2. Preencha os campos.
3. Escreva ou cole o corpo em Markdown.
4. Clique em `Salvar Markdown`.
5. Confira o arquivo gerado em `src/content/editorial/`.
6. Rode `npm run check`.
7. Revise o post no site local.
8. Faça commit e push quando estiver pronto para publicar.

## CLI interativo

Para iniciar:

```bash
npm run editorial:cli
```

O terminal pedirá, em sequência:

- título;
- slug;
- descrição;
- categoria;
- data;
- se deve salvar como draft;
- se deve sobrescrever arquivo existente;
- corpo em Markdown.

Para finalizar o corpo do post, digite uma linha contendo apenas:

```txt
.fim
```

### Exemplo de uso

```bash
npm run editorial:cli
```

Depois preencha os campos. No corpo:

```md
Este é o primeiro parágrafo.

## Um subtítulo

Este é outro parágrafo.
.fim
```

## Frontmatter gerado

As ferramentas geram arquivos Markdown com a seguinte estrutura:

```md
---
title: "Título do post"
description: "Descrição do post"
publishedAt: 2026-06-02
category: "estrategia"
draft: false
---

Corpo do post em Markdown.
```

Esse formato segue o schema definido em:

```txt
src/content.config.ts
```

## Drafts

Se `draft: true`, o post é salvo no projeto, mas não aparece em `/editorial` nem gera página individual.

Use draft para textos em desenvolvimento.

Quando o texto estiver pronto, altere para:

```md
draft: false
```

ou salve novamente pelo composer com a opção draft desmarcada.

## Slugs e URLs

O slug define o nome do arquivo e a URL pública.

Exemplo:

```txt
src/content/editorial/conteudo-precisa-ser-realmente-util.md
```

Gera:

```txt
/editorial/conteudo-precisa-ser-realmente-util/
```

Evite mudar o slug depois que um post for publicado, porque isso altera a URL.

## Validação recomendada

Depois de criar ou editar posts, rode:

```bash
npm run check
```

Para validar a geração completa do site:

```bash
npm run build
```

## Fluxo de publicação

1. Criar o post com o composer visual ou CLI.
2. Revisar o Markdown gerado.
3. Rodar `npm run check`.
4. Abrir o site local e revisar `/editorial` e a página individual do post.
5. Fazer commit.
6. Fazer push.
7. Aguardar ou executar o deploy configurado.

## Problemas comuns

### O post não aparece no editorial

Verifique se o frontmatter contém:

```md
draft: false
```

Também confirme se a categoria é uma das categorias válidas.

### O arquivo já existe

Use outro slug ou marque a opção `Sobrescrever se existir` no composer visual.

No CLI, responda `s` na pergunta de sobrescrever.

### A categoria gera erro

Use apenas uma destas opções:

```txt
branding, seo, geo, aeo, luxury, estrategia
```

### O corpo virou bloco de código sem querer

Em Markdown, listas não devem começar com tabulação. Use:

```md
- item um
- item dois
```

Evite:

```md
	- item um
	- item dois
```

## Arquivos da ferramenta

```txt
tools/editorial-composer/editorial-utils.mjs
tools/editorial-composer/server.mjs
tools/editorial-composer/cli.mjs
tools/editorial-composer/index.html
tools/editorial-composer/styles.css
tools/editorial-composer/main.js
```

## Observação final

As ferramentas existem para acelerar a publicação local, não para substituir revisão editorial. Sempre revise título, descrição, categoria, data, slug e corpo antes de publicar.
