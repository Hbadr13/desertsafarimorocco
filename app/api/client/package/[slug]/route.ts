import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Package } from "@/lib/models"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    try {
        const db = await getDatabase()
        const pkg = await db.collection<Package>("packages").findOne({ slug: params.slug })
        return NextResponse.json(pkg || {})
    } catch (error) {
        console.error("Error fetching package:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
