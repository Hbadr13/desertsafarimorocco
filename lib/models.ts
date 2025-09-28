import type { ObjectId } from "mongodb"

export interface Category {
  _id?: ObjectId
  title: {
    en: String,
    fr: String,
    es: String,
  },
  shortDescription: {
    en: String,
    fr: String,
    es: String,
  }
  description: {
    en: String,
    fr: String,
    es: String,
  }
  slug: string
  images: string[]
  tours: ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Tour {
  _id?: ObjectId
  title: {
    en: String,
    fr: String,
    es: String,
  }
  description: {
    en: String,
    fr: String,
    es: String,
  }
  shortDescription: {
    en: String,
    fr: String,
    es: String,
  },
  images: string[]
  slug: string
  packages: ObjectId[]
  categoryId: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export interface Package {
  _id?: ObjectId
  title: {
    en: String,
    fr: String,
    es: String,
  }
  slug: string
  images: string[]
  duration: {
    en: String,
    fr: String,
    es: String,
  }
  departure: {
    en: String,
    fr: String,
    es: String,
  }
  shareTrip: number
  privateTrip: number
  departureTime: string
  description: {
    en: String,
    fr: String,
    es: String,
  }
  shortDescription: {
    en: String,
    fr: String,
    es: String,
  }
  itinerary: {
    title: {
      en: String,
      fr: String,
      es: String,
    }, description: {
      en: String,
      fr: String,
      es: String,
    }
  }[]
  toursIncluded: {
    en: String,
    fr: String,
    es: String,
  }[]
  toursExcluded: {
    en: String,
    fr: String,
    es: String,
  }[]
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
