"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Mail, MessageSquare, Bell, Globe } from "lucide-react"

export default function SettingsPage() {
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: process.env.EMAIL_HOST || "",
    smtpUser: process.env.EMAIL_USER || "",
    smtpPass: "",
    enableEmailNotifications: true,
    adminEmail: process.env.EMAIL_USER || "",
  })

  const [smsSettings, setSmsSettings] = useState({
    apiKey: "",
    enableSmsNotifications: true,
    defaultCountryCode: "+1",
  })

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "TravelExplore",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
    supportEmail: "support@travelexplore.com",
    supportPhone: "+1 (555) 123-4567",
    companyAddress: "123 Travel Street, Adventure City, AC 12345",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSaveSettings = async (settingsType: string) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate saving settings
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(`${settingsType} settings saved successfully!`)
    } catch (error) {
      setError("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and configurations</p>
      </div>

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic site information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={generalSettings.siteUrl}
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, siteUrl: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings((prev) => ({ ...prev, supportPhone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  rows={3}
                  value={generalSettings.companyAddress}
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, companyAddress: e.target.value }))}
                />
              </div>

              <Button onClick={() => handleSaveSettings("General")} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableEmail">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send booking confirmations and notifications via email
                  </p>
                </div>
                <Switch
                  id="enableEmail"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) =>
                    setEmailSettings((prev) => ({ ...prev, enableEmailNotifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={emailSettings.adminEmail}
                    onChange={(e) => setEmailSettings((prev) => ({ ...prev, adminEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpUser: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    value={emailSettings.smtpPass}
                    onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpPass: e.target.value }))}
                    placeholder="Enter new password to change"
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Email")} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Configuration</CardTitle>
              <CardDescription>Configure SMS settings for sending text notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableSms">Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send booking confirmations via SMS</p>
                </div>
                <Switch
                  id="enableSms"
                  checked={smsSettings.enableSmsNotifications}
                  onCheckedChange={(checked) =>
                    setSmsSettings((prev) => ({ ...prev, enableSmsNotifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smsApiKey">SMS API Key</Label>
                  <Input
                    id="smsApiKey"
                    type="password"
                    value={smsSettings.apiKey}
                    onChange={(e) => setSmsSettings((prev) => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter your SMS provider API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countryCode">Default Country Code</Label>
                  <Input
                    id="countryCode"
                    value={smsSettings.defaultCountryCode}
                    onChange={(e) => setSmsSettings((prev) => ({ ...prev, defaultCountryCode: e.target.value }))}
                  />
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Configure your SMS provider (Twilio, AWS SNS, etc.) API credentials to enable SMS notifications.
                </AlertDescription>
              </Alert>

              <Button onClick={() => handleSaveSettings("SMS")} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save SMS Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure when and how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Customer Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Booking Confirmation Email</Label>
                      <p className="text-sm text-muted-foreground">Send email when booking is submitted</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Booking Confirmation SMS</Label>
                      <p className="text-sm text-muted-foreground">Send SMS when booking is submitted</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Trip Reminder Email</Label>
                      <p className="text-sm text-muted-foreground">Send reminder 7 days before trip</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold mb-4">Admin Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Booking Alert</Label>
                      <p className="text-sm text-muted-foreground">Email admin when new booking is received</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Booking Summary</Label>
                      <p className="text-sm text-muted-foreground">Daily email with booking statistics</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Notification")} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
