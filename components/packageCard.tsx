'use client'

import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { ArrowRight, Calendar, Clock, LucideMessageCircle, MapPin, MapPinHouse, MessageCircle, Phone, PhoneCall, Shield, User, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Package } from "@/lib/models"
import { Badge } from "./ui/badge"
import Link from "next/link"

const translations = {
    en: {
        departure: "Departure",
        location: "Location",
        duration: "Duration",
        shared: "Shared",
        private: "Private",
        totalIncludes: "Total includes taxes and fees",
        whatsapp: "WhatsApp",
        call: "Call",
        bookNow: "Book Now",
        whatsappMessage: `Hello, I would like to make a reservation for the package: `
    },
    fr: {
        departure: "Départ",
        location: "Localisation",
        duration: "Durée",
        shared: "Partagé",
        private: "Privé",
        totalIncludes: "Total inclut taxes et frais",
        whatsapp: "WhatsApp",
        call: "Appeler",
        bookNow: "Réserver",
        whatsappMessage: `Bonjour, je voudrais faire une réservation pour le package : `
    },
    es: {
        departure: "Salida",
        location: "Ubicación",

        duration: "Duración",
        shared: "Compartido",
        private: "Privado",
        totalIncludes: "Total incluye impuestos y tasas",
        whatsapp: "WhatsApp",
        call: "Llamar",
        bookNow: "Reservar",
        whatsappMessage: `Hola, me gustaría hacer una reserva para el paquete:`
    }
}
const PackageCard = ({ pkg, lang }: { pkg: Package, lang: 'fr' | 'es' | 'en' }) => {
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+12395375059";


    const t = translations[lang]

    return (
        <Card
            key={pkg._id?.toString() || pkg.slug}
            className="max-w-[330px] w-[90vw] border border-gray-200 rounded-xl overflow-hidden h-full flex flex-col transition-all duration-200 group/child"
        >
            <div className="h-52  w-full relative">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: `.prev-${pkg.slug}`,
                        nextEl: `.next-${pkg.slug}`
                    }}

                    spaceBetween={0}
                    slidesPerView={1}
                    className="h-full "
                    onSlideChange={(swiper) => {
                        const prevArrow = document.querySelector(`.prev-${pkg.slug}`) as HTMLElement;
                        const nextArrow = document.querySelector(`.next-${pkg.slug}`) as HTMLElement;

                        if (prevArrow && nextArrow) {
                            if (swiper.activeIndex === 0) {
                                prevArrow.style.display = "none";
                                nextArrow.style.display = "block";
                            }
                            else if (swiper.activeIndex === pkg.images.length - 1) {
                                prevArrow.style.display = "block";
                                nextArrow.style.display = "none";
                            }
                            else {
                                prevArrow.style.display = "block";
                                nextArrow.style.display = "block";
                            }
                        }
                    }}
                >
                    {pkg.images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-64 lg:h-full">
                                <Image
                                    src={img}
                                    alt={pkg.title[lang]}
                                    fill
                                    className="object-cover "
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    priority={index === 0}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <button className={`prev-${pkg.slug} absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/50 rounded-full p-2 shadow-lg z-10 transition-all`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {<button className={`next-${pkg.slug} absolute right-2 top-1/2 transform -translate-y-1/2  text-white bg-black/40 hover:bg-black/50 rounded-full p-2 shadow-lg z-10 transition-all`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                    </svg>
                </button>}
                <div className="absolute top-3 right-3 z-30">
                    <Badge variant="secondary" className="bg-white/90 px-1.5 py-1  text-[8px] backdrop-blur-sm text-gray-800 border-0 font-medium">
                        {pkg.duration[lang] || pkg.duration.en}
                    </Badge>
                </div>
            </div>

            <CardContent className="flex flex-col justify-between flex-grow p-1.5 md:p-3">
                <div className="">

                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-900  leading-tight flex-1">
                            <Link className="active:text-blue-600 duration-200" href={`/${lang}/packages/${pkg.slug}`}>
                                {pkg.title[lang] || pkg.title.en}
                            </Link>
                        </h3>
                    </div>

                    <p className="mt-2 text-gray-700 font-medium text-xs mb-2 leading-relaxed line-clamp-3">
                        {pkg.shortDescription[lang] || pkg.shortDescription.en}
                    </p>

                    <div className="flex flex-col justify-between">
                        <div>
                            <ul className="text-xs text-gray-700 space-y-1">


                                {pkg.location[lang] != '' && <div className="flex items-center gap-2 text-xs text-gray-700">
                                    <MapPin className="w-4 h-4 text-orange-400" />
                                    <span> {pkg.location[lang] || pkg.location.en}</span>
                                </div>}
                                {pkg.duration[lang] != '' && <li className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    <span>{t.duration}: {pkg.duration[lang] || pkg.duration.en}</span>
                                </li>}
                                {pkg.shareTrip != 0 && <li className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-orange-400" />
                                    <span>{t.shared}: {pkg.shareTrip} Euro</span>
                                </li>}
                                {pkg.privateTrip != 0 && <li className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-orange-400" />
                                    <span>{t.private}: {pkg.privateTrip} Euro</span>
                                </li>}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-1 px-1.5 md:px-4">
                    <div className="flex gap-2 text-sm">
                        <Link
                            href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(t.whatsappMessage + pkg.title[lang])}`}
                            target="_blank"
                            className="flex-1 text-green-500 hover:bg-green-100 active:bg-green-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="h-4 w-4" />
                            {t.whatsapp}
                        </Link>

                        <Link
                            href={`tel:${phoneNumber}`}
                            className="flex-1 text-blue-500 hover:bg-blue-100 active:bg-blue-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Phone className="h-4 w-4" />
                            {t.call}
                        </Link>
                    </div>

                    <Link
                        href={`/${lang}/packages/${pkg.slug}`}
                        className="bg-indigo-500 hover:bg-indigo-600 text-sm active:bg-indigo-400 text-white font-bold py-1.5 mb-1 rounded-[5px] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        {t.bookNow}
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default PackageCard