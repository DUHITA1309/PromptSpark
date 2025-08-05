"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Save, User, Bot, Settings, AlertCircle, Zap, Info } from "lucide-react"
import type { ChatMessage } from "@/lib/types"
import { generateId, defaultCategories } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { databaseService } from "@/lib/database-service"
import { aiService } from "@/lib/ai-service"
import SettingsDialog from "./settings-dialog"

interface PromptChatProps {
  user: any // Supabase User type
}

export default function PromptChat({ user }: PromptChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [promptTitle, setPromptTitle] = useState("")
  const [promptCategory, setPromptCategory] = useState("General")
  const [apiKeyStatus, setApiKeyStatus] = useState<{
    hasKeys: boolean
    availableProviders: string[]
    demoMode: boolean
  }>({
    hasKeys: false,
    availableProviders: [],
    demoMode: true,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check API key availability on component mount
    checkApiKeys()
  }, [user.id])

  const checkApiKeys = async () => {
    try {
      const status = await aiService.hasAvailableApiKeys(user.id)
      setApiKeyStatus(status)
    } catch (error) {
      console.error("Error checking API keys:", error)
      setApiKeyStatus({ hasKeys: false, availableProviders: [], demoMode: true })
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const text = await aiService.generatePrompt({
        userId: user.id,
        prompt: input,
      })

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setGeneratedPrompt(text)
      setPromptTitle(input.slice(0, 50) + (input.length > 50 ? "..." : ""))

      // Show demo mode notification if no API keys
      if (apiKeyStatus.demoMode) {
        toast({
          title: "Demo Mode Active",
          description: "Generated using template-based prompts. Add API keys for AI-powered generation.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error generating prompt",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `I'm sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePrompt = async () => {
    if (!generatedPrompt || !promptTitle.trim()) return

    try {
      await databaseService.savePrompt({
        user_id: user.id,
        title: promptTitle.trim(),
        content: generatedPrompt,
        category: promptCategory,
        tags: [],
        usage_count: 0,
        is_public: false,
      })

      toast({
        title: "Prompt saved!",
        description: `"${promptTitle}" has been added to your library.`,
      })

      setShowSaveDialog(false)
      setPromptTitle("")
      setPromptCategory("General")
    } catch (error) {
      toast({
        title: "Error saving prompt",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Demo Mode Alert */}
      {apiKeyStatus.demoMode && (
        <Alert className="m-4 mb-0 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between text-blue-800">
            <span>
              <strong>Demo Mode:</strong> Using template-based prompt generation. Add your API keys for AI-powered
              prompts.
            </span>
            <SettingsDialog>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Settings className="h-4 w-4 mr-1" />
                Add API Keys
              </Button>
            </SettingsDialog>
          </AlertDescription>
        </Alert>
      )}

      {/* API Key Warning for quota issues */}
      {apiKeyStatus.hasKeys && !apiKeyStatus.demoMode && (
        <Alert className="m-4 mb-0 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>API Issues Detected:</strong> Your API keys may have quota or billing issues. Falling back to demo
            mode.
          </AlertDescription>
        </Alert>
      )}

      {/* Available Providers Info */}
      {apiKeyStatus.hasKeys && apiKeyStatus.availableProviders.length > 0 && !apiKeyStatus.demoMode && (
        <div className="px-4 pt-4">
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
            ✓ AI providers available: {apiKeyStatus.availableProviders.join(", ")}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              {apiKeyStatus.demoMode ? (
                <Zap className="h-12 w-12 text-blue-500" />
              ) : (
                <Bot className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {apiKeyStatus.demoMode ? "Welcome to PromptSpark Demo" : "Welcome to Prompt Chat"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              {apiKeyStatus.demoMode
                ? "Try our template-based prompt generation! Describe what you want to achieve and get optimized prompt templates."
                : "Describe what you want to achieve in natural language, and I'll help you create an optimized AI prompt."}
            </p>

            <div className="space-y-2 text-sm text-gray-400 max-w-lg mx-auto">
              <p>
                <strong>Try these examples:</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                <p>• "Write a cold email for a job application"</p>
                <p>• "Create a marketing campaign for a new app"</p>
                <p>• "Analyze customer feedback data"</p>
                <p>• "Write a creative story about time travel"</p>
              </div>
            </div>

            {apiKeyStatus.demoMode && (
              <div className="mt-6">
                <SettingsDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Upgrade to AI Mode
                  </Button>
                </SettingsDialog>
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`p-2 rounded-full ${message.role === "user" ? "bg-blue-600" : apiKeyStatus.demoMode ? "bg-blue-500" : "bg-gray-200"}`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : apiKeyStatus.demoMode ? (
                    <Zap className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-lg ${message.role === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.role === "assistant" && !message.content.includes("I'm sorry, I encountered an error") && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setGeneratedPrompt(message.content)
                          setShowSaveDialog(true)
                        }}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-3xl">
              <div className={`p-2 rounded-full ${apiKeyStatus.demoMode ? "bg-blue-500" : "bg-gray-200"}`}>
                {apiKeyStatus.demoMode ? (
                  <Zap className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className="p-4 rounded-lg bg-white border">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              apiKeyStatus.demoMode
                ? "Describe what you want to achieve (Demo Mode)..."
                : "Describe what you want to achieve..."
            }
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {apiKeyStatus.demoMode && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            Demo mode generates template-based prompts •{" "}
            <SettingsDialog>
              <Button variant="link" className="p-0 h-auto text-xs">
                Add API keys for AI generation
              </Button>
            </SettingsDialog>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Save Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="Enter prompt title..."
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={promptCategory} onValueChange={setPromptCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preview">Prompt Preview</Label>
                <Textarea
                  id="preview"
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSavePrompt} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Prompt
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
