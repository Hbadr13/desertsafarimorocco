import { ArrowRight, Calendar, Clock, LucideMessageCircle, MapPin, MessageCircle, Phone, PhoneCall, Shield, User, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Package } from "@/lib/models"
import { Badge } from "./ui/badge"
import Link from "next/link"

const PackageCard = ({ pkg }: { pkg: Package }) => {
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+12395375059"; // Default number if not set
    return (

        <Card
            key={pkg._id?.toString() || pkg.slug}
            className="max-w-sm  border border-gray-200 rounded-lg overflow-hidden cursor-pointer h-full flex flex-col  transition-all duration-200 group/child"
        >
            <div className="h-48 w-full overflow-hidden relative">
                <Image
                    src={pkg.images[0]}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover/child:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium">
                        {pkg.duration} {Number(pkg.duration) > 1 ? 'days' : 'day'}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <CardContent className="flex flex-col flex-grow p-5">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight flex-1">
                        <Link className="active:text-blue-600 duration-200" href={`/packages/${pkg.slug}`}>
                            {pkg.title}
                        </Link>
                    </h3>
                </div>
                <p className="text-gray-700 text-xs mb-4 leading-relaxed line-clamp-3">
                    {pkg.description.slice(0, 100)}...
                </p>
                <div className="flex flex-col justify-between">
                    <div>
                        <ul className="text-sm text-gray-700 space-y-2 ">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-600" />
                                <span>Departure: {pkg.departure}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-600" />
                                <span>Duration: {pkg.duration} {Number(pkg.duration) === 1 ? 'day' : 'days'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-red-600" />
                                <span>Shared: {pkg.shareTrip} Euro</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <User className="w-4 h-4 text-red-600" />
                                <span>Private: {pkg.privateTrip} Euro</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs mt-3">
                    <Shield className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-semibold">Total includes taxes and fees</span>
                </div>
                <div className="flex flex-col gap-3 mt-3 px-6">
                    <div className="flex gap-2 text-sm">
                        <Link
                            href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            className="flex-1  text-green-500 hover:bg-green-100 active:bg-green-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                        </Link>

                        <Link
                            href={`tel:${phoneNumber}`}
                            className="flex-1 text-blue-500 hover:bg-blue-100 active:bg-blue-100 font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Phone className="h-4 w-4" />
                            Call
                        </Link>
                    </div>

                    <Link href={`/packages/${pkg.slug}`} className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 text-white font-bold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Book Now
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default PackageCard;