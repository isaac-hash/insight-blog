import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CommentModerationActions from "@/components/comment-moderation-actions"
import { MessageSquare, User, Calendar } from "lucide-react"

export default async function CommentsPage() {
  const supabase = createClient()

  // Get all comments with article and author info
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      *,
      article:articles(title, slug),
      author:users(email)
    `)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-3xl text-slate-900">Comments</h1>
        <p className="font-body text-slate-600 mt-2">Moderate and manage user comments across all articles.</p>
      </div>

      {/* Comments List */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-xl text-slate-900">All Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {comments && comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(comment.status)}>{comment.status}</Badge>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span className="font-body">{comment.author?.email || "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-body">{formatDate(comment.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <CommentModerationActions commentId={comment.id} currentStatus={comment.status} />
                  </div>

                  <div className="mb-4">
                    <h3 className="font-body font-semibold text-slate-900 mb-1">
                      On: {comment.article?.title || "Unknown Article"}
                    </h3>
                    <p className="font-body text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">No Comments Yet</h3>
              <p className="font-body text-slate-600">Comments will appear here as users engage with your articles.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
