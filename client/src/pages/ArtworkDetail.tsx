
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useLocation, Link } from "wouter";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Calendar,
  Ruler,
  Palette,
  Sparkles,
  ZoomIn,
  X,
  Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MegaFooter from "@/components/MegaFooter";
import ArtworkCard from "@/components/ArtworkCard";
import Magnetic from "@/components/Magnetic";
import { getArtworkById, artworks, formatPrice } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const artwork = getArtworkById(id || "");
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }, 100);
    return () => clearTimeout(t);
  }, [id]);

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-display text-3xl text-cream mb-4">Твір не знайдено</h1>
            <Link href="/gallery">
              <span className="font-ui text-gold text-sm hover:underline">Повернутися до галереї</span>
            </Link>
          </div>
        </div>
        <MegaFooter />
      </div>
    );
  }

  const getKeywords = (text: string) =>
    text.toLowerCase().replace(/[.,!?'"()]/g, "").split(/\s+/).filter((w) => w.length > 4);
  const currentKeywords = [...getKeywords(artwork.title), ...getKeywords(artwork.description)];

  const relatedArtworks = artworks
    .filter((a) => a.id !== artwork.id)
    .map((a) => {
      let score = 0;
      if (a.artist === artwork.artist) score += 10;
      if (a.category === artwork.category) score += 2;
      const targetKeywords = [...getKeywords(a.title), ...getKeywords(a.description)];
      const overlap = currentKeywords.filter((k) => targetKeywords.includes(k)).length;
      score += overlap * 3;
      return { item: a, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((i) => i.item);

  const handleAddToCart = () => {
    addToCart(artwork);
    toast.success(`"${artwork.title}" додано до кошика`);
  };

  const handleToggleFavorite = () => {
    const wasAlreadyFavorite = isFavorite(artwork.id);
    toggleFavorite(artwork.id);
    toast.success(
      wasAlreadyFavorite
        ? `"${artwork.title}" видалено з обраних`
        : `"${artwork.title}" додано до обраних`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-gold/30 selection:text-gold font-body">
      <Navbar />


      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[oklch(0.05_0.003_285_/_95%)] backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsZoomed(false)}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-6 right-6 text-cream/60 hover:text-gold transition-colors z-10"
              onClick={() => setIsZoomed(false)}
            >
              <X size={28} />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              src={artwork.image}
              alt={artwork.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>


      <section className="relative z-10 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="container">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/gallery")}
              className="inline-flex items-center gap-2 text-cream/50 hover:text-gold transition-colors font-ui text-sm tracking-wider uppercase cursor-pointer"
            >
              <ArrowLeft size={16} />
              Назад до галереї
            </motion.button>
          </motion.div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              <div
                className="relative overflow-hidden cursor-zoom-in bg-[oklch(0.08_0.005_285)] border border-gold/10"
                onClick={() => setIsZoomed(true)}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-auto object-contain"
                />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                  <div className="w-14 h-14 border border-gold/50 flex items-center justify-center backdrop-blur-sm">
                    <ZoomIn size={24} className="text-gold" />
                  </div>
                </div>
              </div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >

              <span className="font-ui text-[10px] tracking-[0.3em] text-gold/60 uppercase mb-3">
                {artwork.category}
              </span>


              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-cream font-bold leading-tight mb-3">
                {artwork.title}
              </h1>


              <p className="font-body text-lg text-cream/60 mb-6">
                {artwork.artist}, {artwork.year}
              </p>


              <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mb-6" />


              <p className="font-body text-base text-cream/65 leading-relaxed mb-8">
                {artwork.description}
              </p>


              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 p-4 border border-gold/10 bg-[oklch(0.08_0.005_285)] group/item hover:border-gold/25 transition-colors">
                  <Calendar size={20} className="text-gold/50 group-hover/item:text-gold transition-colors" />
                  <div>
                    <span className="font-ui text-[10px] text-cream/40 tracking-wider uppercase block">Рік</span>
                    <span className="font-ui text-sm font-medium text-cream">{artwork.year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gold/10 bg-[oklch(0.08_0.005_285)] group/item hover:border-gold/25 transition-colors">
                  <Ruler size={20} className="text-gold/50 group-hover/item:text-gold transition-colors" />
                  <div>
                    <span className="font-ui text-[10px] text-cream/40 tracking-wider uppercase block">Розмір</span>
                    <span className="font-ui text-sm font-medium text-cream">{artwork.dimensions}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gold/10 bg-[oklch(0.08_0.005_285)] col-span-2 group/item hover:border-gold/25 transition-colors">
                  <Palette size={20} className="text-gold/50 group-hover/item:text-gold transition-colors" />
                  <div>
                    <span className="font-ui text-[10px] text-cream/40 tracking-wider uppercase block">Техніка</span>
                    <span className="font-ui text-sm font-medium text-cream">{artwork.medium}</span>
                  </div>
                </div>
              </div>


              <div className="p-6 border border-gold/15 bg-[oklch(0.06_0.005_285)]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="font-ui text-[10px] text-cream/40 tracking-wider uppercase block mb-1">Ціна</span>
                    <span className="font-display text-2xl sm:text-3xl text-gold font-bold">
                      {formatPrice(artwork.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={
                      !isInCart(artwork.id)
                        ? { scale: 1.02, boxShadow: "0 0 30px oklch(0.75 0.12 85 / 25%)" }
                        : {}
                    }
                    whileTap={!isInCart(artwork.id) ? { scale: 0.97 } : {}}
                    onClick={!isInCart(artwork.id) ? handleAddToCart : undefined}
                    disabled={isInCart(artwork.id)}
                    className={`flex items-center justify-center gap-3 py-3.5 font-ui text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 cursor-pointer ${isInCart(artwork.id)
                      ? "bg-gold/20 border border-gold text-gold cursor-default opacity-80"
                      : "bg-gold text-background hover:bg-gold/90"
                      }`}
                  >
                    <ShoppingCart size={18} />
                    {isInCart(artwork.id) ? "У кошику" : "Додати до кошика"}
                  </motion.button>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleFavorite}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 border transition-all duration-300 cursor-pointer ${isFavorite(artwork.id)
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/30 text-cream/60 hover:text-gold hover:border-gold/60"
                        }`}
                    >
                      <Heart size={16} className={isFavorite(artwork.id) ? "fill-gold" : ""} />
                      <span className="font-ui text-xs tracking-wider uppercase">
                        {isFavorite(artwork.id) ? "В обраних" : "Обране"}
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: "oklch(0.12 0.005 285)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/artwork/${artwork.id}/room`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border border-gold/30 text-cream font-ui text-xs tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      <Eye size={16} className="text-gold" />
                      В інтер'єрі
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {relatedArtworks.length > 0 && (
        <section className="relative z-10 py-24 bg-[oklch(0.07_0.003_285)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="font-ui text-xs tracking-[0.4em] text-gold/60 uppercase">
                Також рекомендуємо
              </span>
              <h2 className="font-display text-3xl text-cream font-bold mt-3 mb-4">Схожі твори</h2>
              <div className="ornament-divider max-w-sm mx-auto">
                <Sparkles size={14} className="text-gold/60" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArtworks.map((art, i) => (
                <ArtworkCard key={art.id} artwork={art} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <MegaFooter />
    </div>
  );
}
