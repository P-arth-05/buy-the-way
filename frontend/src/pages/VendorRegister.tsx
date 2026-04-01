import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ScrollBg from "@/components/ScrollBgVendor"
import Navbar from "./LandingPage/Navbar"
import Footer from "./LandingPage/Footer"
import { supabase } from "@/lib/supabase"
import { useState } from "react"   

export default function VendorRegister() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const role = "vendor";



  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        alert(error.message);
        return;
    }

    const userId = data.user.id;

    // insert role into profiles
    await supabase.from("profiles").insert([
        {
        id: userId,
        role: role,
        name: name,
        is_verified: false, // New field to track verification status
        },
    ]);

  };

  return (
    <section className="min-h-screen bg-neutral-100 ">
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
            Create your account
            </h2>

            <p className="text-sm text-neutral-500 text-center mt-1">
            Start your journey with us
            </p>

            {/* FORM */}
            <div className="mt-6 space-y-4">
            <Input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

            <Button onClick={handleRegister} className="w-full rounded-full py-6 text-lg">
                Register
            </Button>
            </div>

            {/* FOOTER */}
            <p className="text-sm text-center mt-6 text-neutral-500">
            Already have an account?{" "}
            <span
                onClick={() => navigate("/login")}
                className="text-black font-medium cursor-pointer"
            >
                Login
            </span>
            </p>
        </motion.div>
        


        </div>
        <Footer />
    </section>
  )
}