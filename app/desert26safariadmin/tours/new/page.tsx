"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Loader2, 
  Tag,
  Type,
  FileText,
  Link as LinkIcon,
  FolderOpen,
  AlignLeft
} from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"

interface Category {
  _id: string
  name: string
  title: string
}

export default function NewTourPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    slug: "",
    categoryId: "",
  })
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && {
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create tour")
      }

      router.push("/desert26safariadmin/tours")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/desert26safariadmin/tours">
            <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm border-slate-200 hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create New Tour</h1>
            <p className="text-slate-500">Add a new travel tour to your collection</p>
          </div>
        </div>

        <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <CardHeader className="pb-3 border-b border-blue-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Tour Details
              </CardTitle>
              <CardDescription className="text-blue-100/80">
                Fill in the information for the new tour
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-slate-700 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl">
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id} className="py-3 cursor-pointer">
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

               

              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                  placeholder="e.g. Amazing Bali Beach Getaway"
                />
              </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-slate-700 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4 bg-slate-50"
                    placeholder="e.g. bali-beach-escape"
                  />
                </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-slate-700 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Short Description
                </Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                  placeholder="Brief description of the category"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-4 px-4 min-h-[120px]"
                  placeholder="Detailed description of the tour..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-2">
                  Images
                </Label>
                <ImageUpload images={images} onImagesChange={setImages} disabled={isLoading} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.categoryId}
                  className="rounded-xl py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Tour
                    </>
                  )}
                </Button>
                <Link href="/desert26safariadmin/tours" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isLoading}
                    className="w-full rounded-xl py-5 border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}