export const dynamic = "force-dynamic"

import { getDatabase } from "@/lib/mongodb"
import type { Booking } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, FolderOpen, Tag, ArrowRight, Calendar, User, Mail, Phone, MapPin, Clock, Users, Shield, Check, X, Clock4, CheckCircle, AlertCircle, BellRing } from "lucide-react"
import { DeleteButton } from "@/components/admin/DeleteButton"
import StatusUpdateButton from "@/components/ui/StatusUpdateButton"

async function getBookings() {
  try {
    const db = await getDatabase()
    const bookings = await db.collection<Booking>("bookings").find({}).sort({ createdAt: -1 }).toArray()
    return bookings
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}



export default async function BookingsPage() {
  const bookings = await getBookings()

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending", icon: Clock4 },
      confirmed: { variant: "default", label: "Confirmed", icon: CheckCircle },
      cancelled: { variant: "destructive", label: "Cancelled", icon: X },
      paid: { variant: "default", label: "Paid", icon: Shield }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <Badge variant={config.variant as any} className="rounded-full px-3 py-1 flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPackageTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="rounded-full px-3 py-1">
        {type === 'private' ? 'Private Trip' : 'Shared Trip'}
      </Badge>
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-1 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex  flex-col lg:flex-row items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Bookings</h1>
            <p className="text-slate-500">Manage customer bookings and reservations</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="rounded-full px-4 py-2">
              Total: {bookings.length} bookings
            </Badge>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking._id?.toString()} className="overflow-hidden shadow-lg border-0 rounded-2xl transition-all hover:shadow-xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
                  <CardHeader className="pb-3 border-b border-blue-500/20">
                    <div className="w-full flex justify-end">
                      {booking.status == 'pending' && <BellRing strokeWidth={2} className="text-orange-400 " />}
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                      <div className="flex flex-col lg:flex-row items-center gap-3">
                        <CardTitle className="text-white text-lg">
                          <Link href={`/${booking.lang}/packages/${booking.packageSlug}`} target="_blank" className="hover:underline  active:text-blue-300">
                            {booking.packageName}
                          </Link>
                        </CardTitle>
                        <div className="flex text-white">
                          <div className="">
                            {getStatusBadge(booking.status || 'pending')}
                          </div>
                          <div className="">
                            {getPackageTypeBadge(booking.packageType)}
                          </div>
                        </div>
                      </div>
                      <div className="text-white/80 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                </div>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
                    <div className=" space-y-1 lg:space-y-4">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer Information
                      </h3>
                      <div className=" space-y-1 lg:space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <User className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium text-slate-800">{booking.name}</div>
                            <div className="text-sm text-slate-500">Full Name</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium text-slate-800">{booking.email}</div>
                            <div className="text-sm text-slate-500">Email</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Phone className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium text-slate-800">{booking.phone}</div>
                            <div className="text-sm text-slate-500">Phone</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" space-y-1 lg:space-y-4">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Trip Details
                      </h3>
                      <div className=" space-y-1 lg:space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium text-slate-800">
                              {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'Not set'}
                            </div>
                            <div className="text-sm text-slate-500">Start Date</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Users className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium text-slate-800">
                              {booking.adults} adults, {booking.children} children
                            </div>
                            <div className="text-sm text-slate-500">Travelers</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Tag className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium text-slate-800 capitalize">{booking.packageType}</div>
                            <div className="text-sm text-slate-500">Trip Type</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="px-2 md:px-10 mt-2 lg:hidden block">
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="text-sm font-medium text-amber-800 mb-1">Customer Notes:</div>
                          <div className="text-sm text-amber-700 whitespace-pre-wrap">{booking.notes}</div>
                        </div>
                      </div>

                    )}
                    <div className=" space-y-1 lg:space-y-4">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Pricing & Actions
                      </h3>
                      <div className=" space-y-1 lg:space-y-3">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${booking.totalPrice?.toLocaleString()}
                          </div>
                          <div className="text-sm text-slate-500">Total Amount</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-slate-700 mb-2">Update Status:</div>
                          <div className="grid grid-cols-2 gap-2">
                            <StatusUpdateButton
                              bookingId={booking._id.toString()}
                              currentStatus={booking.status || 'pending'}
                              newStatus="pending"
                              label="pending"
                            />
                            <StatusUpdateButton
                              bookingId={booking._id.toString()}
                              currentStatus={booking.status || 'pending'}
                              newStatus="confirmed"
                              label="Confirm"
                            />
                            <StatusUpdateButton
                              bookingId={booking._id.toString()}
                              currentStatus={booking.status || 'pending'}
                              newStatus="paid"
                              label="Mark Paid"
                            />
                            <StatusUpdateButton
                              bookingId={booking._id.toString()}
                              currentStatus={booking.status || 'pending'}
                              newStatus="cancelled"
                              label="Cancel"
                            />
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="px-2 md:px-10 mt-2 hidden lg:block">
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-sm font-medium text-amber-800 mb-1">Customer Notes:</div>
                        <div className="text-sm text-amber-700 whitespace-pre-wrap">{booking.notes}</div>
                      </div>
                    </div>

                  )}
                  <div className="flex gap-2 pt-4 border-t border-slate-200 mt-4">
                    <DeleteButton
                      type="bookings"
                      notAllow={false}
                      id={booking._id.toString()}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
              <CardHeader className="pb-3 border-b border-blue-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  No Bookings Found
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <FolderOpen className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No bookings yet</h3>
              <p className="text-slate-500 text-center mb-6 max-w-md">
                Customer bookings will appear here once they start making reservations through your website
              </p>
              <div className="flex gap-4">
                <Link href="/">
                  <Button variant="outline" className="rounded-xl border-slate-300 hover:bg-slate-50">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View Website
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}