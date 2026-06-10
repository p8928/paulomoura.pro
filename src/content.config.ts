import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const editorial = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/editorial' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    canonicalPath: z.string().optional(),
    schemaType: z.enum(['Article', 'BlogPosting']).default('Article'),
    schemaAbout: z.array(z.string()).default([]),
    schemaMentions: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['branding', 'seo', 'geo', 'aeo', 'luxury', 'estrategia']),
    draft: z.boolean().default(false),
  }),
});

const segments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/segments' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    segment: z.string(),
    region: z.string().optional(),
    priority: z.number().int().min(1).max(5).default(3),
    draft: z.boolean().default(false),
  }),
});

export const collections = { editorial, segments };
