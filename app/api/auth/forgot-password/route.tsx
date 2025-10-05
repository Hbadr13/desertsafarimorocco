import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { generateResetToken } from "@/lib/auth"
import type { User } from "@/lib/models"
import nodemailer from "nodemailer"
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ email })

    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, a reset link has been sent.",
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const resetTokenExpiry = new Date(Date.now() + (60 * 60 * 1000) / 6)
    await db.collection<User>("users").updateOne(
      { email },
      {
        $set: {
          resetToken: hashedToken,
          resetTokenExpiry,
          updatedAt: new Date(),
        },
      },
    )

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/desert26safariadmin/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
       <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          background: white;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .button {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          color: #92400e;
        }
        .logo {
          font-size: 20px;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello,</h2>
          <p>You recently requested to reset your password for your Travel Admin account. Click the button below to proceed:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">
              Reset My Password
            </a>
          </div>

          <div class="warning">
            <strong>⚠️ Important:</strong> This password reset link will expire in <strong>10 min</strong> for security reasons.
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb; background-color: #eff6ff; padding: 12px; border-radius: 6px;">
            ${resetUrl}
          </p>

          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          
          <p>Best regards,<br>Travel Admin Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Travel Admin. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
      
      `,
    })

    return NextResponse.json({
      message: "If an account with that email exists, a reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
