import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Tour } from "@/lib/models"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    try {
        const db = await getDatabase()
        const tour = await db.collection<Tour>("tours").findOne({ slug: params.slug })
        return NextResponse.json(tour || {})
    } catch (error) {
        console.error("Error fetching tour:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
