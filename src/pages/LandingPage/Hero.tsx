import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { MOCK_PRODUCTS } from "@/data/mockData" 
import { Route } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}


const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Hero() {
    const navigate = useNavigate()

  return (
    <section className="px-4 md:px-8 lg:px-16 py-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">

          {/* LEFT TEXT */}
          <motion.div variants={item} className="max-w-2xl md:max-w-3xl lg:max-w-5xl">
            <h1 className="font-heading text-3xl md:text-8xl font-light leading-tight">
              A refined approach to shopping, built on clarity and intention
            </h1>

            {/* CTA + AVATARS */}
            <div className="flex items-center gap-4 mt-10">
              <Button className="rounded-full px-10 py-8 text-xl">
                Register Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-neutral-500 mt-2">
              500+ Happy Customers
            </p>
          </motion.div>

          {/* RIGHT EMPTY SPACE (for alignment like design) */}
          <div className="hidden lg:block w-50" />
        </div>

        {/* PRODUCT CARDS */}
        <div className="relative mt-12">
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-neutral-100 to-transparent z-10" />
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-neutral-100 to-transparent z-10" />

            {/* AUTO SCROLL CAROUSEL */}
            <div className="overflow-hidden mt-12">
                <motion.div
                    className="flex gap-6 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                    }}
                >
                    {[...MOCK_PRODUCTS, ...MOCK_PRODUCTS].map((product, i) => (
                    <Card
                        key={i}
                        className="min-w-[260px] max-w-[260px] rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        {/* IMAGE */}
                        <div className="overflow-hidden">
                            <motion.img
                                src={product.image}
                                className="w-full h-56 object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>

                            {/* CONTENT */}
                        <CardContent className="p-4">
                            <p className="font-medium">{product.name}</p>

                            <p className="text-sm text-neutral-500">
                                ₹{product.price} • {product.category}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                                <Button size="sm" className="rounded-full" onClick={()=>navigate('/shop')}>
                                Buy Now
                                </Button>

                                <div className="flex items-center gap-1 text-sm text-neutral-500">
                                ⭐ {product.rating}
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </motion.div>
                    </div>
        </div>
        

      </motion.div>
    </section>
  )
}