"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, User2Icon } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/desert26safariadmin/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card className="w-full max-w-md shadow-xl rounded-2xl border border-slate-200">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-extrabold text-slate-900">Admin Login</CardTitle>
        <CardDescription className="text-slate-600">
          Enter your credentials to access your admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email" className="font-medium text-slate-700">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10 rounded-xl placeholder:opacity-50 border border-blue-300 focus:border-blue-900 ring-0  duration-200 transition-all"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <User2Icon width={16}/>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="font-medium text-slate-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10 rounded-xl placeholder:opacity-50 border border-blue-300 focus:border-blue-900 ring-0  duration-200 transition-all"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Lock width={16}/>
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 transition-all flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <Link
              href="/desert26safariadmin/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
)

}
