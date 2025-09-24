import { getDatabase } from "@/lib/mongodb"
import type { Category, Tour, Package } from "@/lib/models"

import HeroSection from "@/components/hero"
import { CategoriesSection } from "@/components/CategoriesSection"
import { KeyFeatures } from "@/components/key-features"
import { Footer } from "@/components/footer"
import { ToursSection } from "@/components/ToursSection"
import { TopTrips } from "@/components/TopTrips"

async function getHomeData() {
  try {
    const db = await getDatabase()

    // Get all categories
    const categories = await db.collection<Category>("categories").find({}).limit(6).toArray()

    // Get tours from first category if exists
    let tours: Tour[] = []
    if (categories.length > 0) {
      tours = await db.collection<Tour>("tours").find({ categoryId: categories[0]._id }).limit(7).toArray()
    }

    // Get packages from first tour if exists
    let packages: Package[] = []
    if (tours.length > 0) {
      packages = await db.collection<Package>("packages").find({ tourId: tours[0]._id }).limit(3).toArray()
    }

    return { categories, tours, packages }
  } catch (error) {
    console.error("Error fetching home data:", error)
    return { categories: [], tours: [], packages: [] }
  }
}

export default async function HomePage() {
  const { categories, tours, packages } = await getHomeData()

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <HeroSection />
        <CategoriesSection categories={categories} />

        <TopTrips packages={packages} />

        <ToursSection tours={tours} />


        <KeyFeatures />
      </main>

    </div>
  )
}
