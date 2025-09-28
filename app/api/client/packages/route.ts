import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Package } from "@/lib/models"

export async function GET() {
    try {
        const db = await getDatabase()
        const packages = await db.collection<Package>("packages").find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json({ packages })
    } catch (error) {
        console.error("Error fetching packages:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
