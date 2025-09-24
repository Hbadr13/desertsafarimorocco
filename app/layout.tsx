// app/layout.tsx
import Header from '@/components/header'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { Poppins } from 'next/font/google'
import { getDatabase } from '@/lib/mongodb'
import { Category } from '@/lib/models'
import { Footer } from '@/components/footer'

// Load Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const db = await getDatabase()
  const categories = await db.collection<Category>("categories")
    .find({})
    .limit(10)
    .toArray()
  return (
    <html lang="en" className={poppins.className}>
      <head />
      <body>
        <Header categories={categories} />

        {children}
        <Analytics />
        <Footer categories={categories} />

      </body>
    </html>
  )
}
