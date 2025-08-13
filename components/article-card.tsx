import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt?: string
    featured_image?: string
    published_at: string
    category?: {
      name: string
      slug: string
    }
    author?: {
      email: string
    }
  }
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (featured) {
    return (
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-80 overflow-hidden">
          <img
            src={
              article.featured_image ||
              `/placeholder.svg?height=320&width=600&query=featured article about ${article.title}`
            }
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            {article.category && <Badge className="mb-3 bg-blue-600 hover:bg-blue-700">{article.category.name}</Badge>}
            <Link href={`/article/${article.slug}`}>
              <h2 className="font-heading font-black text-2xl text-white mb-2 group-hover:text-blue-200 transition-colors">
                {article.title}
              </h2>
            </Link>
            {article.excerpt && <p className="text-slate-200 font-body text-sm line-clamp-2 mb-3">{article.excerpt}</p>}
            <div className="flex items-center space-x-4 text-slate-300 text-sm">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="font-body">{article.author?.email || "Anonymous"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="font-body">{formatDate(article.published_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.featured_image || `/placeholder.svg?height=192&width=400&query=article about ${article.title}`}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        {article.category && (
          <Badge variant="secondary" className="mb-3 text-blue-600 bg-blue-50">
            {article.category.name}
          </Badge>
        )}
        <Link href={`/article/${article.slug}`}>
          <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && <p className="text-slate-600 font-body text-sm line-clamp-3 mb-4">{article.excerpt}</p>}
        <div className="flex items-center space-x-4 text-slate-500 text-xs">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span className="font-body">{article.author?.email || "Anonymous"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span className="font-body">{formatDate(article.published_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
