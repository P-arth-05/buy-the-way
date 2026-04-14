import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { CATEGORIES, CATEGORY_IMAGES } from "@/data/mockData"

export default function Categories() {
  const navigate = useNavigate()

  return (
    <section className="px-4 md:px-8 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-light">
            Shop by Category
          </h2>
          <p className="text-neutral-500 mt-2">
            Explore curated collections designed for your lifestyle
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.filter(c => c !== "All").map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="cursor-pointer"
              onClick={() => navigate(`/shop?category=${category}`)}
            >
              <div className="relative rounded-2xl overflow-hidden group">

                {/* IMAGE */}
                <img
                  src={CATEGORY_IMAGES[category]}
                  alt={category}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                {/* TEXT */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg font-medium">{category}</p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}