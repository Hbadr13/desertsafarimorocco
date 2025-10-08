"use client"

import { usePathname, useRouter } from "next/navigation"
import Header from "@/components/header"
import { useEffect, useState } from "react"
import { Footer } from "./footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<any[]>([])
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        fetch(`/api/client/categories`)
            .then(res => res.json())
            .then(data => {
                setCategories(data.categories || [])
            })
    }, [])

    if (pathname === "/") {
        router.push("/en")
    }

    return (
        <>
            {pathname === "/" ? (
                <>
                    <Header lang="en" categories={categories} />
                    {children}
                    <Footer lang="en" categories={categories} />
                </>
            ) : (
                <>
                    {children}
                </>
            )}
        </>
    )
}
