# Auditoria mobile de todas as paginas

Atualizado em 2026-06-07 apos remocao das rotas legadas sem H1 e ajustes mobile globais.

## Escopo

- Rotas auditadas no build: 29.
- Viewports usadas nas passadas completas e pontuais: 390x844 e 360x780.
- Validacoes: presenca de H1, overflow horizontal, headings com stacks excessivos e alvos touch abaixo de 44px.

## Resultado

- Overflow horizontal: nenhum caso encontrado na passada completa anterior aos ajustes finais.
- Rotas sem H1: nenhuma apos remocao das rotas legadas.
- Alvos touch pequenos em conteudo de pagina: os casos restantes foram corrigidos e verificados pontualmente em /privacidade, /cookies, /termos-de-uso e artigo editorial.
- Alvos globais pequenos em overlay, footer e cookies: sem ocorrencias nos componentes globais apos os ajustes.
- Rotas legadas removidas: /analise, /diagnostico, /mentoria, /processo e /sobre.

## Ajustes aplicados

- Overlay menu, footer e caixa de cookies receberam areas clicaveis minimas de 44px.
- CTAs de setores, badges, autor e M-HS Klout receberam area touch minima.
- Indices das paginas legais receberam min-height de 44px.
- Breadcrumbs, autor, compartilhar e sumario mobile dos artigos receberam area touch minima.
- O grid mobile da secao 2 dos setores passou a neutralizar variacoes desktop mais especificas.
- Titulos longos em home, Brand-Driven, M-Direction, Moura e setores receberam ajustes de escala mobile sem impacto planejado no desktop.

## Observacoes visuais restantes

- Alguns titulos editoriais continuam formando stacks de 5 a 7 linhas em smartphones estreitos. Eles nao quebram layout, mas devem ser avaliados manualmente quando houver mudanca de copy.
- A auditoria completa com Chromium local ficou instavel no fechamento em uma das passadas finais; por isso, os alvos touch remanescentes foram validados com varredura pontual nas rotas que acusaram problema.

## Interpretacao

Como o projeto ainda nao foi indexado, a remocao das rotas sem H1 nao gera perda organica. Ela reduz superficie de manutencao e evita publicar paginas fracas ou incompletas quando o site subir.
