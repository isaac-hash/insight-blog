import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ArticleForm from "@/components/article-form"

interface EditArticlePageProps {
  params: {
    id: string
  }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const supabase = createClient()

  // Get the article
  const { data: article } = await supabase.from("articles").select("*").eq("id", params.id).single()

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-black text-3xl text-slate-900">Edit Article</h1>
        <p className="font-body text-slate-600 mt-2">Update your article content and settings.</p>
      </div>

      <ArticleForm article={article} isEditing />
    </div>
  )
}
