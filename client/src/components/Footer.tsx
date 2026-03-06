
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";
import Magnetic from "@/components/Magnetic";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[oklch(0.06_0.003_285)] pt-16 md:pt-24 pb-8 md:pb-12">

      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 mb-16 md:mb-24">


          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 border border-gold/40 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <span className="font-display text-gold text-xl font-bold">A</span>
                </div>
                <span className="font-display text-xl sm:text-2xl tracking-[0.25em] text-cream">ARTVAULT</span>
              </div>
              <p className="font-body text-cream/50 text-[15px] leading-loose max-w-sm mb-10">
                Ексклюзивна онлайн-галерея, де кожен твір мистецтва — це подорож крізь епохи та стилі. Ми зберігаємо історію для майбутнього.
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-ui text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-6">
                Підписатися на новини
              </h4>
              <div className="flex relative max-w-sm group">
                <input
                  type="email"
                  placeholder="Ваш Email"
                  className="w-full bg-transparent border-b border-gold/20 pb-4 pl-0 text-cream placeholder:text-cream/20 focus:outline-none focus:border-gold font-ui text-sm transition-colors"
                />
                <button className="absolute right-0 top-0 text-gold/40 hover:text-gold transition-transform duration-300 p-2 transform group-hover:translate-x-1 cursor-pointer">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>


          <div className="hidden lg:block lg:col-span-3"></div>


          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-ui text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-8">
              Меню
            </h4>
            <div className="flex flex-col gap-6">
              {[
                { href: "/", label: "Головна" },
                { href: "/gallery", label: "Галерея" },
                { href: "/gallery3d", label: "3D Музей" },
                { href: "/favorites", label: "Обрані" },
                { href: "/cart", label: "Кошик" },
                { href: "/about", label: "Про нас" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    className="font-ui text-xs tracking-widest uppercase text-cream/40 hover:text-gold transition-colors duration-300 inline-block cursor-pointer relative group"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>


          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-ui text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-8">
              Зв'язок
            </h4>
            <div className="flex flex-col gap-5 font-ui text-xs text-cream/40 tracking-widest mb-12">
              <a href="mailto:info@artvault.gallery" className="hover:text-gold transition-colors w-fit">info@artvault.gallery</a>
              <a href="tel:+380441234567" className="hover:text-gold transition-colors w-fit">+380 44 123 4567</a>
              <span className="text-cream/20 pt-2">Івано Франківськ, Вулиця АТБ Бульвара</span>
            </div>

            <div className="flex gap-5">
              <Magnetic intensity={0.4}>
                <a href="#" className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 cursor-pointer">
                  <Instagram size={16} />
                </a>
              </Magnetic>
              <Magnetic intensity={0.4}>
                <a href="#" className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 cursor-pointer">
                  <Twitter size={16} />
                </a>
              </Magnetic>
              <Magnetic intensity={0.4}>
                <a href="#" className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 cursor-pointer">
                  <Facebook size={16} />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>


        <div className="pt-6 md:pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-center md:text-left">
          <p className="font-ui text-xs text-cream/30 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} ArtVault. Усі права захищені.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-ui text-xs text-cream/30 tracking-wider hover:text-gold transition-colors">Політика конфіденційності</a>
            <a href="#" className="font-ui text-xs text-cream/30 tracking-wider hover:text-gold transition-colors">Умови використання</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
