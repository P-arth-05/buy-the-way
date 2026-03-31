import { motion } from "framer-motion"

export default function ScrollingBackground() {
  const text = "VENDOR LOGIN • START SELLING TODAY • "

  return (
    <div className="absolute inset-0 overflow-hidden z-0">

      {/* Rotated layer */}
      <div className="absolute inset-0 rotate-[-25deg] scale-[2] flex flex-col justify-center">

        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="whitespace-nowrap text-5xl md:text-7xl font-bold text-black/10 tracking-wider"
            animate={{ x: i % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{
              repeat: Infinity,
              duration: 18 + i * 2,
              ease: "linear",
            }}
            style={{ marginBottom: "2rem" }}
          >
            {text.repeat(20)}
          </motion.div>
        ))}

      </div>
    </div>
  )
}