import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityData, getAllCitySlugs } from '@/lib/db/queries/static'
import { citySchema, cityParamsSchema } from '@/lib/validations/static'
import { CityHero } from '@/components/sections/CityHero'
import { ServiceAreas } from '@/components/sections/ServiceAreas'
import { CleanerProfiles } from '@/components/sections/CleanerProfiles'
import { RecentBookings } from '@/components/sections/RecentBookings'
import { CityFAQ } from '@/components/sections/CityFAQ'

interface CityPageProps {
  params: {
    city: string
  }
}

export async function generateStaticParams() {
  return getAllCitySlugs()
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  try {
    const validatedParams = cityParamsSchema.parse(params)
    const cityData = await getCityData(validatedParams.city)
    const validatedCity = citySchema.parse(cityData)
    const seo = validatedCity.seo as Record<string, string>

    return {
      title: seo?.title ?? `House Cleaning Services in ${validatedCity.name}`,
      description: seo?.description ?? `Professional house cleaning services in ${validatedCity.name}. Book trusted local cleaners for regular cleaning, deep cleaning, and end of lease cleaning.`,
      openGraph: {
        title: seo?.ogTitle ?? `${validatedCity.name} House Cleaning Services`,
        description: seo?.ogDescription,
        images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
      },
    }
  } catch (error) {
    return {
      title: 'House Cleaning Services',
      description: 'Professional house cleaning services across Australia',
    }
  }
}

export default async function CityPage({ params }: CityPageProps) {
  try {
    const validatedParams = cityParamsSchema.parse(params)
    const cityData = await getCityData(validatedParams.city)
    const city = citySchema.parse(cityData)

    return (
      <>
        <CityHero city={city} />
        <ServiceAreas city={city} />
        <CleanerProfiles city={city} />
        <RecentBookings city={city} />
        <CityFAQ city={city} />
      </>
    )
  } catch (error) {
    notFound()
  }
}