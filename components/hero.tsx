
const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Gradient Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/desert-safari-from-marrakech-with-camels-and-sand-.jpg')`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="  block text-white">Discover Your</span>
                    <span className="block bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                        Next Adventure
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-200 font-light">
                    Explore breathtaking destinations and create unforgettable memories with our curated travel experiences
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className=" rounded-xl px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg shadow-2xl hover:shadow-orange-500/30 transition-shadow duration-300">
                        Explore Destinations
                    </button>

                    <button className="rounded-xl px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                        View Packages
                    </button>
                </div>


            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-3 h-3 bg-amber-400/40 rounded-full blur-sm" />
            <div className="absolute top-40 right-20 w-4 h-4 bg-blue-400/30 rounded-full blur-sm" />
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-purple-400/40 rounded-full blur-sm" />
        </section>
    );
};

export default HeroSection;