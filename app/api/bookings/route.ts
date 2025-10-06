import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Booking, Package } from "@/lib/models"
import { ObjectId } from "mongodb"
import {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const {
      packageId,
      packageName,
      packageType,
      startDate,
      name,
      email,
      phone,
      notes,
      adults,
      children,
      totalPrice,
      lang,
      timestamp
    } = await request.json()

    if (!packageId || !packageName || !startDate || !name || !email || !phone || !adults) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const packageDetails = await db.collection<Package>("packages").findOne({
      _id: new ObjectId(packageId)
    })

    if (!packageDetails) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      )
    }

    const newBooking: Booking = {
      packageId: new ObjectId(packageId),
      packageName,
      packageType: packageType || 'shared',
      packageSlug: packageDetails.slug,
      email,
      startDate: start,
      name,
      phone,
      adults: parseInt(adults),
      children: parseInt(children) || 0,
      totalPrice: parseFloat(totalPrice) || 0,
      notes: notes || "",
      lang: lang || "en",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Booking>("bookings").insertOne(newBooking)

    const bookingDetails = {
      name,
      email,
      phone,
      packageTitle: packageName,
      packageType: packageType || 'shared',
      startDate: startDate,
      adults: parseInt(adults),
      children: parseInt(children) || 0,
      totalPrice: parseFloat(totalPrice) || -1,
      notes: notes || "",
      packageUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/packages/${packageDetails.slug}`,
      lang: lang || "en"
    }

    try {
      await sendBookingConfirmationEmail(email, bookingDetails)
    } catch (error) {
      console.error("Failed to send customer confirmation email:", error)
    }

    try {
      await sendAdminNotificationEmail(bookingDetails)
    } catch (error) {
      console.error("Failed to send admin notification email:", error)
    }

    return NextResponse.json({
      message: "Booking submitted successfully",
      booking: { ...newBooking, _id: result.insertedId },
    })

  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const bookings = await db.collection<Booking>("bookings").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
