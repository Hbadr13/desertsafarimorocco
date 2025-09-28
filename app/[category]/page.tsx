// app/categories/[slug]/page.tsx
"use client"
import { getDatabase } from "@/lib/mongodb"
import { notFound } from "next/navigation"
import { Category, Package, Tour } from "@/lib/models"
import { CategoryToursPage } from "@/components/CategoryToursPage"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: {
    categorySlug: string
  }
}

// async function getCategoryData(categorySlug: string) {
//   try {
//     const db = await getDatabase()

//     // Get the category by slug
//     const category = await db.collection<Category>("categories").findOne({ slug: categorySlug })

//     if (!category) {
//       return null
//     }

//     // Get all tours for this category
//     const tours = await db.collection<Tour>("tours")
//       .find({ categoryId: category._id })
//       .toArray()

//     // Get packages for each tour
//     const toursWithPackages = await Promise.all(
//       tours.map(async (tour) => {
//         const packages = await db.collection<Package>("packages")
//           .find({ tourId: tour._id })
//           .limit(4) // Limit packages per tour for better display
//           .toArray()

//         return {
//           ...tour,
//           packages: packages
//         }
//       })
//     )

//     // Get all categories for sidebar
//     const allCategories = await db.collection<Category>("categories")
//       .find({})
//       .toArray()

//     return {
//       category: JSON.parse(JSON.stringify(category)),
//       tours: JSON.parse(JSON.stringify(toursWithPackages)),
//       allCategories: JSON.parse(JSON.stringify(allCategories))
//     }
//   } catch (error) {
//     console.error("Error fetching category data:", error)
//     return null
//   }
// }

const LANGS = ["en", "fr", "es"]

export default function CategoryPage({ params }: PageProps) {
  const [lang, setLang] = useState("en")
  const [category, setCategory] = useState<any>(null)
  const [tours, setTours] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/client/category/${params.categorySlug}`).then(res => res.json()),
      fetch(`/api/client/categories`).then(res => res.json()),
      fetch(`/api/client/tours?category=${params.categorySlug}`).then(res => res.json()),
    ]).then(([catData, allCatData, toursData]) => {
      setCategory({
        ...catData,
        title: catData.title?.[lang] || catData.title?.en || "",
        description: catData.description?.[lang] || catData.description?.en || "",
        shortDescription: catData.shortDescription?.[lang] || catData.shortDescription?.en || "",
      })
      setCategories((allCatData.categories || []).map((cat: any) => ({
        ...cat,
        title: cat.title?.[lang] || cat.title?.en || "",
      })))
      setTours((toursData.tours || []).map((tour: any) => ({
        ...tour,
        title: tour.title?.[lang] || tour.title?.en || "",
        description: tour.description?.[lang] || tour.description?.en || "",
      })))
      setLoading(false)
    })
  }, [lang, params.categorySlug])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!category) {
    notFound()
  }

  return (
    <div>
      {/* Language Switcher */}
      <div className="flex gap-2 mb-4">
        {LANGS.map(l => (
          <Button key={l} variant={l === lang ? "default" : "outline"} onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </Button>
        ))}
      </div>
      <CategoryToursPage
        category={category}
        tours={tours}
        allCategories={categories}
      />
    </div>
  )
}

// export async function generateMetadata({ params }: PageProps) {
//   const data = await getCategoryData(params.categorySlug)

//   if (!data) {
//     return {
//       title: "Category Not Found"
//     }
//   }

//   return {
//     title: `${data.category.title} Tours - Morocco Adventures`,
//     description: data.category.description,
//   }
// }

// export async function generateStaticParams() {
//   try {
//     const db = await getDatabase()
//     const categories = await db.collection<Category>("categories").find({}).toArray()

//     return categories.map((category) => ({
//       slug: category.slug,
//     }))
//   } catch (error) {
//     console.error("Error generating static params:", error)
//     return []
//   }
// }