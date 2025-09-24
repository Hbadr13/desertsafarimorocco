"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Package } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Star, ArrowRight, Shield } from "lucide-react"

interface TopTripsProps {
    packages: Package[]
}

export function TopTrips({ packages }: TopTripsProps) {
    const swiperItems = packages.map((pkg) => (
        <Card
            key={pkg._id?.toString() || pkg.slug}
            className=" max-w-sm border border-gray-200 rounded-lg overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-lg transition-all duration-200 group"
            onClick={() => window.location.href = `/packages/${pkg.slug}`}
        >
            <div className="h-48 w-full overflow-hidden relative">
                <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <Badge className="bg-green-600 text-white border-0 font-semibold shadow-md">
                        🔥 Top Deal
                    </Badge>
                </div>
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium">
                        {pkg.duration} {Number(pkg.duration) > 1 ? 'days' : 'day'}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <CardContent className="flex flex-col flex-grow p-5">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight flex-1">
                        {pkg.title}
                    </h3>
                    {/* <div className="flex items-center gap-1 ml-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">4.8</span>
                    </div> */}
                </div>

                {/* Location and Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{pkg.departure}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{pkg.departureTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Group tour</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {pkg.description.slice(0, 120)}...
                </p>

                {/* Pricing */}
                <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500">Shared trip from</div>
                            <div className="text-xl font-bold text-blue-600">
                                ${pkg.shareTrip.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">Private trip from</div>
                            <div className="text-lg font-semibold text-gray-800">
                                ${pkg.privateTrip.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Savings Badge */}
                    {pkg.shareTrip < 1000 && (
                        <div className="flex items-center gap-2 text-xs">
                            <Shield className="h-3 w-3 text-green-600" />
                            <span className="text-green-600 font-semibold">Total includes taxes and fees</span>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-3 gap-2">
                    View Package Details <ArrowRight className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    ))

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text- mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Top Travel Packages
                    </h2>
                    <p className="text-blue-800 text-lg  mx-auto">
                        Handpicked experiences with the best value and reviews
                    </p>
                </div>

                {/* Swiper */}
                <Swiper
                    items={swiperItems}
                    cardWidth={380}
                    cardGap={24}
                    showNavigation={true}
                    showPagination={false}
                />

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                        View All Packages
                    </Button>
                </div>
            </div>
        </section>
    )
}