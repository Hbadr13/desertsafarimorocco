import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Category } from "@/lib/models"
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
    const categories = await db.collection<Category>("categories").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
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

    const {  title, shortDescription, description, slug, images } = await request.json()

    if ( !title || !shortDescription || !description || !slug) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if slug already exists
    const existingCategory = await db.collection<Category>("categories").findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    const newCategory: Category = {
      title,
      shortDescription,
      description,
      slug,
      images: images || [],
      tours: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Category>("categories").insertOne(newCategory)

    return NextResponse.json({
      message: "Category created successfully",
      category: { ...newCategory, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



