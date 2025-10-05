export const dynamic = "force-dynamic"

import { getDatabase } from "@/lib/mongodb"
import type { Category, Tour, Package, User, Booking } from "@/lib/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FolderOpen,
  MapPin,
  PackageIcon,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  BookOpen,
  BarChart3,
  Sparkles,
  Settings,
  Eye,
  Plus,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
  try {
    const db = await getDatabase()

    const [categoriesCount, toursCount, packagesCount, bookingsCount, recentBookings] = await Promise.all([
      db.collection<Category>("categories").countDocuments(),
      db.collection<Tour>("tours").countDocuments(),
      db.collection<Package>("packages").countDocuments(),
      db.collection<Booking>("bookings").countDocuments(),
      db.collection<Booking>("bookings").find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    ])

    const totalRevenue = bookingsCount * 299

    return {
      categoriesCount,
      toursCount,
      packagesCount,
      bookingsCount,
      recentBookings,
      totalRevenue,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      categoriesCount: 0,
      toursCount: 0,
      packagesCount: 0,
      bookingsCount: 0,
      recentBookings: [],
      totalRevenue: 0,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Welcome to your travel management dashboard. Monitor your business performance at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 rounded-2xl overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/5 to-indigo-700/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800 text-lg">Categories</CardTitle>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardDescription className="text-slate-500">Travel categories</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-slate-800 mb-4">{stats.categoriesCount}</div>
              <div className="flex items-center justify-between">
                <Link href="/desert26safariadmin/categories" className="flex-1 mr-2">
                  <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-300 hover:bg-slate-50">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href="/desert26safariadmin/categories/new" className="flex-1">
                  <Button size="sm" className="w-full rounded-xl bg-blue-100 hover:bg-blue-200">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 rounded-2xl overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-600/5 to-emerald-700/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800 text-lg">Tours</CardTitle>
                <div className="p-3 bg-green-100 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardDescription className="text-slate-500">Travel experiences</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-slate-800 mb-4">{stats.toursCount}</div>
              <div className="flex items-center justify-between">
                <Link href="/desert26safariadmin/tours" className="flex-1 mr-2">
                  <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-300 hover:bg-slate-50">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href="/desert26safariadmin/tours/new" className="flex-1">
                  <Button size="sm" className="w-full rounded-xl bg-green-100 hover:bg-green-200">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 rounded-2xl overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-600/5 to-fuchsia-700/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800 text-lg">Packages</CardTitle>
                <div className="p-3 bg-purple-100 rounded-full">
                  <PackageIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <CardDescription className="text-slate-500">Travel packages</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-slate-800 mb-4">{stats.packagesCount}</div>
              <div className="flex items-center justify-between">
                <Link href="/desert26safariadmin/packages" className="flex-1 mr-2">
                  <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-300 hover:bg-slate-50">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href="/desert26safariadmin/packages/new" className="flex-1">
                  <Button size="sm" className="w-full rounded-xl bg-purple-100 hover:bg-purple-200">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 rounded-2xl overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="pb-3 bg-gradient-to-r from-red-600/5 to-rose-700/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800 text-lg">Bookings</CardTitle>
                <div className="p-3 bg-red-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <CardDescription className="text-slate-500">Total reservations</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-slate-800 mb-4">{stats.bookingsCount}</div>
              <div className="flex items-center">
                <Link href="/desert26safariadmin/bookings" className="flex-1">
                  <Button size="sm" className="w-full rounded-xl bg-red-100 hover:bg-red-200">
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <CardHeader className="pb-3 border-b border-blue-500/20">
              <div className="flex  flex-col lg:flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription className="text-blue-100/80">
                    Latest customer reservations
                  </CardDescription>
                </div>
                <Link href="/desert26safariadmin/bookings">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </div>
          <CardContent className=" p-3 md:p-6">
            {stats.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking) => (
                  <div key={booking._id?.toString()} className="flex  lg:items-center flex-col lg:flex-row  lg:justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{booking.name}</p>
                      <p className="text-sm text-slate-500">{booking.email}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "Date not available"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-3 bg-slate-100 rounded-full inline-flex mb-4">
                  <Sparkles className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No bookings yet</h3>
                <p className="text-slate-500">Customer bookings will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}