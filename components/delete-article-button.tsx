"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DeleteArticleButtonProps {
  articleId: string
}

export default function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("articles").delete().eq("id", articleId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Error deleting article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </>
      )}
    </Button>
  )
}
