"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CategoryImage {
    id: string
    url: string
    packageTitle: {
        en: string,
        fr: string,
        es: string
    },
    packageSlug: string
}

interface GallerySectionProps {
    images: CategoryImage[]
    loading?: boolean
    lang: "en" | "fr" | "es"
}

const categoryTranslations = {
    en: {
        galleryTitle: "Gallery",
        description: "Discover the beauty of Morocco through our curated collection of desert adventures and cultural experiences.",
        loadingImages: "Loading images...",
        viewPackage: "View Package"
    },
    fr: {
        galleryTitle: "Galerie",
        description: "Découvrez la beauté du Maroc à travers notre collection soigneusement sélectionnée d'aventures désertiques et d'expériences culturelles.",
        loadingImages: "Chargement des images...",
        viewPackage: "Voir le Forfait"
    },
    es: {
        galleryTitle: "Galería",
        description: "Descubra la belleza de Marruecos a través de nuestra colección curada de aventuras en el desierto y experiencias culturales.",
        loadingImages: "Cargando imágenes...",
        viewPackage: "Ver Paquete"
    }
}

export default function GallerySection({
    images,
    loading = false,
    lang,
}: GallerySectionProps) {
    const t = categoryTranslations[lang]
    const router = useRouter()
    const [shuffledImages, setShuffledImages] = useState<CategoryImage[]>([])

    useEffect(() => {
        const shuffled = [...images].sort(() => Math.random() - 0.5)
        setShuffledImages(shuffled)
    }, [images])

    const handleImageClick = (image: CategoryImage) => {
        router.push(`/${lang}/packages/${image.packageSlug}`);
    };

    return (
        <section className="space-y-5 max-w-5xl mx-auto pt-6">
            <div className="text-center">
                <h2 className=" text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t.galleryTitle}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg">
                    {t.description}
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">{t.loadingImages}</p>
                </div>
            ) : shuffledImages.length > 0 ? (
                <div className="space-y-8">
                    <div className="rounded-2xl overflow-hidden shadow-2xl relative">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            spaceBetween={0}
                            slidesPerView={1}
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                },
                            }}
                            className="w-full"
                        >
                            {shuffledImages.slice(0, 40).map((image) => (
                                <SwiperSlide key={image.id}>
                                    <div
                                        className="relative w-full h-64 md:h-96 cursor-pointer group "
                                        onClick={() => handleImageClick(image)}
                                    >
                                        <Image
                                            src={image.url}
                                            alt="My Image"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end">
                                            <div className="p-8 text-white w-full">
                                                <div className="transform transition-transform duration-500">
                                                    <h3 className=" text-base md:text-xl font-bold mb-2 transition-opacity duration-500">
                                                        {image.packageTitle[lang]}
                                                    </h3>
                                                    <div className="flex items-center transition-opacity duration-500 delay-200">
                                                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                            {t.viewPackage}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                    <p className="text-gray-500 text-lg">{t.loadingImages}</p>
                </div>
            )}
        </section>
    )
}
