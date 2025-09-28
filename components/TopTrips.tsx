"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Package } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Star, ArrowRight, Shield } from "lucide-react"
import PackageCard from "./packageCard"

interface TopTripsProps {
    packages: Package[]
}

export function TopTrips({ packages }: TopTripsProps) {
    const swiperItems = packages.map((pkg) => (
        <PackageCard key={pkg.slug || pkg.slug} pkg={pkg} />
    ))

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text- mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Best Deals in Marrakech
                    </h2>
                    <p className="text-blue-800 text-lg  mx-auto">
                        Handpicked experiences with the best value and reviews
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
                    <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                        View All Packages
                    </Button>
                </div>
            </div>
        </section>
    )
}