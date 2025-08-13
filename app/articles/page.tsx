import { createClient } from "@/lib/supabase/server"
import BlogHeader from "@/components/blog-header"
import ArticleCard from "@/components/article-card"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ArticlesPage() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get categories for header
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Get all published articles
  const { data: articles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(*),
      author:users(email)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <BlogHeader user={user} categories={categories || []} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Articles Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="font-heading font-black text-4xl text-slate-900">All Articles</h1>
          </div>
          <p className="font-body text-xl text-slate-600">
            Discover insights from our community of {articles?.length || 0} published article
            {articles?.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/articles"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-body font-medium hover:bg-blue-700 transition-colors"
              >
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-body font-medium hover:bg-slate-200 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h2 className="font-heading font-bold text-2xl text-slate-900 mb-4">No Articles Published</h2>
            <p className="font-body text-slate-600 mb-8 max-w-md mx-auto">
              There are no published articles yet. Check back soon for new content from our community of writers!
            </p>
            {user && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/articles/new">Write the First Article</Link>
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
