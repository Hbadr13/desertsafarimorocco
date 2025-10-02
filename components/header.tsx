// components/Header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, ChevronDown, Languages, MessageCircle } from "lucide-react"
import { Category } from "@/lib/models"

interface HeaderProps {
  categories: Category[]
  lang: "es" | "fr" | "en"
}

// Translation interface
interface Translations {
  home: string;
  packages: string;
  about: string;
  contact: string;
  categories: string;
  viewAllCategories: string;
  languages: string;
  bookNow: string;
}

const translations: Record<"en" | "fr" | "es", Translations> = {
  en: {
    home: "Home",
    packages: "Packages",
    about: "About",
    contact: "Contact",
    categories: "Categories",
    viewAllCategories: "View All Categories",
    languages: "Languages",
    bookNow: "Book Now"
  },
  fr: {
    home: "Accueil",
    packages: "Forfaits",
    about: "À Propos",
    contact: "Contact",
    categories: "Catégories",
    viewAllCategories: "Voir Toutes les Catégories",
    languages: "Langues",
    bookNow: "Réserver"
  },
  es: {
    home: "Inicio",
    packages: "Paquetes",
    about: "Nosotros",
    contact: "Contacto",
    categories: "Categorías",
    viewAllCategories: "Ver Todas las Categorías",
    languages: "Idiomas",
    bookNow: "Reservar"
  }
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
]

function LanguageMenu({ lang }: { lang: "es" | "fr" | "en" }) {
  const [isLangsOpen, setIsLangsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsLangsOpen(true)}
        onMouseLeave={() => setIsLangsOpen(false)}
        className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg font-medium transition-all duration-200 ${isLangsOpen
          ? "bg-blue-100 text-blue-800 shadow-md"
          : "text-gray-700 hover:text-blue-400 hover:bg-blue-50"
          }`}
      >
        <span className="text-lg">{languages.find(l => l.code === lang)?.flag}</span>
        <span className="capitalize">{lang}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isLangsOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isLangsOpen && (
        <div
          className="absolute top-full -translate-y-2 left-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 py-2 z-50 shadow-lg"
          onMouseEnter={() => setIsLangsOpen(true)}
          onMouseLeave={() => setIsLangsOpen(false)}
        >
          {languages.map((language) => (
            <Link
              key={language.code}
              href={`/${language.code}`}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${lang === language.code
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span className="text-xl">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header({ categories, lang }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [isMobileLanguagesOpen, setIsMobileLanguagesOpen] = useState(false)
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+12395375059"; // Default number if not set

  const pathname = usePathname()
  const t = translations[lang]

  // Scroll handling - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsCategoriesOpen(false)
    setIsMobileCategoriesOpen(false)
    setIsMobileLanguagesOpen(false)
  }, [pathname])

  const navItems = [
    { href: `/${lang}`, label: t.home },
    { href: `/${lang}/packages`, label: t.packages },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/contact`, label: t.contact },
  ]

  if (pathname.startsWith('/desert26safariadmin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible
        ? 'translate-y-0 shadow-sm'
        : '-translate-y-full shadow-none'
        } bg-white/95 backdrop-blur-md border-b border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex  z-30 items-center space-x-3 group">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md group-hover:shadow-lg transition-all">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight">
                Desert Safaris Morocco
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 font-medium transition-all duration-200 ${isCategoriesOpen
                  ? ' border-b-2 border-blue-600 text-blue-800 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
              >
                <span>{t.categories}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''
                  }`} />
              </button>

              {isCategoriesOpen && (
                <div
                  className="absolute -translate-y-2 top-full left-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 py-2 z-50 shadow-lg"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <div className=" max-h-80 overflow-y-auto">
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category._id?.toString()}
                        href={`/${lang}/categories/${category.slug}`}
                        className="flex items-center px-4 py-1 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg mx-2 group"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mr-3"></div>
                        <span className="font-medium">
                          {category.title[lang] || category.title.en}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      href={`/${lang}/categories`}
                      className="flex items-center space-x-2 px-4 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2 group"
                    >
                      <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                        <ChevronDown className="h-3 w-3 text-white rotate-270" />
                      </div>
                      <span className="font-semibold">{t.viewAllCategories}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Main Navigation Items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-2  font-medium transition-all duration-200 ${pathname === item.href
                  ? ' border-b-2 border-blue-600 text-blue-800 '
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}


            <Link
              href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}`}
              target="_blank"
              className="flex-1 px-1  text-green-500 hover:bg-green-100 active:bg-green-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
            <LanguageMenu lang={lang} />


          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden z-40 relative hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </Button>

          {/* Mobile Navigation Sidebar */}
          <div className={`fixed  rounded-bl-xl  h-screen bg-blue-500= inset-0 z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="absolute z-50 right-0 top-0 h-full w-80 bg-white shadow-xl overflow-hidden">
              {/* Mobile Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">Desert Safaris Morocco</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile Nav Items */}
              <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-2">
                  {/* Main Navigation */}
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3  font-medium transition-all duration-200 ${pathname === item.href
                          ? 'border-b-2 border-blue-400 text-blue-900 '
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="flex-1">{item.label}</span>
                        {pathname === item.href && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Categories Accordion */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-200 rounded flex items-center justify-center">
                          <ChevronDown className="h-4 w-4 text-black" />
                        </div>
                        <span className="font-semibold text-gray-900">{t.categories}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {isMobileCategoriesOpen && (
                      <div className="bg-gray-50">
                        <div className="py-2 space-y-1 max-h-60 overflow-y-auto">
                          {categories.slice(0, 8).map((category) => (
                            <Link
                              key={category._id?.toString()}
                              href={`/${lang}/categories/${category.slug}`}
                              className="flex items-center space-x-3 px-4 py-2.5 mx-2 rounded-lg hover:bg-white hover:shadow-sm transition-all group"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                                {category.title[lang] || category.title.en}
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <Link
                            href={`/${lang}/categories`}
                            className="flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg bg-white hover:shadow-md transition-all group border border-gray-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {t.viewAllCategories}
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Languages Accordion */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setIsMobileLanguagesOpen(!isMobileLanguagesOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-200 rounded flex items-center justify-center">
                          <span className="text-sm text-black"><Languages /></span>
                        </div>
                        <span className="font-semibold text-gray-900">{t.languages}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isMobileLanguagesOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {isMobileLanguagesOpen && (
                      <div className="bg-gray-50 py-2 space-y-1">
                        {languages.map((language) => (
                          <Link
                            key={language.code}
                            href={`/${language.code}`}
                            className={`flex items-center space-x-3 px-4 py-2.5 mx-2 rounded-lg transition-colors group ${lang === language.code
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-700 hover:bg-white'
                              }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-xl">{language.flag}</span>
                            <span className="font-medium">{language.name}</span>
                            {lang === language.code && (
                              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Book Now Button */}
                  {/* <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold shadow-md mt-5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.bookNow}
                  </Button> */}
                  <Link
                    href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    className="flex-1 px-1  mt-5 text-green-600 hover:bg-green-100 active:bg-green-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}

