import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to check role
  const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

  // For now, allow all authenticated users to access admin
  // In production, you might want to restrict to admin role only

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <AdminSidebar user={user} userRole={userProfile?.role || "user"} />
        <main className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
