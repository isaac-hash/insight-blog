import type { NextRequest } from "next/server"
import { signUp } from "@/lib/actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await signUp(null, formData)

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), { status: 400 })
    }

    return new Response(JSON.stringify({ success: result.success }), { status: 200 })
  } catch (err) {
    console.error("/api/signup error", err)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    })
  }
}
