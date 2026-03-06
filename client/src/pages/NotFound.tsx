
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import MegaFooter from "@/components/MegaFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[120px] md:text-[180px] text-gold/10 font-bold leading-none block"
          >
            404
          </motion.span>
          <h1 className="font-display text-3xl md:text-4xl text-cream font-bold -mt-8 mb-4">
            Сторінку не знайдено
          </h1>
          <p className="font-body text-cream/50 mb-8 max-w-md mx-auto">
            Ця сторінка, як загублений шедевр, ще чекає на своє відкриття. Поверніться до галереї.
          </p>
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px oklch(0.75 0.12 85 / 20%)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-3 border border-gold/30 text-gold font-ui text-sm tracking-[0.2em] uppercase font-medium hover:bg-gold/5 transition-all duration-300"
            >
              <ArrowLeft size={16} />
              На головну
            </motion.span>
          </Link>
        </motion.div>
      </div>
      <MegaFooter />
    </div>
  );
}
