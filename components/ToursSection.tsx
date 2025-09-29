"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Tour } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, ArrowRight, Users, Shield } from "lucide-react"

interface ToursSectionProps {
    tours: Tour[]
}

export function ToursSection({ tours }: ToursSectionProps) {
    const swiperItems = tours.map((tour) => (
        <Card
            key={tour._id?.toString() || tour.slug}
            className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-lg transition-all duration-200 group"
            onClick={() => window.location.href = `/${tour.slug}`}
        >
            {/* Image with Badge */}
            <div className="h-48 w-full overflow-hidden relative">
                <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <Badge className="bg-green-600 text-white border-0 font-semibold shadow-md">
                        Popular
                    </Badge>
                </div>
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium">
                        {tour.packages?.length || 0} Options
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <CardContent className="flex flex-col flex-grow p-5">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight flex-1">
                        {tour.title}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">4.7</span>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Multiple destinations in Morocco</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {tour.shortDescription || tour.description.slice(0, 120)}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>3-14 days</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="h-3 w-3" />
                        <span>Small groups</span>
                    </div>
                </div>

                {/* Pricing and Packages */}
                <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xs text-gray-500">Starting from</div>
                            <div className="text-xl font-bold text-blue-600">$119</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">{tour.packages?.length || 0} package options</div>
                            <div className="text-sm font-semibold text-gray-700">Flexible dates</div>
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Shield className="h-3 w-3 text-green-600" />
                        <span>Free cancellation • Best price guarantee</span>
                    </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-3 gap-2">
                    View Tour Details <ArrowRight className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    ))

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Featured Tours & Experiences
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover unforgettable adventures with our carefully curated tour collection
                    </p>
                </div>

                {/* Swiper */}
                <Swiper
                    items={swiperItems}
                    cardWidth={350}
                    cardGap={24}
                    showNavigation={true}
                // showPagination={false}
                />
            </div>
        </section>
    )
}