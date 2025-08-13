import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import DeleteArticleButton from "@/components/delete-article-button"

export default async function ArticlesPage() {
  const supabase = createClient()

  // Get all articles with author and category info
  const { data: articles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(name, slug),
      author:users(email)
    `)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-3xl text-slate-900">Articles</h1>
          <p className="font-body text-slate-600 mt-2">Manage your blog articles and content.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/articles/new">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Articles List */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-xl text-slate-900">All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {articles && articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-body font-semibold text-slate-900">{article.title}</h3>
                      <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>By {article.author?.email || "Unknown"}</span>
                      {article.category && <span>in {article.category.name}</span>}
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteArticleButton articleId={article.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">No articles yet</h3>
              <p className="font-body text-slate-600 mb-6">Get started by creating your first article.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/articles/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
