import { cache } from 'react'
import { db } from '@/lib/db'
import { eq, sql } from 'drizzle-orm'
import { cities, services, content } from '@/lib/db/schema'
import { AppError } from '@/lib/error'

// Cache static data queries
export const getCities = cache(async () => {
  return db
    .select()
    .from(cities)
    .where(eq(cities.isActive, true))
    .orderBy(cities.name)
})

export const getServices = cache(async () => {
  return db
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(services.name)
})

// Get all city slugs for static paths
export const getAllCitySlugs = cache(async () => {
  const results = await db
    .select({ slug: cities.slug })
    .from(cities)
    .where(eq(cities.isActive, true))

  if (!results.length) {
    throw new AppError('No cities found', 'NOT_FOUND', 404)
  }

  return results.map(city => ({
    city: city.slug
  }))
})

// Get all service slugs for static paths
export const getAllServiceSlugs = cache(async () => {
  const results = await db
    .select({ slug: services.slug })
    .from(services)
    .where(eq(services.isActive, true))

  if (!results.length) {
    throw new AppError('No services found', 'NOT_FOUND', 404)
  }

  return results.map(service => ({
    service: service.slug
  }))
})

// Get all city + service combinations for static paths
export const getAllCityServiceSlugs = cache(async () => {
  const results = await db
    .select({
      citySlug: cities.slug,
      serviceSlug: services.slug,
    })
    .from(cities)
    .innerJoin(services, sql`true`)
    .where(
      sql`${cities.isActive} = true AND ${services.isActive} = true`
    )

  return results.map(({ citySlug, serviceSlug }) => ({
    city: citySlug,
    service: serviceSlug,
  }))
})

// Get city data with related content
export const getCityData = cache(async (slug: string) => {
  const [city] = await db
    .select({
      id: cities.id,
      name: cities.name,
      slug: cities.slug,
      content: content.data,
      seo: content.metadata,
    })
    .from(cities)
    .leftJoin(
      content,
      sql`${content.type} = 'city' AND ${content.slug} = ${cities.slug}`
    )
    .where(eq(cities.slug, slug))

  if (!city) {
    throw new AppError('City not found', 'NOT_FOUND', 404)
  }

  return city
})

// Get service data with related content
export const getServiceData = cache(async (slug: string) => {
  const [service] = await db
    .select({
      id: services.id,
      name: services.name,
      slug: services.slug,
      description: services.description,
      price: services.price,
      features: services.features,
      content: content.data,
      seo: content.metadata,
    })
    .from(services)
    .leftJoin(
      content,
      sql`${content.type} = 'service' AND ${content.slug} = ${services.slug}`
    )
    .where(eq(services.slug, slug))

  if (!service) {
    throw new AppError('Service not found', 'NOT_FOUND', 404)
  }

  return service
})