import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Award, Globe } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/team-of-travel-professionals-planning-adventures.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">About TravelExplore</h1>
            <p className="text-lg md:text-xl text-balance max-w-2xl mx-auto">
              Your trusted partner in creating unforgettable travel experiences around the world
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-balance">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2015, TravelExplore began with a simple mission: to make extraordinary travel experiences
                  accessible to everyone. What started as a small team of passionate travelers has grown into a trusted
                  global travel company.
                </p>
                <p className="text-muted-foreground mb-4">
                  We believe that travel has the power to transform lives, broaden perspectives, and create lasting
                  memories. Our carefully curated tours and packages are designed to showcase the world's most beautiful
                  destinations while providing authentic cultural experiences.
                </p>
                <p className="text-muted-foreground">
                  Today, we're proud to have helped thousands of travelers discover new places, meet new people, and
                  create stories they'll treasure forever.
                </p>
              </div>
              <div className="relative h-96">
                <Image src="/travel-team-working-together-planning-adventures.jpg" alt="Our team" fill className="object-cover rounded-lg" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">50+</h3>
                  <p className="text-muted-foreground">Countries</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">10,000+</h3>
                  <p className="text-muted-foreground">Happy Travelers</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">200+</h3>
                  <p className="text-muted-foreground">Destinations</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">15+</h3>
                  <p className="text-muted-foreground">Awards Won</p>
                </CardContent>
              </Card>
            </div>

            {/* Values */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-balance">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                These core values guide everything we do and shape every experience we create
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Badge variant="secondary" className="mb-4">
                    Authenticity
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3">Real Experiences</h3>
                  <p className="text-muted-foreground">
                    We focus on authentic, local experiences that give you a true taste of each destination's culture
                    and heritage.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Badge variant="secondary" className="mb-4">
                    Sustainability
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3">Responsible Travel</h3>
                  <p className="text-muted-foreground">
                    We're committed to sustainable tourism practices that benefit local communities and preserve natural
                    environments.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Badge variant="secondary" className="mb-4">
                    Excellence
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3">Quality Service</h3>
                  <p className="text-muted-foreground">
                    From planning to execution, we maintain the highest standards to ensure your travel experience
                    exceeds expectations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
