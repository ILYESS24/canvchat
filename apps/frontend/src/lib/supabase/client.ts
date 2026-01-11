import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Try process.env first (for Next.js), then global variables (for static hosting)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_SUPABASE_URL__)
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_SUPABASE_ANON_KEY__)

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found, using mock client for build')
    // Return a mock client that doesn't throw errors during build
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
