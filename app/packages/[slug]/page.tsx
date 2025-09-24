// app/packages/[slug]/page.tsx
import { Package, Tour } from "@/lib/models"
import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import { PackageDetailsPage } from "@/components/PackageDetailsPage"

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

export default async function PackagePage({ params }: PageProps) {
    const data = await getPackageData(params.slug)

    if (!data) {
        notFound()
    }

    return <PackageDetailsPage {...data} />
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