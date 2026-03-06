
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Sparkles, Maximize2 } from "lucide-react";
import { useSearch, Link } from "wouter";
import Navbar from "@/components/Navbar";
import MegaFooter from "@/components/MegaFooter";
import GoldParticles from "@/components/GoldParticles";
import ArtworkCard from "@/components/ArtworkCard";
import PageTransition from "@/components/PageTransition";
import { artworks, categories, type ArtCategory } from "@/lib/data";
import { pluralizeTvir } from "@/lib/utils";

type SortOption = "default" | "price-asc" | "price-desc" | "year-asc" | "year-desc";

export default function Gallery() {
  const searchParams = useSearch();
  const urlCategory = new URLSearchParams(searchParams).get("category") as ArtCategory | null;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ArtCategory | "all">(
    urlCategory && categories.includes(urlCategory) ? urlCategory : "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.artist.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "year-asc":
        result.sort((a, b) => a.year - b.year);
        break;
      case "year-desc":
        result.sort((a, b) => b.year - a.year);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <PageTransition variant="unroll">
      <div className="min-h-screen flex flex-col bg-background relative">
        <GoldParticles count={25} />
        <Navbar />


        <section className="relative z-10 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3 mb-2"
              >
                <span className="font-ui text-xs tracking-[0.4em] text-gold/60 uppercase">
                  Колекція
                </span>
                <Link href="/gallery3d">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 border border-gold/30 hover:border-gold text-gold/70 hover:text-gold font-ui text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer"
                  >
                    <Maximize2 size={10} />
                    3D Музей
                  </motion.span>
                </Link>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl text-cream font-bold mt-3 mb-4"
              >
                Галерея
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="ornament-divider max-w-md mx-auto"
              >
                <Sparkles size={14} className="text-gold/60" />
              </motion.div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-4xl mx-auto space-y-6"
            >

              <div className="relative group">
                <div className="absolute inset-0 bg-gold/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors duration-500 z-10" />
                <input
                  type="text"
                  placeholder="Пошук за назвою або художником..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full relative z-0 pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 bg-[oklch(0.1_0.005_285_/_60%)] backdrop-blur-md border border-gold/20 rounded-full text-cream font-ui text-sm sm:text-base placeholder:text-cream/30 focus:outline-none focus:border-gold/50 focus:bg-[oklch(0.1_0.005_285_/_80%)] focus:shadow-[0_0_30px_oklch(0.75_0.12_85_/_15%)] transition-all duration-500"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-cream/40 hover:text-gold bg-background/50 p-1.5 rounded-full hover:bg-gold/10 transition-colors z-10 cursor-pointer"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>


              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 font-ui text-sm tracking-[0.15em] text-cream/60 hover:text-gold uppercase transition-colors duration-300 cursor-pointer group"
                >
                  <SlidersHorizontal size={16} className="group-hover:text-gold transition-colors" />
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">Фільтри</span>
                    <span className="absolute inset-0 block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-gold">Фільтри</span>
                  </span>
                  <motion.span
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-gold/60 ml-1"
                  >
                    ▾
                  </motion.span>
                </button>

                <div className="relative group/select">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-[oklch(0.12_0.005_285_/_50%)] backdrop-blur-sm border border-gold/20 rounded-full text-cream/80 font-ui text-[11px] sm:text-xs tracking-wider uppercase px-4 sm:px-5 py-2 sm:py-2.5 pr-7 sm:pr-8 focus:outline-none focus:border-gold/50 focus:bg-[oklch(0.12_0.005_285_/_80%)] hover:border-gold/30 transition-all duration-300 cursor-pointer w-full sm:w-auto"
                  >
                    <option value="default">За замовчуванням</option>
                    <option value="price-asc">Ціна: від низької</option>
                    <option value="price-desc">Ціна: від високої</option>
                    <option value="year-asc">Рік: від старих</option>
                    <option value="year-desc">Рік: від нових</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold/60 group-hover/select:text-gold transition-colors">
                    ▾
                  </div>
                </div>
              </div>


              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-3 pt-4 pb-2 px-2">
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory("all")}
                        className={`px-5 py-2.5 rounded-full font-ui text-xs tracking-[0.1em] uppercase border backdrop-blur-md transition-all duration-500 cursor-pointer ${selectedCategory === "all"
                          ? "border-gold bg-gold/15 text-gold shadow-[0_0_20px_oklch(0.75_0.12_85_/_20%)] font-semibold"
                          : "border-gold/20 bg-background/30 text-cream/60 hover:border-gold/40 hover:text-cream hover:bg-gold/5"
                          }`}
                      >
                        Усі ({artworks.length})
                      </motion.button>
                      {categories.map((cat) => {
                        const count = artworks.filter((a) => a.category === cat).length;
                        return (
                          <motion.button
                            key={cat}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full font-ui text-xs tracking-[0.1em] uppercase border backdrop-blur-md transition-all duration-500 cursor-pointer ${selectedCategory === cat
                              ? "border-gold bg-gold/15 text-gold shadow-[0_0_20px_oklch(0.75_0.12_85_/_20%)] font-semibold"
                              : "border-gold/20 bg-background/30 text-cream/60 hover:border-gold/40 hover:text-cream hover:bg-gold/5"
                              }`}
                          >
                            {cat} <span className="text-gold/60 ml-1 opacity-70">({count})</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>


            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center font-ui text-xs text-cream/30 tracking-wider mt-6"
            >
              Знайдено {filteredArtworks.length}{" "}
              {pluralizeTvir(filteredArtworks.length)}
            </motion.p>
          </div>
        </section>


        <section className="relative z-10 pb-24">
          <div className="container">
            <AnimatePresence mode="wait">
              {filteredArtworks.length > 0 ? (
                <motion.div
                  key={`${selectedCategory}-${sortBy}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredArtworks.map((artwork, i) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 mx-auto mb-6 border border-gold/20 flex items-center justify-center"
                  >
                    <Search size={32} className="text-gold/20" />
                  </motion.div>
                  <p className="font-display text-2xl text-cream/40 mb-2">Нічого не знайдено</p>
                  <p className="font-body text-cream/30">
                    Спробуйте змінити параметри пошуку або фільтри
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSortBy("default");
                    }}
                    className="mt-4 font-ui text-xs text-gold/60 hover:text-gold underline underline-offset-4 transition-colors"
                  >
                    Скинути фільтри
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <MegaFooter />
      </div>
    </PageTransition>
  );
}
