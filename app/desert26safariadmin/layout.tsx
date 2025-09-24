'use client'
import type React from "react"
import { Sidebar, MobileSidebar } from "@/components/admin/sidebar"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()

  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/desert26safariadmin/forgot-password" || pathname === "/desert26safariadmin/reset-password") return

      const res = await fetch("/api/auth/check-token")
      const data = await res.json()

      if (!data.valid) {
        router.push("/desert26safariadmin/login")
      }
    }

    checkAuth()
  }, [pathname, router])
  if (pathname === '/desert26safariadmin/reset-password' || pathname === "/desert26safariadmin/forgot-password" || pathname === "/desert26safariadmin/login")
    return <div className="">{children}</div>
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[180px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-gray-200 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileSidebar />
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
