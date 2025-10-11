import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
