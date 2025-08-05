import { supabase } from "./supabase"

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

export const settingsService = {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user settings:", error)
      return null
    }

    return data
  },

  async updateUserSettings(settings: UserSettings): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from("user_settings")
      .upsert(settings, { onConflict: "user_id" })
      .select()
      .single()

    if (error) {
      console.error("Error updating user settings:", error)
      throw error
    }

    return data
  },

  async getApiKey(userId: string, provider: "openai" | "anthropic" | "groq"): Promise<string | null> {
    const settings = await this.getUserSettings(userId)
    if (!settings) return null

    switch (provider) {
      case "openai":
        return settings.openai_api_key
      case "anthropic":
        return settings.anthropic_api_key
      case "groq":
        return settings.groq_api_key
      default:
        return null
    }
  },
}
