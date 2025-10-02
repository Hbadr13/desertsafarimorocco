


import { getDatabase } from "@/lib/mongodb"
import type { Category } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, FolderOpen, Tag, ArrowRight } from "lucide-react"
import { DeleteButton } from "@/components/admin/DeleteButton"

async function getCategories() {
  try {
    const db = await getDatabase()
    const categories = await db.collection<Category>("categories").find({}).sort({ createdAt: -1 }).toArray()
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Categories</h1>
            <p className="text-slate-500">Manage your travel categories</p>
          </div>
          <Link href="/desert26safariadmin/categories/new">
            <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category._id?.toString()} className="overflow-hidden shadow-lg border-0 rounded-2xl transition-all hover:shadow-xl">
                <div className="relative h-48">
                  <Image
                    src={
                      category.images[0] ||
                      `/placeholder.svg?height=300&width=400&query=${category.title.en || "/placeholder.svg"} travel category`
                    }
                    alt={category.title.en}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-800 rounded-full px-3 py-1">
                      {category.tours?.length || 0} {category.tours?.length === 1 ? 'tour' : 'tours'}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 text-lg">{category.title.en}</CardTitle>
                  <CardDescription className="line-clamp-2 text-slate-600">
                    {category.shortDescription.en || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Link href={`/desert26safariadmin/categories/${category._id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-300 hover:bg-slate-50">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteButton notAllow={category.tours.length != 0} type="categories" id={category._id.toString()} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
              <CardHeader className="pb-3 border-b border-blue-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  No Categories Found
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <FolderOpen className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No categories yet</h3>
              <p className="text-slate-500 text-center mb-6 max-w-md">
                Get started by creating your first travel category to organize your tours
              </p>
              <Link href="/desert26safariadmin/categories/new">
                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Category
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}