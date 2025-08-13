import { createClient } from "@/lib/supabase/server"
import BlogHeader from "@/components/blog-header"
import ArticleCard from "@/components/article-card"
import { Search } from "lucide-react"

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient()
  const query = searchParams.q || ""

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get categories for header
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Search articles if query exists
  let searchResults: any[] = []
  if (query.trim()) {
    const { data } = await supabase
      .from("articles")
      .select(`
        *,
        category:categories(*),
        author:users(email)
      `)
      .eq("status", "published")
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order("published_at", { ascending: false })

    searchResults = data || []
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BlogHeader user={user} categories={categories || []} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Search className="w-8 h-8 text-blue-600" />
            <h1 className="font-heading font-black text-4xl text-slate-900">Search Results</h1>
          </div>
          {query ? (
            <p className="font-body text-xl text-slate-600">
              {searchResults.length > 0
                ? `Found ${searchResults.length} article${searchResults.length === 1 ? "" : "s"} for "${query}"`
                : `No articles found for "${query}"`}
            </p>
          ) : (
            <p className="font-body text-xl text-slate-600">Enter a search term to find articles</p>
          )}
        </div>

        {/* Search Results */}
        {query && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* No Results */}
        {query && searchResults.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h2 className="font-heading font-bold text-2xl text-slate-900 mb-4">No Articles Found</h2>
            <p className="font-body text-slate-600 mb-8 max-w-md mx-auto">
              We couldn't find any articles matching your search. Try different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories?.slice(0, 4).map((category) => (
                <a
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-body font-medium hover:bg-blue-100 transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h2 className="font-heading font-bold text-2xl text-slate-900 mb-4">Search Our Articles</h2>
            <p className="font-body text-slate-600 mb-8 max-w-md mx-auto">
              Use the search bar above to find articles on topics that interest you.
            </p>
            <div className="space-y-4">
              <p className="font-body text-sm text-slate-500">Popular categories:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {categories?.map((category) => (
                  <a
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-body font-medium hover:bg-slate-200 transition-colors"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
