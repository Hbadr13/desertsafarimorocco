// app/packages/[slug]/PackageDetailsPage.tsx
"use client"

import { useState, useEffect } from "react"
import { Package, Tour } from "@/lib/models"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Clock, Star, Shield, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Phone, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PackageDetailsPageProps {
    package: Package
    tour: Tour
    otherPackages: Package[]
}

export function PackageDetailsPage({ package: pkg, tour, otherPackages }: PackageDetailsPageProps) {
    const [selectedPackageType, setSelectedPackageType] = useState<'shared' | 'private'>('shared')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [expandedItinerary, setExpandedItinerary] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included'>('overview')

    // Calculate end date based on duration
    useEffect(() => {
        if (startDate) {
            const duration = parseInt(pkg.duration.split(' ')[0]) || 7
            const start = new Date(startDate)
            const end = new Date(start)
            end.setDate(start.getDate() + duration)
            setEndDate(end.toISOString().split('T')[0])
        }
    }, [startDate, pkg.duration])

    // Calculate total price
    useEffect(() => {
        const basePrice = selectedPackageType === 'shared' ? pkg.shareTrip : pkg.privateTrip
        const childrenDiscount = 0.3
        const childrenPrice = children * basePrice * (1 - childrenDiscount)
        const adultsPrice = adults * basePrice
        setTotalPrice(adultsPrice + childrenPrice)
    }, [selectedPackageType, adults, children, pkg.shareTrip, pkg.privateTrip])

    const handleReservation = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({
            package: pkg.title,
            type: selectedPackageType,
            startDate,
            endDate,
            adults,
            children,
            totalPrice
        })
    }
    return (
        <div className="min-h-screen bg-white">
            {/* Header Navigation */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/tours" className="hover:text-blue-600 transition-colors">Tours</Link>
                        <span>/</span>
                        <Link href={`/tours/${tour.slug}`} className="hover:text-blue-600 transition-colors line-clamp-1">{tour.title}</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium line-clamp-1">{pkg.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Package Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <div className="relative h-80 sm:h-96 w-full">
                                <Image
                                    src={pkg.images[currentImageIndex]}
                                    alt={pkg.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {pkg.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : pkg.images.length - 1)}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => prev < pkg.images.length - 1 ? prev + 1 : 0)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronRight className="h-5 w-5 text-gray-700" />
                                        </button>
                                    </>
                                )}
                                <div className="absolute bottom-4 left-4">
                                    <Badge className="bg-blue-600 text-white border-0 font-semibold text-sm">
                                        ⭐ Best Seller
                                    </Badge>
                                </div>
                            </div>

                            {pkg.images.length > 1 && (
                                <div className="p-4 bg-gray-50 flex gap-2 overflow-x-auto">
                                    {pkg.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${pkg.title} ${index + 1}`}
                                                width={64}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Package Header */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{pkg.departure}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{pkg.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Departure: {pkg.departureTime}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Navigation Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8">
                                    {[
                                        { id: 'overview', label: 'Overview' },
                                        { id: 'itinerary', label: 'Itinerary' },
                                        { id: 'included', label: 'What\'s Included' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {activeTab === 'overview' && (
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed">{pkg.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-blue-900 mb-2">Tour Highlights</h3>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                {pkg.itinerary.slice(0, 4).map((item, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <Check className="h-4 w-4 text-green-600" />
                                                        {item.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-orange-900 mb-2">Quick Facts</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Group Size:</span>
                                                    <span className="font-medium">2-12 people</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Difficulty:</span>
                                                    <span className="font-medium">Moderate</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Age Range:</span>
                                                    <span className="font-medium">8-70 years</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'itinerary' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Detailed Itinerary</h3>
                                    <div className="space-y-4">
                                        {pkg.itinerary.map((day, index) => (
                                            <div key={index} className="border border-gray-200  overflow-hidden">
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                                            {day.day}
                                                        </span>
                                                        {day.title}
                                                    </h4>
                                                </div>
                                                <div className="p-6 bg-white">
                                                    <p className="text-gray-700 leading-relaxed text-sm">{day.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}

                            {activeTab === 'included' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                                            <Check className="h-5 w-5" />
                                            What's Included
                                        </h3>
                                        <ul className="space-y-3">
                                            {pkg.toursIncluded.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                                            <div className="h-5 w-5 text-red-600">✕</div>
                                            What's Excluded
                                        </h3>
                                        <ul className="space-y-3">
                                            {pkg.toursExcluded.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                                    <div className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5">✕</div>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Other Packages */}
                        {otherPackages.length > 0 && (
                            <div className="border-t pt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Packages in This Tour</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {otherPackages.map((otherPkg, index) => (
                                        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-blue-100">
                                            <CardContent className="p-0">
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900 mb-2">{otherPkg.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                        <span>{otherPkg.duration}</span>
                                                        <span>•</span>
                                                        <span>From ${otherPkg.shareTrip}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {otherPkg.description.slice(0, 100)}...
                                                    </p>
                                                </div>
                                                <div className="border-t border-gray-100 p-4">
                                                    <Link href={`/packages/${otherPkg.slug}`}>
                                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                            View Package Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="space-y-6">
                        <Card className="stickytop-6 border border-blue-200 shadow-xl">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        ${selectedPackageType === 'shared' ? pkg.shareTrip : pkg.privateTrip}
                                    </div>
                                    <div className="text-sm text-gray-600">per person</div>
                                    <Badge className="bg-green-100 text-green-800 border-0 mt-2">
                                        Free cancellation
                                    </Badge>
                                </div>

                                <form onSubmit={handleReservation} className="space-y-4">
                                    {/* Trip Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Trip Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPackageType('shared')}
                                                className={`p-4 border-2 rounded-xl text-center transition-all ${selectedPackageType === 'shared'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                                                    : 'border-gray-300 hover:border-blue-400 bg-white'
                                                    }`}
                                            >
                                                <Users className="h-6 w-6 mx-auto mb-2" />
                                                <div className="font-semibold">Shared</div>
                                                <div className="text-lg font-bold">${pkg.shareTrip}</div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPackageType('private')}
                                                className={`p-4 border-2 rounded-xl text-center transition-all ${selectedPackageType === 'private'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                                                    : 'border-gray-300 hover:border-blue-400 bg-white'
                                                    }`}
                                            >
                                                <Shield className="h-6 w-6 mx-auto mb-2" />
                                                <div className="font-semibold">Private</div>
                                                <div className="text-lg font-bold">${pkg.privateTrip}</div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                readOnly
                                                value={endDate}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Guests */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Travelers</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <select
                                                    value={adults}
                                                    onChange={(e) => setAdults(parseInt(e.target.value))}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                                        <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <select
                                                    value={children}
                                                    onChange={(e) => setChildren(parseInt(e.target.value))}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {[0, 1, 2, 3].map(num => (
                                                        <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Adults x{adults}</span>
                                            <span className="font-semibold">
                                                ${(adults * (selectedPackageType === 'shared' ? pkg.shareTrip : pkg.privateTrip)).toLocaleString()}
                                            </span>
                                        </div>
                                        {children > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Children x{children} (30% off)</span>
                                                <span className="font-semibold">
                                                    ${(children * (selectedPackageType === 'shared' ? pkg.shareTrip : pkg.privateTrip) * 0.7).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total Amount</span>
                                                <span className="text-blue-600">${totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg"
                                    >
                                        Book Now
                                    </Button>

                                    {/* Trust Features */}
                                    <div className="text-center space-y-2 text-xs text-gray-500">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                <span>Secure payment</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Check className="h-3 w-3" />
                                                <span>Best price guarantee</span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border border-blue-100 bg-blue-50">
                            <CardContent className="p-6">
                                <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Need Help Booking?
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Phone className="h-4 w-4" />
                                        <span>+1 239 537 5059</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Mail className="h-4 w-4" />
                                        <span>desertsafarimorocco@gmail.com</span>
                                    </div>
                                    <div className="text-blue-600 font-medium">24/7 Customer Support</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}