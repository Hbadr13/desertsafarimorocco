import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Category } from "@/lib/models"

export async function GET() {
    try {
        const db = await getDatabase()
        const categories = await db.collection<Category>("categories").find({}).sort({ title: 1 }).toArray()
        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
