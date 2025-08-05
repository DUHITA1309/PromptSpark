"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Share2, Copy, Download, Link, FileText, Code } from "lucide-react"
import type { Prompt } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { databaseService } from "@/lib/database-service"

interface PromptSharingProps {
  user: any // Supabase User type
}

export default function PromptSharing({ user }: PromptSharingProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")
  const [shareUrl, setShareUrl] = useState("")
  const [exportFormat, setExportFormat] = useState<"json" | "markdown">("json")
  const { toast } = useToast()

  useEffect(() => {
    loadPrompts()
  }, [user.id])

  const loadPrompts = async () => {
    const userPrompts = await databaseService.getPrompts(user.id)
    setPrompts(userPrompts)
  }

  const selectedPromptData = prompts.find((p) => p.id === selectedPrompt)

  // Rest of the component remains the same...
  const generateShareUrl = () => {
    if (!selectedPromptData) return

    const shareData = {
      id: selectedPromptData.id,
      title: selectedPromptData.title,
      content: selectedPromptData.content,
      category: selectedPromptData.category,
      sharedBy: user.email,
      sharedAt: new Date().toISOString(),
    }

    const encodedData = btoa(JSON.stringify(shareData))
    const url = `${window.location.origin}/shared/${encodedData}`
    setShareUrl(url)

    toast({
      title: "Share URL generated!",
      description: "Your prompt is ready to share.",
    })
  }

  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "URL copied!",
        description: "Share URL has been copied to your clipboard.",
      })
    }
  }

  const exportPrompt = () => {
    if (!selectedPromptData) return

    let content: string
    let filename: string
    let mimeType: string

    if (exportFormat === "json") {
      content = JSON.stringify(
        {
          title: selectedPromptData.title,
          content: selectedPromptData.content,
          category: selectedPromptData.category,
          tags: selectedPromptData.tags,
          exportedAt: new Date().toISOString(),
          exportedBy: user.email,
        },
        null,
        2,
      )
      filename = `${selectedPromptData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
      mimeType = "application/json"
    } else {
      content = `# ${selectedPromptData.title}

**Category:** ${selectedPromptData.category}
**Created:** ${new Date(selectedPromptData.created_at).toLocaleDateString()}
**Tags:** ${selectedPromptData.tags.join(", ") || "None"}

## Prompt Content

${selectedPromptData.content}

---
*Exported from PromptSpark on ${new Date().toLocaleDateString()}*`
      filename = `${selectedPromptData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`
      mimeType = "text/markdown"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export complete!",
      description: `Prompt exported as ${filename}`,
    })
  }

  const copyPromptContent = () => {
    if (selectedPromptData) {
      navigator.clipboard.writeText(selectedPromptData.content)
      toast({
        title: "Prompt copied!",
        description: "Prompt content has been copied to your clipboard.",
      })
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Share2 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Prompt Sharing</h2>
        </div>

        <p className="text-sm text-gray-600">
          Share your prompts with others or export them for backup and portability.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts to share</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Create some prompts in the Chat window first, then come back here to share them.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Prompt Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a prompt to share..." />
                  </SelectTrigger>
                  <SelectContent>
                    {prompts.map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        {prompt.title} ({prompt.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Prompt Preview */}
            {selectedPromptData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Prompt Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">{selectedPromptData.title}</h4>
                    <p className="text-sm text-gray-500">Category: {selectedPromptData.category}</p>
                  </div>

                  <Textarea value={selectedPromptData.content} readOnly rows={6} className="resize-none bg-gray-50" />

                  <Button onClick={copyPromptContent} variant="outline" className="w-full bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt Content
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Share Options */}
            {selectedPromptData && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Generate Share URL */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      Share URL
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Generate a shareable link that others can use to view this prompt.
                    </p>

                    {shareUrl ? (
                      <div className="space-y-2">
                        <Textarea value={shareUrl} readOnly rows={3} className="text-xs bg-gray-50" />
                        <Button onClick={copyShareUrl} variant="outline" className="w-full bg-transparent">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={generateShareUrl} className="w-full">
                        <Link className="h-4 w-4 mr-2" />
                        Generate Share URL
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Export Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">Download your prompt as a file for backup or sharing.</p>

                    <Select value={exportFormat} onValueChange={(value: "json" | "markdown") => setExportFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">
                          <div className="flex items-center">
                            <Code className="h-4 w-4 mr-2" />
                            JSON Format
                          </div>
                        </SelectItem>
                        <SelectItem value="markdown">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Markdown Format
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button onClick={exportPrompt} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as {exportFormat.toUpperCase()}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
