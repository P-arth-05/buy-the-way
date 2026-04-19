// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner" // or your toast library
import { useEffect, useRef } from "react"

const ROLE_HOME: Record<string, string> = {
  customer: "/shop",
  vendor: "/vendor",
  admin: "/admin",
}

interface Props {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth()
  const toastShown = useRef(false)

  // Show loading spinner while fetching profile
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />

  // Wrong role → redirect to their home with toast
  if (!allowedRoles.includes(user.role!)) {
    if (!toastShown.current) {
      toastShown.current = true
      toast.error("Access denied", {
        description: "That page is out of your scope.",
      })
    }
    return <Navigate to={ROLE_HOME[user.role!] ?? "/login"} replace />
  }

  return <>{children}</>
}