"use client"
import Header from '@/components/header'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { Poppins } from 'next/font/google'
import { getDatabase } from '@/lib/mongodb'
import { Category } from '@/lib/models'
import { Footer } from '@/components/footer'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  const [categories, setCategories] = useState<any[]>([])
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    fetch(`/api/client/categories`)
      .then(res => res.json())
      .then(catData => {
        setCategories((catData.categories || []).map((cat: any) => ({
          ...cat,
          title: cat.title || "",
          description: cat.description || "",
          shortDescription: cat.shortDescription || "",
        })))
      })
  }, [])
  if (pathname == '/')
    router.push('/en')
  return (
    <html lang="en" className={poppins.className}>
      <head />
      <body>
        {pathname == '/' ? <>
          <Header lang={"en"} categories={categories} />
          {children}
          <Analytics />
          <Footer lang={"en"} categories={categories} />
        </> :
          <>
            {children}
            <Analytics />
          </>
        }
      </body>
    </html>
  )
}
