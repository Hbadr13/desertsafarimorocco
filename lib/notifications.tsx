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


export async function sendBookingConfirmationEmail(
  email: string,
  bookingDetails: {
    name: string
    packageTitle: string
    packageType: string
    startDate: string
    adults: number
    children: number
    totalPrice: number
    notes?: string
    packageUrl: string
    lang: 'fr' | 'es' | 'en'
  },
) {
  try {
    const translations = {
      en: {
        subject: `Booking Confirmation - ${bookingDetails.packageTitle}`,
        greeting: `Hello ${bookingDetails.name},`,
        thankYou: "Thank you for choosing Desert Safaris Morocco!",
        confirmation: "We're excited to confirm that we've received your booking request. Our team will review your request and contact you within 24 hours to finalize the details.",
        bookingDetails: "Booking Details",
        package: "Package",
        packageType: "Package Type",
        startDate: "Start Date",
        guests: "Guests",
        totalPrice: "Total Price",
        yourNotes: "Your Notes",
        nextSteps: "What's Next?",
        steps: [
          "Our travel experts will review your booking request",
          "We'll contact you within 24 hours to confirm availability",
          "Once confirmed, we'll send you detailed itinerary and payment instructions",
          "Get ready for an amazing desert adventure!"
        ],
        visitWebsite: "Visit Our Website",
        questions: "If you have any questions, feel free to contact us",
        copyright: "© 2026 Desert Safaris Morocco. All rights reserved."
      },
      fr: {
        subject: `Confirmation de Réservation - ${bookingDetails.packageTitle}`,
        greeting: `Bonjour ${bookingDetails.name},`,
        thankYou: "Merci d'avoir choisi Desert Safaris Morocco !",
        confirmation: "Nous sommes ravis de confirmer que nous avons bien reçu votre demande de réservation. Notre équipe examinera votre demande et vous contactera dans les 24 heures pour finaliser les détails.",
        bookingDetails: "Détails de la Réservation",
        package: "Forfait",
        packageType: "Type de Forfait",
        startDate: "Date de Départ",
        guests: "Voyageurs",
        totalPrice: "Prix Total",
        yourNotes: "Vos Notes",
        nextSteps: "Prochaines Étapes",
        steps: [
          "Nos experts en voyages examineront votre demande de réservation",
          "Nous vous contacterons dans les 24 heures pour confirmer la disponibilité",
          "Une fois confirmé, nous vous enverrons l'itinéraire détaillé et les instructions de paiement",
          "Préparez-vous pour une incroyable aventure dans le désert !"
        ],
        visitWebsite: "Visiter Notre Site Web",
        questions: "Si vous avez des questions, n'hésitez pas à nous contacter",
        copyright: "© 2026 Desert Safaris Morocco. Tous droits réservés."
      },
      es: {
        subject: `Confirmación de Reserva - ${bookingDetails.packageTitle}`,
        greeting: `Hola ${bookingDetails.name},`,
        thankYou: "¡Gracias por elegir Desert Safaris Morocco!",
        confirmation: "Nos complace confirmar que hemos recibido su solicitud de reserva. Nuestro equipo revisará su solicitud y se comunicará con usted dentro de las 24 horas para finalizar los detalles.",
        bookingDetails: "Detalles de la Reserva",
        package: "Paquete",
        packageType: "Tipo de Paquete",
        startDate: "Fecha de Inicio",
        guests: "Viajeros",
        totalPrice: "Precio Total",
        yourNotes: "Tus Notas",
        nextSteps: "¿Qué Sigue?",
        steps: [
          "Nuestros expertos en viajes revisarán su solicitud de reserva",
          "Nos contactaremos con usted dentro de 24 horas para confirmar disponibilidad",
          "Una vez confirmado, le enviaremos el itinerario detallado y las instrucciones de pago",
          "¡Prepárese para una increíble aventura en el desierto!"
        ],
        visitWebsite: "Visitar Nuestro Sitio Web",
        questions: "Si tiene alguna pregunta, no dude en contactarnos",
        copyright: "© 2026 Desert Safaris Morocco. Todos los derechos reservados."
      }
    }

    const t = translations[bookingDetails.lang] || translations.en

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${t.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #f7eac6; color: #f9faf5; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ${t.subject}</h1>
              <p>${t.thankYou}</p>
            </div>
            
            <div class="content">
              <h2>${t.greeting}</h2>
              <p>${t.confirmation}</p>
              
              <div class="booking-details">
                <h3>${t.bookingDetails}</h3>
                <div class="detail-row">
                  <strong>${t.package}:</strong>
                  <span>${bookingDetails.packageTitle}</span>
                </div>
                <div class="detail-row">
                  <strong>${t.packageType}:</strong>
                  <span>${bookingDetails.packageType}</span>
                </div>
                <div class="detail-row">
                  <strong>${t.startDate}:</strong>
                  <span>${new Date(bookingDetails.startDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>${t.guests}:</strong>
                  <span>${bookingDetails.adults} adults, ${bookingDetails.children} children</span>
                </div>
               ${bookingDetails.totalPrice != 0 && `<div class="detail-row">
                  <strong>${t.totalPrice}:</strong>
                  <span>$${bookingDetails.totalPrice.toLocaleString()}</span>
                </div>`}
                ${bookingDetails.notes ? `
                <div class="detail-row">
                  <strong>${t.yourNotes}:</strong>
                  <span>${bookingDetails.notes}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <strong>Package URL:</strong>
                  <span><a href="${bookingDetails.packageUrl}">View Package</a></span>
                </div>
              </div>
              
              <h3>${t.nextSteps}</h3>
              <ul>
                ${t.steps.map(step => `<li>${step}</li>`).join('')}
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">${t.visitWebsite}</a>
              
              <p>${t.questions} at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a> or call us at ${process.env.NEXT_PUBLIC_PHONE_NUMBER}.</p>
            </div>
            
            <div class="footer">
              <p>${t.copyright}</p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: `"Desert Safaris Morocco" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: t.subject,
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
  phone: string
  packageTitle: string
  packageType: string
  startDate: string
  adults: number
  children: number
  totalPrice: number
  notes?: string
  packageUrl: string
  lang: string
}) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Request - Desert Safaris Morocco</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .urgent { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #f7eac6; color: #f9faf5; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Booking Request</h1>
              <p>Desert Safaris Morocco Admin</p>
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
                <div class="detail-row">
                  <strong>Phone:</strong>
                  <span>${bookingDetails.phone}</span>
                </div>
                <div class="detail-row">
                  <strong>Language:</strong>
                  <span>${bookingDetails.lang}</span>
                </div>
                
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <strong>Package:</strong>
                  <span>${bookingDetails.packageTitle}</span>
                </div>
                <div class="detail-row">
                  <strong>Package Type:</strong>
                  <span>${bookingDetails.packageType}</span>
                </div>
                <div class="detail-row">
                  <strong>Start Date:</strong>
                  <span>${new Date(bookingDetails.startDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Guests:</strong>
                  <span>${bookingDetails.adults} adults, ${bookingDetails.children} children</span>
                </div>
                <div class="detail-row">
                  <strong>Total Price:</strong>
                  <span>$${bookingDetails.totalPrice.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Package URL:</strong>
                  <span><a href="${bookingDetails.packageUrl}">View Package</a></span>
                </div>
                ${bookingDetails.notes ? `
                <div class="detail-row">
                  <strong>Customer Notes:</strong>
                  <span>${bookingDetails.notes}</span>
                </div>
                ` : ''}
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/desert26safariadmin/bookings" class="button">View in Admin Dashboard</a>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Review the booking request in the admin dashboard</li>
                <li>Check availability for the requested date</li>
                <li>Contact the customer within 24 hours</li>
                <li>Update the booking status once confirmed</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: `"Desert Safaris Morocco System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Booking Request - ${bookingDetails.packageTitle}`,
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error("Admin email sending error:", error)
    return { success: false, message: "Failed to send admin notification" }
  }
}