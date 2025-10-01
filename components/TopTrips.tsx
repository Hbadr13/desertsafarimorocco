"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Package } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Star, ArrowRight, Shield } from "lucide-react"
import PackageCard from "./packageCard"
import Link from "next/link"

interface TopTripsProps {
    packages: Package[]
    lang: 'fr' | 'es' | 'en'
}

export function TopTrips({ packages, lang }: TopTripsProps) {
    // Translations for all text in the component
    const translations = {
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
    }

    const t = translations[lang]

    const swiperItems = packages.map((pkg) => (
        <PackageCard key={pkg.slug || pkg._id?.toString()} pkg={pkg} lang={lang} />
    ))

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text- mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {t.title}
                    </h2>
                    <p className="text-blue-800 text-lg mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <Swiper
                    items={swiperItems}
                    cardWidth={340}
                    cardGap={2}
                    showNavigation={true}
                />

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <Link href={`/${lang}/packages`}>
                        <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}