import { createClient } from "@/lib/supabase/server"
import ArticleCard from "@/components/article-card"

interface RelatedArticlesProps {
  currentArticleId: string
  categoryId?: string
}

export default async function RelatedArticles({ currentArticleId, categoryId }: RelatedArticlesProps) {
  const supabase = createClient()

  // Get related articles from the same category, excluding current article
  const { data: relatedArticles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(*),
      author:users(email)
    `)
    .eq("status", "published")
    .neq("id", currentArticleId)
    .eq("category_id", categoryId || "")
    .order("published_at", { ascending: false })
    .limit(3)

  if (!relatedArticles || relatedArticles.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="font-heading font-black text-2xl text-slate-900 mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
