import { z } from 'zod'

export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  content: z.record(z.unknown()).nullable(),
  seo: z.record(z.unknown()).nullable(),
})

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  features: z.array(z.string()),
})

export const cityParamsSchema = z.object({
  city: z.string(),
})

export const serviceParamsSchema = z.object({
  service: z.string(),
})