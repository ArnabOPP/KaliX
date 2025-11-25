"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getAllUsers } from "@/lib/csv-service"
import { Lock, Mail, AlertCircle, Loader } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { user, login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<Array<{ email: string; name: string }>>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [csvError, setCsvError] = useState("")

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  // Load available users from Google Sheets
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true)
        setCsvError("")
        console.log("[v0] Loading users from CSV...")
        const users = await getAllUsers()
        console.log("[v0] Loaded users:", users)

        if (users.length === 0) {
          setCsvError(
            "⚠️ No users found in Google Sheet. Please add user data with columns: email, password, name, status, contacts",
          )
        }

        setAvailableUsers(users.map((u) => ({ email: u.email, name: u.name })))
      } catch (error) {
        console.error("[v0] Failed to load users:", error)
        setCsvError("Failed to load users from Google Sheet")
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono text-lg">SYSTEM INITIALIZING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background grid effect */}
      <div className="fixed inset-0 opacity-3 pointer-events-none">
        <div
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          className="absolute inset-0"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glow-card border rounded-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary tracking-wider">KALI</h1>
            <p className="text-xs text-muted-foreground font-mono">SECURE ACCESS TERMINAL</p>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-4" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-muted-foreground tracking-wider">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-primary/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@kali.com"
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-muted-foreground tracking-wider">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-primary/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/50 rounded flex gap-2 text-xs text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-primary/20 border border-primary text-primary rounded font-mono font-semibold text-sm tracking-wider hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-6"
            >
              {isSubmitting ? "AUTHENTICATING..." : "AUTHENTICATE"}
            </button>
          </form>

          {/* CSV Status */}
          <div className="pt-4 border-t border-border/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              {loadingUsers ? (
                <>
                  <Loader className="w-3 h-3 animate-spin text-primary" />
                  LOADING DATABASE...
                </>
              ) : csvError ? (
                <>
                  <AlertCircle className="w-3 h-3 text-destructive flex-shrink-0" />
                  <span className="text-destructive">{csvError}</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 bg-accent rounded-full" />
                  DATABASE CONNECTED
                </>
              )}
            </div>

            {/* Available Users */}
            {availableUsers.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-mono text-muted-foreground">AVAILABLE USERS:</p>
                <div className="space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
                  {availableUsers.map((u) => (
                    <div key={u.email} className="text-primary/70">
                      <span className="text-muted-foreground">{u.name}:</span> {u.email}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
