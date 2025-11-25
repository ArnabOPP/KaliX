"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { findUserByEmail, getAllUsers } from "./csv-service"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline" | "busy"
}

export interface UserContact {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  status: "online" | "offline" | "busy"
  avatar: string
  department: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  userContacts: UserContact[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userContacts, setUserContacts] = useState<UserContact[]>([])

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("kali_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        loadUserContacts(parsedUser.email)
      } catch {
        localStorage.removeItem("kali_user")
      }
    }
    setIsLoading(false)
  }, [])

  const loadUserContacts = async (userEmail: string) => {
    try {
      const allUsers = await getAllUsers()
      console.log("[v0] All users loaded:", allUsers.length)
      console.log("[v0] Current user email:", userEmail)

      const contactDetails = allUsers
        .filter((u) => u.email.toLowerCase() !== userEmail.toLowerCase())
        .map((contact) => ({
          id: contact.email,
          userId: userEmail,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          status: (contact.status?.toLowerCase() || "offline") as "online" | "offline" | "busy",
          avatar: contact.name.substring(0, 2).toUpperCase(),
          department: "TEAM", // Added default department
        }))

      console.log("[v0] Final contacts:", contactDetails)
      setUserContacts(contactDetails)
    } catch (error) {
      console.error("[v0] Failed to load contacts:", error)
      setUserContacts([])
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const csvUser = await findUserByEmail(email)

      if (!csvUser || csvUser.password !== password) {
        throw new Error("Invalid email or password")
      }

      const userData: User = {
        id: email,
        name: csvUser.name,
        email: csvUser.email,
        avatar: csvUser.name.substring(0, 2).toUpperCase(),
        status: csvUser.status,
      }

      setUser(userData)
      await loadUserContacts(email)
      localStorage.setItem("kali_user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setUserContacts([])
    localStorage.removeItem("kali_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, userContacts }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
