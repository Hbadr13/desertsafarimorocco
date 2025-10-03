// app/[lang]/categories/page.tsx
export const revalidate = 60;
import { Category } from "@/lib/models"
import { MapPin, ArrowRight, Shield, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation";
// lib/translations/categories.ts
const categoriesTranslations: Record<'en' | 'fr' | 'es', {
    hero: {
        title: string;
        subtitle: string;
    };
    results: {
        found: string;
        bestDestinations: string;
    };
    category: {
        popular: string;
        options: string;
        explore: string;
    };
    emptyState: {
        title: string;
        description: string;
    };
    features: {
        trustSafety: {
            title: string;
            description: string;
        };
        support: {
            title: string;
            description: string;
        };
        bestPrice: {
            title: string;
            description: string;
        };
    };
}> = {
    en: {
        hero: {
            title: "Travel Categories",
            subtitle: "Explore our curated collection of amazing destinations"
        },
        results: {
            found: "categories found",
            bestDestinations: "Discover our top destinations"
        },
        category: {
            popular: "Popular",
            options: "options",
            explore: "Explore Options"
        },
        emptyState: {
            title: "No categories found",
            description: "Check back later to discover our new destinations"
        },
        features: {
            trustSafety: {
                title: "Trust & Safety",
                description: "Secure and guaranteed payments"
            },
            support: {
                title: "24/7 Support",
                description: "Our team assists you anytime"
            },
            bestPrice: {
                title: "Best Price Guaranteed",
                description: "Find a lower price? We'll match it!"
            }
        }
    },
    fr: {
        hero: {
            title: "Catégories de Voyage",
            subtitle: "Découvrez notre collection soigneusement sélectionnée de destinations incroyables"
        },
        results: {
            found: "catégories trouvées",
            bestDestinations: "Découvrez nos meilleures destinations"
        },
        category: {
            popular: "Populaire",
            options: "options",
            explore: "Explorer les Options"
        },
        emptyState: {
            title: "Aucune catégorie trouvée",
            description: "Revenez plus tard pour découvrir nos nouvelles destinations"
        },
        features: {
            trustSafety: {
                title: "Confiance et sécurité",
                description: "Paiements sécurisés et garantis"
            },
            support: {
                title: "Support 24/7",
                description: "Notre équipe vous assiste à tout moment"
            },
            bestPrice: {
                title: "Meilleur prix garanti",
                description: "Trouvez un prix inférieur ? Nous égalons !"
            }
        }
    },
    es: {
        hero: {
            title: "Categorías de Viaje",
            subtitle: "Explora nuestra colección curada de destinos increíbles"
        },
        results: {
            found: "categorías encontradas",
            bestDestinations: "Descubre nuestros mejores destinos"
        },
        category: {
            popular: "Popular",
            options: "opciones",
            explore: "Explorar Opciones"
        },
        emptyState: {
            title: "No se encontraron categorías",
            description: "Vuelve más tarde para descubrir nuestros nuevos destinos"
        },
        features: {
            trustSafety: {
                title: "Confianza y seguridad",
                description: "Pagos seguros y garantizados"
            },
            support: {
                title: "Soporte 24/7",
                description: "Nuestro equipo te ayuda en cualquier momento"
            },
            bestPrice: {
                title: "Mejor precio garantizado",
                description: "¿Encontraste un precio menor? ¡Igualamos!"
            }
        }
    }
};
const LANGS = ["en", "fr", "es"]
const WEBSITE_NAME = process.env.NEXT_PUBLIC_SITE_URL

// SEO Metadata
export async function generateMetadata({ params }: { params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params
    const t = categoriesTranslations[lang]
    if (!LANGS.includes(lang))
        return null
    return {
        title: `${t.hero.title} | ${WEBSITE_NAME}`,
        description: t.hero.subtitle,
        keywords: `travel, categories, destinations, tours, ${lang}, morocco`,
        openGraph: {
            title: t.hero.title,
            description: t.hero.subtitle,
            type: 'website',
            locale: lang,
            siteName: WEBSITE_NAME,
            url: `${WEBSITE_NAME}/${lang}/categories`,

            images: [
                {
                    url: `${WEBSITE_NAME}/categories-og.jpg`,
                    width: 1200,
                    height: 630,
                    alt: 'Travel Categories',
                },
            ],
        },
        alternates: {
            canonical: `${WEBSITE_NAME}/${lang}/categories`,
            languages: {
                'en': `${WEBSITE_NAME}/en/categories`,
                'fr': `${WEBSITE_NAME}/fr/categories`,
                'es': `${WEBSITE_NAME}/es/categories`,
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

// Generate static params for better performance
export async function generateStaticParams() {
    return LANGS.map((lang) => ({
        lang: lang,
    }))
}

async function getCategories(lang: "en" | "fr" | "es") {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/client/categories`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!res.ok) {
            throw new Error('Failed to fetch categories')
        }

        const data = await res.json()

        const categories = (data.categories || []).map((category: Category) => ({
            ...category,
            title: category.title[lang] || category.title.en,
            shortDescription: category.shortDescription[lang] || category.shortDescription.en,
        }))

        return categories
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

// Category Card Component
function CategoryCard({ category, lang, t }: { category: Category, lang: string, t: any }) {
    return (
        <article className="border max-w-sm border-gray-200 rounded-xl overflow-hidden h-full hover:border-blue-300 transition-all duration-200 group">
            <div className="p-0 flex flex-col h-full">
                {/* Image with Gradient Overlay */}
                <div className="h-52 w-full overflow-hidden relative">
                    <Image
                        src={category.images[0]}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>

                    {/* Top Badge */}
                    <div className="absolute top-4 left-4">
                        <div className="bg-white text-gray-800 font-semibold border-0 shadow-md px-3 py-1 rounded-full text-sm">
                            ⭐ {t.category.popular}
                        </div>
                    </div>

                    {/* Bottom Text Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl font-bold text-white drop-shadow-lg">
                            {category.title}
                        </h2>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                            <MapPin className="h-4 w-4 text-green-400" />
                            <span>Morocco • {category.tours?.length || 0} {t.category.options}</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.shortDescription}
                    </p>
                    <div className="w-full flex justify-end mt-auto">
                        <Link
                            href={`/${lang}/categories/${category.slug}`}
                            className="rounded-xl flex items-center py-2 px-3 justify-center duration-200 w-max hover:bg-blue-100 text-blue-500 font-semibold gap-2"
                            aria-label={`Explore ${category.title} options`}
                        >
                            {t.category.explore} <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default async function CategoriesPage({ params }: { params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params
    if (!LANGS.includes(lang))
        return notFound


    const categories = await getCategories(lang)
    const t = categoriesTranslations[lang]

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t.hero.title,
        "description": t.hero.subtitle,
        "numberOfItems": categories.length,
        "itemListElement": categories.map((category: Category, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "TouristDestination",
                "name": category.title,
                "description": category.shortDescription,
                "url": `https://yourdomain.com/${lang}/categories/${category.slug}`,
                "containsPlace": {
                    "@type": "Place",
                    "name": "Morocco"
                }
            }
        }))
    }

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section with Background Image */}
                <div className="relative py-16 overflow-hidden">
                    <Image
                        src="/categories-hero.webp"
                        alt={t.hero.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="container relative pt-4 mx-auto px-4 z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            {t.hero.title}
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl text-white">
                            {t.hero.subtitle}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    {/* Results Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {categories.length} {t.results.found}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {t.results.bestDestinations}
                            </p>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category: Category) => (
                            <CategoryCard
                                key={category.slug}
                                category={category}
                                lang={lang}
                                t={t}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {categories.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🏝️</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                {t.emptyState.title}
                            </h3>
                            <p className="text-gray-500">
                                {t.emptyState.description}
                            </p>
                        </div>
                    )}
                </main>
                <div className="bg-white border-t border-gray-200 py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <Shield className="w-12 h-12 text-amber-500 mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {t.features.trustSafety.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {t.features.trustSafety.description}
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Users className="w-12 h-12 text-amber-500 mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {t.features.support.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {t.features.support.description}
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Star className="w-12 h-12 text-amber-500 mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {t.features.bestPrice.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {t.features.bestPrice.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}