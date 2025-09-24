"use client"

import type React from "react"
import { useState, useEffect, Fragment } from "react"
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
  Upload,
  X,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  FileText,
  List,
  Type,
  Link as LinkIcon,
  Package,
  Plus,
  TimerIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Tour {
  _id: string
  title: string
  name: string
  categoryName: string
}

interface ItineraryItem {
  day: string
  title: string
  description: string
}

export default function NewPackagePage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    duration: "",
    departureTime: "",
    departure: "",
    shareTrip: "",
    privateTrip: "",
    description: "",
    tourId: "",
  })
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([{ day: "", title: "", description: "" }])
  const [toursIncluded, setToursIncluded] = useState<string[]>([""])
  const [toursExcluded, setToursExcluded] = useState<string[]>([""])
  const [images, setImages] = useState<string[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchTours()
  }, [])

  const [groupedTours, setGroupedTours] = useState<Record<string, Tour[]>>({})

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/admin/tours")
      if (response.ok) {
        const data: { tours: Tour[] } = await response.json()
        const groups: Record<string, Tour[]> = {}
        data.tours.forEach(tour => {
          const catName = tour.categoryName || "Uncategorized"
          if (!groups[catName]) groups[catName] = []
          groups[catName].push(tour)
        })
        setGroupedTours(groups)
      }
    } catch (error) {
      console.error("Error fetching tours:", error)
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

  const handleItineraryChange = (index: number, field: keyof ItineraryItem, value: string) => {
    const newItinerary = [...itinerary]
    newItinerary[index] = { ...newItinerary[index], [field]: value }
    setItinerary(newItinerary)
  }

  const addItineraryItem = () => {
    setItinerary([...itinerary, { day: "", title: "", description: "" }])
  }

  const removeItineraryItem = (index: number) => {
    if (itinerary.length > 1) {
      setItinerary(itinerary.filter((_, i) => i !== index))
    }
  }

  const handleTourIncludedChange = (text: string, index: number) => {
    const newTourIncluded = [...toursIncluded]
    newTourIncluded[index] = text
    setToursIncluded(newTourIncluded)
  }

  const addTourIncluded = () => {
    setToursIncluded([...toursIncluded, ""])
  }

  const removeTourIncluded = (index: number) => {
    if (toursIncluded.length > 1) {
      setToursIncluded(toursIncluded.filter((_, i) => i !== index))
    }
  }
  const handleTourExcludedChange = (text: string, index: number) => {
    const newTourExcluded = [...toursExcluded]
    newTourExcluded[index] = text
    setToursExcluded(newTourExcluded)
  }

  const addTourExcluded = () => {
    setToursExcluded([...toursExcluded, ""])
  }

  const removeTourExcluded = (index: number) => {
    if (toursExcluded.length > 1) {
      setToursExcluded(toursExcluded.filter((_, i) => i !== index))
    }
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
      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images,
          itinerary: itinerary.filter(item => item.day && item.title),
          toursIncluded: toursIncluded,
          toursExcluded: toursExcluded,
          shareTrip: Number(formData.shareTrip),
          privateTrip: Number(formData.privateTrip),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create package")
      }

      router.push("/desert26safariadmin/packages")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/desert26safariadmin/packages">
            <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm border-slate-200 hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create New Package</h1>
            <p className="text-slate-500">Add a new travel package to your collection</p>
          </div>
        </div>

        <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <CardHeader className="pb-3 border-b border-blue-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                Package Details
              </CardTitle>
              <CardDescription className="text-blue-100/80">
                Fill in the information for the new package
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
                <Label htmlFor="tourId" className="text-slate-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Select Tour
                </Label>
                <Select
                  value={formData.tourId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tourId: value }))}
                >
                  <SelectTrigger className="rounded-xl py-5 px-4">
                    <SelectValue className="placeholder:text-gray-300" placeholder="Select a tour" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl">
                    {Object.entries(groupedTours).map(([categoryName, tours]) => (
                      <Fragment key={categoryName}>
                        <div className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100">
                          {categoryName}
                        </div>
                        {tours.map((tour) => (
                          <SelectItem key={tour._id} value={tour._id} className="pl-6 py-2 cursor-pointer">
                            {tour.title}
                          </SelectItem>
                        ))}
                      </Fragment>
                    ))}
                  </SelectContent>
                </Select>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-700 flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Package Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="placeholder:text-gray-400/55 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="e.g. Premium Bali Experience"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Duration (days)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="placeholder:text-gray-400/55 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="e.g. 7"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <Label htmlFor="departure" className="text-slate-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Departure Time
                  </Label>
                  <Input
                    id="departureTime"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="placeholder:text-gray-400/55 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure" className="text-slate-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Departure Location
                  </Label>
                  <Input
                    id="departure"
                    name="departure"
                    value={formData.departure}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="placeholder:text-gray-400/55 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shareTrip" className="text-slate-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Share Trip Price ($)
                  </Label>
                  <Input
                    id="shareTrip"
                    name="shareTrip"
                    type="number"
                    min="0"
                    value={formData.shareTrip}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="placeholder:text-gray-400/55 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="e.g. 999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privateTrip" className="text-slate-700 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Private Trip Price ($)
                  </Label>
                  <Input
                    id="privateTrip"
                    name="privateTrip"
                    type="number"
                    min="0"
                    value={formData.privateTrip}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="placeholder:text-gray-400/55 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-5 px-4"
                    placeholder="e.g. 1499"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Full Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="placeholder:text-gray-400/55 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 py-4 px-4 min-h-[120px]"
                  placeholder="Detailed description of the package..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700 flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Itinerary
                  </Label>
                  <button
                    className="rounded-[4px] text-xs py-1 px-1 active:opacity-50 active:scale-[101%] transition-all duration-200 text-white bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-400 hover:to-indigo-500  shadow-md hover:shadow-lg"

                    type="button" onClick={addItineraryItem}
                  >
                    <div className="flex items-center">
                      <div className="">
                        Add Day
                      </div>
                      <Plus width={14} />
                    </div>
                  </button>
                </div>
                <div className="border border-slate-200 rounded-xl">
                  {itinerary.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4  ">
                      <div className="md:col-span-1">
                        <Label htmlFor={`day-${index}`}>Day</Label>
                        <Input
                          id={`day-${index}`}
                          value={item.day}
                          onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                          placeholder="Day #"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl placeholder:text-gray-400/55"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        <Input
                          id={`title-${index}`}
                          value={item.title}
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                          placeholder="Activity title"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl placeholder:text-gray-400/55"
                        />
                      </div>
                      <div className="md:col-span-6">
                        <Label htmlFor={`desc-${index}`}>Description</Label>
                        <Textarea
                          id={`desc-${index}`}
                          value={item.description}
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                          placeholder="Day description"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl min-h-[80px] placeholder:text-gray-400/55"
                        />
                      </div>
                      <div className="md:col-span-1 flex items-end h-full">
                        {itinerary.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeItineraryItem(index)}
                            className="rounded-full h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-slate-300 rounded-xl p-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-700 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Tour Details
                    </Label>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        What is included?
                      </Label>
                      <button
                        className="rounded-[4px] text-xs py-1 px-1 active:opacity-50 active:scale-[101%] transition-all duration-200 text-white bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-400 hover:to-indigo-500  shadow-md hover:shadow-lg"

                        type="button" onClick={addTourIncluded}
                      >
                        <div className="flex items-center">
                          <div className="">
                            Add Detail
                          </div>
                          <Plus width={14} />
                        </div>
                      </button>
                    </div>
                    {toursIncluded.map((detail, index) => (
                      <div key={index} className=" items-start p-4 ">
                        <div className="md:col-span-7">
                          <Textarea
                            id={`detail-desc-${index}`}
                            value={detail}
                            onChange={(e) => handleTourIncludedChange(e.target.value, index)}
                            placeholder="Detail description"
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl min-h-[80px] placeholder:text-gray-400/55"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end h-full">
                          {toursIncluded.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeTourIncluded(index)}
                              className="rounded-full h-8 w-8 placeholder:text-gray-400/55"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border border-slate-200 rounded-xl p-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        What is excluded?
                      </Label>
                      <button
                        className="rounded-[4px] text-xs py-1 px-1 active:opacity-50 active:scale-[101%] transition-all duration-200 text-white bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-400 hover:to-indigo-500  shadow-md hover:shadow-lg"

                        type="button" onClick={addTourExcluded}
                      >
                        <div className="flex items-center">
                          <div className="">
                            Add Detail
                          </div>
                          <Plus width={14} />
                        </div>
                      </button>
                    </div>
                    {toursExcluded.map((detail, index) => (
                      <div key={index} className=" items-start p-4 ">
                        <div className="md:col-span-7">
                          <Textarea
                            id={`detail-desc-${index}`}
                            value={detail}
                            onChange={(e) => handleTourExcludedChange(e.target.value, index)}
                            placeholder="Detail description"
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl min-h-[80px] placeholder:text-gray-400/55"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end h-full">
                          {toursExcluded.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeTourExcluded(index)}
                              className="rounded-full h-8 w-8 placeholder:text-gray-400/55"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Images
                </Label>
                <div className="h-[0.1px]"></div>
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="border-2 border-dashed border-blue-300 rounded-2xl p-2 md:p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50/50 bg-blue-50/30">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Upload className=" w-4 h-4 md:h-8 md:w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="  hidden md:block text-sm md:text-xl font-medium text-slate-700">Drop images here or click to browse</p>
                        <p className="text-xs md:text-sm text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB each)</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group overflow-hidden rounded-xl shadow-sm border border-slate-200">
                        <div className="aspect-video relative">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Package image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full"
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
                  disabled={isLoading || !formData.tourId}
                  className="rounded-xl py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Package
                    </>
                  )}
                </Button>
                <Link href="/desert26safariadmin/packages" className="flex-1">
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