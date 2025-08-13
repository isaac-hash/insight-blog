import { createClient } from "@/lib/supabase/server"
import BlogHeader from "@/components/blog-header"
import ArticleCard from "@/components/article-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Get featured articles (latest 1)
  const { data: featuredArticles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(*),
      author:users(email)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)

  // Get recent articles (excluding featured)
  const { data: recentArticles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(*),
      author:users(email)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(1, 8)

  return (
    <div className="min-h-screen bg-slate-50">
      <BlogHeader user={user} categories={categories || []} />

      <main>
        {/* Hero Section */}
        <section className="bg-white py-16 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-black text-4xl md:text-6xl text-slate-900 mb-6">
              Explore Insights from <span className="text-blue-600">Diverse Voices</span>
            </h1>
            <p className="font-body text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Curated articles that inform, inspire, and engage from our community of thinkers and storytellers.
            </p>
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 font-body font-semibold">
              <Link href="/auth/signup">Join our community of thinkers and storytellers</Link>
            </Button>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticles && featuredArticles.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading font-black text-3xl text-slate-900">Featured Voice</h2>
              </div>
              <div className="max-w-4xl mx-auto">
                <ArticleCard article={featuredArticles[0]} featured />
              </div>
            </div>
          </section>
        )}

        {/* Recent Articles */}
        {recentArticles && recentArticles.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading font-black text-3xl text-slate-900">Latest Trends</h2>
                <Button variant="outline" asChild>
                  <Link href="/articles" className="font-body font-medium">
                    View All Articles
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading font-black text-3xl text-slate-900 mb-8 text-center">In-Depth Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="font-body text-slate-600 text-sm">{category.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {(!featuredArticles || featuredArticles.length === 0) && (!recentArticles || recentArticles.length === 0) && (
          <section className="py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-heading font-black text-3xl text-slate-900 mb-4">No Articles Yet</h2>
              <p className="font-body text-slate-600 mb-8">Be the first to share your insights with our community.</p>
              {user ? (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/admin">Write Your First Article</Link>
                </Button>
              ) : (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/signup">Join Us to Start Writing</Link>
                </Button>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-black text-lg">I</span>
              </div>
              <span className="font-heading font-black text-xl">InsightHub</span>
            </div>
            <p className="font-body text-slate-400">© 2024 InsightHub. Empowering diverse voices.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
