import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Category } from "@/lib/models"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    try {
        const db = await getDatabase()
        const category = await db.collection<Category>("categories").findOne({ slug: params.slug })
        return NextResponse.json(category || {})
    } catch (error) {
        console.error("Error fetching category:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
