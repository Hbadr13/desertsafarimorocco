// app/api/auth/check-token/route.ts
import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ valid: false })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: true, user: decoded })
  } catch (error) {
    console.error("Check token error:", error)
    return NextResponse.json({ valid: false })
  }
}
