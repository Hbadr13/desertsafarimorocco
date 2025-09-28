"use client"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import React from "react"

const LANGS = ["en", "fr", "es"]

export default function ClientLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
    const pathname = usePathname()
    const router = useRouter()
    const { lang } = params

    // Replace the lang in the current path
    const handleLangSwitch = (newLang: string) => {
        if (newLang !== lang) {
            router.push(pathname.replace(/^\/(en|fr|es)/, `/${newLang}`))
        }
    }

    return (
        <div>
            <nav className="flex gap-2 p-4 border-b bg-white">
                {LANGS.map(l => (
                    <Button key={l} variant={l === lang ? "default" : "outline"} onClick={() => handleLangSwitch(l)}>
                        {l.toUpperCase()}
                    </Button>
                ))}
                {/* ...other navbar items... */}
            </nav>
            {children}
        </div>
    )
}
