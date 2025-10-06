export const revalidate = 3600;

import { notFound, usePathname, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { getDatabase } from "@/lib/mongodb"

const LANGS = ["en", "fr", "es"]

export default async function ClientLayout({ children, params }: { children: React.ReactNode; params: { lang: "en" | "fr" | "es" } }) {
    const { lang } = params
    const db = await getDatabase()

    const categories = await db.collection("categories").find({}).toArray();

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
