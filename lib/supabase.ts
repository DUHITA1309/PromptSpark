import { createClient } from "@supabase/supabase-js";

console.log("🔍 URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("🔍 KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;



// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)



// Types for our database
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string
          tags: string[]
          usage_count: number
          is_public: boolean
          source_url: string | null
          source_author: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category?: string
          tags?: string[]
          usage_count?: number
          is_public?: boolean
          source_url?: string | null
          source_author?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          usage_count?: number
          is_public?: boolean
          source_url?: string | null
          source_author?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          messages: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: any
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          openai_api_key: string | null
          anthropic_api_key: string | null
          groq_api_key: string | null
          preferred_model: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          openai_api_key?: string | null
          anthropic_api_key?: string | null
          groq_api_key?: string | null
          preferred_model?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          openai_api_key?: string | null
          anthropic_api_key?: string | null
          groq_api_key?: string | null
          preferred_model?: string
          created_at?: string
          updated_at?: string
        }
      }
      shared_prompts: {
        Row: {
          id: string
          prompt_id: string
          share_token: string
          is_active: boolean
          view_count: number
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          prompt_id: string
          share_token: string
          is_active?: boolean
          view_count?: number
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          prompt_id?: string
          share_token?: string
          is_active?: boolean
          view_count?: number
          created_at?: string
          expires_at?: string | null
        }
      }
    }
  }
}

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
