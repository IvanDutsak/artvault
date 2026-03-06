
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import Magnetic from "@/components/Magnetic";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/gallery", label: "Галерея" },
  { href: "/gallery3d", label: "3D Музей" },
  { href: "/about", label: "Про нас" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { getItemCount } = useCart();
  const { getFavoritesCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const cartCount = getItemCount();
  const favCount = getFavoritesCount();

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-ui ${scrolled
          ? "bg-[oklch(0.08_0.005_285_/_90%)] backdrop-blur-xl shadow-[0_4px_30px_oklch(0_0_0_/_40%)]"
          : "bg-transparent"
          }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">

          <Link href="/">
            <motion.div
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 border border-gold/40 flex items-center justify-center relative overflow-hidden">
                <span className="font-display text-gold text-xl font-bold relative z-10">A</span>
                <motion.div
                  className="absolute inset-0 bg-gold/10"
                  whileHover={{ scale: 1.5, opacity: 0.3 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base sm:text-lg tracking-[0.2em] text-cream font-semibold leading-tight">
                  ARTVAULT
                </span>
                <span className="text-[10px] tracking-[0.3em] text-gold/60 font-ui uppercase">
                  Галерея Мистецтва
                </span>
              </div>
            </motion.div>
          </Link>


          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className={`relative font-ui text-sm tracking-[0.15em] uppercase transition-colors duration-300 py-2 ${location === link.href
                    ? "text-gold"
                    : "text-cream/70 hover:text-cream"
                    }`}
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>
            ))}
          </div>


          <div className="flex items-center gap-4">
            <Magnetic intensity={0.2} actionArea="parent">
              <Link href="/favorites">
                <motion.div
                  className="relative p-2 text-cream/70 hover:text-gold transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={20} className={favCount > 0 ? "fill-gold text-gold" : ""} />
                  {favCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-[14px] text-background font-bold flex items-center justify-center rounded-full shadow-lg"
                    >
                      {favCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </Magnetic>

            <Magnetic intensity={0.2} actionArea="parent">
              <Link href="/cart">
                <motion.div
                  className="relative p-2 text-cream/70 hover:text-gold transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-[14px] text-background font-bold flex items-center justify-center rounded-full shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </Magnetic>


            <Magnetic intensity={0.2}>
              <motion.button
                className="md:hidden p-2 text-cream/70 hover:text-gold cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                whileTap={{ scale: 0.9 }}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </Magnetic>
          </div>
        </div>
      </motion.nav>


      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[oklch(0.06_0.005_285_/_98%)] backdrop-blur-2xl pt-20 md:pt-24 px-6 sm:px-8 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={link.href}>
                    <span
                      className={`font-display text-3xl tracking-wider ${location === link.href ? "text-gold" : "text-cream/80"
                        }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-8 border-t border-gold/20"
              >
                <Link href="/favorites">
                  <span className="font-ui text-cream/60 text-sm tracking-wider flex items-center gap-3">
                    <Heart size={16} /> Обрані ({favCount})
                  </span>
                </Link>
              </motion.div>
              <Link href="/cart">
                <span className="font-ui text-cream/60 text-sm tracking-wider flex items-center gap-3">
                  <ShoppingCart size={16} /> Кошик ({cartCount})
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
