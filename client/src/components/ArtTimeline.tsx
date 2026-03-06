
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { artworks, type ArtCategory } from "@/lib/data";


interface Epoch {
  id: string;
  name: ArtCategory;
  period: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  textureStyle: React.CSSProperties;
}

const epochs: Epoch[] = [
  {
    id: "renaissance",
    name: "Ренесанс",
    period: "XIV — XVI ст.",
    description: "Епоха Відродження — час, коли людина знову стала центром всесвіту. Гармонія форм, досконалість пропорцій та глибина перспективи.",
    bgGradient: "linear-gradient(135deg, #2C1810 0%, #4A2C1A 30%, #6B3A1F 60%, #3D2010 100%)",
    accentColor: "#C9A84C",
    textureStyle: {
      backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)",
    },
  },
  {
    id: "baroque",
    name: "Бароко",
    period: "XVII — XVIII ст.",
    description: "Драматизм, пишність та емоційна насиченість. Контрасти світла і тіні, складні композиції та розкішні деталі.",
    bgGradient: "linear-gradient(135deg, #1A0F0A 0%, #2D1A0F 30%, #4A2515 60%, #1A0F0A 100%)",
    accentColor: "#D4A843",
    textureStyle: {
      backgroundImage: "radial-gradient(ellipse at 70% 40%, rgba(212,168,67,0.1) 0%, transparent 50%)",
    },
  },
  {
    id: "impressionism",
    name: "Імпресіонізм",
    period: "XIX ст.",
    description: "Світло, колір та мить. Імпресіоністи вловлювали швидкоплинні враження, розчиняючи форми у вібрації кольорових мазків.",
    bgGradient: "linear-gradient(135deg, #1A1A2E 0%, #16213E 30%, #1A2744 60%, #0F1628 100%)",
    accentColor: "#7EB8DA",
    textureStyle: {
      backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(126,184,218,0.08) 0%, transparent 60%)",
    },
  },
  {
    id: "surrealism",
    name: "Сюрреалізм",
    period: "1920-ті — 1960-ті",
    description: "Світ підсвідомого та мрій. Неможливі образи, деформований простір та магічна реальність, що виходить за межі логіки.",
    bgGradient: "linear-gradient(135deg, #0D0D2B 0%, #1A0A2E 30%, #2D1B4E 60%, #0D0D2B 100%)",
    accentColor: "#B088D4",
    textureStyle: {
      backgroundImage: "radial-gradient(ellipse at 40% 60%, rgba(176,136,212,0.1) 0%, transparent 50%)",
    },
  },
  {
    id: "modernism",
    name: "Модернізм",
    period: "XX ст.",
    description: "Революція форми та змісту. Відмова від традицій, пошук нових засобів вираження та переосмислення самої природи мистецтва.",
    bgGradient: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 30%, #2A2A2A 60%, #0A0A0A 100%)",
    accentColor: "#E8E8E8",
    textureStyle: {
      backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%)",
      backgroundSize: "60px 60px",
    },
  },
  {
    id: "abstractionism",
    name: "Абстракціонізм",
    period: "XX — XXI ст.",
    description: "Чиста мова кольору, форми та лінії. Абстракція звільняє мистецтво від зображення, відкриваючи нескінченні можливості вираження.",
    bgGradient: "linear-gradient(135deg, #0A0F1A 0%, #0F1A2E 30%, #1A2540 60%, #0A0F1A 100%)",
    accentColor: "#FF6B6B",
    textureStyle: {
      backgroundImage: "conic-gradient(from 45deg at 50% 50%, rgba(255,107,107,0.03) 0%, transparent 25%, rgba(201,168,76,0.03) 50%, transparent 75%)",
    },
  },
];


function EpochCard({ epoch, index }: { epoch: Epoch; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-10% 0px -10% 0px", once: false });
  const epochArtworks = useMemo(
    () => artworks.filter((a) => a.category === epoch.name).slice(0, 4),
    [epoch.name]
  );

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      id={`epoch-${epoch.id}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="relative rounded-sm overflow-hidden"
      style={{ minHeight: "420px" }}
    >

      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: epoch.bgGradient }}
      />
      <div className="absolute inset-0" style={epoch.textureStyle} />


      <div className={`relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 sm:p-10 md:p-14 ${isEven ? "" : "md:flex-row-reverse"}`}>

        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -30 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-10" style={{ background: epoch.accentColor, opacity: 0.5 }} />
              <span
                className="font-ui text-[10px] tracking-[0.4em] uppercase"
                style={{ color: epoch.accentColor, opacity: 0.8 }}
              >
                {epoch.period}
              </span>
            </div>
            <h3
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: epoch.accentColor }}
            >
              {epoch.name}
            </h3>
            <p className="font-body text-cream/60 text-base sm:text-lg max-w-md leading-relaxed">
              {epoch.description}
            </p>
          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 30 : -30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 min-w-0"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
            {epochArtworks.map((art, i) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 20, scale: 0.9 }
                }
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                className="group relative"
              >
                <Link href={`/artwork/${art.id}`}>
                  <div className="relative overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-500">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-display text-xs text-cream font-semibold truncate">{art.title}</p>
                      <p className="font-ui text-[9px] text-cream/60">{art.artist}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>


      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: epoch.accentColor,
              boxShadow: `0 0 20px ${epoch.accentColor}40, 0 0 40px ${epoch.accentColor}20`,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}


export default function ArtTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeEpoch, setActiveEpoch] = useState(0);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("epoch-", "");
            const idx = epochs.findIndex((e) => e.id === id);
            if (idx >= 0) setActiveEpoch(idx);
          }
        });
      },
      { threshold: 0.4 }
    );

    epochs.forEach((epoch) => {
      const el = document.getElementById(`epoch-${epoch.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToEpoch = (index: number) => {
    const el = document.getElementById(`epoch-${epochs[index].id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-[oklch(0.04_0.003_285)] overflow-hidden">

      <div className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={16} className="text-gold" />
            <span className="font-ui text-gold text-xs tracking-[0.3em] uppercase">
              Подорож крізь час
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream font-bold leading-tight mb-4">
            Інтерактивна стрічка часу
          </h2>
          <p className="font-body text-cream/50 max-w-2xl mx-auto">
            Подорожуйте від Ренесансу до Абстракціонізму. Кожна епоха — це окремий всесвіт.
          </p>
        </motion.div>
      </div>


      <div className="container mb-8">
        <div className="flex items-center gap-2 max-w-4xl mx-auto flex-wrap justify-center">
          {epochs.map((epoch, i) => (
            <button
              key={epoch.id}
              onClick={() => scrollToEpoch(i)}
              className="group cursor-pointer px-3 py-2 sm:px-4 sm:py-2"
            >
              <div className="relative h-1 w-12 sm:w-16 bg-gold/10 overflow-hidden mb-1">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gold"
                  animate={{ width: i <= activeEpoch ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span
                className={`font-ui text-[9px] sm:text-[10px] tracking-wider uppercase transition-colors duration-300 ${
                  i === activeEpoch ? "text-gold" : "text-cream/30"
                }`}
              >
                {epoch.name}
              </span>
            </button>
          ))}
        </div>
      </div>


      <div className="container">
        <div className="flex flex-col gap-8 md:gap-12 max-w-6xl mx-auto">
          {epochs.map((epoch, i) => (
            <EpochCard key={epoch.id} epoch={epoch} index={i} />
          ))}
        </div>
      </div>


      <div className="container mt-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent max-w-3xl mx-auto" />
      </div>
    </section>
  );
}
