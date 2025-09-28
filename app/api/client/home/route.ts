import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const db = await getDatabase()
        // Example: get homepage data from a "home" collection or static object
        const home = await db.collection("home").findOne({})
        return NextResponse.json(home || {})
    } catch (error) {
        console.error("Error fetching home data:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
