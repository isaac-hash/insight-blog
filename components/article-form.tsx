"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface ArticleFormProps {
  article?: any
  isEditing?: boolean
}

export default function ArticleForm({ article, isEditing = false }: ArticleFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    featured_image: article?.featured_image || "",
    category_id: article?.category_id || "",
    status: article?.status || "draft",
  })

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from("categories").select("*").order("name")
      setCategories(data || [])
    }
    loadCategories()
  }, [supabase])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const articleData = {
        ...formData,
        author_id: user.id,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }

      if (isEditing && article) {
        const { error } = await supabase.from("articles").update(articleData).eq("id", article.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("articles").insert([articleData])

        if (error) throw error
      }

      router.push("/admin/articles")
    } catch (error) {
      console.error("Error saving article:", error)
      alert("Error saving article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <CardTitle className="font-heading font-bold text-xl text-slate-900">
          {isEditing ? "Edit Article" : "Article Details"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-body font-medium text-slate-700">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title"
                required
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="font-body font-medium text-slate-700">
                Slug *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="article-slug"
                required
                className="font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="font-body font-medium text-slate-700">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description of the article"
              rows={3}
              className="font-body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="font-body font-medium text-slate-700">
              Content *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your article content here..."
              rows={12}
              required
              className="font-body"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="font-body font-medium text-slate-700">
                Category
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="font-body font-medium text-slate-700">
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image" className="font-body font-medium text-slate-700">
                Featured Image URL
              </Label>
              <Input
                id="featured_image"
                value={formData.featured_image}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="font-body"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Article"
              ) : (
                "Create Article"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
