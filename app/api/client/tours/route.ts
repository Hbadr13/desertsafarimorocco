import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Tour } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
    try {
        const db = await getDatabase()
        const url = new URL(request.url)
        const categorySlug = url.searchParams.get("category")
        let query: any = {}
        if (categorySlug) {
            const category = await db.collection("categories").findOne({ slug: categorySlug })
            if (category) {
                query.categoryId = category._id
            }
        }
        const tours = await db.collection<Tour>("tours").find(query).sort({ createdAt: -1 }).toArray()
        return NextResponse.json({ tours })
    } catch (error) {
        console.error("Error fetching tours:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
