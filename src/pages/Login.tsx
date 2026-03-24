import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ScrollBg from "@/components/Scrollbg"
import Navbar from "./Landing/Navbar"
import Footer from "./Landing/Footer"

export default function Login() {
  const navigate = useNavigate()

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
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />

            <Button className="w-full rounded-full py-6 text-lg">
                Login
            </Button>
            </div>

            {/* FOOTER */}
            <p className="text-sm text-center mt-6 text-neutral-500">
            Don’t have an account?{" "}
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