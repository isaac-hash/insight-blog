import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export const createClient = () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    // minimal stub similar to server-side version; mainly we need auth
    // methods such as signOut used by client components.
    const builder = () => {
      const b: any = {}
      const chain = () => b
      b.select = chain
      b.order = chain
      b.eq = chain
      b.limit = chain
      b.range = chain
      b.single = chain
      b.insert = chain
      b.update = chain
      b.delete = chain
      b.then = (resolve: any) => resolve({ data: [], error: null })
      return b
    }

    const stub: any = {
      auth: {
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => builder(),
    }
    return stub
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// Keep the singleton instance for backward compatibility
export const supabase = createClient()
