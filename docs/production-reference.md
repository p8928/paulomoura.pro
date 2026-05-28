# Referencia do site em producao

URL analisada: https://paulomoura.pro/
Data da leitura: 2026-05-28

Este documento registra o que o site em producao ja comunica em termos de modernidade, estrutura, SEO e experiencia. Ele deve orientar o redesign local para que a nova versao nao regrida visualmente nem tecnicamente.

## Diagnostico rapido

O scaffold local atual esta correto como base tecnica, mas ficou minimalista demais para o grau de impacto do site publicado. A producao atual ja tem densidade visual, ritmo, recursos de SEO, rotas comerciais e uma linguagem de marca mais reconhecivel.

A nova versao deve preservar a percepcao de modernidade e autoridade, mas reduzir excesso de escopo, abandonar o tom de agencia ampla e reorganizar a narrativa como boutique assinada por Paulo Moura.

## O que preservar

- Impacto de primeira dobra.
- Marca como primeiro sinal visual forte.
- Uso de linguagem proprietaria: `Brand-Driven`, `Brand Led`, `Moura`.
- Estetica contemporanea, mais ousada que um site editorial minimalista comum.
- Forte presenca de SEO tecnico e dados estruturados.
- Navegacao completa e clara.
- CTAs visiveis sem parecerem SaaS generico.
- Estrutura multilíngue planejada.
- Seções comerciais com densidade argumentativa.
- FAQ como ferramenta de objecoes e SEO.
- Rigor em favicons, manifest, metadados e Open Graph.
- Cuidado com performance, preloads e carregamento seletivo.

## O que abandonar ou reduzir

- Posicionamento de agencia ampla.
- Excesso de servicos soltos no catalogo.
- Promessas que pareçam grandes demais ou difusas.
- Linguagem muito universal, como atendimento para qualquer empresa.
- Rotas que fragmentam demais a oferta antes de fechar o novo posicionamento.
- Redundancia entre blog, metodologia, brand academy, pricing e servicos.
- Excesso de scripts inline se puderem virar componentes/arquivos organizados.
- Duplicidade de carregamento de CSS ou recursos.
- Dependencia de blocos grandes demais sem composicao por componentes.

## Sinais de modernidade observados

Headings principais extraidos da home atual:

- `MOURA`
- `BRAND LED`
- `BRANDING`
- `ELEVANDO O DIGITAL AO PADRAO DA SUA MARCA`
- `PENSADO PARA PESSOAS, AMIGAVEL PARA ROBOS`
- `RELEVANTE. MEMORAVEL.`
- `BRAND-DRIVEN SEO`
- `SEO A PROVA DE FUTURO`
- `COMPREENDEMOS SEUS DESAFIOS`
- `SERVICOS`
- `Esclarecimentos`
- `TRANSFORME VISITANTES EM CLIENTES LEAIS A SUA MARCA`

CTAs e rotas observadas:

- `/metodologia` - Conheca a metodologia
- `/contato` - Agende uma conversa
- `/brand-led-design` - Manifesto
- `/expertise` - Nossa expertise
- `/servicos` - Nossos servicos
- `/pricing` - Preco
- `/blog` - Blog
- `/sobre` - Sobre

A nova versao nao precisa manter todas as rotas, mas deve manter a sensacao de ecossistema serio e tecnicamente maduro.

## Nova leitura estrategica

A nova comunicacao deve sair de:

```txt
Moura como agencia premium de muitos servicos
```

para:

```txt
Paulo Moura como boutique autoral Brand-Driven para transformar substancia real em presenca digital de alto desempenho
```

A oferta principal deve ser integrada:

```txt
Diagnostico + branding + site + SEO/GEO/AEO + Google Business Profile
```

Essa oferta pode ser apresentada como:

```txt
Brand-Driven como metodo/conceito
M-Signature como aplicacao assinada
M-Direction como continuidade estrategica
```

## Proposta de arquitetura nova

Rotas de primeira fase:

- `/` - Home
- `/m-signature` - Oferta principal integrada
- `/m-direction` - Continuidade e direcao estrategica
- `/processo` - Como funciona
- `/sobre` - Paulo Moura e autoridade
- `/editorial` - Conteudo de profundidade
- `/diagnostico` - Entrada consultiva

Rotas futuras:

- `/segmentos/[slug]` - landings SEO por segmento/regiao
- `/editorial/[slug]` - artigos
- `/en` e `/es` - internacionalizacao futura

## Direcao para a nova homepage

A home deve combinar a forca visual da producao atual com a seletividade da nova boutique.

Ordem sugerida:

1. Hero de alto impacto
   - marca como sinal forte;
   - `Brand-Driven` como conceito;
   - promessa curta;
   - CTA para diagnostico;
   - CTA secundario para M-Signature.

2. Tese
   - explicar que identidade, site, SEO e GBP nao funcionam isolados;
   - elevar o problema do cliente sem didatismo excessivo.

3. M-Signature
   - apresentar a oferta integrada;
   - quatro frentes como sistema unico;
   - reforcar trabalho artesanal e assinado.

4. Filtro de qualificacao
   - agenda limitada;
   - primeira disponibilidade apos 9 dias;
   - candidatura consultiva;
   - estimativa de orcamento informada pelo cliente.

5. M-Direction
   - continuidade como direcao estrategica, nao gestao operacional;
   - semiotica, editorial, concorrencia, roadmap e press/reputacao.

6. Segmentos prioritarios
   - arquitetos;
   - consultorias;
   - advogados;
   - restaurantes;
   - clinicas;
   - outros segmentos premium/luxury.

7. FAQ enxuto
   - objecoes sobre processo, investimento, prazo, presencialidade e ROI.

8. CTA final
   - candidatura/diagnostico.

## Direcao visual

A nova versao deve evitar uma pagina excessivamente calma. O site atual tem mais energia, contraste e marca. A evolucao deve buscar:

- marca em primeiro plano;
- composicao editorial moderna, mas nao fria;
- contraste mais assertivo;
- grids sofisticados;
- tipografia grande em momentos certos;
- microinteracoes controladas;
- stacking ou transicoes apenas onde aumentem ritmo;
- menos cards genericos;
- menos linguagem de landing SaaS;
- mais assinatura autoral.

## Direcao tecnica

Manter a stack local:

```txt
Astro + Svelte + Tailwind + Content Collections + GSAP/Lenis quando justificado
```

A implementacao deve ser mais organizada que a producao atual:

- componentes por secao;
- dados estruturados em arquivos dedicados;
- scripts fora do HTML sempre que possivel;
- SEO e Schema.org gerados de forma controlada;
- imagens e fontes tratadas como ativos versionados;
- Playwright validando Chromium e Firefox.

## Plano de execucao

### Fase 1 - Base de referencia

- Manter este documento atualizado.
- Capturar screenshots da producao em desktop e mobile.
- Mapear secoes e CTAs atuais.
- Definir quais elementos entram na nova home.

### Fase 2 - Redesenho da home local

- Refatorar `src/pages/index.astro` como composicao de secoes.
- Recriar hero com impacto mais proximo da producao.
- Substituir blocos minimalistas por seções com mais presença.
- Manter o texto mais seletivo e boutique.

### Fase 3 - Oferta principal

- Expandir `/m-signature`.
- Explicar o sistema integrado.
- Remover a ideia de servicos separados.
- Criar CTA para diagnostico.

### Fase 4 - Diagnostico consultivo

- Evoluir `DiagnosticConfigurator.svelte`.
- Coletar contexto, segmento, regiao, momento e estimativa de investimento.
- Preparar saida para WhatsApp, email ou futura ferramenta de agenda.

### Fase 5 - SEO e Schema

- Criar dados estruturados para `Person`, `ProfessionalService` ou `Organization` conforme posicionamento final.
- Evitar schema inflado ou contraditorio.
- Planejar landings segmentadas.

### Fase 6 - Validacao

- `npm run check`
- `npm run build`
- `npm run test:e2e`
- screenshots desktop/mobile com Playwright
- revisao visual contra producao

## Criterio de sucesso

A nova versao sera bem-sucedida se:

- parecer pelo menos tao moderna quanto a producao atual;
- comunicar menos coisa, com mais autoridade;
- deixar claro que o trabalho e integrado e assinado;
- filtrar clientes sem depender de preco publico;
- preservar maturidade tecnica e SEO;
- abrir caminho para editorial e landings segmentadas sem parecer portal.
