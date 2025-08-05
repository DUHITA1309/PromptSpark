"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Link, FileText, Wand2, X, Globe } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { databaseService } from "@/lib/database-service"
import { useToast } from "@/hooks/use-toast"
import { getUserCategories } from "@/lib/utils"
import CategoryManager from "./category-manager"

interface AddPromptDialogProps {
  children?: React.ReactNode
  onPromptAdded?: () => void
}

export default function AddPromptDialog({ children, onPromptAdded }: AddPromptDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("General")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [sourceAuthor, setSourceAuthor] = useState("")
  const [notes, setNotes] = useState("")

  const resetForm = () => {
    setTitle("")
    setContent("")
    setCategory("General")
    setTags([])
    setTagInput("")
    setSourceUrl("")
    setSourceAuthor("")
    setNotes("")
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const extractFromUrl = async () => {
    if (!sourceUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to extract content from.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // This is a placeholder for URL extraction functionality
      // In a real app, you'd implement web scraping or use a service
      toast({
        title: "URL Extraction",
        description: "URL extraction feature coming soon! For now, please copy and paste the prompt manually.",
      })
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Could not extract content from the URL. Please copy and paste manually.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrompt = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for the prompt.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await databaseService.savePrompt({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        usage_count: 0,
        is_public: false,
        source_url: sourceUrl.trim() || null,
        source_author: sourceAuthor.trim() || null,
        notes: notes.trim() || null,
      } as any)

      toast({
        title: "Prompt saved!",
        description: `"${title}" has been added to your library.`,
      })

      resetForm()
      setOpen(false)
      onPromptAdded?.()
    } catch (error) {
      toast({
        title: "Error saving prompt",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="h-4 w-4 mr-2" />
      Add Prompt
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Prompt
          </DialogTitle>
          <DialogDescription>
            Save prompts from websites, social media, or create your own. Build your personal prompt library.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center">
              <Link className="h-4 w-4 mr-2" />
              From URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cold Email Template for Job Applications"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getUserCategories(user.id).map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full bg-gradient-to-r ${cat.color.replace("category-", "").replace("writing", "from-purple-100 to-pink-100").replace("marketing", "from-blue-100 to-cyan-100").replace("development", "from-green-100 to-emerald-100").replace("research", "from-orange-100 to-yellow-100").replace("creative", "from-pink-100 to-rose-100").replace("business", "from-indigo-100 to-purple-100").replace("education", "from-teal-100 to-cyan-100").replace("general", "from-gray-100 to-slate-100")}`}
                            ></div>
                            <span>{cat.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <CategoryManager>
                  <Button type="button" variant="outline" size="sm" className="mt-7 bg-transparent">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CategoryManager>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Prompt Content *</Label>
              <Textarea
                id="content"
                placeholder="Paste the prompt content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source-url">Source URL (Optional)</Label>
                <Input
                  id="source-url"
                  placeholder="https://example.com/prompt"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-author">Author/Creator (Optional)</Label>
                <Input
                  id="source-author"
                  placeholder="e.g., @username or Full Name"
                  value={sourceAuthor}
                  onChange={(e) => setSourceAuthor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center">
                      {tag}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Personal Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add your own notes about this prompt..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Extract from URL
                </CardTitle>
                <CardDescription>
                  Enter a URL to automatically extract prompt content (coming soon - for now, copy manually)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://example.com/prompt"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                  />
                  <Button onClick={extractFromUrl} disabled={loading}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Extract
                  </Button>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>How to collect prompts:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Copy prompts from ChatGPT, Claude, or other AI tools</li>
                    <li>Save prompts from Twitter, Reddit, or Discord</li>
                    <li>Collect from prompt libraries and marketplaces</li>
                    <li>Save your own successful prompts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Same form fields as manual entry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title-url">Title *</Label>
                <Input
                  id="title-url"
                  placeholder="e.g., Cold Email Template for Job Applications"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getUserCategories(user.id).map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full bg-gradient-to-r ${cat.color.replace("category-", "").replace("writing", "from-purple-100 to-pink-100").replace("marketing", "from-blue-100 to-cyan-100").replace("development", "from-green-100 to-emerald-100").replace("research", "from-orange-100 to-yellow-100").replace("creative", "from-pink-100 to-rose-100").replace("business", "from-indigo-100 to-purple-100").replace("education", "from-teal-100 to-cyan-100").replace("general", "from-gray-100 to-slate-100")}`}
                            ></div>
                            <span>{cat.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <CategoryManager>
                  <Button type="button" variant="outline" size="sm" className="mt-7 bg-transparent">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CategoryManager>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-url">Prompt Content *</Label>
              <Textarea
                id="content-url"
                placeholder="Paste the prompt content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-author-url">Author/Creator (Optional)</Label>
              <Input
                id="source-author-url"
                placeholder="e.g., @username or Full Name"
                value={sourceAuthor}
                onChange={(e) => setSourceAuthor(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePrompt} disabled={loading}>
            {loading ? "Saving..." : "Save Prompt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
