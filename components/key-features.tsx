import { CheckCircle, DollarSign, Calendar, Users, Star } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Swiper } from "./ui/swiper"

export function KeyFeatures({ lang }: { lang: 'en' | 'es' | 'fr' }) {
  // Translations for all text in the component
  const translations = {
    en: {
      title: "Why Desert Safaris Morocco",
      subtitle: "We're committed to providing exceptional experiences with unmatched service",
      features: [
        {
          icon: CheckCircle,
          title: "Guaranteed Departure",
          description: "All tours are guaranteed to depart as scheduled",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100"
        },
        {
          icon: DollarSign,
          title: "Lowest Price Guarantee",
          description: "Best prices guaranteed or we'll match any competitor",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          iconBg: "bg-green-100"
        },
        {
          icon: Calendar,
          title: "Flexible Cancellation",
          description: "Free cancellation up to 24 hours before departure",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
          iconBg: "bg-purple-100"
        },
        {
          icon: Users,
          title: "Local Expertise",
          description: "Expert local guides with deep cultural knowledge",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          iconBg: "bg-orange-100"
        },
        {
          icon: Star,
          title: "Customer Reviews",
          description: "5-star rated experiences from thousands of travelers",
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          iconBg: "bg-red-100"
        },
      ]
    },
    fr: {
      title: "Pourquoi Desert Safaris Morocco",
      subtitle: "Nous nous engageons à offrir des expériences exceptionnelles avec un service incomparable",
      features: [
        {
          icon: CheckCircle,
          title: "Départ Garanti",
          description: "Tous les circuits sont garantis de partir comme prévu",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100"
        },
        {
          icon: DollarSign,
          title: "Meilleur Prix Garanti",
          description: "Meilleurs prix garantis ou nous égalons tout concurrent",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          iconBg: "bg-green-100"
        },
        {
          icon: Calendar,
          title: "Annulation Flexible",
          description: "Annulation gratuite jusqu'à 24 heures avant le départ",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
          iconBg: "bg-purple-100"
        },
        {
          icon: Users,
          title: "Expertise Locale",
          description: "Guides locaux experts avec une connaissance culturelle approfondie",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          iconBg: "bg-orange-100"
        },
        {
          icon: Star,
          title: "Avis Clients",
          description: "Expériences notées 5 étoiles par des milliers de voyageurs",
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          iconBg: "bg-red-100"
        },
      ]
    },
    es: {
      title: "Por Qué Desert Safaris Morocco",
      subtitle: "Nos comprometemos a proporcionar experiencias excepcionales con un servicio inigualable",
      features: [
        {
          icon: CheckCircle,
          title: "Salida Garantizada",
          description: "Todos los tours están garantizados para salir según lo programado",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100"
        },
        {
          icon: DollarSign,
          title: "Garantía de Mejor Precio",
          description: "Mejores precios garantizados o igualamos cualquier competidor",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          iconBg: "bg-green-100"
        },
        {
          icon: Calendar,
          title: "Cancelación Flexible",
          description: "Cancelación gratuita hasta 24 horas antes de la salida",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
          iconBg: "bg-purple-100"
        },
        {
          icon: Users,
          title: "Experiencia Local",
          description: "Guías locales expertos con profundo conocimiento cultural",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          iconBg: "bg-orange-100"
        },
        {
          icon: Star,
          title: "Reseñas de Clientes",
          description: "Experiencias calificadas con 5 estrellas por miles de viajeros",
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          iconBg: "bg-red-100"
        },
      ]
    }
  }

  const t = translations[lang]

  const swiperItems = t.features.map((feature, index) => (
    <Card key={index} className={`p-2 text-center ${feature.bgColor} border-gray-200 border-[1px] rounded-lg`}>
      <CardContent className="p-0">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${feature.iconBg}`}>
            {feature.icon && (
              <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
            )}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
        <p className="text-gray-600 text-xs">{feature.description}</p>
      </CardContent>
    </Card>
  ))

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{t.title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <Swiper
          items={swiperItems}
          cardWidth={220}
          cardGap={24}
          showNavigation={true}
        />
      </div>
    </section>
  )
}