

"use client"

import { useState, useEffect } from "react"
import { Package, Tour } from "@/lib/models"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Clock, Star, Shield, Check, ChevronLeft, ChevronRight, Phone, Mail, MessageCircle, User, MailIcon, PhoneIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import PackageCard from "./packageCard"
import { Swiper } from "./ui/swiper"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface PackageDetailsPageProps {
    pkg: Package
    tour: Tour | null
    otherPackages: Package[]
    lang: 'en' | 'fr' | 'es'
}
const translations = {
    en: {
        whatsapp: "WhatsApp",
        call: "Call",
        whatsappMessage: `Hello, I would like to make a reservation for the package: `,
        breadcrumb: {
            home: "Home",
            tours: "Tours",
            packages: "Packages"
        },
        tabs: {
            overview: "Overview",
            itinerary: "Itinerary",
            included: "What's Included"
        },
        booking: {
            bestSeller: "⭐ Best Seller",
            selectTripType: "Select Trip Type",
            shared: "Shared",
            private: "Private",
            perPerson: "per person",
            freeCancellation: "Free cancellation",
            startDate: "Start Date",
            travelers: "Travelers",
            adults: "Adults",
            children: "Children",
            priceBreakdown: "Price Breakdown",
            totalAmount: "Total Amount",
            bookNow: "Book Now",
            securePayment: "Secure payment",
            bestPriceGuarantee: "Best price guarantee",
            needHelp: "Need Help Booking?",
            customerSupport: "24/7 Customer Support",
            contactInfo: "Contact Information",
            fullName: "Full Name",
            email: "Email Address",
            phone: "Phone Number",
            notes: "Additional Notes",
            optional: "Optional",
            contactUsForPrice: "Contact us for price",
            noPriceAvailable: "Price not available"
        },
        content: {
            tourHighlights: "Tour Highlights",
            quickFacts: "Quick Facts",
            groupSize: "Group Size",
            difficulty: "Difficulty",
            ageRange: "Age Range",
            detailedItinerary: "Detailed Itinerary",
            whatsIncluded: "What's Included",
            whatsExcluded: "What's Excluded",
            otherPackages: "Other Packages in This Tour",
            viewPackageDetails: "View Package Details",
            from: "From",
            experience: "Experience",
            accommodation: "Accommodation",
            meals: "Meals Included",
            transportation: "Transportation",
            guide: "Professional Guide",
            readMore: 'Read more'
        },
        features: {
            groupSize: "2-12 people",
            difficulty: "Moderate",
            ageRange: "8-70 years"
        },
        messages: {
            successTitle: "Booking Request Submitted!",
            successMessage: "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
            processingMessage: "Our travel experts will review your booking request. We'll contact you within 24 hours to confirm availability. Once confirmed, we'll send you detailed itinerary and payment instructions.",
            errorTitle: "Booking Failed",
            errorMessage: "There was an error submitting your booking. Please try again or contact us directly."
        }
    },
    fr: {
        whatsapp: "WhatsApp",
        call: "Appeler",
        whatsappMessage: `Bonjour, je voudrais faire une réservation pour le package : `,
        breadcrumb: {
            home: "Accueil",
            tours: "Circuits",
            packages: "Forfaits"
        },
        tabs: {
            overview: "Aperçu",
            itinerary: "Itinéraire",
            included: "Ce qui est inclus"
        },
        booking: {
            bestSeller: "⭐ Meilleure Vente",
            selectTripType: "Sélectionnez le type de voyage",
            shared: "Partagé",
            private: "Privé",
            perPerson: "par personne",
            freeCancellation: "Annulation gratuite",
            startDate: "Date de début",
            travelers: "Voyageurs",
            adults: "Adultes",
            children: "Enfants",
            priceBreakdown: "Détail du prix",
            totalAmount: "Montant total",
            bookNow: "Réserver",
            securePayment: "Paiement sécurisé",
            bestPriceGuarantee: "Meilleur prix garanti",
            needHelp: "Besoin d'aide pour réserver?",
            customerSupport: "Support client 24/7",
            contactInfo: "Informations de contact",
            fullName: "Nom complet",
            email: "Adresse email",
            phone: "Numéro de téléphone",
            notes: "Notes supplémentaires",
            optional: "Optionnel",
            contactUsForPrice: "Contactez-nous pour le prix",
            noPriceAvailable: "Prix non disponible"
        },
        content: {
            tourHighlights: "Points forts du circuit",
            quickFacts: "Informations rapides",
            groupSize: "Taille du groupe",
            difficulty: "Difficulté",
            ageRange: "Tranche d'âge",
            detailedItinerary: "Itinéraire détaillé",
            whatsIncluded: "Ce qui est inclus",
            whatsExcluded: "Ce qui est exclu",
            otherPackages: "Autres forfaits de ce circuit",
            viewPackageDetails: "Voir les détails du forfait",
            from: "À partir de",
            experience: "Expérience",
            accommodation: "Hébergement",
            meals: "Repas inclus",
            transportation: "Transport",
            guide: "Guide professionnel",
            readMore: 'En savoir plus'
        },
        features: {
            groupSize: "2-12 personnes",
            difficulty: "Modérée",
            ageRange: "8-70 ans"
        },
        messages: {
            successTitle: "Demande de Réservation Envoyée !",
            successMessage: "Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.",
            processingMessage: "Nos experts voyages examineront votre demande de réservation. Nous vous contacterons dans les 24 heures pour confirmer la disponibilité. Une fois confirmé, nous vous enverrons l'itinéraire détaillé et les instructions de paiement.",
            errorTitle: "Échec de la Réservation",
            errorMessage: "Une erreur s'est produite lors de l'envoi de votre réservation. Veuillez réessayer ou nous contacter directement."
        }
    },
    es: {
        whatsapp: "WhatsApp",
        call: "Llamar",
        whatsappMessage: `Hola, me gustaría hacer una reserva para el paquete:`,
        breadcrumb: {
            home: "Inicio",
            tours: "Tours",
            packages: "Paquetes"
        },
        tabs: {
            overview: "Resumen",
            itinerary: "Itinerario",
            included: "Qué incluye"
        },
        booking: {
            bestSeller: "⭐ Más Vendido",
            selectTripType: "Selecciona el tipo de viaje",
            shared: "Compartido",
            private: "Privado",
            perPerson: "por persona",
            freeCancellation: "Cancelación gratuita",
            startDate: "Fecha de inicio",
            travelers: "Viajeros",
            adults: "Adultos",
            children: "Niños",
            priceBreakdown: "Desglose del precio",
            totalAmount: "Monto total",
            bookNow: "Reservar",
            securePayment: "Pago seguro",
            bestPriceGuarantee: "Mejor precio garantizado",
            needHelp: "¿Necesitas ayuda para reservar?",
            customerSupport: "Soporte al cliente 24/7",
            contactInfo: "Información de contacto",
            fullName: "Nombre completo",
            email: "Correo electrónico",
            phone: "Número de teléfono",
            notes: "Notas adicionales",
            optional: "Opcional",
            contactUsForPrice: "Contáctenos para precio",
            noPriceAvailable: "Precio no disponible"
        },
        content: {
            tourHighlights: "Destacados del tour",
            quickFacts: "Datos rápidos",
            groupSize: "Tamaño del grupo",
            difficulty: "Dificultad",
            ageRange: "Rango de edad",
            detailedItinerary: "Itinerario detallado",
            whatsIncluded: "Qué incluye",
            whatsExcluded: "Qué excluye",
            otherPackages: "Otros paquetes de este tour",
            viewPackageDetails: "Ver detalles del paquete",
            from: "Desde",
            experience: "Experiencia",
            accommodation: "Alojamiento",
            meals: "Comidas incluidas",
            transportation: "Transporte",
            guide: "Guía profesional",
            readMore: 'leer más'

        },
        features: {
            groupSize: "2-12 personas",
            difficulty: "Moderada",
            ageRange: "8-70 años"
        },
        messages: {
            successTitle: "¡Solicitud de Reserva Enviada!",
            successMessage: "¡Gracias! Su mensaje ha sido enviado exitosamente. Nos pondremos en contacto con usted dentro de 24 horas.",
            processingMessage: "Nuestros expertos en viajes revisarán su solicitud de reserva. Nos contactaremos con usted dentro de 24 horas para confirmar la disponibilidad. Una vez confirmado, le enviaremos el itinerario detallado y las instrucciones de pago.",
            errorTitle: "Reserva Fallida",
            errorMessage: "Hubo un error al enviar su reserva. Por favor, intente nuevamente o contáctenos directamente."
        }
    }
}
export function PackageDetailsPage({ pkg, tour, otherPackages, lang }: PackageDetailsPageProps) {
    const [selectedPackageType, setSelectedPackageType] = useState<'shared' | 'private'>('shared')
    const [startDate, setStartDate] = useState('')
    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included'>('overview')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        notes: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogMessage, setDialogMessage] = useState('')
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+12395375059'
    const email = process.env.NEXT_PUBLIC_EMAIL

    const hasSharedPrice = pkg.shareTrip && pkg.shareTrip > 0
    const hasPrivatePrice = pkg.privateTrip && pkg.privateTrip > 0

    const hasOnlyOnePrice = (hasSharedPrice && !hasPrivatePrice) || (!hasSharedPrice && hasPrivatePrice)
    const hasBothPrices = hasSharedPrice && hasPrivatePrice

    useEffect(() => {
        if (!hasSharedPrice && hasPrivatePrice) {
            setSelectedPackageType('private')
        } else if (hasSharedPrice && !hasPrivatePrice) {
            setSelectedPackageType('shared')
        }
    }, [hasSharedPrice, hasPrivatePrice])

    const t = translations[lang]

    useEffect(() => {
        const basePrice = selectedPackageType === 'shared' ? pkg.shareTrip : pkg.privateTrip
        if (basePrice && basePrice > 0) {
            const childrenDiscount = 0.3
            const childrenPrice = children * basePrice * (1 - childrenDiscount)
            const adultsPrice = adults * basePrice
            setTotalPrice(adultsPrice + childrenPrice)
        } else {
            setTotalPrice(0)
        }
    }, [selectedPackageType, adults, children, pkg.shareTrip, pkg.privateTrip])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleAdultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0
        setAdults(Math.max(1, Math.min(10, value)))
    }

    const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0
        setChildren(Math.max(0, Math.min(10, value)))
    }

    const handleReservation = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const bookingData = {
            packageId: pkg._id,
            packageName: pkg.title?.[lang] || pkg.title?.en,
            packageType: selectedPackageType,
            startDate,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes,
            adults,
            children,
            totalPrice,
            lang,
            timestamp: new Date().toISOString()
        }

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            })

            if (response.ok) {
                const result = await response.json()
                setDialogTitle(t.messages.successTitle)
                setDialogMessage(`${t.messages.successMessage}\n\n${t.messages.processingMessage}`)
                setDialogOpen(true)
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    notes: ''
                })
                setStartDate('')
                setAdults(1)
                setChildren(0)
            } else {
                throw new Error('Failed to submit booking')
            }
        } catch (error) {
            console.error('Error submitting booking:', error)
            setDialogTitle(t.messages.errorTitle)
            setDialogMessage(t.messages.errorMessage)
            setDialogOpen(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    const packageTitle = pkg.title?.[lang] || pkg.title?.en || ""
    const packageDescription = pkg.description?.[lang] || pkg.description?.en || ""
    const packageDuration = pkg.duration?.[lang] || pkg.duration?.en || ""
    const packageLocation = pkg.location?.[lang] || pkg.location?.en || ""
    const tourTitle = tour?.title?.[lang] || tour?.title?.en || ""

    const getCurrentPrice = () => {
        const price = selectedPackageType === 'shared' ? pkg.shareTrip : pkg.privateTrip
        return price && price > 0 ? price : 0
    }

    const getSinglePrice = () => {
        if (hasSharedPrice) return pkg.shareTrip
        if (hasPrivatePrice) return pkg.privateTrip
        return 0
    }

    const swiperItems = otherPackages.map((pkg) => (
        <PackageCard key={pkg.slug || pkg._id?.toString()} pkg={pkg} lang={lang} />
    ))

    return (
        <div className="min-h-screen bg-white pt-10">
            <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <div className="relative h-80 sm:h-96 w-full">
                                <Image
                                    src={pkg.images?.[currentImageIndex] || "/default-package.jpg"}
                                    alt={packageTitle}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {pkg.images && pkg.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : pkg.images!.length - 1)}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/60 p-3 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronLeft strokeWidth={3} className="h-5 w-5 text-blue-700" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => prev < pkg.images!.length - 1 ? prev + 1 : 0)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/60 p-3 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronRight strokeWidth={3} className="h-5 w-5 text-blue-700" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {pkg.images && pkg.images.length > 1 && (
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
                                                alt={`${packageTitle} ${index + 1}`}
                                                width={64}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">{packageTitle}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                                        {packageLocation != '' && <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{packageLocation}</span>
                                        </div>}
                                        {packageDuration != '' && <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{packageDuration}</span>
                                        </div>}
                                        {pkg.departureTime != '' && <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Departure: {pkg.departureTime}</span>
                                        </div>}
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8">
                                    {[
                                        { id: 'overview', label: t.tabs.overview },
                                        { id: 'itinerary', label: t.tabs.itinerary },
                                        { id: 'included', label: t.tabs.included }
                                    ].filter((it) => !(it.id == 'itinerary' && pkg.itinerary.length == 0)).map((tab) => (
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

                        <div className="space-y-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <p className="text-gray-700  whitespace-pre-wrap leading-relaxed  text-sm md:text-lg">{packageDescription}</p>

                                    <div className="grid grid-cols-1 gap-8">
                                        {pkg.itinerary && pkg.itinerary.length != 0 && <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                                                    <h3 className="text-xl font-bold text-blue-900">{t.content.tourHighlights}</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {pkg.itinerary.slice(0, 4).map((item, index) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-300  hover:shadow-md transition-shadow">
                                                            <div className="flex-shrink-0 rounded-full flex items-center justify-center">
                                                                <span className="text-blue-800 font-bold text-sm">Day {index + 1}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                                                    {item.title?.[lang] || item.title?.en || ""}
                                                                </h4>

                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>}

                                        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                                                    <h3 className="text-xl font-bold text-green-900">{t.content.quickFacts}</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                                                            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                                            <div className="text-sm font-semibold text-gray-900">{t.content.groupSize}</div>
                                                            <div className="text-xs text-gray-600">{t.features.groupSize}</div>
                                                        </div>
                                                        <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                                                            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                                            <div className="text-sm font-semibold text-gray-900">{t.content.difficulty}</div>
                                                            <div className="text-xs text-gray-600">{t.features.difficulty}</div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded-lg border border-green-100 p-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-gray-900">{t.content.ageRange}</span>
                                                            <span className="text-sm text-green-600 font-bold">{t.features.ageRange}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded-lg border border-green-100 p-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-gray-900">{t.content.experience}</span>
                                                            <span className="text-sm text-green-600 font-bold">3.8/5</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'itinerary' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-900">{t.content.detailedItinerary}</h3>
                                    <div className="space-y-4">
                                        {pkg.itinerary?.map((day, index) => (
                                            <div key={index} className="border border-gray-200 overflow-hidden">
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                                    <h4 className="font-semibold flex justify-between text-gray-900  gap-2">
                                                        <span className=" flex-shrink-0 text-blue-900 text-sm">
                                                            Day {index + 1}
                                                        </span>
                                                        <div className="">
                                                            {day.title?.[lang] || day.title?.en || ""}
                                                        </div>
                                                    </h4>
                                                </div>
                                                <div className="p-6 bg-white">
                                                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap ">{day.description?.[lang] || day.description?.en || ""}</p>
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
                                            {t.content.whatsIncluded}
                                        </h3>
                                        <ul className="space-y-3">
                                            {pkg.toursIncluded?.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span>{item.description[lang] || item.description.en}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                                            <div className="h-5 w-5 text-red-600">✕</div>
                                            {t.content.whatsExcluded}
                                        </h3>
                                        <ul className="space-y-3">
                                            {pkg.toursExcluded?.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                                    <div className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5">✕</div>
                                                    <span>{item.description[lang] || item.description.en}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>

                    <div className="space-y-6">
                        <Card className="border border-blue-200 shadow-xl">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    {hasOnlyOnePrice || hasBothPrices ? (
                                        <>
                                            <div className="text-3xl font-bold text-blue-600 mb-1">
                                                ${hasOnlyOnePrice ? getSinglePrice() : getCurrentPrice()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {t.booking.perPerson}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-xl font-bold text-gray-600 mb-2">
                                            {t.booking.contactUsForPrice}
                                        </div>
                                    )}
                                </div>
                                <form onSubmit={handleReservation} className="space-y-4">
                                    {hasBothPrices != 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">{t.booking.selectTripType}</label>
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
                                                    <div className="font-semibold">{t.booking.shared}</div>
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
                                                    <div className="font-semibold">{t.booking.private}</div>
                                                    <div className="text-lg font-bold">${pkg.privateTrip}</div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            {t.booking.contactInfo}
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t.booking.fullName} *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={handleFormChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={t.booking.fullName}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t.booking.email} *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleFormChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={t.booking.email}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t.booking.phone} *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleFormChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={t.booking.phone}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t.booking.notes} ({t.booking.optional})
                                                </label>
                                                <textarea
                                                    name="notes"
                                                    value={formData.notes}
                                                    onChange={handleFormChange}
                                                    rows={3}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={t.booking.notes}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                {t.booking.startDate} *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">{t.booking.travelers}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">{t.booking.adults}</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={adults}
                                                    onChange={handleAdultsChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">{t.booking.children}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    value={children}
                                                    onChange={handleChildrenChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {(hasOnlyOnePrice || hasBothPrices) && (
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{t.booking.adults} x{adults}</span>
                                                <span className="font-semibold">
                                                    ${(adults * (hasOnlyOnePrice ? getSinglePrice() : getCurrentPrice())).toLocaleString()}
                                                </span>
                                            </div>
                                            {children > 0 && (
                                                <div className="flex justify-between text-sm text-green-600">
                                                    <span>{t.booking.children} x{children} (30% off)</span>
                                                    <span className="font-semibold">
                                                        ${(children * (hasOnlyOnePrice ? getSinglePrice() : getCurrentPrice()) * 0.7).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex justify-between font-bold text-lg">
                                                    <span>{t.booking.totalAmount}</span>
                                                    <span className="text-blue-600">${totalPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Submitting..." : t.booking.bookNow}
                                    </Button>

                                    <div className="text-center space-y-2 text-xs text-gray-500">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                <span>{t.booking.securePayment}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Check className="h-3 w-3" />
                                                <span>{t.booking.bestPriceGuarantee}</span>
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
                                    {t.booking.needHelp}
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <PhoneIcon className="h-4 w-4" />
                                        <span>{phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <MailIcon className="h-4 w-4" />
                                        <span className="break-all">{email}</span>
                                    </div>
                                    <div className="text-blue-600 font-medium">{t.booking.customerSupport}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200">
                {otherPackages.length > 0 && (
                    <div className=" pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h2 className=" text-xl md:text-3xl font-bold text-gray-900 mb-6">{t.content.otherPackages}</h2>
                        <Swiper
                            items={swiperItems}
                        />
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription className="whitespace-pre-line">
                            {dialogMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setDialogOpen(false)} className="mt-1 bg-blue-500 text-white">
                        OK
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}