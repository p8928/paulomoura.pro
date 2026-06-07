import { brand } from './brand';

type JsonLdNode = Record<string, unknown>;

export const schemaIdentity = {
  baseUrl: 'https://paulomoura.pro',
  personId: 'https://paulomoura.pro/#person-paulo-moura',
  organizationId: 'https://paulomoura.pro/#organization',
  websiteId: 'https://paulomoura.pro/#website',
  logoId: 'https://paulomoura.pro/#logo',
  sameAs: [] as string[],
  socialProfilesPending: true,
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
  jobTitle: 'Expert em Branding e Comunicação Digital',
  description: 'Paulo Moura é expert em Branding e Comunicação Digital e criador da metodologia Brand-Driven para empresas premium e luxury.',
  knowsAbout: [
    'Brand-Driven',
    'SEO',
    'AEO',
    'GEO',
    'Presença digital',
    'Branding',
    'Comunicação digital',
    'Marketing',
    'Marketing de conteúdo',
    'Estratégia de conteúdo',
    'Tecnologia da informação',
    'Cibersegurança',
    'Google Search',
    'Estratégia de marca',
    'Dados estruturados',
    'Autoridade digital',
  ],
  sameAs: schemaIdentity.sameAs,
});

export const organizationSchema = () => compact({
  '@type': 'Organization',
  '@id': schemaIdentity.organizationId,
  name: brand.name,
  url: schemaIdentity.baseUrl + '/',
  description: brand.promise,
  founder: { '@id': schemaIdentity.personId },
  brand: {
    '@type': 'Brand',
    name: 'Moura',
  },
  areaServed: [
    { '@type': 'Country', name: 'Brasil' },
    ...brand.markets.map((market) => ({ '@type': 'City', name: market })),
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
  description,
  serviceType,
  url,
  provider: { '@id': schemaIdentity.organizationId },
  areaServed: { '@type': 'Country', name: 'Brasil' },
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
