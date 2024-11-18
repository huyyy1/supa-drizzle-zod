import { pgTable, text, jsonb, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const cities = pgTable('cities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: text('price').notNull(),
  features: jsonb('features').$type<string[]>(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const content = pgTable('content', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(), // 'city', 'service', 'blog'
  slug: text('slug').notNull(),
  data: jsonb('data').notNull(),
  metadata: jsonb('metadata'), // SEO and other metadata
  status: text('status').notNull().default('draft'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Zod Schemas
export const insertCitySchema = createInsertSchema(cities)
export const selectCitySchema = createSelectSchema(cities)

export const insertServiceSchema = createInsertSchema(services)
export const selectServiceSchema = createSelectSchema(services)

export const insertContentSchema = createInsertSchema(content)
export const selectContentSchema = createSelectSchema(content)