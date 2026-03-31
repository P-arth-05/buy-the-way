import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CTA() {
  const navigate = useNavigate()

  return (
    <section className="px-4 md:px-8 lg:px-16 py-20">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-black text-white rounded-3xl px-6 md:px-12 py-16 md:py-20 text-center relative overflow-hidden">

          {/* Glow / subtle gradient accent */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-500/20 blur-3xl rounded-full" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            
            <h2 className="text-3xl md:text-5xl font-light leading-tight">
              Stop Wrestling with Complex Setup and Start Selling Your Products Today
            </h2>

            <p className="text-neutral-400 mt-4 text-sm md:text-base">
              Claim your dedicated vendor space, upload your catalog in minutes, and let our platform handle the heavy lifting.
            </p>

            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => navigate("/vendor-register")}
                className="rounded-full px-10 py-6 text-lg font-semibold bg-teal-500 text-black hover:bg-teal-400 transition flex items-center gap-2 shadow-lg shadow-teal-500/20"
              >
                START SELLING
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  )
}