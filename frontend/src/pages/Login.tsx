import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ScrollBg from "@/components/ScrollBg"
import Navbar from "./LandingPage/Navbar"
import Footer from "./LandingPage/Footer"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
        setLoading(true);
        setErrorMsg("");

        // 1. Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        setErrorMsg(error.message);
        return;
        }

        // 2. Safely extract user + session
        const userId = data?.user?.id;
        const accessToken = data?.session?.access_token;

        if (!userId || !accessToken) {
        setErrorMsg("Login failed: missing session data");
        return;
        }

        // 3. Store token for backend usage
        localStorage.setItem("access_token", accessToken);

        // (optional) store user id
        localStorage.setItem("user_id", userId);

        // 4. Fetch role from profiles table
        const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

        if (profileError) {
        console.error(profileError);
        setErrorMsg("Failed to fetch user profile");
        return;
        }

        // 5. Role-based navigation (unchanged logic)
        if (profile?.role === "customer") {
        navigate("/shop");
        } else if (profile?.role === "vendor") {
        navigate("/vendor");
        } else if (profile?.role === "admin") {
        navigate("/admin");
        } else {
        setErrorMsg("Unknown user role");
        }

    } catch (err) {
        console.error(err);
        setErrorMsg("Something went wrong");
    } finally {
        setLoading(false);
    }
    };

  return (
    <section>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
        <ScrollBg />
        
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-neutral-200"
            style={{ opacity: 1 }}
        >
            
            <h2 className="text-2xl font-semibold text-center">
            Welcome back
            </h2>

            <p className="text-sm text-neutral-500 text-center mt-1">
            Login to continue your experience
            </p>

            {/* FORM */}
            <div className="mt-6 space-y-4">
            <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

            <Button onClick={handleLogin} className="w-full rounded-full py-6 text-lg">
                Login
            </Button>
            </div>

            {/* FOOTER */}
            <p className="text-sm text-center mt-6 text-neutral-500">
            Don't have an account?{" "}
            <span
                onClick={() => navigate("/register")}
                className="text-black font-medium cursor-pointer"
            >
                Register
            </span>
            </p>
        </motion.div>
        

        </div>
        <Footer />
    </section>
  )
}