"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Package } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Star, ArrowRight, Shield, LucideArrowLeft } from "lucide-react"
import PackageCard from "./packageCard"
import Link from "next/link"
import PackageCardV2 from "./packageCardV2"

interface TopTripsProps {
    packages: Package[]
    lang: 'fr' | 'es' | 'en'
    index: number
}

export function TopTrips({ packages, lang, index }: TopTripsProps) {
    // Translations for all text in the component
    const translations = [{
        en: {
            title: "Best Deals in Marrakech",
            subtitle: "Handpicked experiences with the best value and reviews",
            viewAll: "View All Packages"
        },
        fr: {
            title: "Meilleures Offres à Marrakech",
            subtitle: "Expériences sélectionnées avec le meilleur rapport qualité-prix et avis",
            viewAll: "Voir Tous les Forfaits"
        },
        es: {
            title: "Mejores Ofertas en Marrakech",
            subtitle: "Experiencias seleccionadas con la mejor relación calidad-precio y reseñas",
            viewAll: "Ver Todos los Paquetes"
        }
    },
    {
        en: {
            title: "Desert Safaris Day Tours",
            subtitle: "Unforgettable desert adventures from Marrakech with great deals",
            viewAll: "View All Desert Packages"
        },
        fr: {
            title: "Excursions Journalières dans le Désert",
            subtitle: "Aventures inoubliables depuis Marrakech avec les meilleures offres",
            viewAll: "Voir Tous les Forfaits Désert"
        },
        es: {
            title: "Excursiones de Un Día al Desierto",
            subtitle: "Aventuras inolvidables desde Marrakech con las mejores ofertas",
            viewAll: "Ver Todos los Paquetes del Desierto"
        }
    }]

    const t = translations[index][lang]

    const swiperItems = packages.map((pkg) => (
        index == 0 ?
            <PackageCard key={pkg.slug || pkg._id?.toString()} pkg={pkg} lang={lang} /> :
            <PackageCardV2 key={pkg.slug || pkg._id?.toString()} pkg={pkg} lang={lang} />
    ))

    return (
        <section className={`py-16 ${index == 0 ? 'bg-white' : ''}`}>
            <div className="max-w-7xl mx-auto px-2 md:px-4">
                <div className="text- mb-2">
                    <h2 className=" text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-3">
                        {t.title}
                    </h2>
                    <p className="text-blue-800 text-sm  md:text-lg mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <Swiper
                    items={swiperItems}
                />

                {/* Bottom CTA */}
                <div className=" mt-4 w-max ">
                    <Link
                        className={`${index == 0 ? 'border-blue-600 text-blue-600 hover:bg-blue-50 ' : 'text-white hover:bg-blue-50/25'} transition-all duration-200  rounded-xl px-2 border-0  font-semibold flex items-center space-x-1`}
                        href={`/${lang}/categories/desert-safaris`}>
                        {t.viewAll}
                        <ArrowRight className="rotate- " />
                    </Link>
                </div>
            </div>
        </section>
    )
}