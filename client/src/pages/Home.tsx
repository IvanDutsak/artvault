
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Quote, Maximize2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import GoldParticles from "@/components/GoldParticles";
import ArtworkCard from "@/components/ArtworkCard";
import PageTransition from "@/components/PageTransition";
import Magnetic from "@/components/Magnetic";
import CinematicHero from "@/components/CinematicHero";

import MegaFooter from "@/components/MegaFooter";
import { getFeaturedArtworks, categories, artworks } from "@/lib/data";
import { pluralizeTvir } from "@/lib/utils";

const testimonials = [
  {
    text: "ArtVault відкрив для мене світ мистецтва, який я навіть не уявляла. Кожен твір — це справжня подорож.",
    author: "Олена Коваленко",
    role: "Колекціонер",
  },
  {
    text: "Неймовірна якість та увага до деталей. Це найкраща онлайн-галерея, яку я бачив.",
    author: "Андрій Шевченко",
    role: "Мистецтвознавець",
  },
  {
    text: "Завдяки ArtVault я знайшов ідеальний твір для своєї колекції. Рекомендую всім поціновувачам.",
    author: "Марія Петренко",
    role: "Дизайнер інтер'єрів",
  },
];

export default function Home() {
  const featured = getFeaturedArtworks();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition variant="doors">
      <div className="min-h-screen flex flex-col bg-background relative">
        <GoldParticles count={30} />
        <Navbar />


        <CinematicHero />


        <section className="py-16 md:py-24 relative">
          <div className="container" id="featured">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <Sparkles size={16} className="text-gold" />
                  <span className="font-ui text-gold text-xs tracking-[0.3em] uppercase">
                    Вибір куратора
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-display text-3xl sm:text-4xl md:text-5xl text-cream font-bold leading-tight"
                >
                  Шедеври, що надихають
                </motion.h2>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="cursor-pointer"
              >
                <Link href="/gallery" className="inline-flex items-center gap-2 text-gold hover:text-cream transition-colors font-ui text-sm tracking-widest uppercase cursor-pointer">
                  Всі картини <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featured.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ArtworkCard artwork={artwork} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        <section className="relative z-10 py-6 bg-[oklch(0.07_0.003_285)] border-y border-gold/10 overflow-hidden">
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap min-w-max"
          >
            {[...Array(3)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-12 flex-shrink-0">
                {["Ренесанс", "•", "Імпресіонізм", "•", "Бароко", "•", "Модернізм", "•", "Сюрреалізм", "•", "Абстракціонізм", "•"].map(
                  (text, i) => (
                    <span
                      key={`${setIdx}-${i}`}
                      className={`font-display text-lg tracking-[0.15em] flex-shrink-0 ${text === "•" ? "text-gold/30" : "text-cream/20"}`}
                    >
                      {text}
                    </span>
                  )
                )}
              </div>
            ))}
          </motion.div>
        </section>


        <section className="py-16 md:py-24 relative bg-[oklch(0.06_0.002_285)]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream font-bold mb-4">
                Епохи та Стилі
              </h2>
              <p className="font-body text-cream/50 max-w-2xl mx-auto">
                Подорожуйте крізь час та мистецькі течії. Кожна категорія відкриває нову грань людської творчості.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {categories.map((category, index) => {
                const categoryArtworks = artworks.filter((a) => a.category === category);
                const count = categoryArtworks.length;
                const bgImage = categoryArtworks[0]?.image || "";

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/gallery?category=${encodeURIComponent(category)}`} className="block w-full h-full">
                      <div className="relative h-72 overflow-hidden group cursor-pointer border border-gold/10 hover:border-gold/30 transition-colors duration-500">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                          style={{ backgroundImage: `url(${bgImage})` }}
                        />
                        <div className="absolute inset-0 bg-[oklch(0.06_0.005_285_/_95%)] group-hover:bg-[oklch(0.06_0.005_285_/_40%)] transition-colors duration-700 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.005_285)] via-transparent to-transparent opacity-90" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                          <h3 className="font-display text-2xl md:text-3xl text-cream font-bold mb-3 uppercase tracking-[0.2em] group-hover:text-gold transition-colors duration-500 transform group-hover:-translate-y-2">
                            {category}
                          </h3>
                          <p className="font-ui text-xs text-gold/60 tracking-[0.3em] uppercase transform transition-all duration-500 group-hover:text-cream group-hover:translate-y-0 opacity-80 group-hover:opacity-100">
                            {count} {pluralizeTvir(count)}
                          </p>
                          <div className="h-px w-0 bg-gold mt-6 transition-all duration-700 ease-out group-hover:w-16 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-gold/0 group-hover:border-gold/40 transition-colors duration-500" />
                        <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-gold/0 group-hover:border-gold/40 transition-colors duration-500" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>


        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="container relative z-10 text-center">
            <Quote size={48} className="text-gold/20 mx-auto mb-8" />

            <div className="relative h-64 sm:h-48 md:h-36 mb-8 sm:mb-12 flex justify-center items-center">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  className="absolute w-full max-w-3xl"
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{
                    opacity: activeTestimonial === idx ? 1 : 0,
                    y: activeTestimonial === idx ? 0 : 20,
                    filter: activeTestimonial === idx ? "blur(0px)" : "blur(10px)",
                    pointerEvents: activeTestimonial === idx ? "auto" as const : "none" as const,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <p className="font-display text-xl sm:text-2xl md:text-3xl text-cream leading-relaxed mb-4 sm:mb-6">
                    "{t.text}"
                  </p>
                  <div>
                    <h4 className="font-ui text-gold uppercase tracking-[0.2em] text-sm font-bold">
                      {t.author}
                    </h4>
                    <span className="font-body text-cream/40 text-sm">{t.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              {testimonials.map((_, idx) => (
                <button key={idx} onClick={() => setActiveTestimonial(idx)} className="p-2">
                  <motion.div
                    className={`h-1 transition-all duration-300 ${activeTestimonial === idx ? "w-8 bg-gold" : "w-4 bg-gold/20"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>


        <section className="relative py-20 sm:py-24 lg:py-32 mt-8 sm:mt-12 overflow-hidden bg-[oklch(0.04_0.005_285)] border-t border-gold/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-[oklch(0.04_0.005_285)] to-[oklch(0.04_0.005_285)] opacity-50" />
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-gold/5 blur-[100px] rounded-full pointer-events-none"
          />

          <div className="container relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
                <Sparkles size={16} className="text-gold" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
              </div>

              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-cream leading-tight">
                Ваша власна <br />
                <span className="gold-shimmer font-style-italic tracking-wider">мистецька колекція</span>
              </h2>

              <p className="font-body text-lg sm:text-xl text-cream/50 max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
                Кожен твір у нашій галереї — це унікальна історія, що чекає на свого поціновувача. Знайдіть ту саму картину, яка резонує з вашою душею.
              </p>

              <Magnetic intensity={0.2}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0 rounded-none blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <Link href="/gallery" className="relative flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 bg-[oklch(0.08_0.005_285)] border border-gold/30 hover:border-gold hover:bg-[oklch(0.12_0.005_285)] text-gold hover:text-cream transition-all duration-500 overflow-hidden font-ui text-xs sm:text-sm tracking-[0.25em] uppercase font-medium">
                    <span className="relative z-10">Перейти до галереї</span>
                    <ArrowRight size={18} className="relative z-10 transform group-hover:translate-x-2 transition-transform duration-500" />
                    <div className="absolute inset-0 h-full w-[200%] translate-x-[-100%] group-hover:translate-x-[50%] bg-gradient-to-r from-transparent via-gold/10 to-transparent transition-transform duration-1000 ease-in-out" />
                  </Link>
                </motion.div>
              </Magnetic>
            </motion.div>
          </div>
        </section>


        <MegaFooter />
      </div>
    </PageTransition>
  );
}
