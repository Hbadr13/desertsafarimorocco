'use client'

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

type Language = "en" | "fr" | "es";

interface Translation {
    contactTitle: string;
    contactSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submittingButton: string;
    successMessage: string;
    errorMessage: string;
    ourInfo: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    followUs: string;
    requiredField: string;
    invalidEmail: string;
}

const translations: Record<Language, Translation> = {
    en: {
        contactTitle: "Get In Touch",
        contactSubtitle: "Ready to start your Moroccan adventure? Contact us and we'll help you plan the perfect desert experience.",
        nameLabel: "Full Name",
        namePlaceholder: "Enter your full name",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email address",
        phoneLabel: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        subjectLabel: "Subject",
        subjectPlaceholder: "What is this regarding?",
        messageLabel: "Your Message",
        messagePlaceholder: "Tell us about your desired adventure...",
        submitButton: "Send Message",
        submittingButton: "Sending...",
        successMessage: "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
        errorMessage: "Sorry, there was an error sending your message. Please try again or contact us directly.",
        ourInfo: "Our Information",
        address: "Marrakech, Morocco",
        phone: "Phone",
        email: "Email",
        hours: "Working Hours",
        followUs: "Follow Us",
        requiredField: "This field is required",
        invalidEmail: "Please enter a valid email address"
    },
    fr: {
        contactTitle: "Contactez-Nous",
        contactSubtitle: "Prêt à commencer votre aventure marocaine ? Contactez-nous et nous vous aiderons à planifier l'expérience désertique parfaite.",
        nameLabel: "Nom Complet",
        namePlaceholder: "Entrez votre nom complet",
        emailLabel: "Adresse Email",
        emailPlaceholder: "Entrez votre adresse email",
        phoneLabel: "Numéro de Téléphone",
        phonePlaceholder: "Entrez votre numéro de téléphone",
        subjectLabel: "Sujet",
        subjectPlaceholder: "De quoi s'agit-il ?",
        messageLabel: "Votre Message",
        messagePlaceholder: "Parlez-nous de l'aventure que vous souhaitez...",
        submitButton: "Envoyer le Message",
        submittingButton: "Envoi en cours...",
        successMessage: "Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.",
        errorMessage: "Désolé, une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer ou nous contacter directement.",
        ourInfo: "Nos Informations",
        address: "Marrakech, Maroc",
        phone: "Téléphone",
        email: "Email",
        hours: "Heures de Travail",
        followUs: "Suivez-Nous",
        requiredField: "Ce champ est obligatoire",
        invalidEmail: "Veuillez entrer une adresse email valide"
    },
    es: {
        contactTitle: "Póngase en Contacto",
        contactSubtitle: "¿Listo para comenzar su aventura marroquí? Contáctenos y le ayudaremos a planificar la experiencia desértica perfecta.",
        nameLabel: "Nombre Completo",
        namePlaceholder: "Ingrese su nombre completo",
        emailLabel: "Correo Electrónico",
        emailPlaceholder: "Ingrese su correo electrónico",
        phoneLabel: "Número de Teléfono",
        phonePlaceholder: "Ingrese su número de teléfono",
        subjectLabel: "Asunto",
        subjectPlaceholder: "¿Sobre qué se trata?",
        messageLabel: "Su Mensaje",
        messagePlaceholder: "Cuéntenos sobre la aventura que desea...",
        submitButton: "Enviar Mensaje",
        submittingButton: "Enviando...",
        successMessage: "¡Gracias! Su mensaje ha sido enviado con éxito. Le responderemos dentro de 24 horas.",
        errorMessage: "Lo sentimos, hubo un error al enviar su mensaje. Por favor, inténtelo de nuevo o contáctenos directamente.",
        ourInfo: "Nuestra Información",
        address: "Marrakech, Marruecos",
        phone: "Teléfono",
        email: "Correo Electrónico",
        hours: "Horario de Trabajo",
        followUs: "Síganos",
        requiredField: "Este campo es obligatorio",
        invalidEmail: "Por favor ingrese un correo electrónico válido"
    }
};

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
}

export default function ContactPage({ params }: { params: { lang: Language } }) {
    const t = translations[params.lang] || translations.en;

    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    const contactInfo = {
        phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+212-600-000000",
        email: process.env.NEXT_PUBLIC_EMAIL || "contact@desertsafarimorocco.com",
        address: "Marrakech, Morocco",
        hours: "Mon - Sun: 8:00 AM - 10:00 PM"
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = t.requiredField;
        if (!formData.email.trim()) {
            newErrors.email = t.requiredField;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t.invalidEmail;
        }
        if (!formData.subject.trim()) newErrors.subject = t.requiredField;
        if (!formData.message.trim()) newErrors.message = t.requiredField;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-12">
            <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-black/60 to-black/40">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/contact-us-bg-marrakech.png"
                        alt="Moroccan Desert Contact"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-300/30 mb-6">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-amber-100 text-sm font-medium">Contact Us</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        {t.contactTitle}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                        {t.contactSubtitle}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-amber-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.ourInfo}</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{t.address}</h3>
                                        <p className="text-gray-600 break-all">{contactInfo.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{t.phone}</h3>
                                        <p className="text-gray-600">{contactInfo.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{t.email}</h3>
                                        <p className="text-gray-600 break-all">{contactInfo.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{t.hours}</h3>
                                        <p className="text-gray-600">{contactInfo.hours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-amber-400 rounded-2xl p-8 shadow-xl text-white">
                            <h3 className="text-xl font-bold mb-4">{t.followUs}</h3>
                            <div className="flex space-x-4">
                                {[
                                    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'hover:bg-amber-600' },
                                    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'hover:bg-pink-600' },
                                    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'hover:bg-amber-400' },
                                    { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'hover:bg-red-600' }
                                ].map((social, index) => (
                                    <button
                                        key={index}
                                        className={`w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 backdrop-blur-sm`}
                                    >
                                        {social.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-amber-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.nameLabel} *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                } focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all`}
                                            placeholder={t.namePlaceholder}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.emailLabel} *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                } focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all`}
                                            placeholder={t.emailPlaceholder}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.phoneLabel}
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                            placeholder={t.phonePlaceholder}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.subjectLabel} *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                                } focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all`}
                                            placeholder={t.subjectPlaceholder}
                                        />
                                        {errors.subject && (
                                            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.messageLabel} *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none`}
                                        placeholder={t.messagePlaceholder}
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all hover:from-amber-600 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            {t.submittingButton}
                                        </div>
                                    ) : (
                                        t.submitButton
                                    )}
                                </button>

                                {submitStatus === 'success' && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <p className="text-green-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {t.successMessage}
                                        </p>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            {t.errorMessage}
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}