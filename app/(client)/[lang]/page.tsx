// app/[lang]/page.tsx
import { getDatabase } from "@/lib/mongodb"
import { Category, Tour, Package } from "@/lib/models"
import HeroSection from "@/components/hero"
import { CategoriesSection } from "@/components/CategoriesSection"
import { KeyFeatures } from "@/components/key-features"
import { ToursSection } from "@/components/ToursSection"
import { TopTrips } from "@/components/TopTrips"
import { ObjectId } from "mongodb"
import GallerySection from "@/components/GallerySection"

const LANGS = ["en", "fr", "es"]
const WEBSITE_NAME = process.env.NEXT_PUBLIC_WEBSITE_NAME || "Desert safaris morocco"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// SEO Metadata
export async function generateMetadata({ params }: { params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params

    const translations = {
        en: {
            title: "Desert Safaris Morocco | Luxury Desert Tours & Adventures",
            description: "Experience the magic of Moroccan deserts with our luxury tours. Camel treks, desert camps, and unforgettable adventures in the Sahara."
        },
        fr: {
            title: "Safaris Désert Maroc | Circuits Luxe et Aventures dans le Désert",
            description: "Vivez la magie des déserts marocains avec nos circuits de luxe. Randonnées à dos de chameau, camps dans le désert et aventures inoubliables au Sahara."
        },
        es: {
            title: "Safaris del Desierto Marruecos | Tours de Lujo y Aventuras",
            description: "Vive la magia de los desiertos marroquíes con nuestros tours de lujo. Paseos en camello, campamentos en el desierto y aventuras inolvidables en el Sahara."
        }
    }

    const t = translations[lang]

    return {
        title: t?.title,
        description: t?.description,
        metadataBase: new URL(SITE_URL),
        keywords: `desert safaris, morocco tours, sahara desert, ${lang}, luxury travel`,
        openGraph: {
            title: t.title,
            description: t.description,
            type: 'website',
            locale: lang,
            siteName: WEBSITE_NAME,
            url: `${SITE_URL}/${lang}`,
            images: [
                {
                    url: `${SITE_URL}/og-home.jpg`,
                    width: 1200,
                    height: 630,
                    alt: 'Desert Safaris Morocco',
                },
            ],
        },
        alternates: {
            canonical: `${SITE_URL}/${lang}`,
            languages: {
                'en': `${SITE_URL}/en`,
                'fr': `${SITE_URL}/fr`,
                'es': `${SITE_URL}/es`,
            },
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
}

// Generate static params
export async function generateStaticParams() {
    return LANGS.map((lang) => ({
        lang: lang,
    }))
}

async function getHomeData() {
    try {
        const db = await getDatabase()

        // Get all data in parallel
        const [categories, packagesDay, packagesMarrakech, tours] = await Promise.all([
            db.collection<Category>("categories").find({}).toArray(),
            db.collection<Package>("packages").find({ tourId: new ObjectId('68d9b92cabc6733561312e71') }).limit(12).toArray(),
            db.collection<Package>("packages").find({ tourId: new ObjectId('68dbc748e852b9e051011779') }).limit(12).toArray(),
            db.collection<Tour>("tours").find({}).toArray()
        ])

        return {
            categories,
            packagesDay,
            packagesMarrakech,
            tours
        }
    } catch (error) {
        console.error('Error fetching home data:', error)
        return { categories: [], packages: [], tours: [] }
    }
}

export default async function HomePage({ params }: { params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params

    if (!LANGS.includes(lang)) {
        return <div>Not Found</div>
    }

    const { categories, packagesDay, packagesMarrakech, tours } = await getHomeData()

    // Structured Data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": WEBSITE_NAME,
        "description": "Luxury desert tours and safaris in Morocco",
        "url": `${SITE_URL}/${lang}`,
        "telephone": process.env.NEXT_PUBLIC_PHONE_NUMBER,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Morocco"
        },
        "offers": {
            "@type": "AggregateOffer",
            "offerCount": packagesDay?.concat(packagesMarrakech || []).length,
            "offers": packagesDay?.concat(packagesMarrakech || []).slice(0, 9).map((pkg: Package) => ({
                "@type": "Offer",
                "name": pkg.title?.en || "",
                "description": pkg.shortDescription?.en || "",
                "price": pkg.price,
                "priceCurrency": "EUR"
            }))
        }
    }
    interface CategoryImage {
        id: string
        url: string
        packageTitle: {
            en: string,
            fr: string,
            es: string
        },
        packageSlug: string
    }
    const imagesUrl: CategoryImage[] = []
    packagesMarrakech?.concat(packagesDay).forEach((pk) => pk.images.forEach((url) => imagesUrl.push({ id: pk._id.toString(), url: url, packageSlug: pk.slug, packageTitle: pk.title })))
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                    <HeroSection lang={lang} />
                    <CategoriesSection categories={categories} lang={lang} />
                    <TopTrips index={0} packages={packagesMarrakech || []} lang={lang} />
                    <TopTrips index={1} packages={packagesDay || []} lang={lang} />
                    <ToursSection tours={tours} lang={lang} />
                    <KeyFeatures lang={lang} />
                    <div className=" max-w-5xl mx-auto pb-10">

                        {packagesMarrakech && packagesDay && <GallerySection lang={lang} images={imagesUrl} />}
                    </div>
                </main>
            </div>
        </>
    )
}