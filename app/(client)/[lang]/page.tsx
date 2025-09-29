"use client"
import HomePage from "@/components/homePage"

export default function Index({ params }: { params: { lang: 'fr' | 'en' | 'es' } }) {

    return (
        <div >
            <HomePage params={params} />
        </div>
    )
}
