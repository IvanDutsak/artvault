
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Artwork } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import Magnetic from "@/components/Magnetic";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

interface ArtworkCardProps {
  artwork: Artwork;
  index?: number;
}

export default function ArtworkCard({ artwork, index = 0 }: ArtworkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [, navigate] = useLocation();
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const addToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(artwork);
    toast.success(`"${artwork.title}" додано до кошика`);
  };

  const toggleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasAlreadyFavorite = isFavorite(artwork.id);
    toggleFavorite(artwork.id);
    toast.success(
      wasAlreadyFavorite
        ? `"${artwork.title}" видалено з обраних`
        : `"${artwork.title}" додано до обраних`
    );
  };

  const rotateX = isHovered ? (mousePos.y - 0.5) * -8 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 8 : 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      } as any}
      className="group relative"
    >
      <div onClick={() => navigate(`/artwork/${artwork.id}`)} className="cursor-pointer">
        <div className="relative overflow-hidden bg-card gold-border-glow">

          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-gold" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-gold" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-gold" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-gold" />


          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />


            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(201,168,76,0.15) 0%, transparent 60%)`,
              }}
            />


            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_285)] via-transparent to-transparent opacity-80" />


            <motion.div
              initial={false}
              animate={{ opacity: (isHovered || isTouchDevice) ? 1 : 0, y: (isHovered || isTouchDevice) ? 0 : -20 }}
              transition={{ duration: 0.4 }}
              className="absolute top-4 right-4 flex flex-col gap-2 z-20"
            >
              <Magnetic intensity={0.4}>
                <motion.button
                  onClick={toggleFavoriteClick}
                  className="p-3 bg-background/90 border border-gold/10 hover:border-gold/30 hover:bg-background transition-all text-cream/70 rounded-none cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart
                    size={20}
                    className={
                      isFavorite(artwork.id) ? "fill-gold text-gold" : "hover:text-gold"
                    }
                  />
                </motion.button>
              </Magnetic>

              <Magnetic intensity={0.4}>
                <motion.button
                  onClick={addToCartClick}
                  disabled={isInCart(artwork.id)}
                  className={`p-3 bg-background/90 border border-gold/10 transition-all rounded-none cursor-pointer ${isInCart(artwork.id)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-gold/30 hover:bg-background text-cream/70"
                    }`}
                  whileHover={!isInCart(artwork.id) ? { scale: 1.1 } : {}}
                  whileTap={!isInCart(artwork.id) ? { scale: 0.95 } : {}}
                >
                  {isInCart(artwork.id) ? (
                    <Check size={20} className="text-gold" />
                  ) : (
                    <ShoppingCart size={20} className="hover:text-gold" />
                  )}
                </motion.button>
              </Magnetic>
            </motion.div>


            <motion.div
              initial={false}
              animate={{ opacity: (isHovered || isTouchDevice) ? 1 : 0, y: (isHovered || isTouchDevice) ? 0 : 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="absolute bottom-16 left-0 right-0 flex justify-center z-20"
            >
              <span className="flex items-center gap-2 px-5 py-2 bg-gold/90 text-background font-ui text-xs tracking-[0.2em] uppercase font-medium">
                <Eye size={14} /> Детальніше
              </span>
            </motion.div>
          </div>


          <div className="p-4 relative">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base text-cream font-semibold truncate leading-tight">
                  {artwork.title}
                </h3>
                <p className="font-body text-sm text-cream/60 mt-1">
                  {artwork.artist}, {artwork.year}
                </p>
              </div>
              <span className="font-ui text-gold text-sm font-medium whitespace-nowrap">
                {formatPrice(artwork.price)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-ui tracking-[0.15em] uppercase text-gold/60 border border-gold/20 px-2 py-0.5">
                {artwork.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
