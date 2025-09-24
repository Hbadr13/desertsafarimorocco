// app/categories/[slug]/page.tsx
import { getDatabase } from "@/lib/mongodb"
import { notFound } from "next/navigation"
import { Category, Package, Tour } from "@/lib/models"
import { CategoryToursPage } from "@/components/CategoryToursPage"

interface PageProps {
  params: {
    categorySlug: string
  }
}

async function getCategoryData(categorySlug: string) {
  try {
    const db = await getDatabase()

    // Get the category by slug
    const category = await db.collection<Category>("categories").findOne({ slug: categorySlug })

    if (!category) {
      return null
    }

    // Get all tours for this category
    const tours = await db.collection<Tour>("tours")
      .find({ categoryId: category._id })
      .toArray()

    // Get packages for each tour
    const toursWithPackages = await Promise.all(
      tours.map(async (tour) => {
        const packages = await db.collection<Package>("packages")
          .find({ tourId: tour._id })
          .limit(4) // Limit packages per tour for better display
          .toArray()

        return {
          ...tour,
          packages: packages
        }
      })
    )

    // Get all categories for sidebar
    const allCategories = await db.collection<Category>("categories")
      .find({})
      .toArray()

    return {
      category: JSON.parse(JSON.stringify(category)),
      tours: JSON.parse(JSON.stringify(toursWithPackages)),
      allCategories: JSON.parse(JSON.stringify(allCategories))
    }
  } catch (error) {
    console.error("Error fetching category data:", error)
    return null
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const data = await getCategoryData(params.categorySlug)

  if (!data) {
    notFound()
  }

  return <CategoryToursPage {...data} />
}

export async function generateMetadata({ params }: PageProps) {
  const data = await getCategoryData(params.categorySlug)

  if (!data) {
    return {
      title: "Category Not Found"
    }
  }

  return {
    title: `${data.category.title} Tours - Morocco Adventures`,
    description: data.category.description,
  }
}

export async function generateStaticParams() {
  try {
    const db = await getDatabase()
    const categories = await db.collection<Category>("categories").find({}).toArray()

    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}