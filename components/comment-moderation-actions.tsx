"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CommentModerationActionsProps {
  commentId: string
  currentStatus: string
}

export default function CommentModerationActions({ commentId, currentStatus }: CommentModerationActionsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(newStatus)

    try {
      const { error } = await supabase
        .from("comments")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", commentId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating comment status:", error)
      alert("Error updating comment status. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  if (currentStatus === "approved") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusChange("rejected")}
        disabled={loading === "rejected"}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        {loading === "rejected" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <X className="w-4 h-4 mr-1" />
            Reject
          </>
        )}
      </Button>
    )
  }

  if (currentStatus === "rejected") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusChange("approved")}
        disabled={loading === "approved"}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        {loading === "approved" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Check className="w-4 h-4 mr-1" />
            Approve
          </>
        )}
      </Button>
    )
  }

  // Pending status - show both approve and reject buttons
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusChange("approved")}
        disabled={loading === "approved"}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        {loading === "approved" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Check className="w-4 h-4 mr-1" />
            Approve
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusChange("rejected")}
        disabled={loading === "rejected"}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        {loading === "rejected" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <X className="w-4 h-4 mr-1" />
            Reject
          </>
        )}
      </Button>
    </div>
  )
}
