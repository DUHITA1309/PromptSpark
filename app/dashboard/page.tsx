"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Library, Share2, Plus, MessageSquare, History, User, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import PromptLibrary from "@/components/prompt-library"
import PromptSharing from "@/components/prompt-sharing"
import PromptChat from "@/components/prompt-chat"
import AddPromptDialog from "@/components/add-prompt-dialog"
import { useAuth } from "@/lib/auth-context"
import SettingsDialog from "@/components/settings-dialog"

type ActiveWindow = "library" | "sharing" | "chat"

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>("library")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await signOut()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-4 text-gray-600">Loading your prompt library...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-purple-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-gradient-to-b from-white to-purple-50/30">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Logo size="md" />
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Menu</h3>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-purple-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <History className="h-4 w-4 mr-3" />
                    Recent Activity
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account</h3>
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Member since {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <SettingsDialog />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo size="md" />
        </div>

        {/* Add Prompt Button - Primary CTA */}
        <AddPromptDialog>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Prompt
          </Button>
        </AddPromptDialog>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeWindow === "library" && <PromptLibrary user={user} />}
        {activeWindow === "sharing" && <PromptSharing user={user} />}
        {activeWindow === "chat" && <PromptChat user={user} />}
      </main>

      {/* Bottom Navigation - Enhanced with gradients */}
      <nav className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-4 py-2 shadow-lg">
        <div className="flex justify-around">
          <Button
            variant={activeWindow === "library" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveWindow("library")}
            className={`flex flex-col items-center space-y-1 h-auto py-2 transition-all duration-200 ${
              activeWindow === "library"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "hover:bg-purple-50"
            }`}
          >
            <Library className="h-5 w-5" />
            <span className="text-xs">My Library</span>
          </Button>

          <Button
            variant={activeWindow === "sharing" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveWindow("sharing")}
            className={`flex flex-col items-center space-y-1 h-auto py-2 transition-all duration-200 ${
              activeWindow === "sharing"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "hover:bg-purple-50"
            }`}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </Button>

          <Button
            variant={activeWindow === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveWindow("chat")}
            className={`flex flex-col items-center space-y-1 h-auto py-2 transition-all duration-200 ${
              activeWindow === "chat"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "hover:bg-purple-50"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
