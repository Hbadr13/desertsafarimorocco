// app/packages/[slug]/page.tsx
"use client"
import { Package, Tour } from "@/lib/models"
import { notFound } from "next/navigation"
import { getDatabase } from "@/lib/mongodb"
import { PackageDetailsPage } from "@/components/PackageDetailsPage"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface PageProps {
    params: {
        slug: string
    }
}

async function getPackageData(slug: string) {
    try {
        const db = await getDatabase()

        // Get the package by slug
        const packageData = await db.collection<Package>("packages").findOne({ slug })

        if (!packageData) {
            return null
        }

        // Get the tour for this package
        const tour = await db.collection<Tour>("tours").findOne({ _id: packageData.tourId })

        if (!tour) {
            return null
        }

        // Get all packages from the same tour
        const otherPackages = await db.collection<Package>("packages")
            .find({ tourId: packageData.tourId, _id: { $ne: packageData._id } })
            .toArray()

        return {
            package: JSON.parse(JSON.stringify(packageData)),
            tour: JSON.parse(JSON.stringify(tour)),
            otherPackages: JSON.parse(JSON.stringify(otherPackages))
        }
    } catch (error) {
        console.error("Error fetching package data:", error)
        return null
    }
}

const LANGS = ["en", "fr", "es"]

export default function PackageDetailPage({ params }: { params: { slug: string } }) {
    const [lang, setLang] = useState("en")
    const [pkg, setPkg] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/client/package/${params.slug}`)
            .then(res => res.json())
            .then(data => {
                setPkg({
                    ...data,
                    title: data.title?.[lang] || data.title?.en || "",
                    description: data.description?.[lang] || data.description?.en || "",
                    duration: data.duration?.[lang] || data.duration?.en || "",
                    departure: data.departure?.[lang] || data.departure?.en || "",
                })
            })
    }, [lang, params.slug])

    if (!pkg) {
        notFound()
    }

    return (
        <div>
            {/* Language Switcher */}
            <div className="flex gap-2 mb-4">
                {LANGS.map(l => (
                    <Button key={l} variant={l === lang ? "default" : "outline"} onClick={() => setLang(l)}>
                        {l.toUpperCase()}
                    </Button>
                ))}
            </div>
            <PackageDetailsPage
                package={pkg}
                tour={pkg.tour}
                otherPackages={pkg.otherPackages}
            />
        </div>
    )
}

export async function generateMetadata({ params }: PageProps) {
    const data = await getPackageData(params.slug)

    if (!data) {
        return {
            title: "Package Not Found"
        }
    }

    return {
        title: `${data.package.title} - ${data.tour.title}`,
        description: data.package.description,
    }
}

export async function generateStaticParams() {
    try {
        const db = await getDatabase()
        const packages = await db.collection<Package>("packages").find({}).toArray()

        return packages.map((pkg) => ({
            slug: pkg.slug,
        }))
    } catch (error) {
        console.error("Error generating static params:", error)
        return []
    }
}