// Supabase types that match our database schema
export interface User {
  id: string
  email: string
  created_at: string
  updated_at?: string
}

export interface Prompt {
  id: string
  user_id: string
  title: string
  content: string
  category: string
  tags: string[]
  usage_count: number
  is_public: boolean
  created_at: string
  updated_at: string
  source_url?: string | null
  source_author?: string | null
  notes?: string | null
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatHistory {
  id: string
  user_id: string
  messages: ChatMessage[]
  created_at: string
}

export interface UserSettings {
  id?: string
  user_id: string
  openai_api_key?: string | null
  anthropic_api_key?: string | null
  groq_api_key?: string | null
  preferred_model: string
  created_at?: string
  updated_at?: string
}
