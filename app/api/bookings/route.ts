import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Booking, Package } from "@/lib/models"
import { ObjectId } from "mongodb"
import {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
  sendBookingConfirmationSMS,
} from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const { packageId, email, tripStart, tripEnd, name, guests, adults, children, message, phone } =
      await request.json()

    if (!packageId || !email || !tripStart || !tripEnd || !name || !guests || !adults) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Validate dates
    const startDate = new Date(tripStart)
    const endDate = new Date(tripEnd)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return NextResponse.json({ error: "Trip start date cannot be in the past" }, { status: 400 })
    }

    if (endDate <= startDate) {
      return NextResponse.json({ error: "Trip end date must be after start date" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get package details for notifications
    const packageDetails = await db.collection<Package>("packages").findOne({ _id: new ObjectId(packageId) })
    if (!packageDetails) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    const newBooking: Booking = {
      packageId: new ObjectId(packageId),
      email,
      tripStart: startDate,
      tripEnd: endDate,
      name,
      guests,
      adults,
      children,
      message: message || "",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Booking>("bookings").insertOne(newBooking)

    // Send notifications
    const bookingDetails = {
      name,
      email,
      packageTitle: packageDetails.title,
      tripStart,
      tripEnd,
      guests,
      adults,
      children,
      message,
    }

    // Send confirmation email to customer
    try {
      await sendBookingConfirmationEmail(email, bookingDetails)
    } catch (error) {
      console.error("Failed to send customer confirmation email:", error)
    }

    // Send notification email to admin
    try {
      await sendAdminNotificationEmail(bookingDetails)
    } catch (error) {
      console.error("Failed to send admin notification email:", error)
    }

    // Send SMS if phone number provided
    if (phone) {
      try {
        await sendBookingConfirmationSMS(phone, bookingDetails)
      } catch (error) {
        console.error("Failed to send SMS:", error)
      }
    }

    return NextResponse.json({
      message: "Booking submitted successfully",
      booking: { ...newBooking, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
