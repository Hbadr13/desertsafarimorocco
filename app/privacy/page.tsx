import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Last updated: January 1, 2024
            </p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, make a
                    booking, or contact us for support. This may include:
                  </p>
                  <ul>
                    <li>Personal information (name, email address, phone number)</li>
                    <li>Payment information (credit card details, billing address)</li>
                    <li>Travel preferences and booking history</li>
                    <li>Communication preferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Process your bookings and provide travel services</li>
                    <li>Communicate with you about your trips and our services</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Information Sharing</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your
                    consent, except in the following circumstances:
                  </p>
                  <ul>
                    <li>With service providers who assist us in operating our website and conducting business</li>
                    <li>With travel partners (hotels, airlines, tour operators) to fulfill your bookings</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Security</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized
                    access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                    is 100% secure.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Rights</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your personal information</li>
                  </ul>
                  <p>To exercise these rights, please contact us at privacy@travelexplore.com.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cookies</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We use cookies and similar technologies to enhance your browsing experience, analyze website
                    traffic, and personalize content. You can control cookie settings through your browser preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Changes to This Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any changes by posting
                    the new policy on this page and updating the "Last updated" date.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>If you have any questions about this privacy policy, please contact us at:</p>
                  <p>
                    Email: privacy@travelexplore.com
                    <br />
                    Phone: +1 (555) 123-4567
                    <br />
                    Address: 123 Travel Street, Adventure City, AC 12345
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
