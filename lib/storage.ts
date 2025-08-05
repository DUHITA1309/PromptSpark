import type { User, Prompt, ChatHistory } from "./types"

// Local storage utilities
export const storage = {
  // User management
  setCurrentUser: (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user))
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  },

  clearCurrentUser: () => {
    localStorage.removeItem("currentUser")
  },

  // Prompts management
  getPrompts: (userId: string): Prompt[] => {
    const prompts = localStorage.getItem(`prompts_${userId}`)
    return prompts ? JSON.parse(prompts) : []
  },

  savePrompt: (prompt: Prompt) => {
    const prompts = storage.getPrompts(prompt.userId)
    const existingIndex = prompts.findIndex((p) => p.id === prompt.id)

    if (existingIndex >= 0) {
      prompts[existingIndex] = prompt
    } else {
      prompts.push(prompt)
    }

    localStorage.setItem(`prompts_${prompt.userId}`, JSON.stringify(prompts))
  },

  deletePrompt: (userId: string, promptId: string) => {
    const prompts = storage.getPrompts(userId)
    const filtered = prompts.filter((p) => p.id !== promptId)
    localStorage.setItem(`prompts_${userId}`, JSON.stringify(filtered))
  },

  // Chat history management
  getChatHistory: (userId: string): ChatHistory[] => {
    const history = localStorage.getItem(`chatHistory_${userId}`)
    return history ? JSON.parse(history) : []
  },

  saveChatHistory: (chatHistory: ChatHistory) => {
    const history = storage.getChatHistory(chatHistory.userId)
    const existingIndex = history.findIndex((h) => h.id === chatHistory.id)

    if (existingIndex >= 0) {
      history[existingIndex] = chatHistory
    } else {
      history.push(chatHistory)
    }

    localStorage.setItem(`chatHistory_${chatHistory.userId}`, JSON.stringify(history))
  },
}
