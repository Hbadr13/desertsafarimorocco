// components/CategoryToursPage.tsx
"use client"

import { Category, Tour, Package } from "@/lib/models"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Swiper } from "@/components/ui/swiper"
import { MapPin, Clock, Users, Star, ArrowRight, Shield, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import PackageCard from "./packageCard"
import CategoryCard from "./categoryCard"

interface CategoryToursPageProps {
    category: Category
    tours: (Tour & { packages: Package[] })[]
    allCategories: Category[]
    lang: 'fr' | 'es' | 'en'
    translations: any
}

export function CategoryToursPage({ category, tours, allCategories, lang, translations }: CategoryToursPageProps) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

    const packageSwiperItems = (packages: Package[]) =>
        packages.map((pkg, index) => (
            <PackageCard key={pkg.slug || index} pkg={pkg} lang={lang} />
        ))

    // Get translated texts directly from the objects
    const categoryTitle = category.title?.[lang] || category.title?.en || ""
    const categoryDescription = category.description?.[lang] || category.description?.en || ""
    const categoryShortDescription = category.shortDescription?.[lang] || category.shortDescription?.en || ""

    const displayDescription = isDescriptionExpanded
        ? categoryDescription
        : (categoryDescription?.slice(0, 120) || '') + (categoryDescription && categoryDescription.length > 120 ? '...' : '')

    const totalPackages = tours.reduce((acc, tour) => acc + (tour.packages?.length || 0), 0)
    const swiperItems = allCategories.filter((it) => it.slug != category.slug).map((category, index) => (
        <CategoryCard key={index} category={category} lang={lang} />
    ))
    return (
        <div className="min-h-screen bg-white mt-16">
            {/* Hero Section with Category Image */}
            <div className="relative min-h-[440px] w-full">
                <Image
                    src={category.images?.[0] || "/default-category.jpg"}
                    alt={categoryTitle}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className={`${!isDescriptionExpanded ? 'items-center' : 'items-start'} absolute inset-0 flex justify-center`}>
                    <div className={`text-center ${!isDescriptionExpanded ? '' : ''} text-white w-full max-w-6xl px-4`}>
                        {!isDescriptionExpanded && (
                            <h1 className="text-2xl md:text-5xl font-bold mb-6 drop-shadow-2xl">
                                {categoryTitle} {translations.hero.tours}
                            </h1>
                        )}
                        {categoryDescription && (
                            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
                                <p className="text-sm mb-4 leading-relaxed">
                                    {displayDescription}
                                </p>
                                {categoryDescription.length > 120 && (
                                    <Button
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        variant="outline"
                                        className="border-white text-white hover:bg-white/20"
                                    >
                                        {isDescriptionExpanded ? translations.buttons.readLess : translations.buttons.readMore}
                                        {isDescriptionExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                                    </Button>
                                )}
                            </div>
                        )}
                        {!isDescriptionExpanded && (
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-lg px-4 py-2 mt-4">
                                {tours.length} {tours.length === 1 ? translations.hero.tours.slice(0, -1) : translations.hero.tours} • {totalPackages} {translations.hero.packages}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href={`/${lang}`} className="hover:text-blue-600">
                            {translations.breadcrumb.home}
                        </Link>
                        <span>/</span>
                        <Link href={`/${lang}/categories`} className="hover:text-blue-600">
                            {translations.breadcrumb.categories}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{categoryTitle}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {tours.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="text-gray-500 text-xl mb-4">
                                {translations.emptyState.title}
                            </div>
                            <p className="text-gray-400 mb-6">
                                {translations.emptyState.description}
                            </p>
                            <Link href={`/${lang}`}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {translations.emptyState.button}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-12">
                        {tours.map((tour) => (
                            tour.packages && tour.packages.length > 0 && (
                                <div key={tour.slug} className="scroll-mt-20">
                                    <div className="bg-gray-50 rounded-xl p-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                {tour.title?.[lang] || tour.title?.en || ""}
                                            </h2>
                                        </div>

                                        <Swiper
                                            items={packageSwiperItems(tour.packages)}
                                            cardWidth={380}
                                            cardGap={24}
                                            showNavigation={true}
                                        />
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>

            {
                allCategories.length > 0 && (
                    <section className="py-16 bg-indigo-100/70 border-t border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                    {translations.explore.title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {translations.explore.subtitle}
                                </p>
                            </div>
                            <Swiper
                                items={swiperItems}
                                cardWidth={340}
                                cardGap={2}
                                showNavigation={true}
                            />

                        </div>
                    </section>
                )
            }
        </div >
    )
}