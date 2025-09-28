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

interface CategoryToursPageProps {
    category: Category
    tours: (Tour & { packages: Package[] })[]
    allCategories: Category[]
}

export function CategoryToursPage({ category, tours, allCategories }: CategoryToursPageProps) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

    const packageSwiperItems = (packages: Package[]) =>
        packages.map((pkg) => (
            <PackageCard pkg={pkg} />
        ))

    const displayDescription = isDescriptionExpanded
        ? category.description
        : category.description.slice(0, 120) + (category.description.length > 120 ? '...' : '')

    return (
        <div className="min-h-screen bg-white mt-16">
            {/* Hero Section with Category Image */}
            <div className="relative min-h-[440px] w-full">
                <Image
                    src={category.images[0]}
                    alt={category.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className={`  ${!isDescriptionExpanded ? ' items-center ' : '  items-start '} absolute inset-0 flex justify-center`}>
                    <div className={` text-center ${!isDescriptionExpanded ? ' ' : '  '} text-white w-full max-w-6xl px-4`}>
                        {
                            !isDescriptionExpanded && <h1 className="text-2xl md:text-5xl font-bold mb-6 drop-shadow-2xl">{category.title} Tours</h1>
                        }                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
                            <p className="text-sm mb-4 leading-relaxed">
                                {displayDescription}
                            </p>
                            {category.description.length > 120 && (
                                <Button
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/20"
                                >
                                    {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                                    {isDescriptionExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                                </Button>
                            )}
                        </div>
                        {!isDescriptionExpanded && <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-lg px-4 py-2 mt-4">
                            {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} • {tours.reduce((acc, tour) => acc + tour.packages.length, 0)} Packages
                        </Badge>}
                    </div>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span>/</span>
                        <Link href="/categories" className="hover:text-blue-600">Categories</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{category.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {tours.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="text-gray-500 text-xl mb-4">No tours found in this category.</div>
                            <Link href="/">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Home
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-12">
                        {tours.map((tour) => (
                            tour.packages.length != 0 && <div key={tour.slug} className="scroll-mt-20">
                                <div className="bg-gray-50 rounded-xl p-1">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                                            </div>
                                            <p className="text-gray-600 text-sm max-w-2xl">{tour.shortDescription}</p>
                                            <div className=" truncate px-2 mt-2 text-xs font-medium w-max rounded-2xl  bg-green-100 text-green-800 ">
                                                {tour.packages.length} Packages
                                            </div>
                                        </div>

                                    </div>

                                    <Swiper
                                        items={packageSwiperItems(tour.packages)}
                                        cardWidth={380}
                                        cardGap={24}
                                        showNavigation={true}
                                        showPagination={false}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {allCategories.length > 0 && (
                <section className="py-16 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                Explore Other Categories
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Discover more amazing travel experiences in Morocco
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allCategories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/categories/${cat.slug}`}
                                    className="group"
                                >
                                    <Card className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-lg transition-all duration-200">
                                        <div className="h-48 w-full overflow-hidden relative">
                                            <Image
                                                src={cat.images[0]}
                                                alt={cat.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                                            </div>
                                        </div>

                                        <CardContent className="flex flex-col flex-grow p-6">
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                                                {cat.description.slice(0, 120)}...
                                            </p>

                                            <div className="mt-auto flex items-center justify-between">
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                    {cat.tours?.length || 0} Tours
                                                </Badge>
                                                <Button variant="ghost" size="sm" className="text-blue-600 gap-1 group-hover:translate-x-1 transition-transform">
                                                    Explore <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/categories">
                                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                                    View All Categories
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}