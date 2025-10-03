"use client"

import { GiDesert, GiCampingTent, GiJeep, GiSandstorm, GiCamel } from "react-icons/gi"
import { motion } from "framer-motion"

const translations = {
    en: {
        title: "Our services",
        services: [
            { name: "Camel Trekking", icon: <GiCamel className="text-4xl" /> },
            { name: "Desert Camping", icon: <GiCampingTent className="text-4xl" /> },
            { name: "4x4 Safari", icon: <GiJeep className="text-4xl" /> },
            { name: "Dunes Adventure", icon: <GiDesert className="text-4xl" /> }
        ]
    },
    fr: {
        title: "Nos services",
        services: [
            { name: "Randonnée en Chameau", icon: <GiCamel className="text-4xl" /> },
            { name: "Camping Désert", icon: <GiCampingTent className="text-4xl" /> },
            { name: "Safari 4x4", icon: <GiJeep className="text-4xl" /> },
            { name: "Aventure Dunes", icon: <GiDesert className="text-4xl" /> }
        ]
    },
    es: {
        title: "Nuestros servicios",
        services: [
            { name: "Caminata en Camello", icon: <GiCamel className="text-4xl" /> },
            { name: "Campamento Desierto", icon: <GiCampingTent className="text-4xl" /> },
            { name: "Safari 4x4", icon: <GiJeep className="text-4xl" /> },
            { name: "Aventura en Dunas", icon: <GiDesert className="text-4xl" /> }
        ]
    }
}

export default function DesertServices({ lang = "en" }: { lang?: "en" | "fr" | "es" }) {
    const t = translations[lang] || translations.en

    return (
        <section className="py-10 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <motion.h2
                    // initial={{ opacity: 0, y: 20 }}
                    // whileInView={{ opacity: 1, y: 0 }}
                    // transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                >
                    {t.title}
                </motion.h2>
                <p className="text-gray-600 mb-12 text-lg">Experience the magic of Moroccan deserts</p>

                <div className="grid grid-cols-2 flex-1 md:grid-cols-4 gap-6">
                    {t.services.map((service, i) => (
                        <motion.div
                            key={i}
                            // initial={{ opacity: 0, scale: 0.9 }}
                            // whileInView={{ opacity: 1, scale: 1 }}
                            // whileHover={{ scale: 1.05 }}
                            // transition={{
                            //     delay: i * 0.1,
                            //     duration: 0.4
                            // }}
                            className="group relative h-full "
                        >
                            <div className="bg-white flex  h-full flex-col justify-between items-center rounded-2xl p-8  transition-all duration-300 border border-orange-200 group-hover:border-orange-300">
                                {/* Icon with background */}
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300 mb-4">
                                    <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                                        {service.icon}
                                    </div>
                                </div>

                                {/* Service name */}
                                <h3 className="text-lg flex-1 font-semibold text-gray-800 group-hover:text-orange-700 transition-colors duration-300">
                                    {service.name}
                                </h3>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-orange-200 to-red-200 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom decorative line */}
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mx-auto mt-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                />
            </div>
        </section>
    )
}