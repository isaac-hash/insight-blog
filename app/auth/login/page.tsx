import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"
import Link from "next/link"

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to home page
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-black text-lg">I</span>
            </div>
            <span className="font-heading font-black text-xl text-slate-900">InsightHub</span>
          </Link>
          <h1 className="font-heading font-black text-3xl text-slate-900 mb-2">Welcome back</h1>
          <p className="font-body text-slate-600">Sign in to your account to continue reading and engaging.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
