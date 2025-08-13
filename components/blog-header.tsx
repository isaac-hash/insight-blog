"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface BlogHeaderProps {
  user?: any
  categories?: Array<{ id: string; name: string; slug: string }>
}

export default function BlogHeader({ user, categories = [] }: BlogHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-black text-lg">I</span>
            </div>
            <span className="font-heading font-black text-xl text-slate-900">InsightHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-body font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link
              href="/articles"
              className="font-body font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              All Articles
            </Link>
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="font-body font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
            </form>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <span className="font-body text-sm text-slate-600">{user.email}</span>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin" className="font-body font-medium">
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login" className="font-body font-medium">
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/signup" className="font-body font-medium">
                    Join Us
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2 px-2">
              <Link
                href="/"
                className="block font-body font-medium text-slate-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className="block font-body font-medium text-slate-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block font-body font-medium text-slate-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            <div className="px-2 pt-4 border-t border-slate-200">
              {user ? (
                <div className="space-y-2">
                  <p className="font-body text-sm text-slate-600">{user.email}</p>
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                      Join Us
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
