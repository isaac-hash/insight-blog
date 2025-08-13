import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, MessageSquare, Users } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get statistics
  const [{ count: articlesCount }, { count: categoriesCount }, { count: commentsCount }, { count: usersCount }] =
    await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ])

  // Get recent articles
  const { data: recentArticles } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(name),
      author:users(email)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Total Articles",
      value: articlesCount || 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Categories",
      value: categoriesCount || 0,
      icon: FolderOpen,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Comments",
      value: commentsCount || 0,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Users",
      value: usersCount || 0,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-3xl text-slate-900">Dashboard</h1>
        <p className="font-body text-slate-600 mt-2">Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-600">{stat.title}</p>
                  <p className="font-heading font-bold text-2xl text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-xl text-slate-900">Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {recentArticles && recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-slate-900">{article.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                      <span>By {article.author?.email || "Unknown"}</span>
                      {article.category && <span>in {article.category.name}</span>}
                      <span className="capitalize">{article.status}</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">{new Date(article.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="font-body text-slate-600">No articles yet. Create your first article to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
