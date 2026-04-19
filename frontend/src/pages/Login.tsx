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

        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        setErrorMsg(error.message);
        }

        // ✅ No navigation here — AuthContext handles it

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

            <Button onClick={handleLogin} className="w-full rounded-full py-6 text-lg disabled={loading} ">
                {loading ? (<span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Logging in...</span>) : ("Login")}
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