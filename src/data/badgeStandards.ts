export type BadgeKind = 'mhs' | 'mstar' | 'mid' | 'msupreme';

export interface BadgeStandard {
  kind: BadgeKind;
  slug: string;
  seal: string;
  expansion: string;
  category: string;
  title: string;
  heroTitle: string;
  description: string;
  definition: string[];
  criteriaTitle: string;
  criteria: Array<{ title: string; body: string }>;
  audience: string[];
  notTitle: string;
  notItems: string[];
}

export const badgeStandards: BadgeStandard[] = [
  {
    kind: 'mhs',
    slug: 'moura-high-standards',
    seal: 'M-HS',
    expansion: 'Moura High Standards',
    category: 'Padrão de Excelência Digital',
    title: 'O padrão mínimo para uma presença digital de alto nível.',
    heroTitle: 'High Standards.',
    description: 'Identifica projetos em que técnica, interface, semântica e conteúdo deixam de competir por atenção e passam a sustentar o mesmo nível de exigência da marca.',
    definition: [
      'O M-HS certifica que o projeto digital atende aos requisitos de alto padrão estabelecidos pela metodologia Moura. Não é um selo de conclusão de projeto; é uma acreditação de qualidade.',
      'A maioria dos sites de empresas de alto padrão falha quando a qualidade da operação offline não encontra equivalente no digital. O M-HS certifica que essa distância foi eliminada.',
    ],
    criteriaTitle: 'Critérios do padrão',
    criteria: [
      { title: 'Performance técnica', body: 'Core Web Vitals dentro de parâmetros de excelência. Tempo de carregamento, estabilidade visual e responsividade tratados como requisitos de marca.' },
      { title: 'UI/UX de alto padrão', body: 'Contraste, tipografia, hierarquia visual e espaço em branco calibrados para orientar o visitante sem esforço consciente.' },
      { title: 'Arquitetura de informação', body: 'Cada página tem propósito definido. A navegação é clara e nenhum elemento existe sem função comunicativa.' },
      { title: 'Autoridade semântica', body: 'Schema JSON-LD, metadados completos e dados estruturados adequados ao tipo de negócio.' },
      { title: 'Consistência de marca', body: 'A identidade digital é coerente com todos os pontos de contato e com a experiência real entregue pela operação.' },
      { title: 'Conteúdo com substância', body: 'Nenhuma copy genérica. Cada texto nasce do diagnóstico da marca e reflete o que a empresa realmente é.' },
    ],
    audience: ['Empresas e profissionais de alto padrão em qualquer setor que exigem presença digital equivalente à qualidade da operação.'],
    notTitle: 'O que o M-HS não é',
    notItems: ['Não é um selo de design bonito.', 'Não é uma auditoria isolada de SEO técnico.', 'Não é um certificado de conclusão de projeto.', 'Não é uma camada estética aplicada sobre uma operação digital frágil.'],
  },
  {
    kind: 'mstar',
    slug: 'moura-star',
    seal: 'M-Star',
    expansion: 'Moura Star',
    category: 'Excelência Digital para Gastronomia',
    title: 'Presença gastronômica digital.',
    heroTitle: 'Moura Star.',
    description: 'Reconhece presenças digitais criadas para operações gastronômicas com identidade própria, onde cardápio, experiência, busca local e atmosfera precisam comunicar a mesma intenção.',
    definition: [
      'O M-Star certifica que o projeto digital de um restaurante, bar ou estabelecimento gastronômico foi concebido e executado com domínio das especificidades do setor.',
      'Gastronomia exige que experiência sensorial, logística operacional e identidade de marca coexistam em um ambiente digital coeso. O selo avalia o ecossistema, não apenas o site.',
    ],
    criteriaTitle: 'Critérios do padrão gastronômico',
    criteria: [
      { title: 'Menu digital interativo', body: 'Cardápio navegável, com categorias claras, descrições que comunicam intenção criativa, precificação visível e atualização simples.' },
      { title: 'Local SEO de precisão', body: 'Google Business Profile otimizado, NAP consistente, fotos qualificadas e Schema Restaurant com marcação densa.' },
      { title: 'Sistema de reservas integrado', body: 'Reservas acessíveis com o mínimo de fricção possível e integração operacional quando aplicável.' },
      { title: 'Storytelling gastronômico', body: 'História do estabelecimento, chef, filosofia culinária e ingredientes apresentados com profundidade real.' },
      { title: 'Experiência visual de alto padrão', body: 'Fotografia e vídeo tratados como ativos estratégicos, com linguagem visual compatível com o posicionamento.' },
      { title: 'Performance mobile prioritária', body: 'Busca gastronômica é majoritariamente mobile e em tempo real. A experiência precisa carregar rápido e preservar funções essenciais.' },
    ],
    audience: ['Restaurantes, bares, bistrôs, casas de chá, fine dining e operações gastronômicas com posicionamento acima do commodity.'],
    notTitle: 'O que o M-Star não é',
    notItems: ['Não é um site de cardápio com formulário de contato.', 'Não é uma página de Instagram com domínio próprio.', 'Não é uma ficha de delivery com design melhorado.', 'Não é estética gastronômica sem operação digital coerente.'],
  },
  {
    kind: 'mid',
    slug: 'moura-identity',
    seal: 'M-ID',
    expansion: 'Moura Identity',
    category: 'Autoridade Digital de Identidade Pessoal',
    title: 'Autoridade digital construída em torno de uma pessoa, não de uma corporação.',
    heroTitle: 'Identidade verificável.',
    description: 'Aplica-se a presenças digitais em que a autoridade nasce de uma pessoa: trajetória, voz, pensamento, entidade pública e consistência intelectual organizados com precisão.',
    definition: [
      'O M-ID certifica que o projeto digital foi concebido e executado com foco na construção de autoridade atribuída a uma pessoa.',
      'Uma marca corporativa comunica o que uma organização faz. Uma identidade pessoal comunica quem uma pessoa é: trajetória, pensamento e visão de mundo.',
    ],
    criteriaTitle: 'Critérios de identidade pessoal',
    criteria: [
      { title: 'Conteúdo com Information Gain', body: 'Estratégia editorial com perspectivas inéditas, sem produção de volume por palavras-chave. Cada publicação carrega pensamento real do titular.' },
      { title: 'Jornada com intencionalidade narrativa', body: 'A arquitetura revela progressivamente quem é o titular e por que sua perspectiva é única.' },
      { title: 'Design e experiência de leitura', body: 'Texto e imagem têm igual dignidade. Tipografia, espaçamento e hierarquia sustentam leitura longa sem fadiga.' },
      { title: 'Autoridade de entidade', body: 'Schema Person com marcação densa, afiliações, áreas de conhecimento e sameAs para perfis externos de autoridade.' },
      { title: 'Otimização para IA', body: 'llms.txt com síntese da identidade do titular, autoridade, produção e forma correta de referência por modelos de linguagem.' },
      { title: 'Voz e autenticidade', body: 'Conteúdo produzido ou rigorosamente validado pelo titular. A voz escrita é reconhecível em todos os pontos de contato.' },
    ],
    audience: ['Consultores, arquitetos, advogados, médicos especialistas, acadêmicos com atuação de mercado, criadores intelectuais e executivos com trajetória densa.'],
    notTitle: 'O que o M-ID não é',
    notItems: ['Não é um site institucional com foto profissional e lista de serviços.', 'Não é um blog com calendário editorial por palavras-chave.', 'Não é um portfólio visual sem contexto narrativo.', 'Não é uma landing page de captação disfarçada de presença digital.'],
  },
  {
    kind: 'msupreme',
    slug: 'moura-supreme',
    seal: 'M-Supreme',
    expansion: 'Moura Supreme',
    category: 'Distinção de Grau Máximo',
    title: 'O grau máximo de execução aplicado aos padrões Moura.',
    heroTitle: 'Execução máxima.',
    description: 'Marca projetos levados ao limite da execução Moura, com personalização, direção de arte, refinamento editorial e decisões técnicas tratadas sem economia de critério.',
    definition: [
      'O M-Supreme não é uma categoria separada. É o grau máximo de execução aplicado sobre qualquer categoria existente.',
      'A distinção existe porque há diferença objetiva entre atender todos os requisitos e levar cada decisão ao limite do possível: personalização, direção de arte, integrações e refinamento sem paralelo.',
    ],
    criteriaTitle: 'O que qualifica um projeto como M-Supreme',
    criteria: [
      { title: 'Personalização sem precedente', body: 'Componentes, animações, microinterações, tipografia e comportamentos projetados especificamente para aquela marca.' },
      { title: 'Direção de arte integral', body: 'Orientação sobre fotografia, vídeo, linguagem visual offline e coerência entre pontos de contato.' },
      { title: 'Integrações premium', body: 'Sistemas de terceiros integrados com personalização que elimina dissonância visual ou funcional.' },
      { title: 'Serviços de estúdio', body: 'Produção ou curadoria de ativos audiovisuais de alto padrão como parte integral do projeto.' },
      { title: 'Refinamento editorial máximo', body: 'Cada frase passa por revisão estratégica e editorial, com cuidado equivalente ao de uma publicação de referência.' },
      { title: 'Tempo e dedicação irrestrita', body: 'Projetos com duração estendida e envolvimento profundo de Paulo Moura em cada fase.' },
    ],
    audience: ['Marcas de luxo e clientes que não querem o melhor dentro de um orçamento, mas o melhor, ponto.'],
    notTitle: 'O que o M-Supreme não é',
    notItems: ['Não é um upgrade de pacote.', 'Não é um M-HS com mais páginas.', 'Não é premium por preço.', 'Não é decoração dourada: é registro de execução no limite do que a Moura produz.'],
  },
];

export const badgeStandardBySlug = Object.fromEntries(badgeStandards.map((standard) => [standard.slug, standard]));
