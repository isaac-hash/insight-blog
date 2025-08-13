import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import BlogHeader from "@/components/blog-header"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CommentSection from "@/components/comment-section"
import RelatedArticles from "@/components/related-articles"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get categories for header
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Get the article
  const { data: article } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(*),
      author:users(email)
    `)
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()

  if (!article) {
    notFound()
  }

  // Get approved comments for this article
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      *,
      author:users(email)
    `)
    .eq("article_id", article.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BlogHeader user={user} categories={categories || []} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </Button>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Featured Image */}
          {article.featured_image && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category Badge */}
            {article.category && <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">{article.category.name}</Badge>}

            {/* Title */}
            <h1 className="font-heading font-black text-4xl text-slate-900 mb-4 leading-tight">{article.title}</h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="font-body text-xl text-slate-600 mb-6 leading-relaxed">{article.excerpt}</p>
            )}

            {/* Meta Info */}
            <div className="flex items-center space-x-6 text-slate-500 text-sm mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="font-body">By {article.author?.email || "Anonymous"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="font-body">{formatDate(article.published_at)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none">
              <div className="font-body text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                {article.content}
              </div>
            </div>
          </div>
        </article>

        {/* Comment Section */}
        <div className="mt-12">
          <CommentSection articleId={article.id} user={user} comments={comments || []} />
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <RelatedArticles currentArticleId={article.id} categoryId={article.category_id} />
        </div>
      </main>
    </div>
  )
}
