import { ArrowRight, Calendar, Clock, LucideMessageCircle, MapPin, MessageCircle, Phone, PhoneCall, Shield, User, Users } from "lucide-react"
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
            className="max-w-[320px] w-[80vw] border border-gray-200 rounded-xl overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-200 group/child"
        >
            <div className=" h-44  w-full overflow-hidden relative">
                <Image
                    src={pkg.images[0]}
                    alt={pkg.title[lang] || pkg.title.en}
                    fill
                    className="object-cover group-hover/child:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 px-1.5 py-1  text-[8px] backdrop-blur-sm text-gray-800 border-0 font-medium">
                        {pkg.duration[lang] || pkg.duration.en}
                    </Badge>
                </div>

            </div>

            <CardContent className="flex flex-col justify-between flex-grow p-1.5 md:p-3">
                <div className="">

                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight flex-1">
                            <Link className="active:text-blue-600 duration-200" href={`/${lang}/packages/${pkg.slug}`}>
                                {pkg.title[lang] || pkg.title.en}
                            </Link>
                        </h3>
                    </div>

                    <p className="text-gray-700 font-medium text-xs mb-2 leading-relaxed line-clamp-3">
                        {pkg.shortDescription[lang] || pkg.shortDescription.en}
                    </p>

                    <div className="flex flex-col justify-between">
                        <div>
                            <ul className="text-xs text-gray-700 space-y-1">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-600" />
                                    <span>{t.departure}: {pkg.departure[lang] || pkg.departure.en}</span>
                                </li>
                                {pkg.location && <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-600" />
                                    <span>{t.location}: {pkg.location[lang] || pkg.location.en}</span>
                                </li>}

                                <li className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-red-600" />
                                    <span>{t.duration}: {pkg.duration[lang] || pkg.duration.en}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-red-600" />
                                    <span>{t.shared}: {pkg.shareTrip} Euro</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-red-600" />
                                    <span>{t.private}: {pkg.privateTrip} Euro</span>
                                </li>
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