import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Prompt = Database["public"]["Tables"]["prompts"]["Row"]
type PromptInsert = Database["public"]["Tables"]["prompts"]["Insert"]
type PromptUpdate = Database["public"]["Tables"]["prompts"]["Update"]

type ChatHistory = Database["public"]["Tables"]["chat_history"]["Row"]
type ChatHistoryInsert = Database["public"]["Tables"]["chat_history"]["Insert"]

export const databaseService = {
  // Prompts
  async getPrompts(userId: string): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching prompts:", error)
      return []
    }

    return data || []
  },

  async savePrompt(prompt: PromptInsert): Promise<Prompt | null> {
    const { data, error } = await supabase.from("prompts").insert(prompt).select().single()

    if (error) {
      console.error("Error saving prompt:", error)
      throw error
    }

    return data
  },

  async updatePrompt(id: string, updates: PromptUpdate): Promise<Prompt | null> {
    const { data, error } = await supabase.from("prompts").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating prompt:", error)
      throw error
    }

    return data
  },

  async deletePrompt(id: string): Promise<boolean> {
    const { error } = await supabase.from("prompts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting prompt:", error)
      return false
    }

    return true
  },

  async incrementUsageCount(id: string): Promise<void> {
    // Get current prompt
    const { data: prompt } = await supabase.from("prompts").select("usage_count").eq("id", id).single()

    if (prompt) {
      await supabase
        .from("prompts")
        .update({
          usage_count: prompt.usage_count + 1,
        })
        .eq("id", id)
    }
  },

  // Chat History
  async getChatHistory(userId: string): Promise<ChatHistory[]> {
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching chat history:", error)
      return []
    }

    return data || []
  },

  async saveChatHistory(chatHistory: ChatHistoryInsert): Promise<ChatHistory | null> {
    const { data, error } = await supabase.from("chat_history").insert(chatHistory).select().single()

    if (error) {
      console.error("Error saving chat history:", error)
      throw error
    }

    return data
  },

  // Public prompts
  async getPublicPrompts(): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_public", true)
      .order("usage_count", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching public prompts:", error)
      return []
    }

    return data || []
  },
}
