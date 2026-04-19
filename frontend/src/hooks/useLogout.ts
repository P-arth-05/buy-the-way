// hooks/useLogout.ts
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"

export const useLogout = () => {
  const navigate = useNavigate()

  const logout = async () => {
    // 1. Sign out from Supabase (invalidates session server-side)
    await supabase.auth.signOut()

    // 2. Clear local storage
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_id")

    // 3. Redirect to login
    navigate("/login")
  }

  return { logout }
}