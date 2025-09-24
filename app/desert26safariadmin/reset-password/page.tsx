"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, User2, Lock } from "lucide-react"

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      })

      const data = await response.json()
      if (response.ok) {
        router.push("/desert26safariadmin/login?message=Password reset successful")
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-slate-200">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold text-slate-900">Reset Password</CardTitle>
          <CardDescription className="text-slate-600">Enter your email and new password below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert className="rounded-xl bg-red-500 border-white text-white" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="font-medium text-slate-700">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 rounded-xl placeholder:opacity-50 border border-blue-300 focus:border-blue-900 ring-0 duration-200 transition-all"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <User2 width={16} />
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="font-medium text-slate-700">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pl-10 rounded-xl placeholder:opacity-50 border border-blue-300 focus:border-blue-900 ring-0 duration-200 transition-all"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Lock width={16} />
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="font-medium text-slate-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pl-10 rounded-xl placeholder:opacity-50 border border-blue-300 focus:border-blue-900 ring-0 duration-200 transition-all"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Lock width={16} />
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 transition-all flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/desert26safariadmin/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center justify-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
