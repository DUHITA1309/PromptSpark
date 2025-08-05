"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean
}

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  }

  return (
    <div className={cn("flex items-center", className)}>
      {/* Logo Icon */}
      <div
        className={cn(
          "relative rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2 shadow-lg",
          sizeClasses[size],
        )}
      >
        {/* Spark/Lightning Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-300/20 to-transparent"></div>

        {/* Book Pages */}
        <svg viewBox="0 0 24 24" fill="none" className="relative z-10 w-full h-full text-white">
          {/* Book Base */}
          <path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Spark/Lightning Bolt */}
          <path
            d="M12 6l-2 5h4l-2 5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            className="drop-shadow-sm"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div
          className={cn(
            "ml-3 font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
            textSizeClasses[size],
          )}
        >
          PromptSpark
        </div>
      )}
    </div>
  )
}
