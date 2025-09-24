// components/Header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, ChevronDown } from "lucide-react"
import { Category } from "@/lib/models"

interface HeaderProps {
  categories: Category[]
}

export default function Header({ categories }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const pathname = usePathname()

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

  // Close dropdowns when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsCategoriesOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/packages", label: "Packages" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/", label: "Home" },
  ]
  if (pathname.startsWith('/desert26safariadmin')) {
    return null;
  }
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
      } bg-white/95 backdrop-blur-md border-b border-b-gray-300`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 z-50">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">MoroccoTours</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">


            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all ${isCategoriesOpen
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
              >
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''
                  }`} />
              </button>

              {isCategoriesOpen && (
                <div
                  className="absolute top-full -translate-y-[10px] -left-28 mt-2 w-64 bg-white rounded-xl border border-gray-200 py-2 z-50"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category._id}
                      href={`/${category.slug}`}
                      className="flex text-sm text-gray-700 items-center py-[2px] space-x-3 px-4 hover:bg-blue-50 transition-colors group"
                    >
                      {category.title}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 pt-2">
                    <Link
                      href="/all-categories"
                      className="flex items-center justify-center px-4 text-sm text-blue-600 font-medium"
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </Button>

          {/* Mobile Navigation Sidebar */}
          <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 lg:hidden z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>

            {/* Mobile Header */}
            <div className="p-6 border-b flex items-center justify-between bg-white ">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">MoroccoTours</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile Nav Items */}
            <div className="p-4 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto bg-white">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Categories */}
              <div className="py-2">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Categories
                </div>
                <div className="space-y-1">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category._id}
                      href={`/${category.slug}`}
                      className="flex items-center space-x-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-700 py-0.5">{category.title}</div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/categories"
                  className="block px-4 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}