import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import BlogHeader from "@/components/blog-header"
import ArticleCard from "@/components/article-card"
import { FolderOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get all categories for header
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Get the specific category
  const { data: category } = await supabase.from("categories").select("*").eq("slug", params.slug).single()

  if (!category) {
    notFound()
  }

  // Get articles in this category
  const { data: articles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(*),
      author:users(email)
    `)
    .eq("status", "published")
    .eq("category_id", category.id)
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

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FolderOpen className="w-8 h-8 text-blue-600" />
            <h1 className="font-heading font-black text-4xl text-slate-900">{category.name}</h1>
          </div>
          {category.description && (
            <p className="font-body text-xl text-slate-600 max-w-3xl mx-auto">{category.description}</p>
          )}
          <p className="font-body text-slate-500 mt-4">
            {articles?.length || 0} article{articles?.length === 1 ? "" : "s"} in this category
          </p>
        </div>

        {/* Articles Grid */}
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h2 className="font-heading font-bold text-2xl text-slate-900 mb-4">No Articles Yet</h2>
            <p className="font-body text-slate-600 mb-8 max-w-md mx-auto">
              This category doesn't have any published articles yet. Check back soon for new content!
            </p>
            <div className="space-y-4">
              <p className="font-body text-sm text-slate-500">Explore other categories:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {categories
                  ?.filter((cat) => cat.id !== category.id)
                  .slice(0, 4)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-body font-medium hover:bg-slate-200 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
