import { getDatabase } from "@/lib/mongodb"
import type { Tour, Category } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, FolderOpen, Tag } from "lucide-react"
import { DeleteButton } from "@/components/admin/DeleteButton"

async function getToursWithCategories() {
  try {
    const db = await getDatabase()
    const tours = await db.collection<Tour>("tours").find({}).sort({ createdAt: -1 }).toArray()
    const categories = await db.collection<Category>("categories").find({}).sort({ title: 1 }).toArray()

    const toursWithCategories = tours.map((tour) => {
      const category = categories.find((cat) => cat._id?.toString() === tour.categoryId?.toString())
      return {
        ...tour,
        categoryName: category?.title || "Unknown",
        categoryId: category?._id?.toString() || "",
      }
    })

    return { tours: toursWithCategories, categories }
  } catch (error) {
    console.error("Error fetching tours:", error)
    return { tours: [], categories: [] }
  }
}

export default async function ToursPage() {
  const { tours, categories } = await getToursWithCategories()

  // Group tours by category
  const groupedTours = categories.map((category) => ({
    ...category,
    tours: tours.filter((tour) => tour.categoryId === category._id?.toString()),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tours by Category</h1>
            <p className="text-slate-500">Browse and manage tours organized by category</p>
          </div>
          <Link href="/desert26safariadmin/tours/new">
            <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Tour
            </Button>
          </Link>
        </div>

        {
          groupedTours.length?  groupedTours.map((category) => (
          <div key={category._id?.toString()} className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                {category.title}
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {category.tours.length} {category.tours.length === 1 ? "tour" : "tours"}
              </Badge>
            </h2>

            {category.tours.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.tours.map((tour) => (
                  <Card key={tour._id?.toString()} className="overflow-hidden shadow-lg border-0 rounded-2xl hover:shadow-xl transition-all">
                    <div className="relative h-48">
                      <Image
                        src={
                          tour.images[0] ||
                          `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(tour.title || "tour")}`
                        }
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-800 rounded-full px-3 py-1">
                          {tour.packages?.length || 0} {tour.packages?.length === 1 ? "package" : "packages"}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="line-clamp-1 text-slate-800 text-lg">{tour.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Link href={`/desert26safariadmin/tours/${tour._id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-300 hover:bg-slate-50">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <DeleteButton notAllow={tour.packages.length!=0} type="tours" id={tour._id.toString()} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No tours available in this category.</p>
            )}
          </div>
        )):
         <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
              <CardHeader className="pb-3 border-b border-blue-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  No Tours Found
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <FolderOpen className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No tours yet</h3>
              <p className="text-slate-500 text-center mb-6 max-w-md">
                Get started by creating your first travel Tour to organize your packages
              </p>
              <Link href="/desert26safariadmin/tours/new">
                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Tour
                </Button>
              </Link>
            </CardContent>
          </Card>   
        }
      </div>
    </div>
  )
}
