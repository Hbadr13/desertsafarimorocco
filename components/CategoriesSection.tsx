"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper } from "./ui/swiper"
import { Category } from "@/lib/models"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Users, Clock, Star } from "lucide-react"
import Link from "next/link"
import CategoryCard from "./categoryCard"

export function CategoriesSection({ categories }: { categories: Array<Category> }) {

    const swiperItems = categories.map((category, index) => (
        <CategoryCard key={index} category={category} />
    ))

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Find Your Perfect Moroccan Adventure
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        From desert safaris to city tours, discover the best experiences Morocco has to offer
                    </p>
                </div>
                <div className="text-2xl font-bold text-blue-800 pl-2">
                    Discover Morocco’s Desert
                </div>
                <Swiper
                    items={swiperItems}
                    cardWidth={340}
                    cardGap={2}
                    showNavigation={true}
                />

                <div className="text-center mt-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                            Browse All Categories
                        </Button>
                        <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold">
                            View Special Offers
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}