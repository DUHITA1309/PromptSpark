"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, X, Settings, Palette } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface CategoryManagerProps {
  children?: React.ReactNode
  onCategoriesUpdated?: (categories: string[]) => void
}

const categoryColors = [
  { name: "Purple", class: "category-writing", color: "from-purple-100 to-pink-100" },
  { name: "Blue", class: "category-marketing", color: "from-blue-100 to-cyan-100" },
  { name: "Green", class: "category-development", color: "from-green-100 to-emerald-100" },
  { name: "Orange", class: "category-research", color: "from-orange-100 to-yellow-100" },
  { name: "Pink", class: "category-creative", color: "from-pink-100 to-rose-100" },
  { name: "Indigo", class: "category-business", color: "from-indigo-100 to-purple-100" },
  { name: "Teal", class: "category-education", color: "from-teal-100 to-cyan-100" },
  { name: "Gray", class: "category-general", color: "from-gray-100 to-slate-100" },
]

export default function CategoryManager({ children, onCategoriesUpdated }: CategoryManagerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Array<{ name: string; color: string }>>([])
  const [newCategory, setNewCategory] = useState("")
  const [selectedColor, setSelectedColor] = useState(categoryColors[0])

  useEffect(() => {
    loadCategories()
  }, [user?.id])

  const loadCategories = () => {
    if (!user?.id) return

    const saved = localStorage.getItem(`categories_${user.id}`)
    if (saved) {
      setCategories(JSON.parse(saved))
    } else {
      // Default categories with colors
      const defaultCategories = [
        { name: "Writing", color: "category-writing" },
        { name: "Marketing", color: "category-marketing" },
        { name: "Development", color: "category-development" },
        { name: "Research", color: "category-research" },
        { name: "Creative", color: "category-creative" },
        { name: "Business", color: "category-business" },
        { name: "Education", color: "category-education" },
        { name: "General", color: "category-general" },
      ]
      setCategories(defaultCategories)
      localStorage.setItem(`categories_${user.id}`, JSON.stringify(defaultCategories))
    }
  }

  const saveCategories = (newCategories: Array<{ name: string; color: string }>) => {
    if (!user?.id) return

    setCategories(newCategories)
    localStorage.setItem(`categories_${user.id}`, JSON.stringify(newCategories))
    onCategoriesUpdated?.(newCategories.map((c) => c.name))
  }

  const addCategory = () => {
    if (!newCategory.trim()) return

    if (categories.some((c) => c.name.toLowerCase() === newCategory.toLowerCase())) {
      toast({
        title: "Category exists",
        description: "This category already exists.",
        variant: "destructive",
      })
      return
    }

    const newCategories = [...categories, { name: newCategory.trim(), color: selectedColor.class }]
    saveCategories(newCategories)
    setNewCategory("")

    toast({
      title: "Category added!",
      description: `"${newCategory}" has been added to your categories.`,
    })
  }

  const removeCategory = (categoryName: string) => {
    if (categoryName === "General") {
      toast({
        title: "Cannot delete",
        description: "The General category cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    const newCategories = categories.filter((c) => c.name !== categoryName)
    saveCategories(newCategories)

    toast({
      title: "Category removed",
      description: `"${categoryName}" has been removed.`,
    })
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category?.color || "category-general"
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Settings className="h-4 w-4 mr-2" />
      Manage Categories
    </Button>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Manage Categories
            </DialogTitle>
            <DialogDescription>
              Create custom categories to organize your prompts with beautiful colors.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add New Category */}
            <div className="space-y-3">
              <Label>Add New Category</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                />
                <Button onClick={addCategory} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label className="text-sm">Choose Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        h-8 rounded-md border-2 transition-all
                        ${selectedColor.name === color.name ? "border-gray-400 scale-105" : "border-gray-200"}
                        bg-gradient-to-r ${color.color}
                      `}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Current Categories */}
            <div className="space-y-2">
              <Label>Current Categories</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <Badge className={`${category.color} border`}>{category.name}</Badge>
                    {category.name !== "General" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.name)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Export utility function
export const getCategoryColorClass = (categoryName: string, categories?: Array<{ name: string; color: string }>) => {
  if (!categories) return "category-general"
  const category = categories.find((c) => c.name === categoryName)
  return category?.color || "category-general"
}
