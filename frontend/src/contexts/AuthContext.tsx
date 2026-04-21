// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"

type Role = "customer" | "vendor" | "admin" | null

interface AuthUser {
  id: string
  role: Role
  name: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

const ROLE_HOME: Record<string, string> = {
  customer: "/shop",
  vendor: "/vendor",
  admin: "/admin",
}

const SUPABASE_URL = "https://azmnrmazqsbrzlukovrs.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bW5ybWF6cXNicnpsdWtvdnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzM5OTIsImV4cCI6MjA5MDQ0OTk5Mn0.RSNfMS7asiZ0ALs2S3YJG38txl6T2CoBE6fQZ45wu9Q"

const fetchProfile = async (userId: string, accessToken: string) => {

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role,name`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const data = await response.json()

  if (!data || data.length === 0) {
    console.log("❌ no profile found")
    return null
  }

  return {
    id: userId,
    role: data[0].role as Role,
    name: data[0].name,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {

    // 1. Check existing session on app load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("🟡 getSession fired, session:", session);
      console.log("🟡 access_token:", session?.access_token);
      if (session?.user) {
        
        const profile = await fetchProfile(session.user.id, session.access_token)
        setUser(profile)
        localStorage.setItem("access_token", session.access_token)
      }

      setLoading(false)
      console.log("🟡 loading set to false");
    })

    // 2. Listen for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {

        if (event === "SIGNED_IN" && session?.user) {
          const { id, access_token } = { id: session.user.id, access_token: session.access_token }

          setTimeout(async () => {
            const profile = await fetchProfile(id, access_token)

            setUser(profile)
            localStorage.setItem("access_token", access_token)

            if (profile?.role) {
              navigate(ROLE_HOME[profile.role])
            } else {
              console.log("❌ no role found — cannot navigate")
            }
          }, 0)

        } else if (event === "SIGNED_OUT") {
          console.log("🔴 signed out")
          setUser(null)
          localStorage.removeItem("access_token")
          localStorage.removeItem("user_id")
          navigate("/login")
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [navigate])

  const logout = async () => {
    console.log("🔴 logout called")
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_id")
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)