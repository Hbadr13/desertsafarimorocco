"use client"

import { Swiper } from "./ui/swiper"
import { Tour } from "@/lib/models"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ToursSectionProps {
    tours: Tour[]
    lang: 'fr' | 'en' | 'es'
}

export function ToursSection({ tours, lang }: ToursSectionProps) {
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
                viewDetails: "View Tour"
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
                viewDetails: "Voir la visite"
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
                viewDetails: "Ver Tour"
            },
            features: {
                duration: "1-9 días",
                groupSize: "Grupos pequeños"
            }
        }
    }

    const t = translations[lang]

    const swiperItems = tours.map((tour) => {

        return (
            <div
                key={tour._id?.toString()}
                className="bg-white rounded-2xl h-full  max-w-[350px] w-[85vw] hover:shadow-lg overflow-hidden border border-gray-200   transition-all group/shilder"
            >
                <div className="relative h-48">
                    <Image
                        src={tour.images?.[0] || "/default-tour.jpg"}
                        alt={tour.title[lang] || tour.title.en || "Tour Image"}
                        fill
                        className="object-cover group-hover/shilder:scale-[102%] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/shilder:bg-black/10 transition-colors"></div>
                </div>

                <div className=" p-3 md:p-6 justify-between flex-col flex ">
                    <div className=" ">
                        <h3 className="text-xl font-bold text-amber-500 mb-2 line-clamp-2 group-hover:text-amber-600 active:text-amber-600 transition-colors">
                            <Link
                                href={`/${lang}/tours/${tour.slug}`}

                            >
                                {tour.title[lang] || tour.title.en}
                            </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {tour.shortDescription[lang] || tour.shortDescription.en || tour.description[lang]?.slice(0, 100) || tour.description.en?.slice(0, 100)}
                        </p>
                    </div>

                    <Link href={`/${lang}/tours/${tour.slug}`} className="flex items-center  px-1 w-max active:bg-amber-100 rounded-lg text-amber-600 font-medium">
                        <span>{t.card.viewDetails}</span>
                        <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                    </Link>
                </div>
            </div>
        )
    })

    return (
        <section className="py-5 bg-white">
            <div className="max-w-7xl mx-auto px-1 md:px-4  pb-3">
                <div className="text-center mb-7">
                    <h2 className=" text-xl md:text-3xl font-bold text-gray-900 mb-3">
                        {t.header.title}
                    </h2>
                </div>

                <Swiper
                    items={swiperItems}
                />
            </div>
        </section>
    )
}