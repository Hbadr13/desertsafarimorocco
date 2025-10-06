import Link from "next/link";

const translations: Record<'en' | 'fr' | 'es', {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    exploreBtn: string;
    packagesBtn: string;
}> = {
    en: {
        titleLine1: "Discover The Magic Of",
        titleLine2: "Moroccan Deserts",
        subtitle: "We organize desert tours in the Great Moroccan Sahara for an authentic and unforgettable experience.",
        exploreBtn: "Explore Destinations",
        packagesBtn: "View All Tours"
    },
    fr: {
        titleLine1: "Découvrez la Magie de",
        titleLine2: "Déserts Marocains",
        subtitle: "Nous organisons des excursions dans le désert du Grand Sahara marocain pour une expérience authentique et inoubliable.",
        exploreBtn: "Explorer les Destinations",
        packagesBtn: "Voir Toutes les Excursions"
    },
    es: {
        titleLine1: "Descubre la Magia de",
        titleLine2: "Desiertos Marroquíes",
        subtitle: "Organizamos tours por el desierto del Gran Sahara marroquí para una experiencia auténtica e inolvidable.",
        exploreBtn: "Explorar Destinos",
        packagesBtn: "Ver Todas las Excursiones"
    }
}

const HeroSection = ({ lang }: { lang: 'fr' | 'en' | 'es' }) => {
    const t = translations[lang];

    return (
        <section className="pt-16 relative min-h-[600px] h-[80vw] max-h-[700px] flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/desert-safari-from-marrakech-with-camels-and-sand-.jpg')`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
            </div>

            <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="block text-white">{t.titleLine1}</span>
                    <span className="block bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                        {t.titleLine2}
                    </span>
                </h1>

                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-200 font-light">
                    {t.subtitle}
                </p>

                <div className="flex flex-row gap-4 justify-center items-center">
                    <Link href={`/${lang}/packages`} className="rounded-xl px-2 md:px-8 py-2 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm md:text-lg shadow-2xl hover:shadow-orange-500/30 transition-shadow duration-300">
                        {t.exploreBtn}
                    </Link>

                    <Link href={`/${lang}/categories/desert-safaris`} className="rounded-xl px-2 md:px-8 py-2 md:py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-sm md:text-lg hover:bg-white/20 transition-all duration-300">
                        {t.packagesBtn}
                    </Link>
                </div>
            </div>

            <div className="absolute top-20 left-10 w-3 h-3 bg-amber-400/40 rounded-full blur-sm" />
            <div className="absolute top-40 right-20 w-4 h-4 bg-blue-400/30 rounded-full blur-sm" />
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-purple-400/40 rounded-full blur-sm" />
        </section>
    );
};

export default HeroSection;
