"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 font-body font-semibold py-6 text-lg rounded-lg h-[60px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/")
    }
  }, [state, router])

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-body text-sm">
            {state.error}
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

        <SubmitButton />

        <div className="text-center font-body text-slate-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
