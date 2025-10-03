"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Tour } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, ArrowRight, Users, Shield } from "lucide-react"
import Link from "next/link"

interface ToursSectionProps {
    tours: Tour[]
    lang: 'fr' | 'en' | 'es'
}

export function ToursSection({ tours, lang }: ToursSectionProps) {
    // Translations for all text in the component
    const translations = {
        en: {
            header: {
                title: "Featured Tours & Experiences",
                subtitle: "Discover unforgettable adventures with our carefully curated tour collection"
            },
            card: {
                popular: "Popular",
                options: "Options",
                multipleDestinations: "Multiple destinations in Morocco",
                startingFrom: "Starting from",
                packageOptions: "package options",
                flexibleDates: "Flexible dates",
                freeCancellation: "Free cancellation • Best price guarantee",
                viewDetails: "View Tour Details"
            },
            features: {
                duration: "1-9 days",
                groupSize: "Small groups"
            }
        },
        fr: {
            header: {
                title: "Circuits et Expériences en Vedette",
                subtitle: "Découvrez des aventures inoubliables avec notre collection de circuits soigneusement sélectionnée"
            },
            card: {
                popular: "Populaire",
                options: "Options",
                multipleDestinations: "Plusieurs destinations au Maroc",
                startingFrom: "À partir de",
                packageOptions: "options de forfaits",
                flexibleDates: "Dates flexibles",
                freeCancellation: "Annulation gratuite • Meilleur prix garanti",
                viewDetails: "Voir les Détails du Circuit"
            },
            features: {
                duration: "1-9 jours",
                groupSize: "Petits groupes"
            }
        },
        es: {
            header: {
                title: "Tours y Experiencias Destacados",
                subtitle: "Descubre aventuras inolvidables con nuestra colección de tours cuidadosamente seleccionada"
            },
            card: {
                popular: "Popular",
                options: "Opciones",
                multipleDestinations: "Múltiples destinos en Marruecos",
                startingFrom: "Desde",
                packageOptions: "opciones de paquetes",
                flexibleDates: "Fechas flexibles",
                freeCancellation: "Cancelación gratuita • Mejor precio garantizado",
                viewDetails: "Ver Detalles del Tour"
            },
            features: {
                duration: "1-9 días",
                groupSize: "Grupos pequeños"
            }
        }
    }

    const t = translations[lang]

    const swiperItems = tours.map((tour) => {
        const tourTitle = tour.title?.[lang] || tour.title?.en || ""
        const tourDescription = tour.shortDescription?.[lang] || tour.shortDescription?.en || tour.description?.[lang] || tour.description?.en || ""

        return (
            <Card
                key={tour._id?.toString() || tour.slug}
                className="border  max-w-[280px] w-[80vw] border-gray-200 rounded-lg overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-sm transition-all duration-200 group"
            >
                {/* Image with Badge */}
                <div className="h-48 w-full overflow-hidden relative">
                    <img
                        src={tour.images?.[0] || "/default-tour.jpg"}
                        alt={tourTitle}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-green-600 text-white border-0 font-semibold shadow-md">
                            {t.card.popular}
                        </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium">
                            {tour.packages?.length || 0} {t.card.options}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex flex-col flex-grow p-2 md:p-4 justify-between">
                    {/* Title and Rating */}
                    <div className="">

                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight flex-1">
                                {tourTitle}
                            </h3>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{t.card.multipleDestinations}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-2 leading-relaxed line-clamp-3">
                            {tourDescription.slice(0, 120)}
                            {tourDescription.length > 120 ? '...' : ''}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{t.features.duration}</span>
                        </div>

                    </div>
                    <Link className="px-4" href={`/${lang}/tours/${tour.slug}`}>
                        <Button className="w-full text-blue-600 hover:bg-blue-100 font-semibold mt-1 p-2 gap-2">
                            {t.card.viewDetails} <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    })

    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-1 md:px-4">
                {/* Header */}
                <div className="text-center mb-7">
                    <h2 className=" text-xl md:text-3xl font-bold text-gray-900 mb-3">
                        {t.header.title}
                    </h2>
                </div>

                {/* Swiper */}
                <Swiper
                    items={swiperItems}
                />
            </div>
        </section>
    )
}