import { NextRequest, NextResponse } from 'next/server'
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})


export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    const requiredFields = ['name', 'email', 'subject', 'message']
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const emailResult = await sendAdminContactNotification(formData)

    if (emailResult.success) {
      return NextResponse.json(
        { message: 'Contact message sent successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to send contact message' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function sendAdminContactNotification(contactDetails: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Message - Desert safaris Marrakech</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 10px; }
            .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 14px; border-radius: 0 0 8px 8px; }
            .message-details { background: white; padding: 10px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .urgent { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .message-content { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #d4af37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Message</h1>
              <p>Desert safaris Marrakech Admin</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>Action Required:</strong> A new contact message has been received and requires your attention.
              </div>
              
              <div class="message-details">
                <h3>Contact Information</h3>
                <div class="detail-row">
                  <strong>Name:</strong>
                  <span>${contactDetails.name}</span>
                </div>
                <div class="detail-row">
                  <strong>Email:</strong>
                  <span><a href="mailto:${contactDetails.email}">${contactDetails.email}</a></span>
                </div>
                ${contactDetails.phone ? `
                <div class="detail-row">
                  <strong>Phone:</strong>
                  <span><a href="tel:${contactDetails.phone}">${contactDetails.phone}</a></span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <strong>Subject:</strong>
                  <span>${contactDetails.subject}</span>
                </div>
                
                <h3>Message Content</h3>
                <div class="message-content">
                  <p>${contactDetails.message.replace(/\n/g, '<br>')}</p>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="mailto:${contactDetails.email}" class="button">Reply to Customer</a>
                ${contactDetails.phone ? `
                <a href="tel:${contactDetails.phone}" class="button" style="background: #10b981; margin-left: 10px;">Call Customer</a>
                ` : ''}
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Reply to the customer within 24 hours</li>
                <li>Address their inquiry or provide requested information</li>
                <li>Follow up if additional details are needed</li>
                <li>Update CRM if applicable</li>
              </ul>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                This message was sent from the contact form on Desert safaris Marrakech website.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: `"Desert safaris Marrakech Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message: ${contactDetails.subject}`,
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error("Admin contact email sending error:", error)
    return { success: false, message: "Failed to send contact notification" }
  }
}