export const revalidate = 3600;

import { Package, Tour, Category } from "@/lib/models"
import { Star, MapPin, Clock, Users, Shield, ArrowLeft, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import { Swiper } from "@/components/ui/swiper";

const LANGS = ["en", "fr", "es"]
const WEBSITE_NAME = process.env.NEXT_PUBLIC_SITE_URL

const tourPageTranslations = {
    en: {
        whatsappMessage: `Hello, I would like to make a reservation for the package: `,
        breadcrumb: {
            home: "Home",
            tours: "Tours",
            currentTour: "Current Tour"
        },
        hero: {
            explorePackages: "Explore Packages",
            packagesInThisTour: "Packages in this tour"
        },
        packages: {
            availablePackages: "Available Packages",
            noPackages: "No packages available for this tour",
            duration: "Duration",
            location: "Location",
            departure: "Departure",
            perPerson: "per person",
            shared: "Shared",
            private: "Private",
            viewDetails: "View Details",
            bookNow: "Book Now"
        },
        relatedTours: {
            title: "Other Tours in This Category",
            noTours: "No other tours in this category",
            viewTour: "View Tour"
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
        whatsappMessage: `Bonjour, je voudrais faire une réservation pour le package : `,
        breadcrumb: {
            home: "Accueil",
            tours: "Circuits",
            currentTour: "Circuit Actuel"
        },
        hero: {
            explorePackages: "Explorer les Forfaits",
            packagesInThisTour: "Forfaits dans ce circuit"
        },
        packages: {
            availablePackages: "Forfaits Disponibles",
            noPackages: "Aucun forfait disponible pour ce circuit",
            duration: "Durée",
            location: "Emplacement",
            departure: "Départ",
            perPerson: "par personne",
            shared: "Partagé",
            private: "Privé",
            viewDetails: "Voir les Détails",
            bookNow: "Réserver"
        },
        relatedTours: {
            title: "Autres Circuits dans Cette Catégorie",
            noTours: "Aucun autre circuit dans cette catégorie",
            viewTour: "Voir le Circuit"
        },
        features: {
            trustSafety: {
                title: "Confiance et Sécurité",
                description: "Paiements sécurisés et garantis"
            },
            support: {
                title: "Support 24/7",
                description: "Notre équipe vous assiste à tout moment"
            },
            bestPrice: {
                title: "Meilleur Prix Garanti",
                description: "Trouvez un prix inférieur ? Nous égalons !"
            }
        }
    },
    es: {
        whatsappMessage: `Hola, me gustaría hacer una reserva para el paquete:`,
        breadcrumb: {
            home: "Inicio",
            tours: "Tours",
            currentTour: "Tour Actual"
        },
        hero: {
            explorePackages: "Explorar Paquetes",
            packagesInThisTour: "Paquetes en este tour"
        },
        packages: {
            availablePackages: "Paquetes Disponibles",
            noPackages: "No hay paquetes disponibles para este tour",
            duration: "Duración",
            location: "Ubicación",
            departure: "Salida",
            perPerson: "por persona",
            shared: "Compartido",
            private: "Privado",
            viewDetails: "Ver Detalles",
            bookNow: "Reservar"
        },
        relatedTours: {
            title: "Otros Tours en Esta Categoría",
            noTours: "No hay otros tours en esta categoría",
            viewTour: "Ver Tour"
        },
        features: {
            trustSafety: {
                title: "Confianza y Seguridad",
                description: "Pagos seguros y garantizados"
            },
            support: {
                title: "Soporte 24/7",
                description: "Nuestro equipo te ayuda en cualquier momento"
            },
            bestPrice: {
                title: "Mejor Precio Garantizado",
                description: "¿Encontraste un precio menor? ¡Igualamos!"
            }
        }
    }
}

export async function generateMetadata({ params }: { params: { lang: "en" | "fr" | "es", slug: string } }) {
    const { lang, slug } = params

    if (!LANGS.includes(lang)) {
        return null
    }

    try {
        const db = await getDatabase()
        const tour = await db.collection<Tour>("tours").findOne({ slug })

        if (!tour) {
            return {
                title: "Tour Not Found",
                description: "The requested tour could not be found."
            }
        }

        const tourTitle = tour.title[lang] || tour.title.en
        const tourDescription = tour.shortDescription[lang] || tour.shortDescription.en
        const tourImage = tour.images?.[0] || "/default-tour.jpg"

        return {
            title: `${tourTitle} | ${WEBSITE_NAME}`,
            description: tourDescription,
            keywords: `tour, travel, packages, ${tourTitle}, ${lang}`,
            openGraph: {
                title: tourTitle,
                description: tourDescription,
                type: 'website',
                locale: lang,
                siteName: WEBSITE_NAME,
                url: `${WEBSITE_NAME}/${lang}/tours/${slug}`,
                images: [
                    {
                        url: `${WEBSITE_NAME}${tourImage}`,
                        width: 1200,
                        height: 630,
                        alt: tourTitle,
                    },
                ],
            },
            alternates: {
                canonical: `${WEBSITE_NAME}/${lang}/tours/${slug}`,
                languages: {
                    'en': `${WEBSITE_NAME}/en/tours/${slug}`,
                    'fr': `${WEBSITE_NAME}/fr/tours/${slug}`,
                    'es': `${WEBSITE_NAME}/es/tours/${slug}`,
                },
            },
            robots: {
                index: true,
                follow: true,
            }
        }
    } catch (error) {
        console.error('Error generating metadata:', error)
        return {
            title: "Tour | Desert safaris Marrakech",
            description: "Discover amazing tours and packages"
        }
    }
}

export async function generateStaticParams() {
    try {
        const db = await getDatabase()
        const tours = await db.collection<Tour>("tours").find({}).toArray()

        const params = []
        for (const tour of tours) {
            for (const lang of LANGS) {
                params.push({
                    lang: lang,
                    slug: tour.slug
                })
            }
        }
        return params
    } catch (error) {
        console.error('Error generating static params:', error)
        return []
    }
}

async function getTourData(slug: string, lang: "en" | "fr" | "es") {
    try {
        const db = await getDatabase()

        const tour = await db.collection<Tour>("tours").findOne({ slug })
        if (!tour) {
            return null
        }

        const packages = await db.collection<Package>("packages")
            .find({ tourId: tour._id })
            .toArray()

        const category = await db.collection<Category>("categories")
            .findOne({ _id: tour.categoryId })

        const relatedTours = await db.collection<Tour>("tours")
            .find({
                categoryId: tour.categoryId,
                _id: { $ne: tour._id }
            })
            .limit(6)
            .toArray()
        const translatedTour = {
            ...tour,
            title: tour.title[lang] || tour.title.en,
            description: tour.description[lang] || tour.description.en,
            shortDescription: tour.shortDescription[lang] || tour.shortDescription.en
        }

        const translatedPackages = packages.map(pkg => ({
            ...pkg,
            title: pkg.title[lang] || pkg.title.en,
            shortDescription: pkg.shortDescription[lang] || pkg.shortDescription.en,
            duration: pkg.duration[lang] || pkg.duration.en,
            location: pkg.location?.[lang] || pkg.location?.en || "",
            departure: pkg.departure[lang] || pkg.departure.en
        }))

        const translatedCategory = category ? {
            ...category,
            title: category.title[lang] || category.title.en,
            description: category.description[lang] || category.description.en,
            shortDescription: category.shortDescription[lang] || category.shortDescription.en
        } : null

        const translatedRelatedTours = relatedTours.map(relatedTour => ({
            ...relatedTour,
            title: relatedTour.title[lang] || relatedTour.title.en,
            shortDescription: relatedTour.shortDescription[lang] || relatedTour.shortDescription.en
        }))

        return {
            tour: translatedTour,
            packages: translatedPackages,
            category: translatedCategory,
            relatedTours: translatedRelatedTours
        }
    } catch (error) {
        console.error('Error fetching tour data:', error)
        return null
    }
}

export default async function TourDetailPage({ params }: { params: { lang: "en" | "fr" | "es", slug: string } }) {
    const { lang, slug } = params
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+12395375059";

    if (!LANGS.includes(lang)) {
        return notFound()
    }

    const data = await getTourData(slug, lang)

    if (!data) {
        return notFound()
    }

    const { tour, packages, category, relatedTours } = data
    const t = tourPageTranslations[lang]

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": tour.title,
        "description": tour.shortDescription,
        "image": tour.images?.map(img => `${WEBSITE_NAME}${img}`) || [],
        "offers": {
            "@type": "AggregateOffer",
            "offerCount": packages.length,
            "offers": packages.map(pkg => ({
                "@type": "Offer",
                "name": pkg.title,
                "description": pkg.shortDescription,
                "price": Math.min(pkg.shareTrip || Infinity, pkg.privateTrip || Infinity),
                "priceCurrency": "USD"
            }))
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href={`/${lang}`} className="hover:text-amber-600">
                                {t.breadcrumb.home}
                            </Link>
                            <span>/</span>
                            <Link href={`/${lang}/tours`} className="hover:text-amber-600">
                                {t.breadcrumb.tours}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{tour.title}</span>
                        </nav>
                    </div>
                </div>
                <div className="relative py-16 overflow-hidden">
                    {tour.images && tour.images.length > 0 ? (
                        <Image
                            src={tour.images[0]}
                            alt={tour.title}
                            fill
                            className="object-cover"
                            priority
                            quality={100}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                    )}
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="container relative mx-auto px-4 z-10">
                        <div className="max-w-4xl">
                            {category && (
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500 text-white text-sm font-medium mb-4">
                                    {category.title}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                {tour.title}
                            </h1>
                            <p className="text-xl opacity-90 max-w-2xl text-white">
                                {tour.shortDescription}
                            </p>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8">
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {t.packages.availablePackages}
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    {packages.length} {t.hero.packagesInThisTour}
                                </p>
                            </div>
                        </div>

                        {packages.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {packages.map(pkg => (
                                    <div key={pkg._id?.toString()} className="bg-white flex flex-col justify-between flex-1  rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                                        <div className="relative h-48">
                                            <Image
                                                src={pkg.images?.[0] || "/default-package.jpg"}
                                                alt={pkg.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-4 left-4">
                                                {pkg.shareTrip != 0 && pkg.privateTrip != 0 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium">
                                                        {t.packages.shared} & {t.packages.private}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className=" p-2.5 md:p-5 flex flex-col justify-between flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                {pkg.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {pkg.shortDescription}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                {pkg.duration && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        <span>{t.packages.duration}: {pkg.duration}</span>
                                                    </div>
                                                )}
                                                {pkg.location && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        <span>{pkg.location}</span>
                                                    </div>
                                                )}
                                                {pkg.departure && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <span>{t.packages.departure}: {pkg.departure}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    {(pkg.shareTrip || pkg.privateTrip) ? (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl font-bold text-amber-600">
                                                                ${Math.min(pkg.shareTrip || Infinity, pkg.privateTrip || Infinity)}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                {t.packages.perPerson}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-lg font-semibold text-gray-600">
                                                            Contact for price
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(t.whatsappMessage + pkg.title)}`}
                                                    target="_blank"
                                                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-lg flex items-center space-x-1 text-sm font-medium transition-colors"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    <div className="">
                                                        Whatsapp
                                                    </div>
                                                </Link>
                                                <Link
                                                    href={`/${lang}/packages/${pkg.slug}#booking`}
                                                    className="flex-1 bg-amber-500 text-white hover:bg-amber-600 py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors"
                                                >
                                                    {t.packages.bookNow}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    {t.packages.noPackages}
                                </h3>
                                <p className="text-gray-500">
                                    Check back later for new packages in this tour.
                                </p>
                            </div>
                        )}
                    </section>

                </main>
                <div className="container py-2 bg-gray-200 mx-auto px-2 md:px-4 rounded-xl mb-4">

                    {relatedTours.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                {t.relatedTours.title}
                            </h2>
                            <div className="mb-3">
                                <Swiper
                                    items={relatedTours.map(relatedTour => (
                                        <div
                                            key={relatedTour._id?.toString()}

                                            className="bg-white group/v1 h-full  max-w-[350px] w-[82vw] rounded-2xl   overflow-hidden border border-gray-200  transition-all group"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <Image
                                                    src={relatedTour.images?.[0] || "/categories-hero.webp"}
                                                    alt={relatedTour.title}
                                                    fill
                                                    className="object-cover group-hover/v1:scale-[102%] transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover/v1:bg-black/10 transition-colors"></div>
                                            </div>

                                            <div className=" p-3 md:p-6">
                                                <h3 className="text-xl font-bold text-amber-500 active:text-amber-600 mb-2 line-clamp-2 group-hover/v1:text-amber-600 transition-colors">
                                                    <Link href={`/${lang}/tours/${relatedTour.slug}`}>
                                                        {relatedTour.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {relatedTour.shortDescription}
                                                </p>
                                                <Link href={`/${lang}/tours/${relatedTour.slug}`} className="flex items-center  px-1 w-max active:bg-amber-100 rounded-lg text-amber-600 font-medium">
                                                    <span>{t.relatedTours.viewTour}</span>
                                                    <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                />
                                { }
                            </div>
                        </section>
                    )}
                </div>

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