"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Share2, Search, AlertCircle, Plus, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "@/components/logo"

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { user, signIn, signUp, isSupabaseEnabled } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleAuth = async (email: string, password: string, isSignup: boolean) => {
    setIsLoading(true)

    try {
      const { error } = isSignup ? await signUp(email, password) : await signIn(email, password)

      if (error) {
        throw error
      }

      toast({
        title: isSignup ? "Account created!" : "Welcome back!",
        description: `Successfully ${isSignup ? "signed up" : "logged in"} as ${email}`,
      })

      if (!isSignup || !isSupabaseEnabled) {
        router.push("/dashboard")
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Configuration Notice */}
      {!isSupabaseEnabled && (
        <div className="p-4">
          <Alert className="mb-6 max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> Supabase is not configured. Data will be stored locally and won't persist
              across sessions.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Left Side - Features */}
        <div className="flex-1 p-8 flex items-center">
          <div className="max-w-2xl">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Logo size="lg" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Personal Prompt Library</h1>
              <p className="text-xl text-gray-600 mb-6">
                Collect, organize, and share the best AI prompts from across the web. Build your personal prompt library
                and never lose a great prompt again.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 mb-8">
              <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Collect Prompts</h3>
                  <p className="text-sm text-gray-600">Save prompts from websites, social media, and AI tools</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Organize & Search</h3>
                  <p className="text-sm text-gray-600">Categorize, tag, and quickly find your saved prompts</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Share & Export</h3>
                  <p className="text-sm text-gray-600">Share prompts with links or export your collection</p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Perfect for collecting prompts from:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2 text-blue-600" />
                    <span>ChatGPT, Claude, and other AI tools</span>
                  </div>
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Twitter/X prompt threads</span>
                  </div>
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Reddit communities</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Discord servers and communities</span>
                  </div>
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Prompt marketplaces</span>
                  </div>
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Your own successful prompts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="flex-1 border-l flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Message */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join PromptSpark</h2>
              <p className="text-gray-600">Start building your AI prompt collection today</p>
            </div>

            {/* Authentication Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Start Building Your Library</CardTitle>
                <CardDescription>
                  {isSupabaseEnabled
                    ? "Sign in to your account or create a new one to start collecting prompts."
                    : "Enter any email and password to try the demo."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <AuthForm
                      onSubmit={(email, password) => handleAuth(email, password, false)}
                      isLoading={isLoading}
                    />
                  </TabsContent>

                  <TabsContent value="signup">
                    <AuthForm onSubmit={(email, password) => handleAuth(email, password, true)} isLoading={isLoading} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Stats/Benefits */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Quick Benefits */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthForm({
  onSubmit,
  isLoading,
}: { onSubmit: (email: string, password: string) => void; isLoading: boolean }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Please wait..." : "Start Collecting"}
      </Button>
    </form>
  )
}
