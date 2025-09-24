import nodemailer from "nodemailer"

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})


// SMS configuration (using a generic SMS API)
interface SMSResponse {
  success: boolean
  message?: string
}

export async function sendSMS(phone: string, message: string): Promise<SMSResponse> {
  try {
    // This is a placeholder for SMS API integration
    // You would replace this with your actual SMS provider (Twilio, AWS SNS, etc.)
    const response = await fetch("https://api.sms-provider.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PHONE_API_KEY}`,
      },
      body: JSON.stringify({
        to: phone,
        message: message,
      }),
    })

    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, message: "Failed to send SMS" }
    }
  } catch (error) {
    console.error("SMS sending error:", error)
    return { success: false, message: "SMS service unavailable" }
  }
}

export async function sendBookingConfirmationEmail(
  email: string,
  bookingDetails: {
    name: string
    packageTitle: string
    tripStart: string
    tripEnd: string
    guests: number
    adults: number
    children: number
    message?: string
  },
) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation - TravelExplore</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmation</h1>
              <p>Thank you for choosing TravelExplore!</p>
            </div>
            
            <div class="content">
              <h2>Hello ${bookingDetails.name},</h2>
              <p>We're excited to confirm that we've received your booking request. Our team will review your request and contact you within 24 hours to finalize the details.</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <strong>Package:</strong>
                  <span>${bookingDetails.packageTitle}</span>
                </div>
                <div class="detail-row">
                  <strong>Trip Start:</strong>
                  <span>${new Date(bookingDetails.tripStart).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Trip End:</strong>
                  <span>${new Date(bookingDetails.tripEnd).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Total Guests:</strong>
                  <span>${bookingDetails.guests} (${bookingDetails.adults} adults, ${bookingDetails.children} children)</span>
                </div>
                ${bookingDetails.message
        ? `
                <div class="detail-row">
                  <strong>Your Message:</strong>
                  <span>${bookingDetails.message}</span>
                </div>
                `
        : ""
      }
              </div>
              
              <h3>What's Next?</h3>
              <ul>
                <li>Our travel experts will review your booking request</li>
                <li>We'll contact you within 24 hours to confirm availability</li>
                <li>Once confirmed, we'll send you detailed itinerary and payment instructions</li>
                <li>Get ready for an amazing adventure!</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">Visit Our Website</a>
              
              <p>If you have any questions, feel free to contact us at <a href="mailto:info@travelexplore.com">info@travelexplore.com</a> or call us at +1 (555) 123-4567.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 TravelExplore. All rights reserved.</p>
              <p>123 Travel Street, Adventure City, AC 12345</p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: `"TravelExplore" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmation - ${bookingDetails.packageTitle}`,
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, message: "Failed to send email" }
  }
}

export async function sendAdminNotificationEmail(bookingDetails: {
  name: string
  email: string
  packageTitle: string
  tripStart: string
  tripEnd: string
  guests: number
  adults: number
  children: number
  message?: string
}) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Request - TravelExplore Admin</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .urgent { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Booking Request</h1>
              <p>TravelExplore Admin Dashboard</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>Action Required:</strong> A new booking request has been submitted and requires your attention.
              </div>
              
              <div class="booking-details">
                <h3>Customer Information</h3>
                <div class="detail-row">
                  <strong>Name:</strong>
                  <span>${bookingDetails.name}</span>
                </div>
                <div class="detail-row">
                  <strong>Email:</strong>
                  <span>${bookingDetails.email}</span>
                </div>
                
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <strong>Package:</strong>
                  <span>${bookingDetails.packageTitle}</span>
                </div>
                <div class="detail-row">
                  <strong>Trip Start:</strong>
                  <span>${new Date(bookingDetails.tripStart).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Trip End:</strong>
                  <span>${new Date(bookingDetails.tripEnd).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Total Guests:</strong>
                  <span>${bookingDetails.guests} (${bookingDetails.adults} adults, ${bookingDetails.children} children)</span>
                </div>
                ${bookingDetails.message
        ? `
                <div class="detail-row">
                  <strong>Customer Message:</strong>
                  <span>${bookingDetails.message}</span>
                </div>
                `
        : ""
      }
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/desert26safariadmin/bookings" class="button">View in Admin Dashboard</a>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Review the booking request in the admin dashboard</li>
                <li>Check availability for the requested dates</li>
                <li>Contact the customer within 24 hours</li>
                <li>Update the booking status once confirmed</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: `"TravelExplore System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin email
      subject: `New Booking Request - ${bookingDetails.packageTitle}`,
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error("Admin email sending error:", error)
    return { success: false, message: "Failed to send admin notification" }
  }
}

export async function sendBookingConfirmationSMS(
  phone: string,
  bookingDetails: { name: string; packageTitle: string; tripStart: string },
) {
  const message = `Hi ${bookingDetails.name}! Your booking for "${bookingDetails.packageTitle}" starting ${new Date(bookingDetails.tripStart).toLocaleDateString()} has been received. We'll contact you within 24 hours to confirm. - TravelExplore`

  return await sendSMS(phone, message)
}
