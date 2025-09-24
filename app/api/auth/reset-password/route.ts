import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"
import type { User } from "@/lib/models"
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { token , email, password } = await request.json()

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({
      resetToken: hashedToken,
      email,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    await db.collection<User>("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetToken: "",
          resetTokenExpiry: "",
        },
      },
    )

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
