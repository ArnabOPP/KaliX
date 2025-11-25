"use client"

import { Mic, MicOff, Activity, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface HeaderProps {
  isListening: boolean
  setIsListening: (value: boolean) => void
}

export default function Header({ isListening, setIsListening }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const toggleListening = () => {
    setIsListening(!isListening)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-xl font-bold text-primary tracking-wider">KALI</span>
            </div>
            <div className="h-6 w-px bg-border/50" />
            <span className="text-xs text-muted-foreground font-mono">{user?.name || "SYSTEM"} | v2.4</span>
          </div>

          {/* Status Info */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right text-xs space-y-1">
              <div className="text-foreground font-mono font-semibold">SYSTEM STATUS</div>
              <div className="text-primary">ONLINE | SECURE</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Voice Button */}
            <button
              onClick={toggleListening}
              className={`p-2 rounded border transition-all duration-300 font-mono text-xs font-semibold tracking-wide ${
                isListening
                  ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/50"
                  : "bg-muted border-border hover:border-primary/50 hover:text-primary text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>LISTENING</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>ACTIVATE</span>
                  </>
                )}
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded border bg-muted border-border hover:border-destructive/50 hover:text-destructive text-muted-foreground transition-all duration-300 font-mono text-xs font-semibold"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
