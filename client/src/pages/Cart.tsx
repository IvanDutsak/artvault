
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Sparkles, ArrowRight, Package } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import MegaFooter from "@/components/MegaFooter";
import GoldParticles from "@/components/GoldParticles";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/data";
import { toast } from "sonner";

export default function Cart() {
  const { items, removeFromCart, clearCart, getTotal } = useCart();

  const handleCheckout = () => {
    toast.success("Замовлення оформлено! Дякуємо за покупку.", {
      duration: 5000,
    });
    clearCart();
  };

  return (
    <PageTransition variant="unroll">
      <div className="min-h-screen flex flex-col bg-background relative">
        <GoldParticles count={20} />
        <Navbar />

        <section className="relative z-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 flex-1">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="font-ui text-xs tracking-[0.4em] text-gold/60 uppercase">Ваше замовлення</span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream font-bold mt-3 mb-4">
                Кошик
              </h1>
              <div className="ornament-divider max-w-md mx-auto">
                <ShoppingCart size={14} className="text-gold/60" />
              </div>
            </motion.div>

            {items.length > 0 ? (
              <div className="space-y-6">

                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div
                      key={item.artwork.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex gap-4 md:gap-6 p-4 border border-gold/15 bg-[oklch(0.12_0.005_285)] gold-border-glow"
                    >

                      <Link href={`/artwork/${item.artwork.id}`}>
                        <div className="w-24 h-32 md:w-32 md:h-40 overflow-hidden flex-shrink-0 border border-gold/10">
                          <img
                            src={item.artwork.image}
                            alt={item.artwork.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </Link>


                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <Link href={`/artwork/${item.artwork.id}`}>
                            <h3 className="font-display text-lg text-cream font-semibold hover:text-gold transition-colors truncate">
                              {item.artwork.title}
                            </h3>
                          </Link>
                          <p className="font-body text-sm text-cream/50 mt-1">
                            {item.artwork.artist}, {item.artwork.year}
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-ui tracking-[0.15em] uppercase text-gold/50 border border-gold/15 px-2 py-0.5">
                            {item.artwork.category}
                          </span>
                        </div>
                        <div className="flex items-end justify-between mt-3">
                          <span className="font-display text-xl text-gold font-semibold">
                            {formatPrice(item.artwork.price)}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              removeFromCart(item.artwork.id);
                              toast.info(`"${item.artwork.title}" видалено з кошика`);
                            }}
                            className="p-2 text-cream/30 hover:text-destructive transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>


                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="border border-gold/20 bg-[oklch(0.1_0.005_285)] p-6 mt-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-ui text-sm text-cream/60 tracking-wider">
                      Кількість творів:
                    </span>
                    <span className="font-ui text-sm text-cream">{items.length}</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-4" />
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-lg text-cream">Загальна сума:</span>
                    <span className="font-display text-2xl text-gold font-bold">
                      {formatPrice(getTotal())}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212, 175, 55, 0.25)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCheckout}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-gold text-background font-ui text-sm tracking-[0.15em] uppercase font-medium"
                    >
                      <Package size={16} />
                      Оформити замовлення
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        clearCart();
                        toast.info("Кошик очищено");
                      }}
                      className="px-4 border border-gold/20 text-cream/50 hover:text-destructive hover:border-destructive/30 transition-all duration-300"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 border border-gold/20 flex items-center justify-center"
                >
                  <ShoppingCart size={32} className="text-gold/30" />
                </motion.div>
                <h2 className="font-display text-2xl text-cream/50 mb-3">
                  Ваш кошик порожній
                </h2>
                <p className="font-body text-cream/30 mb-8 max-w-md mx-auto">
                  Додайте твори мистецтва з галереї, щоб оформити замовлення
                </p>
                <Link href="/gallery">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 px-8 py-3 border border-gold/30 text-gold font-ui text-sm tracking-[0.2em] uppercase font-medium hover:bg-gold/5 transition-all duration-300"
                  >
                    <Sparkles size={16} />
                    Перейти до галереї
                    <ArrowRight size={16} />
                  </motion.span>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        <MegaFooter />
      </div>
    </PageTransition>
  );
}
