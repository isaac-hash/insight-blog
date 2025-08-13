"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, User, Calendar, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    email: string
  }
}

interface CommentSectionProps {
  articleId: string
  user: any
  comments: Comment[]
}

export default function CommentSection({ articleId, user, comments }: CommentSectionProps) {
  const router = useRouter()
  const supabase = createClient()
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setLoading(true)

    try {
      const { error } = await supabase.from("comments").insert([
        {
          article_id: articleId,
          author_id: user.id,
          content: newComment.trim(),
          status: "pending", // Comments start as pending for moderation
        },
      ])

      if (error) throw error

      setNewComment("")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error("Error submitting comment:", error)
      alert("Error submitting comment. Please try again.")
    } finally {
      setLoading(false)
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
      {/* Comments Header */}
      <div className="flex items-center space-x-3">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="font-heading font-bold text-2xl text-slate-900">Comments ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      {user ? (
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg text-slate-900">Join the Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-body text-sm mb-4">
                Your comment has been submitted and is awaiting moderation. Thank you for engaging with our community!
              </div>
            )}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this article..."
                rows={4}
                className="font-body resize-none"
                required
              />
              <div className="flex items-center justify-between">
                <p className="font-body text-sm text-slate-600">
                  Commenting as <span className="font-semibold">{user.email}</span>
                </p>
                <Button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Post Comment"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">Join the Conversation</h3>
            <p className="font-body text-slate-600 mb-4">
              Sign in to share your thoughts and engage with our community of thinkers.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/signup">Join Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id} className="border border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-body font-semibold text-slate-900">{comment.author.email}</span>
                      <div className="flex items-center space-x-1 text-slate-500 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span className="font-body">{formatDate(comment.created_at)}</span>
                      </div>
                    </div>
                    <p className="font-body text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-slate-200">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">No Comments Yet</h3>
            <p className="font-body text-slate-600">
              Be the first to share your thoughts on this article and start the conversation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
