import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"
import { Tour } from "@/lib/models"
import { deleteImage, extractPublicId } from "@/lib/cloudinary"


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const token = req.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const decoded = verifyToken(token)
    if (!decoded || !["admin", "editor"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDatabase()
    const tours  = await db.collection("tours").findOne({ _id: new ObjectId(params.id) })
    if (!tours) {
      return NextResponse.json({ error: "tours not found" }, { status: 404 })
    }


    return NextResponse.json(tours)
  } catch (error) {
    console.error("Error find category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !["admin", "editor"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const {  title, description,shortDescription, slug, categoryId, images } = await request.json()

    if (  !title || !description || !shortDescription || !slug || !categoryId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const db = await getDatabase()

    const existingTour = await db.collection<Tour>("tours").findOne({ slug })
    if (existingTour && existingTour._id.toString() !== params.id) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    const category = await db.collection("categories").findOne({ _id: new ObjectId(categoryId) })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const newTour = {
      title,
      description,
      shortDescription,
      slug,
      categoryId: new ObjectId(categoryId),
      images: images || [],
      updatedAt: new Date(),
    }

    const result = await db.collection<Tour>("tours").updateOne({_id: new ObjectId(params.id)},
       { $set: newTour}
    )
    return NextResponse.json({
      message: "Tour created successfully",
      tour: { ...newTour, _id: params.id },
    })
  } catch (error) {
    console.error("Error creating tour:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const token = req.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const decoded = verifyToken(token)
    if (!decoded || !["admin", "editor"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDatabase()
    const tour = await db.collection("tours").findOne({ _id: new ObjectId(params.id) })
    if (!tour) {
          return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }
    const category = await db.collection("categories").findOne({ _id: tour.categoryId })
    
    if(category){
            const updatedtours = (category.tours || []).filter(
              (pId:any) => pId.toString() !== params.id
            )
            await db
              .collection("categories")
              .updateOne({ _id: new ObjectId(category._id) }, { $set: { tours: updatedtours } })
    }
    if (tour.images && Array.isArray(tour.images)) {
          for (const url of tour.images) {
            try {
                const publicId = extractPublicId(url)
                await deleteImage(`tourist-website/${publicId}`)
              } catch (err) {
                console.error("Failed to delete image:", url, err)
              }
          }
    }


    const { deletedCount } = await db.collection("tours").deleteOne({ _id: new ObjectId(params.id) })

    if (deletedCount === 0) {
      return NextResponse.json({ error: "tour not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "tour deleted successfully" })
  } catch (error) {
    console.error("Error deleting tour:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
