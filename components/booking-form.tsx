"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users, Mail, User, MessageSquare, Loader2, CheckCircle, Phone } from "lucide-react"

interface BookingFormProps {
  packageId: string
}

export default function BookingForm({ packageId }: BookingFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    tripStart: "",
    tripEnd: "",
    name: "",
    guests: 1,
    adults: 1,
    children: 0,
    message: "",
    phone: "", // Added phone field for SMS notifications
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    // Update total guests
    const totalGuests = formData.adults + formData.children
    const bookingData = {
      ...formData,
      guests: totalGuests,
      packageId,
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit booking")
      }

      setSuccess(true)
      setFormData({
        email: "",
        tripStart: "",
        tripEnd: "",
        name: "",
        guests: 1,
        adults: 1,
        children: 0,
        message: "",
        phone: "",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Booking Submitted!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your booking request. We've sent you a confirmation email and will contact you soon to confirm
          your trip details.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          Book Another Trip
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone (Optional)
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="+1 (555) 123-4567"
        />
        <p className="text-xs text-muted-foreground">We'll send you SMS updates about your booking</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tripStart" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Trip Start
          </Label>
          <Input
            id="tripStart"
            name="tripStart"
            type="date"
            value={formData.tripStart}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tripEnd" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Trip End
          </Label>
          <Input
            id="tripEnd"
            name="tripEnd"
            type="date"
            value={formData.tripEnd}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          placeholder="John Doe"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adults" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Adults
          </Label>
          <Input
            id="adults"
            name="adults"
            type="number"
            min="1"
            value={formData.adults}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="children" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Children
          </Label>
          <Input
            id="children"
            name="children"
            type="number"
            min="0"
            value={formData.children}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Message (Optional)
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Any special requests or questions..."
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Book Now
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        By booking, you agree to our terms and conditions. We'll send you email and SMS confirmations.
      </p>
    </form>
  )
}
