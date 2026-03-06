import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { cache } from "react"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a cached version of the Supabase client for Server Components
import type { SupabaseClient } from "@supabase/supabase-js"

export const createClient = cache((): SupabaseClient<any, "public", any> => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    // Provide a fake client that implements the minimal pieces our server
    // components rely on.  This avoids runtime crashes with "supabase.from is
    // not a function" when preview environments (like GitHub.dev) lack the
    // necessary env vars.  The builder methods are chainable and `select`
    // /`single` always return an empty result.
    const createBuilder = () => {
      const builder: any = {}
      const chain = () => builder

      // chainable methods - each returns the builder so you can keep calling
      // additional query modifiers.  select itself does not execute the query;
      // awaiting the builder performs the no-op lookup.
      builder.select = chain
      builder.order = chain
      builder.eq = chain
      builder.limit = chain
      builder.range = chain

      // these methods usually terminate the query and return a result; we
      // simulate a no-op response but still remain awaitable.
      builder.single = chain
      builder.insert = chain
      builder.update = chain
      builder.delete = chain

      // make the builder thenable so `await builder` returns an empty result
      builder.then = (resolve: any) => resolve({ data: [], error: null })

      return builder
    }

    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
      from: () => createBuilder(),
    } as unknown as SupabaseClient<any, "public", any>
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // supabase-js does not currently expose the `cookies` option in its
    // TypeScript definitions, but the runtime accepts it.  Cast the whole
    // options object to `any` and ignore the TS errors so we can continue
    // passing our helper for server-side cookies.
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    {
      cookies: {
        get(name: string) {
          const store = cookies() as any
          return store?.get(name)?.value
        },
      },
    } as any,
  )
})
