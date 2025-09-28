"use client"
import { useEffect, useState } from "react"

import HeroSection from "@/components/hero"
import { CategoriesSection } from "@/components/CategoriesSection"
import { KeyFeatures } from "@/components/key-features"
import { ToursSection } from "@/components/ToursSection"
import { TopTrips } from "@/components/TopTrips"
import { Button } from "@/components/ui/button"

const LANGS = ["en", "fr", "es"]

export default function HomePage() {
  const [lang, setLang] = useState("en")
  const [home, setHome] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/client/home`).then(res => res.json()),
      fetch(`/api/client/categories`).then(res => res.json()),
      fetch(`/api/client/packages`).then(res => res.json()),
      fetch(`/api/client/tours`).then(res => res.json()),
    ]).then(([homeData, catData, pkgData, tourData]) => {
      setHome({
        title: homeData.title?.[lang] || homeData.title?.en || "",
        description: homeData.description?.[lang] || homeData.description?.en || "",
        // ...other fields...
      })
      setCategories((catData.categories || []).map((cat: any) => ({
        ...cat,
        title: cat.title?.[lang] || cat.title?.en || "",
        description: cat.description?.[lang] || cat.description?.en || "",
        shortDescription: cat.shortDescription?.[lang] || cat.shortDescription?.en || "",
      })))
      setPackages((pkgData.packages || []).map((pkg: any) => ({
        ...pkg,
        title: pkg.title?.[lang] || pkg.title?.en || "",
        description: pkg.description?.[lang] || pkg.description?.en || "",
        duration: pkg.duration?.[lang] || pkg.duration?.en || "",
        departure: pkg.departure?.[lang] || pkg.departure?.en || "",
      })))
      setTours((tourData.tours || []).map((tour: any) => ({
        ...tour,
        title: tour.title?.[lang] || tour.title?.en || "",
        description: tour.description?.[lang] || tour.description?.en || "",
        shortDescription: tour.shortDescription?.[lang] || tour.shortDescription?.en || "",
      })))
      setLoading(false)
    })
  }, [lang])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection categories={categories} />
        <TopTrips packages={packages} />
        <ToursSection tours={tours} />
        <KeyFeatures />
      </main>
      {/* Language Switcher */}
      <div className="flex gap-2 mb-4">
        {LANGS.map(l => (
          <Button key={l} variant={l === lang ? "default" : "outline"} onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  )
}
