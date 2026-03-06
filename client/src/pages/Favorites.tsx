
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import MegaFooter from "@/components/MegaFooter";
import GoldParticles from "@/components/GoldParticles";
import ArtworkCard from "@/components/ArtworkCard";
import PageTransition from "@/components/PageTransition";
import { artworks } from "@/lib/data";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();
  const favoriteArtworks = artworks.filter((a) => favorites.includes(a.id));

  return (
    <PageTransition variant="unroll">
      <div className="min-h-screen flex flex-col bg-background relative">
        <GoldParticles count={20} />
        <Navbar />

        <section className="relative z-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 flex-1">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="font-ui text-xs tracking-[0.4em] text-gold/60 uppercase">Ваша колекція</span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream font-bold mt-3 mb-4">
                Обрані твори
              </h1>
              <div className="ornament-divider max-w-md mx-auto">
                <Heart size={14} className="text-gold/60 fill-gold/60" />
              </div>
            </motion.div>

            {favoriteArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteArtworks.map((artwork, i) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 border border-gold/20 flex items-center justify-center"
                >
                  <Heart size={32} className="text-gold/30" />
                </motion.div>
                <h2 className="font-display text-2xl text-cream/50 mb-3">
                  Ваш список обраних порожній
                </h2>
                <p className="font-body text-cream/30 mb-8 max-w-md mx-auto">
                  Натисніть на серце біля будь-якого твору, щоб додати його до обраних
                </p>
                <Link href="/gallery">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 px-8 py-3 border border-gold/30 text-gold font-ui text-sm tracking-[0.2em] uppercase font-medium hover:bg-gold/5 transition-all duration-300"
                  >
                    <Sparkles size={16} />
                    Перейти до галереї
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
