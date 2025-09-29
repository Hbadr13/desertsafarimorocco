import { ArrowRight, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import { Category } from "@/lib/models"
import { Badge } from "./ui/badge"

const CategoryCard = ({ category }: { category: Category }) => {

    return (
        <Card className="border max-w-sm border-gray-200 rounded-xl overflow-hidden h-full hover:border-blue-300 transition-all duration-200 group">
            <CardContent className="p-0 flex flex-col h-full">
                {/* Image with Gradient Overlay */}
                <div className="h-52 w-full overflow-hidden relative">
                    <img
                        src={category.images[0]}
                        alt={category.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>

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
                            <MapPin className="h-4 w-4 text-green-400 " />
                            <span>Morocco • {category.tours?.length || 0} options</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.shortDescription}
                    </p>
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