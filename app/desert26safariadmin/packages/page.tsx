import { getDatabase } from "@/lib/mongodb"
import type { Package, Tour, Category } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Clock, DollarSign, FolderOpen, Tag } from "lucide-react"
import { DeleteButton } from "@/components/admin/DeleteButton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

async function getPackagesGrouped() {
  try {
    const db = await getDatabase()
    const packages = await db.collection<Package>("packages").find({}).sort({ createdAt: -1 }).toArray()
    const tours = await db.collection<Tour>("tours").find({}).toArray()
    const categories = await db.collection<Category>("categories").find({}).sort({ title: 1 }).toArray()

    const packagesWithDetails = packages.map((pkg) => {
      const tour = tours.find((t) => t._id?.toString() === pkg.tourId?.toString())
      const category = categories.find((cat) => cat._id?.toString() === tour?.categoryId?.toString())
      return {
        ...pkg,
        tourId: tour?._id?.toString(),
        tourName: tour?.title?.en || "Unknown",
        categoryId: category?._id?.toString(),
        categoryName: category?.title?.en || "Unknown",
        // Only English translation for display
        title: pkg.title || "",
        duration: pkg.duration || "",
        departure: pkg.departure || "",
      }
    })

    // Group by category > tour
    const groupedByCategory = categories.map((cat) => {
      const toursInCategory = tours.filter((t) => t.categoryId?.toString() === cat._id.toString())
      return {
        categoryId: cat._id.toString(),
        categoryName: cat.title,
        tours: toursInCategory.map((tour) => ({
          tourId: tour._id.toString(),
          tourName: tour.title,
          packages: packagesWithDetails.filter((p) => p.tourId === tour._id.toString()),
        })),
      }
    })

    return groupedByCategory
  } catch (error) {
    console.error("Error fetching packages:", error)
    return []
  }
}

export default async function PackagesPage() {
  const groupedCategories = await getPackagesGrouped()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className=" text-lg md:text-3xl font-bold text-slate-800">Packages by Category</h1>
            <p className="text-slate-500 text-sm md:text-base">Browse and manage packages organized by category and tour</p>
          </div>
          <Link href="/desert26safariadmin/packages/new">
            <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </Link>
        </div>

        {/* Categories Accordion */}
        <Accordion type="multiple" className="space-y-6 ">
          {groupedCategories.length ? groupedCategories.map((category) => (
            <AccordionItem key={category.categoryId} value={category.categoryId}>
              <AccordionTrigger className=" bg-gray-200/60 px-4 rounded-xl py-2 mb-2  text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="space-x-3 ">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {category.categoryName.en}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {category.tours.reduce((sum, t) => sum + t.packages.length, 0)} packages
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                {

                  category.tours.length > 0 ? category.tours.map((tour) => (
                    <div key={tour.tourId} className="space-y-3">
                      <h3 className="text-lg font-medium text-slate-700 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                          {tour.tourName.en}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {tour.packages.length} {tour.packages.length === 1 ? "package" : "packages"}
                        </Badge>
                      </h3>

                      {tour.packages.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {tour.packages.map((pkg) => (
                            <Card
                              key={pkg._id?.toString()}
                              className="overflow-hidden shadow-lg border-0 rounded-2xl hover:shadow-xl transition-all"
                            >
                              <div className="relative h-48">
                                <Image
                                  src={
                                    pkg.images?.[0] ||
                                    `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(pkg.title.en.toString() || "package")}`
                                  }
                                  alt={pkg.title.en}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-white/90 backdrop-blur-sm text-slate-800 rounded-full px-3 py-1"
                                  >
                                    <Clock className="w-3 h-3 mr-1" />
                                    {pkg.duration.en}
                                  </Badge>
                                </div>
                              </div>

                              <CardHeader className="pb-3">
                                <CardTitle className="line-clamp-1 text-slate-800 text-lg">{pkg.title.en}</CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0 space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Departure:</span>
                                  <span className="font-medium">{pkg.departure.en}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Location:</span>
                                  <span className="font-medium">{pkg.location.en}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {pkg.shareTrip && <div className="flex items-center">
                                    <DollarSign className="w-3 h-3 mr-1 text-muted-foreground" />
                                    <span className="text-muted-foreground">Shared:</span>
                                    <span className="font-semibold ml-1">${pkg.shareTrip}</span>
                                  </div>}
                                  {pkg.privateTrip && <div className="flex items-center">
                                    <DollarSign className="w-3 h-3 mr-1 text-muted-foreground" />
                                    <span className="text-muted-foreground">Private:</span>
                                    <span className="font-semibold ml-1">${pkg.privateTrip}</span>
                                  </div>}
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Link href={`/desert26safariadmin/packages/${pkg._id}/edit`} className="flex-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full rounded-xl border-slate-300 hover:bg-slate-50"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Button>
                                  </Link>
                                  <DeleteButton notAllow={false} type="packages" id={pkg._id.toString()} />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500">No packages available in this tour.</p>
                      )}
                    </div>
                  )) : <p className="text-slate-500">No tours available in this category.</p>


                }
              </AccordionContent>
            </AccordionItem>
          )) :

            <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
                <CardHeader className="pb-3 border-b border-blue-500/20">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    No Packages Found
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-blue-100 rounded-full mb-4">
                  <FolderOpen className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No Packages yet</h3>
                <p className="text-slate-500 text-center mb-6 max-w-md">
                  Get started by creating your first travel package
                </p>
                <Link href="/desert26safariadmin/tours/new">
                  <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Package
                  </Button>
                </Link>
              </CardContent>
            </Card>


          }
        </Accordion>
      </div>
    </div>
  )
}
