import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectText = z.object({
  summary: z.string().min(1),
  did: z.array(z.string().min(1)).min(1),
  imageAlt: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number(),
      repo: z.url(),
      stack: z.array(z.string()).min(1),
      image: image().optional(),
      imageColor: z
        .string()
        .regex(/^#[0-9a-f]{6}$/i)
        .optional(),
      text: z.object({
        'pt-br': projectText,
        es: projectText,
        en: projectText,
      }),
    }),
});

const heading = z.object({ title: z.string(), intro: z.string().optional() });
const labeled = z.object({ label: z.string(), text: z.string() });

const profile = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/profile' }),
  schema: z.object({
    metaDescription: z.string().max(170),
    role: z.string(),
    tagline: z.string(),
    status: z.string(),
    heroVideoLabel: z.string(),
    photoAlt: z.string(),
    work: heading.extend({
      viewCode: z.string(),
      didLabel: z.string(),
      stackLabel: z.string(),
    }),
    others: heading.extend({
      items: z.array(
        z.object({
          name: z.string(),
          line: z.string(),
          repo: z.url().optional(),
        }),
      ),
    }),
    qa: heading.extend({
      items: z.array(z.object({ title: z.string(), text: z.string() })),
    }),
    path: heading.extend({
      entries: z.array(
        z.object({ period: z.string(), title: z.string(), text: z.string() }),
      ),
    }),
    education: heading.extend({
      items: z.array(
        z.object({
          degree: z.string(),
          school: z.string(),
          status: z.string(),
        }),
      ),
    }),
    skills: heading.extend({
      groups: z.array(
        z.object({ label: z.string(), items: z.array(z.string()) }),
      ),
    }),
    contact: heading.extend({
      languagesLabel: z.string(),
      languages: z.array(labeled),
      form: z.object({
        name: z.string(),
        email: z.string(),
        message: z.string(),
        send: z.string(),
        sending: z.string(),
        ok: z.string(),
        error: z.string(),
        invalid: z.string(),
      }),
    }),
  }),
});

export const collections = { projects, profile };
