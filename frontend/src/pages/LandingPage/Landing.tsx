import Hero from "./Hero"
import Footer from "./Footer"
import Categories from "./Categories"
import About from "./About"
import CTA from "./CTA"
import Navbar from "./Navbar"


export default function Landing() {
  return (
    <div className="bg-neutral-100 text-neutral-900">
      <Navbar />
      <Hero />
      <Categories />
      <About />
      <CTA />
      <Footer />
    </div>
  )
}
