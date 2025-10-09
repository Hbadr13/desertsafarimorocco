export const revalidate = 3600;
import { getDatabase } from "@/lib/mongodb"
import { Package, Tour } from "@/lib/models"
import { PackageDetailsPage } from "@/components/PackageDetailsPage"
import { notFound } from "next/navigation"

const LANGS = ["en", "fr", "es"]
const WEBSITE_NAME = process.env.NEXT_PUBLIC_WEBSITE_NAME || "Desert safaris Marrakech"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata({ params }: { params: { lang: "en" | "fr" | "es", slug: string } }) {
    const { lang, slug } = params

    try {
        const db = await getDatabase()
        const pkg = await db.collection<Package>("packages").findOne({ slug })

        if (!pkg) {
            return {
                title: "Package Not Found",
                description: "The requested package was not found."
            }
        }

        const tour = await db.collection<Tour>("tours").findOne({ _id: pkg.tourId })

        const title = `${pkg.title?.[lang] || pkg.title?.en || ""} | ${WEBSITE_NAME}`
        const description = pkg.shortDescription?.[lang] || pkg.shortDescription?.en || pkg.description?.[lang] || pkg.description?.en || ""
        const tourTitle = tour?.title?.[lang] || tour?.title?.en || ""
        const image = pkg.images?.[0] || `${SITE_URL}/default-package.jpg`

        return {
            title,
            description: description.slice(0, 160) + '...',
            metadataBase: new URL(SITE_URL),
            keywords: `${pkg.title?.[lang] || pkg.title?.en || ""}, ${tourTitle}, morocco tours, desert safari, ${lang}`,
            openGraph: {
                title,
                description: description.slice(0, 160) + '...',
                type: 'article',
                locale: lang === "fr" ? "fr_FR" : lang === "es" ? "es_ES" : "en_US",
                siteName: WEBSITE_NAME,
                url: `${SITE_URL}/${lang}/packages/${slug}`,
                images: [
                    {
                        url: image,
                        width: 1200,
                        height: 630,
                        alt: pkg.title?.[lang] || pkg.title?.en || "",
                    },
                ],
            },
            alternates: {
                canonical: `${SITE_URL}/${lang}/packages/${slug}`,
                languages: {
                    'en': `${SITE_URL}/en/packages/${slug}`,
                    'fr': `${SITE_URL}/fr/packages/${slug}`,
                    'es': `${SITE_URL}/es/packages/${slug}`,
                },
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: description.slice(0, 160) + '...',
                images: [image],
                creator: '@YourTwitterHandle', // اختياري
                site: '@YourWebsiteName' // اختياري
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        }
    } catch (error) {
        return {
            title: "Error Loading Package",
            description: "There was an error loading the package information."
        }
    }
}

export async function generateStaticParams() {
    try {
        const db = await getDatabase()
        const packages = await db.collection<Package>("packages").find({}).toArray()

        return packages.flatMap((pkg) =>
            LANGS.map((lang) => ({
                lang,
                slug: pkg.slug,
            }))
        )
    } catch (error) {
        return []
    }
}

async function getPackageData(lang: "en" | "fr" | "es", slug: string) {
    try {
        const db = await getDatabase()

        const pkg = await db.collection<Package>("packages").findOne({ slug })
        if (!pkg) {
            throw new Error('Package not found')
        }

        const tour = await db.collection<Tour>("tours").findOne({ id: pkg.tourId })

        const otherPackages = await db.collection<Package>("packages")
            .find({
                tourId: pkg.tourId,
                slug: { $ne: slug }
            })
            .limit(5)
            .toArray()

        return {
            pkg,
            tour: tour || null,
            otherPackages
        }
    } catch (error) {
        console.error('Error fetching package data:', error)
        return { pkg: null, tour: null, otherPackages: [] }
    }
}

export default async function PackageDetailPage({ params }: { params: { lang: "en" | "fr" | "es", slug: string } }) {
    const { lang, slug } = params

    if (!LANGS.includes(lang)) {
        return notFound()
    }

    const { pkg, tour, otherPackages } = await getPackageData(lang, slug)

    if (!pkg) {
        return notFound()
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": pkg.title?.[lang] || pkg.title?.en || "",
        "description": pkg.shortDescription?.[lang] || pkg.shortDescription?.en || "",
        "url": `${SITE_URL}/${lang}/packages/${slug}`,
        "image": pkg.images?.[0] || `${SITE_URL}/default-package.jpg`,
        "offers": {
            "@type": "Offer",
            "price": pkg.shareTrip,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
        },
        "itinerary": pkg.itinerary?.map((day: any) => ({
            "@type": "Trip",
            "name": day.title,
            "description": day.description
        })),
        "duration": pkg.duration?.[lang] || pkg.duration?.en || "",
        "departureLocation": {
            "@type": "Place",
            "name": pkg.departure?.[lang] || pkg.departure?.en || ""
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <PackageDetailsPage
                pkg={pkg}
                tour={tour}
                otherPackages={otherPackages}
                lang={lang}
            />
        </>
    )
}