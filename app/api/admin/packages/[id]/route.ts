import { verifyToken } from "@/lib/auth"
import { deleteImage, extractPublicId } from "@/lib/cloudinary"
import { Package } from "@/lib/models"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    const pckg = await db.collection<Package>("packages").findOne({ _id: new ObjectId(params.id) })

    return NextResponse.json(pckg)
  } catch (error) {
    console.error("Error fetching package:", error)
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

    const {
      title,
      shortDescription,
      slug,
      images,
      duration,
      departure,
      shareTrip,
      privateTrip,
      departureTime,
      description,
      location,
      itinerary,
      toursIncluded,
      toursExcluded,
      tourId,
    } = await request.json()

    if (
      !title ||
      !slug ||
      !description ||
      !tourId
    ) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const db = await getDatabase()

    const tour = await db.collection("tours").findOne({ _id: new ObjectId(tourId) })
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }
    const existingPackage = await db.collection<Package>("packages").findOne({ slug })
    if (existingPackage && existingPackage._id.toString() !== params.id) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    const newPackage = {
      title,
      slug,
      images: images || [],
      duration,
      shortDescription,
      departure,
      location,
      shareTrip: Number(shareTrip),
      privateTrip: Number(privateTrip),
      departureTime,
      description,
      itinerary: itinerary || [],
      toursIncluded: toursIncluded || [],
      toursExcluded: toursExcluded || [],
      tourId: new ObjectId(tourId),
      updatedAt: new Date(),
    }

    const result = await db.collection<Package>("packages").updateOne({ _id: new ObjectId(params.id) }, { $set: newPackage })


    return NextResponse.json({
      message: "Package created successfully",
      package: { ...newPackage, _id: params.id },
    })
  } catch (error) {
    console.error("Error creating package:", error)
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

    const package_ = await db.collection("packages").findOne({ _id: new ObjectId(params.id) })
    if (!package_) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }
    const tour = await db.collection("tours").findOne({ _id: package_.tourId })

    if (tour) {
      const updatedPackages = (tour.packages || []).filter(
        (pId: any) => pId.toString() !== params.id
      )
      await db
        .collection("tours")
        .updateOne({ _id: new ObjectId(tour._id) }, { $set: { packages: updatedPackages } })
    }


    if (package_.images && Array.isArray(package_.images)) {
      for (const url of package_.images) {
        try {
          const publicId = extractPublicId(url)
          await deleteImage(`tourist-website/${publicId}`)
        } catch (err) {
          console.error("Failed to delete image:", url, err)
        }
      }
    }

    const { deletedCount } = await db.collection("packages").deleteOne({ _id: new ObjectId(params.id) })

    if (deletedCount === 0) {
      return NextResponse.json({ error: "tour not package" }, { status: 404 })
    }

    return NextResponse.json({ message: "tour deleted successfully" })
  } catch (error) {
    console.error("Error deleting tour:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
