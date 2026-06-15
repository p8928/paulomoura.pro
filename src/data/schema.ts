import { brand } from './brand';

type JsonLdNode = Record<string, unknown>;

export const schemaIdentity = {
  baseUrl: 'https://paulomoura.pro',
  logoUrl: 'https://paulomoura.pro/images/logo/main_logo_dark.svg',
  email: 'contato@paulomoura.pro',
  whatsapp: '+5511922305905',
  personId: 'https://paulomoura.pro/#person-paulo-moura',
  organizationId: 'https://paulomoura.pro/#organization',
  websiteId: 'https://paulomoura.pro/#website',
  logoId: 'https://paulomoura.pro/#logo',
  sameAs: ['https://www.linkedin.com/in/paulo-moura-266b6b416/'] as string[],
  socialProfilesPending: false,
};

const compact = <T extends JsonLdNode>(node: T): T => {
  const cleaned = Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );

  return cleaned as T;
};

const stripContext = (node: JsonLdNode) => {
  const { '@context': _context, ...rest } = node;
  return rest;
};

export const personSchema = () => compact({
  '@type': 'Person',
  '@id': schemaIdentity.personId,
  name: brand.name,
  url: schemaIdentity.baseUrl + '/autor/paulo-moura/',
  jobTitle: 'Diretor de presença digital Brand-Driven',
  description: 'Paulo Moura conduz uma boutique digital de presença, reputação e busca para empresas cuja comunicação precisa refletir a qualidade real da entrega.',
  email: schemaIdentity.email,
  telephone: schemaIdentity.whatsapp,
  worksFor: { '@id': schemaIdentity.organizationId },
  knowsAbout: [
    'Brand-Driven',
    'Direção de presença digital',
    'Leitura de negócio',
    'Branding',
    'Comunicação digital',
    'SEO',
    'AEO',
    'GEO',
    'Presença local',
    'Marketing de conteúdo',
    'Estratégia de conteúdo',
    'Google Search',
    'Dados estruturados',
    'Autoridade digital',
    'Reputação digital',
  ],
  sameAs: schemaIdentity.sameAs,
});

export const organizationSchema = () => compact({
  '@type': 'Organization',
  '@id': schemaIdentity.organizationId,
  name: brand.name,
  alternateName: 'Moura',
  url: schemaIdentity.baseUrl + '/',
  logo: {
    '@type': 'ImageObject',
    '@id': schemaIdentity.logoId,
    url: schemaIdentity.logoUrl,
  },
  description: 'Boutique digital conduzida por Paulo Moura para presença, reputação e busca sob direção próxima.',
  slogan: 'Presença digital conduzida por marca, método e assinatura.',
  email: schemaIdentity.email,
  telephone: schemaIdentity.whatsapp,
  founder: { '@id': schemaIdentity.personId },
  brand: {
    '@type': 'Brand',
    name: 'Moura',
    slogan: 'Presença, reputação e busca sob direção próxima.',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'candidatura e atendimento comercial',
    email: schemaIdentity.email,
    telephone: schemaIdentity.whatsapp,
    availableLanguage: ['pt-BR'],
  },
  areaServed: [
    ...brand.markets.map((market) => ({ '@type': 'City', name: market })),
    { '@type': 'Country', name: 'Brasil' },
  ],
  knowsAbout: [
    'Brand-Driven',
    'Direção de presença digital',
    'Branding',
    'SEO',
    'AEO',
    'GEO',
    'Reputação digital',
    'Dados estruturados',
  ],
  sameAs: schemaIdentity.sameAs,
});

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': schemaIdentity.websiteId,
  name: brand.name,
  url: schemaIdentity.baseUrl + '/',
  inLanguage: 'pt-BR',
  publisher: { '@id': schemaIdentity.organizationId },
});

interface BaseGraphInput {
  canonicalUrl: URL;
  pageTitle: string;
  description: string;
  pageType?: string | string[];
  mainEntity?: JsonLdNode;
  extraNodes?: JsonLdNode[];
}

export const createBaseSchemaGraph = ({
  canonicalUrl,
  pageTitle,
  description,
  pageType = 'WebPage',
  mainEntity,
  extraNodes = [],
}: BaseGraphInput) => {
  const url = canonicalUrl.toString();
  const pageNode = compact({
    '@type': pageType,
    '@id': url + '#webpage',
    url,
    name: pageTitle,
    description,
    isPartOf: { '@id': schemaIdentity.websiteId },
    inLanguage: 'pt-BR',
    about: { '@id': schemaIdentity.personId },
    publisher: { '@id': schemaIdentity.organizationId },
    mainEntity,
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema(),
      organizationSchema(),
      websiteSchema(),
      pageNode,
      ...extraNodes.map(stripContext),
    ],
  };
};

export const serviceSchema = ({
  id,
  name,
  description,
  serviceType,
  url,
  audience,
}: {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  url: string;
  audience?: string;
}) => compact({
  '@type': 'Service',
  '@id': id,
  name,
  description: description + ' Atuação presencial prioritária em São Paulo, Jundiaí, Sorocaba e Campinas; projetos em outras regiões são avaliados por contexto.',
  serviceType,
  category: 'Boutique digital Brand-Driven',
  url,
  provider: { '@id': schemaIdentity.organizationId },
  brand: { '@type': 'Brand', name: 'Moura' },
  areaServed: [
    ...brand.markets.map((market) => ({ '@type': 'City', name: market })),
    { '@type': 'Country', name: 'Brasil' },
  ],
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: schemaIdentity.baseUrl + '/candidatura/',
    servicePhone: {
      '@type': 'ContactPoint',
      telephone: schemaIdentity.whatsapp,
      contactType: 'candidatura e atendimento comercial',
      availableLanguage: ['pt-BR'],
    },
  },
  audience: audience ? { '@type': 'Audience', audienceType: audience } : undefined,
});

export const itemListSchema = ({
  id,
  name,
  description,
  items,
}: {
  id: string;
  name: string;
  description?: string;
  items: Array<{ name: string; url?: string; description?: string }>;
}) => compact({
  '@type': 'ItemList',
  '@id': id,
  name,
  description,
  itemListElement: items.map((item, index) => compact({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: item.url,
    description: item.description,
  })),
});

export const breadcrumbSchema = ({
  id,
  items,
}: {
  id: string;
  items: Array<{ name: string; url: string }>;
}) => ({
  '@type': 'BreadcrumbList',
  '@id': id,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
