"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Copy, Edit3, Trash2, Share2, Library, ExternalLink, User, Globe, Plus } from "lucide-react"
import type { Prompt } from "@/lib/types"
import { formatDate, getCategoryColorClass, getUsageBadgeClass, getUserCategories } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { databaseService } from "@/lib/database-service"
import AddPromptDialog from "./add-prompt-dialog"
import CategoryManager from "./category-manager"
import PopulateDummyData from "./populate-dummy-data"

interface PromptLibraryProps {
  user: any // Supabase User type
}

export default function PromptLibrary({ user }: PromptLibraryProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")
  const { toast } = useToast()
  const [userCategories, setUserCategories] = useState<Array<{ name: string; color: string }>>([])

  useEffect(() => {
    loadPrompts()
  }, [user.id])

  useEffect(() => {
    setUserCategories(getUserCategories(user.id))
  }, [user.id])

  useEffect(() => {
    filterAndSortPrompts()
  }, [prompts, searchQuery, selectedCategory, sortBy])

  const loadPrompts = async () => {
    const userPrompts = await databaseService.getPrompts(user.id)
    setPrompts(userPrompts)
  }

  const filterAndSortPrompts = () => {
    let filtered = prompts

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (prompt as any).source_author?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((prompt) => prompt.category === selectedCategory)
    }

    // Sort prompts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "usage":
          return b.usage_count - a.usage_count
        default:
          return 0
      }
    })

    setFilteredPrompts(filtered)
  }

  const handleCopyPrompt = async (prompt: any) => {
    navigator.clipboard.writeText(prompt.content)

    // Update usage count
    await databaseService.updatePrompt(prompt.id, {
      usage_count: prompt.usage_count + 1,
    })
    loadPrompts()

    toast({
      title: "Prompt copied!",
      description: `"${prompt.title}" has been copied to your clipboard.`,
    })
  }

  const handleDeletePrompt = async (promptId: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      await databaseService.deletePrompt(promptId)
      loadPrompts()
      toast({
        title: "Prompt deleted",
        description: "The prompt has been removed from your library.",
      })
    }
  }

  const getAvailableCategories = () => {
    const usedCategories = [...new Set(prompts.map((p) => p.category))]
    return ["All", ...userCategories.filter((cat) => usedCategories.includes(cat.name)).map((c) => c.name)]
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Library className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Prompt Library
            </h2>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
              {prompts.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <CategoryManager onCategoriesUpdated={() => setUserCategories(getUserCategories(user.id))}>
              <Button variant="outline" size="sm" className="hover:bg-purple-50 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Categories
              </Button>
            </CategoryManager>
            <AddPromptDialog onPromptAdded={loadPrompts}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt
              </Button>
            </AddPromptDialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search prompts, authors, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="usage">Most Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <Library className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {prompts.length === 0 ? "Start building your prompt library" : "No prompts found"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {prompts.length === 0
                ? "Save prompts from websites, social media, or AI tools to build your personal collection."
                : "Try adjusting your search or filter criteria."}
            </p>
            {prompts.length === 0 && (
              <div className="space-y-4">
                <AddPromptDialog onPromptAdded={loadPrompts}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Prompt
                  </Button>
                </AddPromptDialog>

                <div className="text-sm text-gray-500">or</div>

                <PopulateDummyData onDataPopulated={loadPrompts} />
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{prompt.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`${getCategoryColorClass(prompt.category, user.id)} border text-xs`}>
                          {prompt.category}
                        </Badge>
                        {prompt.usage_count > 0 && (
                          <Badge className={`${getUsageBadgeClass(prompt.usage_count)} text-xs`}>
                            Used {prompt.usage_count}x
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Source Information */}
                  {((prompt as any).source_url || (prompt as any).source_author) && (
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      {(prompt as any).source_author && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {(prompt as any).source_author}
                        </div>
                      )}
                      {(prompt as any).source_url && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs text-blue-600"
                          onClick={() => window.open((prompt as any).source_url, "_blank")}
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          Source
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">{prompt.content}</p>

                  {/* Tags */}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prompt.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{prompt.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mb-3">Added {formatDate(new Date(prompt.created_at))}</div>

                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleCopyPrompt(prompt)} className="flex-1">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast({
                          title: "Edit feature",
                          description: "Edit functionality coming soon!",
                        })
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement share functionality
                        toast({
                          title: "Share feature",
                          description: "Share functionality coming soon!",
                        })
                      }}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
