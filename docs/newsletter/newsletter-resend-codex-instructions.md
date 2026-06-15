# Newsletter Moura com Resend

Guia para implementação futura pelo Codex.

## Objetivo

Criar um mecanismo próprio de newsletter para a Moura, mantendo a captação em `paulomoura.pro`, com controle visual total dos e-mails, custo zero inicial e estrutura compatível com LGPD.

A solução recomendada é usar Resend para contatos, audiência e envio, com formulário próprio no site e uma função serverless para gravar inscrições com segurança.

## Decisão técnica recomendada

Usar:

- Resend Audience para armazenar contatos.
- Resend Broadcasts ou envio programático para campanhas.
- Formulário nativo no site, sem iframe externo.
- Função serverless para processar inscrição.
- Template HTML próprio para e-mails.

Não inserir `RESEND_API_KEY` no frontend.

## Observação importante sobre o projeto atual

O projeto Astro está configurado como site estático. Portanto, uma rota Astro em `src/pages/api/...` não funcionará em produção sem mudar a estratégia de deploy.

Escolha uma destas opções antes de implementar:

1. Manter o site estático e criar uma função externa na plataforma de deploy, por exemplo Netlify Functions, Vercel Serverless Function ou Cloudflare Worker.
2. Migrar o Astro para modo server/hybrid com adapter apropriado.

Para menor impacto, a recomendação inicial é manter o site estático e criar função serverless externa.

## Variáveis de ambiente

Configurar no provedor de deploy:

```bash
RESEND_API_KEY=...
RESEND_AUDIENCE_ID=...
NEWSLETTER_FROM="Paulo Moura <contato@paulomoura.pro>"
NEWSLETTER_REPLY_TO="contato@paulomoura.pro"
```

Opcional:

```bash
NEWSLETTER_DOUBLE_OPT_IN=true
NEWSLETTER_TURNSTILE_SECRET=...
```

## DNS e domínio

Antes de enviar campanhas, autenticar o domínio no Resend:

1. Adicionar domínio no painel do Resend.
2. Configurar SPF/DKIM conforme instruções do painel.
3. Configurar DMARC, mesmo que inicialmente em modo monitoramento.
4. Validar domínio no Resend.
5. Usar remetente com domínio próprio, preferencialmente `contato@paulomoura.pro` ou `carta@paulomoura.pro`.

## Modelo de dados do formulário

Campos mínimos:

- `email`, obrigatório.
- `name`, opcional.
- `source`, oculto, com valor da página ou seção.
- `consent`, obrigatório.

Campos úteis para o Resend:

```json
{
  "email": "pessoa@empresa.com",
  "firstName": "Nome",
  "unsubscribed": false,
  "audienceId": "...",
  "customFields": {
    "source": "site_footer",
    "language": "pt-BR",
    "interest": "brand-driven"
  }
}
```

## UX recomendada

A newsletter não deve parecer genérica. Ela deve funcionar como extensão editorial da Moura.

Nome sugerido:

- Carta Brand-Driven
- Notas de Presença
- Carta de Presença

Texto de inscrição sugerido:

> Receba notas sobre presença digital, reputação, busca e marca sob uma leitura Brand-Driven.

Microcopy de consentimento:

> Ao assinar, você concorda em receber comunicações editoriais da Moura. É possível descadastrar-se a qualquer momento.

Estados necessários:

- vazio
- carregando
- sucesso
- erro de e-mail inválido
- erro de rede
- contato já inscrito
- limite/anti-spam

## Onde inserir no site

Prioridade inicial:

1. Página `editorial`.
2. Final de artigos.
3. Footer, depois que houver primeira edição ou promessa editorial clara.

Evitar inserir na hero principal neste momento. A hero deve continuar focada em posicionamento e candidatura.

## Função serverless

A função deve:

1. Aceitar apenas `POST`.
2. Validar origem, se aplicável.
3. Validar e normalizar e-mail.
4. Exigir consentimento.
5. Aplicar honeypot ou Turnstile.
6. Enviar contato para Resend Audience.
7. Retornar JSON simples.
8. Nunca expor a API key.

Exemplo de resposta:

```json
{
  "ok": true,
  "message": "Inscrição confirmada."
}
```

Em caso de contato existente, tratar como sucesso idempotente:

```json
{
  "ok": true,
  "message": "Este e-mail já estava inscrito."
}
```

## Template de e-mail

O e-mail deve ser HTML próprio, responsivo e simples.

Diretrizes visuais:

- fundo claro próximo ao ivory do site;
- tipografia segura para e-mail, sem depender de webfont;
- largura máxima entre 600px e 680px;
- bastante respiro;
- títulos com peso leve;
- links discretos;
- rodapé com endereço do site, motivo do recebimento e descadastro.

Estrutura recomendada:

1. Cabeçalho: Moura ou Paulo Moura.
2. Kicker: Carta Brand-Driven.
3. Título da edição.
4. Texto principal.
5. Link para artigo completo no site, se houver.
6. Assinatura curta.
7. Rodapé legal e unsubscribe.

## LGPD e boas práticas

Implementar:

- consentimento explícito;
- link de descadastro;
- política de privacidade atualizada, se necessário;
- registro de origem da inscrição;
- não importar contatos sem consentimento;
- não compartilhar lista com terceiros fora da operação de envio;
- não prometer frequência que não será cumprida.

## Instruções para o Codex na implementação futura

Ao implementar esta seção, siga estes critérios:

1. Ler `astro.config.mjs`, `package.json`, `src/layouts/BaseLayout.astro`, `src/components/site/SiteFooter.astro`, `src/pages/editorial.astro` e `src/layouts/ArticleLayout.astro` antes de editar.
2. Confirmar a plataforma de deploy antes de criar a função serverless.
3. Não adicionar dependências pesadas sem necessidade.
4. Não colocar `RESEND_API_KEY` em código cliente.
5. Criar componente reutilizável, por exemplo `src/components/newsletter/NewsletterSignup.svelte` ou `.astro`, conforme o padrão local.
6. Manter a estética Moura: contida, editorial, refinada, sem aparência de SaaS genérico.
7. Adicionar estados de sucesso e erro acessíveis.
8. Preservar build estático se o deploy ainda depender disso.
9. Testar `npm run check` e `npm run build`.
10. Se houver função serverless local, documentar como testar com `curl`.

## Critérios de aceite

A implementação está pronta quando:

- o formulário aparece no editorial ou final dos artigos;
- o e-mail é validado no frontend e no backend;
- a inscrição chega ao Resend Audience;
- o usuário recebe retorno claro;
- não há segredo exposto no bundle;
- o build passa;
- a experiência visual combina com o site;
- o fluxo de descadastro está definido para os envios.

## Etapas de implementação sugeridas

1. Criar conta ou projeto no Resend.
2. Autenticar domínio.
3. Criar Audience.
4. Configurar variáveis de ambiente no deploy.
5. Criar função serverless de inscrição.
6. Criar componente de formulário.
7. Inserir no editorial e/ou artigos.
8. Criar template HTML da primeira edição.
9. Enviar teste para e-mail próprio.
10. Publicar apenas depois de validar DNS, inscrição e descadastro.

## Riscos a evitar

- Usar Substack como destino principal e enfraquecer o domínio próprio.
- Criar formulário que depende de JavaScript sem fallback mínimo.
- Enviar e-mail sem autenticação DNS.
- Usar visual de campanha promocional genérica.
- Inserir CTA de newsletter antes de existir uma promessa editorial clara.
- Coletar e-mails sem consentimento explícito.
