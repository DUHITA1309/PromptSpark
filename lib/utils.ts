import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export const defaultCategories = [
  "Writing",
  "Marketing",
  "Development",
  "Research",
  "Creative",
  "Business",
  "Education",
  "General",
]

// Get usage count badge class based on count
export function getUsageBadgeClass(count: number): string {
  if (count === 0) return "usage-low"
  if (count <= 5) return "usage-medium"
  if (count <= 15) return "usage-high"
  return "usage-very-high"
}

// Get category color class
export function getCategoryColorClass(categoryName: string, userId?: string): string {
  if (!userId) return "category-general"

  const saved = localStorage.getItem(`categories_${userId}`)
  if (saved) {
    const categories = JSON.parse(saved)
    const category = categories.find((c: any) => c.name === categoryName)
    return category?.color || "category-general"
  }

  // Default category colors
  const categoryMap: Record<string, string> = {
    Writing: "category-writing",
    Marketing: "category-marketing",
    Development: "category-development",
    Research: "category-research",
    Creative: "category-creative",
    Business: "category-business",
    Education: "category-education",
    General: "category-general",
  }

  return categoryMap[categoryName] || "category-general"
}

// Get user's custom categories
export function getUserCategories(userId: string): Array<{ name: string; color: string }> {
  const saved = localStorage.getItem(`categories_${userId}`)
  if (saved) {
    return JSON.parse(saved)
  }

  // Return default categories
  return [
    { name: "Writing", color: "category-writing" },
    { name: "Marketing", color: "category-marketing" },
    { name: "Development", color: "category-development" },
    { name: "Research", color: "category-research" },
    { name: "Creative", color: "category-creative" },
    { name: "Business", color: "category-business" },
    { name: "Education", color: "category-education" },
    { name: "General", color: "category-general" },
  ]
}
