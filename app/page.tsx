"use client"
import { useEffect, useState } from "react"

import HeroSection from "@/components/hero"
import { CategoriesSection } from "@/components/CategoriesSection"
import { KeyFeatures } from "@/components/key-features"
import { ToursSection } from "@/components/ToursSection"
import { TopTrips } from "@/components/TopTrips"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const LANGS = ["en", "fr", "es"]

export default function Index({ params }: { params: { lang: 'fr' | 'en' | 'es' } }) {
  const router = useRouter()
  useEffect(() => {
    router.push('en')
  }, [router])
  return (
    <div className="">
      <HeroSection lang='en' />
    </div>
  )
}
