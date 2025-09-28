import { ArrowRight, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import { Category } from "@/lib/models"
import { Badge } from "./ui/badge"

const CategoryCard = ({ category }: { category: Category }) => {

    return (
        <Card className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer h-full hover:border-blue-300 transition-all duration-200 group">
            <CardContent className="p-0 flex flex-col h-full">
                {/* Image with Gradient Overlay */}
                <div className="h-52 w-full overflow-hidden relative">
                    <img
                        src={category.images[0]}
                        alt={category.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Top Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-gray-800 font-semibold border-0 shadow-md">
                            ⭐ Popular
                        </Badge>
                    </div>

                    {/* Bottom Text Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                            {category.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>Morocco • {category.tours?.length || 0} options</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.description.slice(0, 100)}...
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>2-10 days</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Users className="h-3 w-3 " />
                            <span className="text-[10px] font-medium">Small/Private groups</span>
                        </div>
                    </div>

                    {/* Rating and Price */}
                    <div className="flex items-center justify-between mb-3">
                        {/* <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900">4.8</span>
                            </div>
                            <span className="text-xs text-gray-500">(245 reviews)</span>
                        </div> */}
                        <div className="text-right flex items-center space-x-3">
                            <div className="text-xs text-gray-500">Starting from</div>
                            <div className="text-xl font-bold text-blue-600">$129</div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="w-full flex justify-end">
                        <Link href={`/${category.slug}`} className=" rounded-xl flex items-center py-2 px-3 justify-center duration-200  w-max hover:bg-blue-100 text-blue-500 font-semibold mt-auto gap-2">
                            Explore Options <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CategoryCard