import { type NextRequest, NextResponse } from "next/server"
import { uploadImage, deleteImage, extractPublicId } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const url = await uploadImage(file)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    const publicId = extractPublicId(url)
    await deleteImage(`tourist-website/${publicId}`)

    return NextResponse.json({ message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
