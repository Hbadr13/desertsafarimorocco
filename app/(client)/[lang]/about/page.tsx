


'use client'

import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import GallerySection from "@/components/GallerySection";
import DesertServices from "@/components/DesertServices";
import Image from "next/image";
import Link from "next/link";

type Language = "en" | "fr" | "es";

interface Translation {
    aboutTitle: string;
    aboutDescription: string;
    locationTitle: string;
    locationDescription: string;
    galleryTitle: string;
    loadingImages: string;
    viewPackage: string;
    contactTitle: string;
    phoneLabel: string;
    emailLabel: string;
    ourServices: string;
    service1: string;
    service2: string;
    service3: string;
    service4: string;
}

const translations: Record<Language, Translation> = {
    en: {
        aboutTitle: "About Desert safaris Marrakech",
        aboutDescription: "Desert safaris Marrakech is specialized in showing you the authentic Morocco, deeply rooted in culture and history. Our experienced local guides provide travelers the chance to experience Morocco like locals.",
        locationTitle: "Our Location",
        locationDescription: "Our main base is located in Marrakech, and we operate desert tours across Merzouga, Zagora, Mhamid, and Chegaga.",
        galleryTitle: "Gallery",
        loadingImages: "Loading images...",
        viewPackage: "View Package",
        contactTitle: "Contact Information",
        phoneLabel: "Phone",
        emailLabel: "Email",
        ourServices: "Our Services",
        service1: "Desert Camping & Glamping",
        service2: "Camel Trekking Adventures",
        service3: "Cultural Village Tours",
        service4: "Custom Private Tours"
    },
    fr: {
        aboutTitle: "À propos de Desert safaris Marrakech",
        aboutDescription: "Desert safaris Marrakech est spécialisé dans la découverte du Maroc authentique, profondément enraciné dans la culture et l'histoire. Nos guides locaux offrent une expérience immersive.",
        locationTitle: "Notre emplacement",
        locationDescription: "Notre base principale est située à Marrakech, et nous opérons des tours dans le désert à Merzouga, Zagora, Mhamid et Chegaga.",
        galleryTitle: "Galerie",
        loadingImages: "Chargement des images...",
        viewPackage: "Voir le forfait",
        contactTitle: "Informations de contact",
        phoneLabel: "Téléphone",
        emailLabel: "Email",
        ourServices: "Nos Services",
        service1: "Camping et Glamping dans le Désert",
        service2: "Randonnées en Chameau",
        service3: "Visites de Villages Culturels",
        service4: "Tours Privés Personnalisés"
    },
    es: {
        aboutTitle: "Acerca de Desert safaris Marrakech",
        aboutDescription: "Desert safaris Marrakech está especializado en mostrarte el Marruecos auténtico, profundamente arraigado en la cultura y la historia. Nuestros guías locales brindan a los viajeros la oportunidad de experimentar Marruecos como locales.",
        locationTitle: "Nuestra ubicación",
        locationDescription: "Nuestra base principal está ubicada en Marrakech, y operamos tours por el desierto en Merzouga, Zagora, Mhamid y Chegaga.",
        galleryTitle: "Galería",
        loadingImages: "Cargando imágenes...",
        viewPackage: "Ver Paquete",
        contactTitle: "Información de Contacto",
        phoneLabel: "Teléfono",
        emailLabel: "Correo Electrónico",
        ourServices: "Nuestros Servicios",
        service1: "Campamento y Glamping en el Desierto",
        service2: "Aventuras en Camello",
        service3: "Tours de Aldeas Culturales",
        service4: "Tours Privados Personalizados"
    }
};

interface Package {
    id: string;
    slug: string;
    title: string;
    images: string[];
}

interface ImageWithPackage {
    id: string;
    url: string;
    packageId: string;
    packageSlug: string;
    packageTitle: string;
}

export default function AboutPage({ params }: { params: { lang: Language } }) {
    const router = useRouter();
    const t = translations[params.lang] || translations.en;

    const [images, setImages] = useState<ImageWithPackage[]>([]);
    const [loading, setLoading] = useState(true);

    const contactInfo = {
        phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+12395375059",
        email: process.env.NEXT_PUBLIC_EMAIL || "desertsafarismorocco@gmail.com"
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/client/packages`);
                const data = await response.json();

                const allImages: ImageWithPackage[] = [];

                (data.packages || []).forEach((pkg: Package) => {
                    if (pkg.images && Array.isArray(pkg.images)) {
                        pkg.images.forEach((imgUrl: string, index: number) => {
                            allImages.push({
                                id: `${pkg.id}-${index}`,
                                url: imgUrl,
                                packageId: pkg.id,
                                packageSlug: pkg.slug,
                                packageTitle: pkg.title
                            });
                        });
                    }
                });

                console.log("Fetched images with package info:", allImages);
                setImages(allImages);
            } catch (err) {
                console.error("Error fetching packages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [params.lang]);


    return (
        <div className="min-h-screen bg-white pt-16">
            <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-black/60 to-black/40">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/about-bg-dune-bash.jpg"
                        alt="Moroccan Desert Landscape"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-300/30 mb-6">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-amber-100 text-sm font-medium">Desert safaris Marrakech</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        {t.aboutTitle}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-3xl mx-auto">
                        {t.aboutDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href={`/${params.lang}/packages`} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg">
                            Book Your Adventure
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
                <DesertServices lang={params.lang} />

                <div className="bg-white rounded-2xl p-8 shadow-xl border border-amber-200">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.contactTitle}</h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-1 items-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{t.phoneLabel}</p>
                                <p className="text-lg font-semibold text-gray-900">{contactInfo.phone}</p>
                            </div>
                        </div>
                        <div className="flex flex-1 items-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{t.emailLabel}</p>
                                <p className=" text-xs md:text-lg font-semibold text-gray-900 break-all">{contactInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900">
                            {t.locationTitle}
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {t.locationDescription}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "Marrakech", emoji: "🏰", desc: "Main Base" },
                                { name: "Merzouga", emoji: "🏜️", desc: "Desert Tours" },
                                { name: "Zagora", emoji: "🐫", desc: "Expeditions" },
                                { name: "Chegaga", emoji: "⭐", desc: "Adventures" }
                            ].map((location, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl shadow-lg border border-amber-200 text-center">
                                    <div className="text-2xl mb-2">{location.emoji}</div>
                                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                                    <p className="text-sm text-amber-600">{location.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.104231294925!2d-7.993153724277722!3d31.63085924263215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5955a5c08d69b588!2sMarrakech%2C%20Morocco!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>

                <GallerySection images={images} lang={params.lang} />
            </div>
        </div>
    );
}