import ArticleForm from "@/components/article-form"

export default function NewArticlePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-black text-3xl text-slate-900">Create New Article</h1>
        <p className="font-body text-slate-600 mt-2">Share your insights with the community.</p>
      </div>

      <ArticleForm />
    </div>
  )
}
