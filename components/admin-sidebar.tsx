"use client"


import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, FolderOpen, MessageSquare, Users, LogOut, Home } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  user: any
  userRole: string
}

export default function AdminSidebar({ user, userRole }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign-out failed:", error.message)
    }
    // Navigate back to home regardless so the UI updates
    router.push("/")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Articles",
      href: "/admin/articles",
      icon: FileText,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
    },
    {
      name: "Comments",
      href: "/admin/comments",
      icon: MessageSquare,
    },
    ...(userRole === "admin"
      ? [
          {
            name: "Users",
            href: "/admin/users",
            icon: Users,
          },
        ]
      : []),
  ]

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-slate-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-black text-lg">I</span>
            </div>
            <span className="font-heading font-black text-xl text-slate-900">InsightHub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg font-body font-medium transition-colors",
                  isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="border-t border-slate-200 p-4 space-y-3">
          <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Link>
          </Button>

          <div className="text-sm text-slate-600 px-2">
            <div className="font-body font-medium">{user.email}</div>
            <div className="text-xs text-slate-500 capitalize">{userRole}</div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-slate-600 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
