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

    const body = await request.json()

    const {
      title,
      shortDescription,
      slug,
      images,
      duration,
      departureTime,
      departure,
      shareTrip,
      privateTrip,
      location,
      description,
      itinerary,
      toursIncluded,
      toursExcluded,
      tourId,
    } = body

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
    const newPackage: Package = {
      title, // { en, fr, es }
      shortDescription, // { en, fr, es }
      slug,
      images: images || [],
      duration, // { en, fr, es }
      departureTime,
      departure, // { en, fr, es }
      location, // { en, fr, es }
      shareTrip: Number(shareTrip),
      privateTrip: Number(privateTrip),
      description, // { en, fr, es }
      itinerary: itinerary || [], // [{ title: { en, fr, es }, description: { en, fr, es } }]
      toursIncluded: toursIncluded || [], // [{ description: { en, fr, es } }]
      toursExcluded: toursExcluded || [], // [{ description: { en, fr, es } }]
      tourId: new ObjectId(tourId),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Package>("packages").insertOne(newPackage)

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
