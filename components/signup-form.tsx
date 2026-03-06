"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignUpForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.")
      } else {
        setSuccess(data.success || "Account created. Check your email.")
        e.currentTarget.reset()
      }
    } catch (err) {
      console.error("Signup request failed", err)
      setError("Failed to submit form.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-body text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-body text-sm">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-body font-medium text-slate-700">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="font-body bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-body font-medium text-slate-700">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="font-body bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 hover:bg-blue-700 font-body font-semibold py-6 text-lg rounded-lg h-[60px]"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="text-center font-body text-slate-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
