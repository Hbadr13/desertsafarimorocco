export const dynamic = "force-dynamic"

import { getDatabase } from "@/lib/mongodb"
import type { Booking } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Users, MessageSquare } from "lucide-react"

async function getBookings() {
  try {
    const db = await getDatabase()
    const bookings = await db.collection<Booking>("bookings").find({}).sort({ createdAt: -1 }).toArray()
    return bookings
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Manage customer bookings</p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking._id?.toString()}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {booking.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {booking.email}
                    </CardDescription>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Trip Start</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.tripStart).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Trip End</p>
                      <p className="text-sm text-muted-foreground">{new Date(booking.tripEnd).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Guests</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.adults} adults, {booking.children} children
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Guests</p>
                    <p className="text-sm text-muted-foreground">{booking.guests}</p>
                  </div>
                </div>

                {booking.message && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Message</p>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{booking.message}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Booked on: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact Customer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground text-center">Customer bookings will appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
