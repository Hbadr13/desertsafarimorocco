import { Package } from "@/lib/models"
import { Star, MapPin, Clock, Users, Shield } from "lucide-react"
import Image from "next/image"

import PackagePageDetailsCard from "@/components/packagePageDetilasCard"
import { notFound } from "next/navigation";

export const packagesTranslations: Record<'en' | 'fr' | 'es', {
    message: string;
    hero: {
        title: string;
        subtitle: string;
    };
    results: {
        found: string;
        bestDeals: string;
        sortBy: string;
        recommended: string;
    };
    package: {
        popular: string;
        duration: string;
        group: string;
        private: string;
        freeCancellation: string;
        perPerson: string;
        viewDetails: string;
        bookNow: string;
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
    buttons: {
        loadMore: string;
    };
}> = {
    en: {
        message: `Hello, I would like to make a reservation for the package`,

        hero: {
            title: "Travel Packages",
            subtitle: "Discover exceptional travel experiences"
        },
        results: {
            found: "packages found",
            bestDeals: "Best deals guaranteed",
            sortBy: "Sort by:",
            recommended: "Recommended"
        },
        package: {
            popular: "Popular",
            duration: "Duration",
            group: "Share trip",
            private: "Private trip",
            freeCancellation: "Free Cancellation",
            perPerson: "per person",
            viewDetails: "View Details",
            bookNow: "Book Now"
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
        },
        buttons: {
            loadMore: "Load More"
        }
    },
    fr: {
        message: `Bonjour, je voudrais faire une réservation pour le package `,
        hero: {
            title: "Forfaits de Voyage",
            subtitle: "Découvrez des expériences de voyage exceptionnelles"
        },
        results: {
            found: "forfaits trouvés",
            bestDeals: "Meilleures offres garanties",
            sortBy: "Trier par :",
            recommended: "Recommandé"
        },
        package: {
            popular: "Populaire",
            duration: "Durée",
            group: "Voyage partagé",
            private: "Voyage privé",
            freeCancellation: "Annulation Gratuite",
            perPerson: "par personne",
            viewDetails: "Voir les détails",
            bookNow: "Réserver"
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
        },
        buttons: {
            loadMore: "Charger plus"
        }
    },
    es: {
        message: `Hola, me gustaría hacer una reserva para el paquete`,
        hero: {
            title: "Paquetes de Viaje",
            subtitle: "Descubre experiencias de viaje excepcionales"
        },
        results: {
            found: "paquetes encontrados",
            bestDeals: "Mejores ofertas garantizadas",
            sortBy: "Ordenar por:",
            recommended: "Recomendado"
        },
        package: {
            popular: "Popular",
            duration: "Duración",
            group: "Viaje compartido",
            private: "viaje privado",
            freeCancellation: "Cancelación Gratuita",
            perPerson: "por persona",
            viewDetails: "Ver detalles",
            bookNow: "Reservar"
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
        },
        buttons: {
            loadMore: "Cargar más"
        }
    }
};
const LANGS = ["en", "fr", "es"]
const WEBSITE_NAME = process.env.NEXT_PUBLIC_SITE_URL



// SEO Metadata
export async function generateMetadata({ params }: { params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params
    const t = packagesTranslations[lang]
    if (!LANGS.includes(lang))
        return null
    return {
        title: `${t.hero.title} | ${WEBSITE_NAME}`,
        description: t.hero.subtitle,
        keywords: `travel, packages, tours, vacation, ${lang}`,
        openGraph: {
            title: t.hero.title,
            description: t.hero.subtitle,
            type: 'website',
            locale: lang,
            siteName: WEBSITE_NAME,
            url: `${WEBSITE_NAME}/${lang}/packages`,

            images: [
                {
                    url: `${WEBSITE_NAME}/image_processing20190808-4-1vbvby8.jpg`,
                    width: 1200,
                    height: 630,
                    alt: 'Travel packages',
                },
            ],
        },
        alternates: {
            canonical: `${WEBSITE_NAME}/${lang}/packages`,
            languages: {
                'en': `${WEBSITE_NAME}/en/packages`,
                'fr': `${WEBSITE_NAME}/fr/packages`,
                'es': `${WEBSITE_NAME}/es/packages`,
            },
        },
        robots: {
            index: true,
            follow: true,
        }
    }
}

// Generate static params for better performance
export async function generateStaticParams() {
    return LANGS.map((lang) => ({
        lang: lang,
    }))
}

async function getPackages(lang: "en" | "fr" | "es") {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/client/packages`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!res.ok) {
            throw new Error('Failed to fetch packages')
        }

        const data = await res.json()

        const packages = (data.packages || []).map((pkg: Package) => ({
            ...pkg,
            title: pkg.title[lang] || pkg.title.en,
            shortDescription: pkg.shortDescription[lang] || pkg.shortDescription.en,
            duration: pkg.duration[lang] || pkg.duration.en,
            departure: pkg.departure[lang] || pkg.departure.en,
            location: pkg.location?.[lang] || pkg.location?.en || "",
        }))

        return packages
    } catch (error) {
        console.error('Error fetching packages:', error)
        return []
    }
}

export default async function PackagesPage({ params }: { params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params

    if (!LANGS.includes(lang)) {
        return notFound
    }

    const packages = await getPackages(lang)
    const t = packagesTranslations[lang]

    // Structured Data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t.hero.title,
        "description": t.hero.subtitle,
        "numberOfItems": packages.length,
        "itemListElement": packages.map((pkg, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "TouristTrip",
                "name": pkg.title,
                "description": pkg.shortDescription,
                "duration": pkg.duration,
                "departureLocation": {
                    "@type": "Place",
                    "name": pkg.departure
                }
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="min-h-screen bg-gray-50">
                <div className="relative py-16 overflow-hidden">
                    <Image
                        src="/image_processing20190808-4-1vbvby8.jpg"
                        alt="Travel Packages"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
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

                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {packages.length} {t.results.found}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {t.results.bestDeals}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {packages.map(pkg => (
                            <PackagePageDetailsCard pkg={pkg} lang={lang} packagesTranslations={packagesTranslations} />
                        ))}
                    </div>
                </main>

                {/* Trust Badges */}
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