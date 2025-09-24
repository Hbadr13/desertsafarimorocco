import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Package } from "@/lib/models"
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
    const packages = await db.collection<Package>("packages").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ packages })
  } catch (error) {
    console.error("Error fetching packages:", error)
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

    const {
      title,
      slug,
      images,
      duration,
      departure,
      shareTrip,
      privateTrip,
      departureTime,
      description,
      itinerary,
      toursIncluded,
      toursExcluded,
      tourId,
    } = await request.json()

    if (
      !title ||
      !slug ||
      !duration ||
      !departure ||
      !shareTrip ||
      !privateTrip ||
      !departureTime ||
      !description ||
      !tourId
    ) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const db = await getDatabase()

    // Verify tour exists
    const tour = await db.collection("tours").findOne({ _id: new ObjectId(tourId) })
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }

    const newPackage: Package = {
      title,
      slug,
      images: images || [],
      duration,
      departure,
      shareTrip: Number(shareTrip),
      privateTrip: Number(privateTrip),
      departureTime,
      description,
      itinerary: itinerary || [],
      toursIncluded: toursIncluded || [],
      toursExcluded: toursExcluded || [],
      tourId: new ObjectId(tourId),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Package>("packages").insertOne(newPackage)

    // Update tour to include this package
    await db.collection("tours").updateOne({ _id: new ObjectId(tourId) }, { $push: { packages: result.insertedId } })

    return NextResponse.json({
      message: "Package created successfully",
      package: { ...newPackage, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
