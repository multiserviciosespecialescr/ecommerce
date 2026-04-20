import { createClient } from '@supabase/supabase-js'

export type Product = {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  description?: string
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
