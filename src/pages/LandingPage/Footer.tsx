import { motion } from "framer-motion"
import { Link } from "react-router-dom"

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

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <motion.div
        className="container mx-auto px-4 py-12"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <motion.div variants={item}>
            <h3 className="font-bold text-lg mb-4 text-primary">
              Buy the Way
            </h3>
            <p className="text-sm text-muted-foreground">
              The premier online marketplace connecting you with verified vendors for high-quality goods.
            </p>
          </motion.div>

          {/* CUSTOMER SERVICE */}
          <motion.div variants={item}>
            <h4 className="font-semibold mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/order-tracking"
                  className="hover:text-primary transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-primary transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* ABOUT */}
          <motion.div variants={item}>
            <h4 className="font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About "Buy the Way"
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* LEGAL */}
          <motion.div variants={item}>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* BOTTOM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground"
        >
          © {new Date().getFullYear()} Buy the Way. All Rights Reserved.
        </motion.div>
      </motion.div>
    </footer>
  )
}