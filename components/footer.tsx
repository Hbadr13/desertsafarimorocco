"use client"
import { Category } from "@/lib/models"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { usePathname } from "next/navigation"

interface FooterProps {
  categories: Category[]
  lang: "es" | "fr" | "en"
}

export function Footer({ categories, lang }: FooterProps) {
  // Multilingual content
  const translations = {
    en: {
      companyDescription: "Your trusted partner for authentic Moroccan adventures. Experience the magic of Morocco with our expert guides and carefully curated tours.",
      quickLinks: "Quick Links",
      home: "Home",
      allTours: "All Tours",
      packages: "Packages",
      aboutUs: "About Us",
      contact: "Contact",
      tourCategories: "Tour Categories",
      allCategories: "All Categories",
      contactUs: "Contact Us",
      copyright: "© 2026 Desert Safaris Morocco. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      cookiePolicy: "Cookie Policy"
    },
    fr: {
      companyDescription: "Votre partenaire de confiance pour des aventures marocaines authentiques. Vivez la magie du Maroc avec nos guides experts et nos circuits soigneusement organisés.",
      quickLinks: "Liens Rapides",
      home: "Accueil",
      allTours: "Tous les Circuits",
      packages: "Forfaits",
      aboutUs: "À Propos",
      contact: "Contact",
      tourCategories: "Catégories de Circuits",
      allCategories: "Toutes les Catégories",
      contactUs: "Contactez-Nous",
      copyright: "© 2026 Desert Safaris Morocco. Tous droits réservés.",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
      cookiePolicy: "Politique des Cookies"
    },
    es: {
      companyDescription: "Su socio de confianza para auténticas aventuras marroquíes. Experimente la magia de Marruecos con nuestros guías expertos y tours cuidadosamente seleccionados.",
      quickLinks: "Enlaces Rápidos",
      home: "Inicio",
      allTours: "Todos los Tours",
      packages: "Paquetes",
      aboutUs: "Sobre Nosotros",
      contact: "Contacto",
      tourCategories: "Categorías de Tours",
      allCategories: "Todas las Categorías",
      contactUs: "Contáctenos",
      copyright: "© 2026 Desert Safaris Morocco. Todos los derechos reservados.",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
      cookiePolicy: "Política de Cookies"
    }
  }

  const t = translations[lang]

  const quickLinks = [
    { href: `/${lang}`, label: t.home },
    { href: `/${lang}/categories`, label: t.allTours },
    { href: `/${lang}/packages`, label: t.packages },
    { href: `/${lang}/about`, label: t.aboutUs },
    { href: `/${lang}/contact`, label: t.contact },
  ]

  const pathname = usePathname()
  if (pathname.startsWith('/desert26safariadmin')) {
    return null
  }

  // Helper function to get category title in current language
  const getCategoryTitle = (category: Category) => {
    if (typeof category.title === 'string') return category.title
    return category.title?.[lang] || category.title?.en || "Untitled"
  }

  return (
    <footer className="bg-gradient-to-br from-gray-700 to-gray-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Desert Safaris Morocco
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.companyDescription}
            </p>
            <div className="flex gap-4">
              <div className="p-2 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </div>
              <div className="p-2 bg-pink-500 rounded-full cursor-pointer hover:bg-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="p-2 bg-blue-400 rounded-full cursor-pointer hover:bg-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="p-2 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-amber-400">{t.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-green-400">{t.tourCategories}</h4>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <a
                    href={`/${lang}/categories/${category.slug}`}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    {getCategoryTitle(category)}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 mt-3">
              <li key={'all'}>
                <a
                  href={`/${lang}/all-categories`}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  {t.allCategories}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-blue-400">{t.contactUs}</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-gray-300 group-hover:text-blue-400 transition-colors">+1 239 537 5059</span>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-red-500 rounded-lg group-hover:bg-red-600 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-gray-300 group-hover:text-red-400 transition-colors break-all">desertsafarimorocco@gmail.com</span>
              </div>

              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors mt-1">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-gray-300 group-hover:text-green-400 transition-colors">
                  Marrakech, Morocco
                  <br />
                  <span className="text-sm">Medina Quarter</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {t.copyright}
            </p>

          </div>
        </div>
      </div>
    </footer>
  )
}