export const revalidate = 3600;
import { getDatabase } from "@/lib/mongodb"
import { Category, Tour, Package } from "@/lib/models"
import { CategoryToursPage } from "@/components/CategoryToursPage"
import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"

const categoryDetailTranslations: Record<'en' | 'fr' | 'es', {
    hero: {
        tours: string;
        packages: string;
    };
    breadcrumb: {
        home: string;
        categories: string;
    };
    emptyState: {
        title: string;
        description: string;
        button: string;
    };
    tour: {
        packages: string;
    };
    explore: {
        title: string;
        subtitle: string;
        viewAll: string;
        explore: string;
        tours: string;
    };
    buttons: {
        readMore: string;
        readLess: string;
    };
}> = {
    en: {
        hero: {
            tours: "Tours",
            packages: "Packages"
        },
        breadcrumb: {
            home: "Home",
            categories: "Categories"
        },
        emptyState: {
            title: "No tours found in this category",
            description: "We couldn't find any tours matching your criteria",
            button: "Back to Home"
        },
        tour: {
            packages: "Packages"
        },
        explore: {
            title: "Explore Other Categories",
            subtitle: "Discover more amazing travel experiences in Morocco",
            viewAll: "View All Categories",
            explore: "Explore",
            tours: "Tours"
        },
        buttons: {
            readMore: "Read More",
            readLess: "Read Less"
        }
    },
    fr: {
        hero: {
            tours: "Circuits",
            packages: "Forfaits"
        },
        breadcrumb: {
            home: "Accueil",
            categories: "Catégories"
        },
        emptyState: {
            title: "Aucun circuit trouvé dans cette catégorie",
            description: "Nous n'avons trouvé aucun circuit correspondant à vos critères",
            button: "Retour à l'accueil"
        },
        tour: {
            packages: "Forfaits"
        },
        explore: {
            title: "Explorer d'autres catégories",
            subtitle: "Découvrez plus d'expériences de voyage incroyables au Maroc",
            viewAll: "Voir toutes les catégories",
            explore: "Explorer",
            tours: "Circuits"
        },
        buttons: {
            readMore: "Lire plus",
            readLess: "Lire moins"
        }
    },
    es: {
        hero: {
            tours: "Tours",
            packages: "Paquetes"
        },
        breadcrumb: {
            home: "Inicio",
            categories: "Categorías"
        },
        emptyState: {
            title: "No se encontraron tours en esta categoría",
            description: "No pudimos encontrar tours que coincidan con tus criterios",
            button: "Volver al Inicio"
        },
        tour: {
            packages: "Paquetes"
        },
        explore: {
            title: "Explorar otras categorías",
            subtitle: "Descubre más experiencias de viaje increíbles en Marruecos",
            viewAll: "Ver todas las categorías",
            explore: "Explorar",
            tours: "Tours"
        },
        buttons: {
            readMore: "Leer más",
            readLess: "Leer menos"
        }
    }
};

const LANGS = ["en", "fr", "es"]
const WEBSITE_NAME = process.env.NEXT_PUBLIC_WEBSITE_NAME || "Desert safaris Marrakech"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata({ params }: { params: { lang: "en" | "fr" | "es", slug: string } }) {
    const { lang, slug } = params

    try {
        const db = await getDatabase()
        const categoryData = await db.collection<Category>("categories").findOne({ slug })

        if (!categoryData) {
            return {
                title: "Category Not Found",
                description: "The requested category was not found."
            }
        }

        const title = `${categoryData.title?.[lang] || categoryData.title?.en || ""} Tours | ${WEBSITE_NAME}`
        const description = categoryData.shortDescription?.[lang] || categoryData.shortDescription?.en || categoryData.description?.[lang] || categoryData.description?.en || ""

        return {
            title,
            description: description.slice(0, 160) + '...',
            metadataBase: new URL(SITE_URL),
            keywords: `${categoryData.title?.[lang] || categoryData.title?.en || ""}, tours, travel, morocco, ${lang}`,
            openGraph: {
                title,
                description: description.slice(0, 160) + '...',
                type: 'website',
                locale: lang,
                siteName: WEBSITE_NAME,
                url: `${SITE_URL}/${lang}/categories/${slug}`,
                images: [
                    {
                        url: categoryData.images?.[0] || `${SITE_URL}/default-og.jpg`,
                        width: 1200,
                        height: 630,
                        alt: categoryData.title?.[lang] || categoryData.title?.en || "",
                    },
                ],
            },
            alternates: {
                canonical: `${SITE_URL}/${lang}/categories/${slug}`,
                languages: {
                    'en': `${SITE_URL}/en/categories/${slug}`,
                    'fr': `${SITE_URL}/fr/categories/${slug}`,
                    'es': `${SITE_URL}/es/categories/${slug}`,
                },
            },
            twitter: {
                card: "summary_large_image",
                title,
                description: description.slice(0, 160) + "...",
                images: [categoryData.images?.[0] || `${SITE_URL}/default-og.jpg`],
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
            title: "Error Loading Category",
            description: "There was an error loading the category information."
        }
    }
}

export async function generateStaticParams() {
    try {
        const db = await getDatabase()
        const categories = await db.collection<Category>("categories").find({}).toArray()
        return categories.flatMap((category) =>
            LANGS.map((lang) => ({
                lang,
                slug: category.slug,
            }))
        )
    } catch (error) {
        return []
    }
}

async function getCategoryData(lang: "en" | "fr" | "es", slug: string) {
    try {
        const db = await getDatabase()

        const categoryData = await db.collection<Category>("categories").findOne({ slug })

        if (!categoryData) {
            throw new Error('Category not found')
        }

        const allCategories = await db.collection<Category>("categories").find({}).toArray()

        const tours = await db.collection<Tour>("tours").find({ categoryId: categoryData._id }).sort({ createdAt: 1 }).toArray()
        console.log('Fetched tours:', tours)
        // if(tours. === 0) {
        const allPackageIds = tours.flatMap(tour =>
            (tour.packages || []).map(id => new ObjectId(id))
        )
        if (allPackageIds.length == 0) return {
            category: categoryData,
            categories: allCategories,
            tours: [],
            allPackages: []
        }

        const allPackages = await db.collection<Package>("packages")
            .find({ _id: { $in: allPackageIds } })
            .toArray()

        const packagesMap = new Map()
        allPackages.forEach(pkg => {
            packagesMap.set(pkg._id.toString(), pkg)
        })
        const toursWithPackages = tours.map((tour: Tour) => {
            const tourPackages = (tour.packages || [])
                .map((packageId: ObjectId | string) => packagesMap.get(packageId.toString()))
                .filter(Boolean) as Package[]

            return {
                ...tour,
                packages: tourPackages.map(pkg => ({
                    ...pkg,
                    _id: pkg._id?.toString(),
                    createdAt: pkg.createdAt?.toISOString(),
                    updatedAt: pkg.updatedAt?.toISOString(),
                }))
            }
        })

        return {
            category: categoryData,
            categories: allCategories,
            tours: toursWithPackages,
            allPackages: allPackages
        }
    } catch (error) {
        console.error('Error fetching category data:', error)
        return { category: null, categories: [], tours: [] }
    }
}

export default async function CategoryPage({ params }: { params: { lang: "en" | "fr" | "es", slug: string } }) {
    const { lang, slug } = params

    if (!LANGS.includes(lang)) {
        return notFound()
    }

    const { category, categories, tours, allPackages } = await getCategoryData(lang, slug)

    if (!category) {
        console.log('Category not found, returning 404')
        return notFound()
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": `${category.title?.[lang] || category.title?.en || ""} Tours`,
        "description": category.shortDescription?.[lang] || category.shortDescription?.en || category.description?.[lang] || category.description?.en || "",
        "url": `${SITE_URL}/${lang}/categories/${slug}`,
        "image": category.images?.[0] || `${SITE_URL}/default-image.jpg`,
        "containsPlace": {
            "@type": "Place",
            "name": "Morocco"
        },
        "offers": {
            "@type": "AggregateOffer",
            "offerCount": allPackages.length,
            "offers": allPackages.map((pkg) => ({
                "@type": "Offer",
                "name": pkg.title?.[lang] || pkg.title?.en || "",
                "description": pkg.shortDescription?.[lang] || pkg.shortDescription?.en || "",
                "price": pkg.price,
                "priceCurrency": "EUR"
            }))
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <CategoryToursPage
                category={category}
                tours={tours}
                allCategories={categories}
                lang={lang}
                translations={categoryDetailTranslations[lang]}
            />
        </>
    )
}