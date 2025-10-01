'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import { Navigation } from "swiper/modules"
import Link from "next/link"
import { Package } from "@/lib/models"
import Image from "next/image"
import { Clock, MapPin, MessageCircle, Phone, Shield, Users } from "lucide-react"


const PackagePageDetailsCard = ({ pkg, lang, packagesTranslations }: { pkg: Package, lang: 'fr' | 'en' | 'es', packagesTranslations: any }) => {
    const t = packagesTranslations[lang]
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+12395375059"; // Default number if not set

    return (

        <article key={pkg.slug} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 relative">
                    <div className="aspect-video lg:aspect-auto lg:h-full">
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                prevEl: `.prev-${pkg.slug}`,
                                nextEl: `.next-${pkg.slug}`
                            }}
                            spaceBetween={0}
                            slidesPerView={1}
                            className="h-full"
                        >
                            {pkg.images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative w-full h-64 lg:h-full">
                                        <Image
                                            src={img}
                                            alt={pkg.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 40vw"
                                            priority={index === 0}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation */}
                        <button className={`prev-${pkg.slug} absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button className={`next-${pkg.slug} absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="lg:w-3/5 p-2.5 md:p-6 flex flex-col">
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                                <Link href={`/${lang}/packages/${pkg.slug}`} className="group-hover:underline group-hover:underline-offset-2">
                                    {pkg.title}
                                </Link>
                            </h3>
                        </div>
                        {pkg.departure && <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                            <span className="text-sm">{pkg.location}</span>
                        </div>
                        }
                        <p className="text-gray-700 mb-4 line-clamp-3">
                            {pkg.shortDescription}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 font-semibold">
                            {pkg.duration && <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{pkg.duration}</span>
                            </div>}
                            {pkg.shareTrip != 0 && <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{t.package.group}: {pkg.shareTrip} Euro</span>
                            </div>}
                            {pkg.privateTrip != 0 && <div className="flex  items-center gap-2 text-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                                <span>{t.package.private}: {pkg.privateTrip} Euro</span>
                            </div>}
                        </div>
                        <div className="flex justify-end items-end  gap-2 text-sm text-green-600 font-semibold w-full">
                            <span className="text-end">{t.package.freeCancellation}</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-end space-x-3 mt-2">
                        <div className="flex gap-2 text-sm">
                            <Link
                                href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`${t.message}: ${pkg.title}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1  text-green-500 hover:bg-green-100 active:bg-green-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </Link>

                            <Link
                                href={`tel:${phoneNumber}`}
                                className="flex-1 text-blue-500 hover:bg-blue-100 active:bg-blue-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Phone className="h-4 w-4" />
                                Call
                            </Link>
                        </div>
                        <Link
                            href={`/${lang}/packages/${pkg.slug}`}
                            className="px-3 py-2 bg-indigo-400 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors text-center shadow-lg shadow-indigo-500/25"
                        >
                            {t.package.bookNow}
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PackagePageDetailsCard;
