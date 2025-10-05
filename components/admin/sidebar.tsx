"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  FolderOpen,
  MapPin,
  Package,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { title: "Dashboard", href: "/desert26safariadmin/dashboard", icon: LayoutDashboard },
  { title: "Categories", href: "/desert26safariadmin/categories", icon: FolderOpen },
  { title: "Tours", href: "/desert26safariadmin/tours", icon: MapPin },
  { title: "Packages", href: "/desert26safariadmin/packages", icon: Package },
  { title: "Bookings", href: "/desert26safariadmin/bookings", icon: Calendar },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/desert26safariadmin/login"
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-14 items-center border-gray-200 border-b px-4">
        <Link
          href="/desert26safariadmin/dashboard"
          className="flex items-center space-x-2"
          onClick={onNavigate}
        >
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-bold">Admin Panel</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="block"
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start ",
                    isActive
                      ? "bg-primary text-blue-500 bg-blue-100 rounded-xl hover:bg-blue-200 duration-200 transition-all"
                      : " hover:bg-gray-100 rounded-xl hover:text-gray-500 transition-all duration-200"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4 text-gray-600" />
                  <div className="text-gray-700">
                    {item.title}
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={() => {
            onNavigate?.()
            handleLogout()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="hidden border-gray-200 border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <SidebarContent />
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="shrink-0 md:hidden bg-transparent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col p-0">
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
