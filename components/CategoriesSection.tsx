"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Category } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Users, Clock, Star } from "lucide-react"
import Link from "next/link"
import CategoryCard from "./categoryCard"

export function CategoriesSection({ categories, lang }: { categories: Array<Category>, lang: 'fr' | 'es' | 'en' }) {

    const translations = {
        en: {
            title: "Find Your Perfect Moroccan Adventure",
            subtitle: "From desert safaris to city tours, discover the best experiences Morocco has to offer",
            discover: "Discover Morocco's Desert",
            browseAll: "Browse All Categories",
            specialOffers: "View Special Offers"
        },
        fr: {
            title: "Trouvez Votre Aventure Marocaine Parfaite",
            subtitle: "Des safaris dans le désert aux visites de villes, découvrez les meilleures expériences que le Maroc a à offrir",
            discover: "Découvrez le Désert Marocain",
            browseAll: "Parcourir Toutes les Catégories",
            specialOffers: "Voir les Offres Spéciales"
        },
        es: {
            title: "Encuentra Tu Aventura Marroquí Perfecta",
            subtitle: "Desde safaris en el desierto hasta tours urbanos, descubre las mejores experiencias que ofrece Marruecos",
            discover: "Descubre el Desierto de Marruecos",
            browseAll: "Explorar Todas las Categorías",
            specialOffers: "Ver Ofertas Especiales"
        }
    }

    const t = translations[lang]

    const swiperItems = categories.map((category, index) => (
        <CategoryCard key={index} category={category} lang={lang} />
    ))

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {t.title}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="text-2xl font-bold text-blue-800 pl-2 mb-6">
                    {t.discover}
                </div>

                <Swiper
                    items={swiperItems}
                    cardWidth={340}
                    cardGap={2}
                    showNavigation={true}
                />

                <div className="text-center mt-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href={`/${lang}/categories`}>
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                                {t.browseAll}
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold">
                            {t.specialOffers}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}