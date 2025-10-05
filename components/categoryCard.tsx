import { ArrowRight, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import { Category } from "@/lib/models"
import { Badge } from "./ui/badge"

const CategoryCard = ({ category, lang }: { category: Category, lang: 'fr' | 'es' | 'en' }) => {

    return (
        <Card className="border max-w-[280px] w-[80vw] border-gray-200 bg-white rounded-xl overflow-hidden h-full hover:border-blue-300 transition-all duration-200 group">
            <CardContent className="p-0 flex flex-col h-full">
                <div className="h-52 w-full overflow-hidden relative">
                    <img
                        src={category.images[0]}
                        alt={category.title[lang]}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>

                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-gray-800 font-semibold border-0 shadow-md">
                            ⭐ Popular
                        </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                            {category.title[lang]}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                            <MapPin className="h-4 w-4 text-green-400 " />
                            <span>Morocco • {category.tours?.length || 0} options</span>
                        </div>
                    </div>
                </div>

                <div className=" p-1.5  md:p-3 flex flex-col flex-grow justify-between">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {category.shortDescription[lang]}
                    </p>
                    <div className="w-full flex justify-end">
                        <Link href={`/${lang}/categories/${category.slug}`} className=" rounded-xl flex items-center py-1 px-3 justify-center duration-200  w-max hover:bg-blue-100 text-blue-500 font-semibold mt-auto gap-2">
                            Explore Options <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CategoryCard