import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"
import { Category } from "@/lib/models"
import { deleteImage, extractPublicId } from "@/lib/cloudinary"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // const token = req.headers.get("authorization")?.replace("Bearer ", "")
    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const token = req.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const decoded = verifyToken(token)
    if (!decoded || !["admin", "editor"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDatabase()
    const category  = await db.collection("categories").findOne({ _id: new ObjectId(params.id) })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }


    return NextResponse.json(category)
  } catch (error) {
    console.error("Error deleting category:", error)
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
    const category = await db.collection("categories").findOne({ _id: new ObjectId(params.id) })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    if (category.images && Array.isArray(category.images)) {
      for (const url of category.images) {
        try {
            const publicId = extractPublicId(url)
            await deleteImage(`tourist-website/${publicId}`)
          } catch (err) {
            console.error("Failed to delete image:", url, err)
          }
      }
    }
    const { deletedCount } = await db.collection("categories").deleteOne({ _id: new ObjectId(params.id) })

    if (deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
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

    const {title, shortDescription, description, slug, images ,id} = await request.json()

    if (!id || !title || !shortDescription || !description || !slug) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const db = await getDatabase()


    const newCategory = {
      title,
      shortDescription,
      description,
      slug,
      images: images || [],
      updatedAt: new Date(),
    }
    const existingcategory = await db.collection<Category>("categories").findOne({ slug })
    if (existingcategory) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }
    const result = await db.collection<Category>("categories").updateOne(
      {_id: new ObjectId(id)},
       { $set: newCategory}
    )

    return NextResponse.json({
      message: "Category created successfully",
      category: { ...newCategory, _id: id },
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
