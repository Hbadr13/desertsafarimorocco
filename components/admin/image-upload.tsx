"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({ images, onImagesChange, maxImages = 10, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setIsUploading(true)
    setError("")

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
      onImagesChange([...images, ...uploadedUrls])
    } catch (error) {
      setError("Failed to upload images")
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = async (index: number) => {
    const imageUrl = images[index]

    // Remove from Cloudinary
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      })
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error)
    }

    // Remove from state
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
            <Label htmlFor="images" className="cursor-pointer">
      <div className="border-2 border-dashed border-blue-300 rounded-2xl  p-6">
        <div className="text-center">
          <div className="w-full flex justify-center items-center">

              <div className="p-3 bg-blue-100 rounded-full w-min">
                        <Upload className="h-8 w-8 text-blue-600" />
                </div>
          </div>
            <div className="mt-4">
              <div className="">

              <span className="mt-2 block text-sm font-medium text-muted-foreground">
                {isUploading ? "Uploading..." : "Click to upload images"}
              </span>
              <span className="text-xs text-muted-foreground">
                {images.length}/{maxImages} images uploaded
              </span>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={disabled || isUploading}
              />
                </div>
          </div>
        </div>
      </div>
            </Label>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isUploading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Uploading images...</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                width={200}
                height={150}
                className="object-cover rounded-xl w-full h-32"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
