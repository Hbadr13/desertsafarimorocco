"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Tag,
  Type,
  FileText,
  AlignLeft,
  Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NewCategoryPage() {
  const [formData, setFormData] = useState({
    title: { en: "", fr: "", es: "" },
    shortDescription: { en: "", fr: "", es: "" },
    description: { en: "", fr: "", es: "" },
    slug: "",
  })
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "slug" && {
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }),
    }))
  }

  const handleMultiLangInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "title" | "shortDescription" | "description",
    lang: "en" | "fr" | "es"
  ) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
      ...(field === "title" && lang === "en" && {
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsLoading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...uploadedUrls])
    } catch (error) {
      setError("Failed to upload images")
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = async (index: number) => {
    try {
      const url = images[index]
      if (!url) return
      setIsLoading(true)

      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Failed to delete images")
      setImages((prev) => prev.filter((_, i) => i !== index))

    } catch (error) {
      setError("Failed to delete images")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          shortDescription: formData.shortDescription,
          description: formData.description,
          slug: formData.slug,
          images,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create category")
      }

      router.push("/desert26safariadmin/categories")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-2 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/desert26safariadmin/categories">
            <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm border-slate-200 hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create New Category</h1>
            <p className="text-slate-500">Add a new travel category to your collection</p>
          </div>
        </div>

        <Card className="shadow-lg rounded-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <CardHeader className="pb-3 border-b border-blue-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Category Details
              </CardTitle>
              <CardDescription className="text-blue-100/80">
                Fill in the information for the new category
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className=" p-2.5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Title
                </Label>
                <div className="grid grid-cols-1  gap-4">
                  <Input
                    id="title-en"
                    name="title-en"
                    value={formData.title.en}
                    onChange={(e) => handleMultiLangInputChange(e, "title", "en")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="Title (English)"
                  />
                  <Input
                    id="title-fr"
                    name="title-fr"
                    value={formData.title.fr}
                    onChange={(e) => handleMultiLangInputChange(e, "title", "fr")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="Titre (Français)"
                  />
                  <Input
                    id="title-es"
                    name="title-es"
                    value={formData.title.es}
                    onChange={(e) => handleMultiLangInputChange(e, "title", "es")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="Título (Español)"
                  />
                </div>
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
                  placeholder="e.g. beach-getaways"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Short Description
                </Label>
                <div className="grid grid-cols-1  gap-4">
                  <Input
                    id="shortDescription-en"
                    name="shortDescription-en"
                    value={formData.shortDescription.en}
                    onChange={(e) => handleMultiLangInputChange(e, "shortDescription", "en")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="Short Description (English)"
                  />
                  <Input
                    id="shortDescription-fr"
                    name="shortDescription-fr"
                    value={formData.shortDescription.fr}
                    onChange={(e) => handleMultiLangInputChange(e, "shortDescription", "fr")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="Description courte (Français)"
                  />
                  <Input
                    id="shortDescription-es"
                    name="shortDescription-es"
                    value={formData.shortDescription.es}
                    onChange={(e) => handleMultiLangInputChange(e, "shortDescription", "es")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="Descripción corta (Español)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <div className="grid grid-cols-1 gap-4">
                  <Textarea
                    id="description-en"
                    name="description-en"
                    rows={5}
                    value={formData.description.en}
                    onChange={(e) => handleMultiLangInputChange(e, "description", "en")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-4 px-4 min-h-[120px]"
                    placeholder="Description (English)"
                  />
                  <Textarea
                    id="description-fr"
                    name="description-fr"
                    rows={5}
                    value={formData.description.fr}
                    onChange={(e) => handleMultiLangInputChange(e, "description", "fr")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-4 px-4 min-h-[120px]"
                    placeholder="Description (Français)"
                  />
                  <Textarea
                    id="description-es"
                    name="description-es"
                    rows={5}
                    value={formData.description.es}
                    onChange={(e) => handleMultiLangInputChange(e, "description", "es")}
                    required
                    disabled={isLoading}
                    className="rounded-xl placeholder:text-gray-400/55 border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-4 px-4 min-h-[120px]"
                    placeholder="Descripción (Español)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Images
                </Label>
                <div className="h-[0.1px]"></div>
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center transition-all hover:border-blue-500 hover:bg-blue-50/50 bg-blue-50/30">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Drop images here or click to browse</p>
                        <p className="text-sm text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB each)</p>
                      </div>
                    </div>
                  </div>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </Label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group overflow-hidden rounded-xl shadow-sm border border-slate-200">
                        <div className="aspect-video relative">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Category image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full shadow-md"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Category
                    </>
                  )}
                </Button>
                <Link href="/desert26safariadmin/categories" className="flex-1">
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