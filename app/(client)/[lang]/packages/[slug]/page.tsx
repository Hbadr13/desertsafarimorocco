"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PackageDetailsPage } from "@/components/PackageDetailsPage"
import { Button } from "@/components/ui/button"

const LANGS = ["en", "fr", "es"]

export default function PackageDetailPage({ params }: { params: { lang: string; slug: string } }) {
    const { lang, slug } = params
    const router = useRouter()
    const [pkg, setPkg] = useState<any>(null)
    const [tour, setTour] = useState<any>(null)
    const [otherPackages, setOtherPackages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetch(`/api/client/package/${slug}`)
            .then(res => res.json())
            .then(data => {
                setPkg({
                    ...data,
                    title: data.title?.[lang] || data.title?.en || "",
                    description: data.description?.[lang] || data.description?.en || "",
                    duration: data.duration?.[lang] || data.duration?.en || "",
                    departure: data.departure?.[lang] || data.departure?.en || "",
                })
                // Fetch tour and other packages if needed
                fetch(`/api/client/tour/${data.tourSlug}`)
                    .then(res => res.json())
                    .then(tourData => setTour({
                        ...tourData,
                        title: tourData.title?.[lang] || tourData.title?.en || "",
                    }))
                fetch(`/api/client/packages?tour=${data.tourSlug}&exclude=${slug}`)
                    .then(res => res.json())
                    .then(pkgs => setOtherPackages(pkgs.packages || []))
                setLoading(false)
            })
    }, [lang, slug])

    const handleLangSwitch = (newLang: string) => {
        if (newLang !== lang) {
            router.push(`/${newLang}/packages/${slug}`)
        }
    }

    if (loading || !pkg) {
        return <div>Loading...</div>
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
            <PackageDetailsPage
                package={pkg}
                tour={tour}
                otherPackages={otherPackages}
            />
        </div>
    )
}

export async function generateStaticParams() {
    const db = await getDatabase()
    const packages = await db.collection("packages").find({}).toArray()
    const langs = ["en", "fr", "es"]
    return packages.flatMap(pkg =>
        langs.map(lang => ({
            lang,
            slug: pkg.slug,
        }))
    )
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
    const db = await getDatabase()
    const pkg = await db.collection("packages").findOne({ slug: params.slug })
    if (!pkg) {
        return { title: "Package Not Found" }
    }
    const tour = await db.collection("tours").findOne({ _id: pkg.tourId })
    const title = pkg.title?.[params.lang] || pkg.title?.en || ""
    const tourTitle = tour?.title?.[params.lang] || tour?.title?.en || ""
    const description = pkg.description?.[params.lang] || pkg.description?.en || ""
    return {
        title: `${title} - ${tourTitle}`,
        description,
    }
}
