import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Tour } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !["admin", "editor"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDatabase()
    const tours = await db.collection<Tour>("tours").find({}).sort({ createdAt: -1 }).toArray()
    const categories = await db.collection("categories").find({}).toArray()

    const toursWithCategory = tours.map(tour => {
      const category = categories.find(cat => cat._id?.toString() === tour.categoryId?.toString())
      return {
        ...tour,
        categoryName: category?.title || "Uncategorized"
      }
    })

    return NextResponse.json({ tours: toursWithCategory })
  } catch (error) {
    console.error("Error fetching tours:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !["admin", "editor"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, description, shortDescription, slug, categoryId, images } = await request.json()

    if (!title || !description || !shortDescription || !slug || !categoryId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if slug already exists
    const existingTour = await db.collection<Tour>("tours").findOne({ slug })
    if (existingTour) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    // Verify category exists
    const category = await db.collection("categories").findOne({ _id: new ObjectId(categoryId) })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const newTour: Tour = {
      title,
      description,
      shortDescription,
      slug,
      categoryId: new ObjectId(categoryId),
      images: images || [],
      packages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Tour>("tours").insertOne(newTour)

    // Update category to include this tour
    await db
      .collection("categories")
      .updateOne({ _id: new ObjectId(categoryId) }, { $push: { tours: result.insertedId } })

    return NextResponse.json({
      message: "Tour created successfully",
      tour: { ...newTour, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating tour:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
