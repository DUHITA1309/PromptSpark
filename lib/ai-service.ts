import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { groq } from "@ai-sdk/groq"
import { settingsService } from "./settings-service"

export interface AIGenerationOptions {
  userId: string
  prompt: string
  model?: string
}

// Demo prompt templates for fallback mode
const demoPromptTemplates = {
  writing: [
    "You are a professional writer. Write a [type of content] about [topic] that is [tone/style]. Include [specific requirements] and make sure to [key objectives].",
    "Create a compelling [content type] for [target audience] about [subject]. The tone should be [adjective] and include [specific elements].",
  ],
  marketing: [
    "You are a marketing expert. Create a [campaign type] for [product/service] targeting [audience]. Focus on [key benefits] and include a strong call-to-action.",
    "Develop a [marketing material] that highlights [unique selling points] for [target market]. Use [tone] language and emphasize [main message].",
  ],
  business: [
    "You are a business consultant. Analyze [business aspect] for [company type] and provide [deliverable]. Consider [key factors] and recommend [specific actions].",
    "Create a professional [business document] for [purpose] that addresses [key points] and provides [expected outcomes].",
  ],
  development: [
    "You are a senior developer. Write [code type] for [programming language] that [functionality]. Follow [best practices] and include [requirements].",
    "Create a technical [deliverable] for [project type] that implements [features] using [technology stack].",
  ],
  research: [
    "You are a research analyst. Investigate [research topic] and provide [analysis type]. Include [methodology] and present findings in [format].",
    "Conduct a comprehensive analysis of [subject] focusing on [key areas] and deliver insights in [presentation format].",
  ],
  creative: [
    "You are a creative professional. Generate [creative content] about [theme] in [style/genre]. Include [creative elements] and ensure [creative goals].",
    "Create an imaginative [content type] that explores [concept] through [creative approach] and engages [target audience].",
  ],
  education: [
    "You are an educational expert. Design a [learning material] for [subject] targeting [learner level]. Include [pedagogical elements] and ensure [learning outcomes].",
    "Create an educational [content type] that teaches [topic] to [audience] using [teaching method] and includes [assessment elements].",
  ],
  general: [
    "You are an AI assistant. Help with [task] by providing [type of assistance]. Consider [important factors] and deliver [expected format].",
    "Assist with [request] by [approach] and ensure the response includes [key elements] in a [desired format].",
  ],
}

function generateDemoPrompt(userPrompt: string): string {
  const prompt = userPrompt.toLowerCase()

  // Determine category based on keywords
  let category = "general"
  if (prompt.includes("write") || prompt.includes("article") || prompt.includes("blog") || prompt.includes("essay")) {
    category = "writing"
  } else if (
    prompt.includes("market") ||
    prompt.includes("advertis") ||
    prompt.includes("campaign") ||
    prompt.includes("brand")
  ) {
    category = "marketing"
  } else if (
    prompt.includes("business") ||
    prompt.includes("strategy") ||
    prompt.includes("plan") ||
    prompt.includes("proposal")
  ) {
    category = "business"
  } else if (
    prompt.includes("code") ||
    prompt.includes("program") ||
    prompt.includes("develop") ||
    prompt.includes("software")
  ) {
    category = "development"
  } else if (
    prompt.includes("research") ||
    prompt.includes("analyze") ||
    prompt.includes("study") ||
    prompt.includes("investigate")
  ) {
    category = "research"
  } else if (
    prompt.includes("creative") ||
    prompt.includes("story") ||
    prompt.includes("design") ||
    prompt.includes("art")
  ) {
    category = "creative"
  } else if (
    prompt.includes("teach") ||
    prompt.includes("learn") ||
    prompt.includes("education") ||
    prompt.includes("course")
  ) {
    category = "education"
  }

  const templates = demoPromptTemplates[category as keyof typeof demoPromptTemplates]
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)]

  // Add a personalized touch based on the user's input
  const enhancedPrompt = `${selectedTemplate}

**Context from your request:** "${userPrompt}"

**Additional Instructions:**
- Tailor the response to be specific and actionable
- Include relevant examples where appropriate  
- Maintain a professional yet engaging tone
- Ensure the output is ready to use

**Note:** This is an optimized prompt template. You can customize the bracketed placeholders [like this] with your specific requirements.`

  return enhancedPrompt
}

export const aiService = {
  async generatePrompt({ userId, prompt, model }: AIGenerationOptions): Promise<string> {
    try {
      // Get user settings to determine which API key to use
      const settings = await settingsService.getUserSettings(userId)
      const preferredModel = model || settings?.preferred_model || "gpt-4o"

      // Determine which provider to use based on the model
      let aiModel: any
      let apiKey: string | null = null

      if (preferredModel.startsWith("gpt-")) {
        // Try user's API key first, then environment variable
        apiKey = settings?.openai_api_key || process.env.OPENAI_API_KEY
        if (!apiKey) {
          throw new Error("DEMO_MODE")
        }
        aiModel = openai(preferredModel, { apiKey })
      } else if (preferredModel.startsWith("claude-")) {
        apiKey = settings?.anthropic_api_key || process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
          throw new Error("DEMO_MODE")
        }
        aiModel = anthropic(preferredModel, { apiKey })
      } else if (preferredModel.includes("llama") || preferredModel.includes("mixtral")) {
        apiKey = settings?.groq_api_key || process.env.GROQ_API_KEY
        if (!apiKey) {
          throw new Error("DEMO_MODE")
        }
        aiModel = groq(preferredModel, { apiKey })
      } else {
        // Fallback to OpenAI
        apiKey = settings?.openai_api_key || process.env.OPENAI_API_KEY
        if (!apiKey) {
          throw new Error("DEMO_MODE")
        }
        aiModel = openai("gpt-4o", { apiKey })
      }

      const { text } = await generateText({
        model: aiModel,
        system: `You are a prompt optimization expert. Your job is to take natural language requests and convert them into highly effective, detailed prompts for AI assistants like ChatGPT or Claude. 

Guidelines:
- Make prompts clear, specific, and actionable
- Include relevant context and constraints
- Use proper formatting and structure
- Add examples when helpful
- Ensure the prompt will produce consistent, high-quality results

Convert the user's request into an optimized prompt that they can use with AI tools.`,
        prompt,
      })

      return text
    } catch (error: any) {
      console.error("AI Generation Error:", error)

      // Handle specific error cases
      if (error.message === "DEMO_MODE") {
        // No API key available - use demo mode
        return generateDemoPrompt(prompt)
      }

      // Handle quota/billing errors
      if (
        error.message?.includes("quota") ||
        error.message?.includes("billing") ||
        error.message?.includes("exceeded")
      ) {
        console.log("API quota exceeded, falling back to demo mode")
        return generateDemoPrompt(prompt)
      }

      // Handle authentication errors
      if (
        error.message?.includes("authentication") ||
        error.message?.includes("invalid") ||
        error.message?.includes("unauthorized")
      ) {
        console.log("API authentication failed, falling back to demo mode")
        return generateDemoPrompt(prompt)
      }

      // Handle rate limiting
      if (error.message?.includes("rate") || error.message?.includes("limit")) {
        console.log("Rate limit exceeded, falling back to demo mode")
        return generateDemoPrompt(prompt)
      }

      // For any other API errors, fall back to demo mode
      console.log("API error occurred, falling back to demo mode:", error.message)
      return generateDemoPrompt(prompt)
    }
  },

  // Method to check if any API keys are available
  async hasAvailableApiKeys(
    userId: string,
  ): Promise<{ hasKeys: boolean; availableProviders: string[]; demoMode: boolean }> {
    const settings = await settingsService.getUserSettings(userId)
    const availableProviders: string[] = []

    // Check OpenAI
    if (settings?.openai_api_key || process.env.OPENAI_API_KEY) {
      availableProviders.push("OpenAI")
    }

    // Check Anthropic
    if (settings?.anthropic_api_key || process.env.ANTHROPIC_API_KEY) {
      availableProviders.push("Anthropic")
    }

    // Check Groq
    if (settings?.groq_api_key || process.env.GROQ_API_KEY) {
      availableProviders.push("Groq")
    }

    return {
      hasKeys: availableProviders.length > 0,
      availableProviders,
      demoMode: availableProviders.length === 0,
    }
  },

  // Test API key validity
  async testApiKey(provider: "openai" | "anthropic" | "groq", apiKey: string): Promise<boolean> {
    try {
      let aiModel: any

      switch (provider) {
        case "openai":
          aiModel = openai("gpt-3.5-turbo", { apiKey })
          break
        case "anthropic":
          aiModel = anthropic("claude-3-haiku-20240307", { apiKey })
          break
        case "groq":
          aiModel = groq("llama-3-8b-8192", { apiKey })
          break
        default:
          return false
      }

      // Test with a simple prompt
      await generateText({
        model: aiModel,
        prompt: "Hello",
        maxTokens: 5,
      })

      return true
    } catch (error) {
      console.error(`API key test failed for ${provider}:`, error)
      return false
    }
  },
}
