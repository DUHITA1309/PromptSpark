"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Brain, Eye, EyeOff, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { settingsService, type UserSettings } from "@/lib/settings-service"
import { useToast } from "@/hooks/use-toast"

interface SettingsDialogProps {
  children?: React.ReactNode
}

export default function SettingsDialog({ children }: SettingsDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    groq: false,
  })

  useEffect(() => {
    if (user && open) {
      loadSettings()
    }
  }, [user, open])

  const loadSettings = async () => {
    if (!user) return

    try {
      const userSettings = await settingsService.getUserSettings(user.id)
      setSettings(
        userSettings || {
          user_id: user.id,
          preferred_model: "gpt-4o",
          openai_api_key: null,
          anthropic_api_key: null,
          groq_api_key: null,
        },
      )
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings || !user) return

    setLoading(true)
    try {
      await settingsService.updateUserSettings(settings)
      toast({
        title: "Settings saved!",
        description: "Your API keys and preferences have been updated.",
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  const toggleKeyVisibility = (provider: "openai" | "anthropic" | "groq") => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  const defaultTrigger = (
    <Button variant="ghost" className="w-full justify-start">
      <Settings className="h-4 w-4 mr-3" />
      Settings
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your API keys and preferences for AI model access.</DialogDescription>
        </DialogHeader>

        {settings && (
          <Tabs defaultValue="api-keys" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="api-keys" className="space-y-4">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Add your own API keys to use AI models. Your keys are encrypted and stored securely.
                </div>

                {/* OpenAI */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      OpenAI
                    </CardTitle>
                    <CardDescription>
                      For GPT models (GPT-4o, GPT-4, GPT-3.5-turbo)
                      <Button
                        variant="link"
                        className="p-0 h-auto ml-2 text-xs"
                        onClick={() => window.open("https://platform.openai.com/api-keys", "_blank")}
                      >
                        Get API Key <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Label htmlFor="openai-key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="openai-key"
                        type={showKeys.openai ? "text" : "password"}
                        placeholder="sk-..."
                        value={settings.openai_api_key || ""}
                        onChange={(e) => updateSetting("openai_api_key", e.target.value)}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => toggleKeyVisibility("openai")}>
                        {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Anthropic */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Anthropic
                    </CardTitle>
                    <CardDescription>
                      For Claude models (Claude-3, Claude-2)
                      <Button
                        variant="link"
                        className="p-0 h-auto ml-2 text-xs"
                        onClick={() => window.open("https://console.anthropic.com/", "_blank")}
                      >
                        Get API Key <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Label htmlFor="anthropic-key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="anthropic-key"
                        type={showKeys.anthropic ? "text" : "password"}
                        placeholder="sk-ant-..."
                        value={settings.anthropic_api_key || ""}
                        onChange={(e) => updateSetting("anthropic_api_key", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => toggleKeyVisibility("anthropic")}
                      >
                        {showKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Groq */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Groq
                    </CardTitle>
                    <CardDescription>
                      For fast inference with Llama, Mixtral models
                      <Button
                        variant="link"
                        className="p-0 h-auto ml-2 text-xs"
                        onClick={() => window.open("https://console.groq.com/keys", "_blank")}
                      >
                        Get API Key <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Label htmlFor="groq-key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="groq-key"
                        type={showKeys.groq ? "text" : "password"}
                        placeholder="gsk_..."
                        value={settings.groq_api_key || ""}
                        onChange={(e) => updateSetting("groq_api_key", e.target.value)}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => toggleKeyVisibility("groq")}>
                        {showKeys.groq ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Model Preferences</CardTitle>
                  <CardDescription>Choose your preferred AI model for prompt generation.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="preferred-model">Preferred Model</Label>
                    <Select
                      value={settings.preferred_model}
                      onValueChange={(value) => updateSetting("preferred_model", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                        <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
                        <SelectItem value="claude-3-opus">Claude-3 Opus (Anthropic)</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude-3 Sonnet (Anthropic)</SelectItem>
                        <SelectItem value="llama-3-70b">Llama-3 70B (Groq)</SelectItem>
                        <SelectItem value="mixtral-8x7b">Mixtral 8x7B (Groq)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
