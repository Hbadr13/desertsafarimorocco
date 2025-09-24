import type { ObjectId } from "mongodb"

export interface Category {
  _id?: ObjectId
  title: string
  shortDescription: string
  description: string
  slug: string
  images: string[]
  tours: ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Tour {
  _id?: ObjectId
  title: string
  description: string
  shortDescription: string
  images: string[]
  slug: string
  packages: ObjectId[]
  categoryId: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export interface Package {
  _id?: ObjectId
  title: string
  slug: string
  images: string[]
  duration: string
  departure: string
  shareTrip: number
  privateTrip: number
  departureTime: string
  description: string
  itinerary: { day: number, title: string, description: string }[]
  toursIncluded: string[]
  toursExcluded: string[]
  tourId: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  _id?: ObjectId
  name: string
  email: string
  image?: string
  role: "admin" | "editor"
  password: string
  resetToken?: string
  resetTokenExpiry?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface Booking {
  _id?: ObjectId
  packageId: ObjectId
  email: string
  tripStart: Date
  tripEnd: Date
  name: string
  guests: number
  adults: number
  children: number
  message?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt?: Date
  updatedAt?: Date
}
