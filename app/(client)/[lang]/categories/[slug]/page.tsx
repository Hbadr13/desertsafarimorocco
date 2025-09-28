"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CategoryToursPage } from "@/components/CategoryToursPage"
import { Button } from "@/components/ui/button"

const LANGS = ["en", "fr", "es"]

interface PageProps {
    params: {
        lang: string
        slug: string
    }
}

export default function CategoryPage({ params }: PageProps) {
    const { lang, slug } = params
    const router = useRouter()
    const [category, setCategory] = useState<any>(null)
    const [tours, setTours] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetch(`/api/client/category/${slug}`).then(res => res.json()),
            fetch(`/api/client/categories`).then(res => res.json()),
            fetch(`/api/client/tours?category=${slug}`).then(res => res.json()),
        ]).then(([catData, allCatData, toursData]) => {
            setCategory({
                ...catData,
                title: catData.title?.[lang] || catData.title?.en || "",
                description: catData.description?.[lang] || catData.description?.en || "",
                shortDescription: catData.shortDescription?.[lang] || catData.shortDescription?.en || "",
            })
            setCategories((allCatData.categories || []).map((cat: any) => ({
                ...cat,
                title: cat.title?.[lang] || cat.title?.en || "",
            })))
            setTours((toursData.tours || []).map((tour: any) => ({
                ...tour,
                title: tour.title?.[lang] || tour.title?.en || "",
                description: tour.description?.[lang] || tour.description?.en || "",
            })))
            setLoading(false)
        })
    }, [lang, slug])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!category) {
        return <div>Category not found</div>
    }

    // Language switcher navigation
    const handleLangSwitch = (newLang: string) => {
        if (newLang !== lang) {
            router.push(`/${newLang}/categories/${slug}`)
        }
    }

    return (
        <div>
            <div className="flex gap-2 mb-4">
                {LANGS.map(l => (
                    <Button key={l} variant={l === lang ? "default" : "outline"} onClick={() => handleLangSwitch(l)}>
                        {l.toUpperCase()}
                    </Button>
                ))}
            </div>
            <CategoryToursPage
                category={category}
                tours={tours}
                allCategories={categories}
            />
        </div>
    )
}

// Static params for SSG
export async function generateStaticParams() {
    // ...existing code to get all categories...
    const db = await getDatabase()
    const categories = await db.collection("categories").find({}).toArray()
    const langs = ["en", "fr", "es"]
    return categories.flatMap((category) =>
        langs.map((lang) => ({
            lang,
            slug: category.slug,
        }))
    )
}

// SEO metadata per language
export async function generateMetadata({ params }: PageProps) {
    const db = await getDatabase()
    const category = await db.collection("categories").findOne({ slug: params.slug })
    if (!category) {
        return {
            title: "Category Not Found"
        }
    }
    const title = category.title?.[params.lang] || category.title?.en || ""
    const description = category.description?.[params.lang] || category.description?.en || ""
    return {
        title: `${title} Tours - Morocco Adventures`,
        description,
    }
}
