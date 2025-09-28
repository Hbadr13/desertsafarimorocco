"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
const LANGS = ["en", "fr", "es"]

export default function AboutPage({ params }: { params: { lang: string } }) {
    const { lang } = params
    const router = useRouter()
    const [about, setAbout] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/client/about`)
            .then(res => res.json())
            .then(data => {
                setAbout({
                    title: data.title?.[lang] || data.title?.en || "",
                    description: data.description?.[lang] || data.description?.en || "",
                })
            })
    }, [lang])

    const handleLangSwitch = (newLang: string) => {
        if (newLang !== lang) {
            router.push(`/${newLang}/about`)
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
            {/* ...display about.title and about.description... */}
        </div>
    )
}
