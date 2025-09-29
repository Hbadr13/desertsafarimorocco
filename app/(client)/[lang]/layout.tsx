"use client"
import { notFound, usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import Header from "@/components/header"
import { Footer } from "@/components/footer"

const LANGS = ["en", "fr", "es"]

export default function ClientLayout({ children, params }: { children: React.ReactNode; params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params
    const [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        fetch(`/api/client/categories`)
            .then(res => res.json())
            .then(catData => {
                setCategories((catData.categories || []).map((cat: any) => ({
                    ...cat,
                    title: cat.title || "",
                    description: cat.description || "",
                    shortDescription: cat.shortDescription || "",
                })))
            })
    }, [])
    if (!LANGS.includes(lang))
        return notFound()
    return (
        <div>
            <Header lang={lang} categories={categories} />
            {children}
            <Footer lang={lang} categories={categories} />
        </div>
    )
}
