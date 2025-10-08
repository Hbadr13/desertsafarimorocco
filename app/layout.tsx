import './globals.css'
import { Poppins } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Desert Safaris Morocco | Luxury Desert Tours & Adventures',
  description: "Experience the magic of Moroccan deserts with our luxury tours. Camel treks, desert camps, and unforgettable adventures in the Sahara.",
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png']
  }
}


export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className={poppins.className}>
      <head />
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
