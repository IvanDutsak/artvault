
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Maximize2, ChevronDown } from "lucide-react";
import TextSplit from "@/components/TextSplit";
import { artworks } from "@/lib/data";


const featuredImages = artworks.filter(a => a.featured).map(a => a.image);


function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Array<{
    x: number; y: number; baseX: number; baseY: number;
    size: number; opacity: number; speed: number; angle: number;
    phase: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();


    const count = Math.min(120, Math.floor(window.innerWidth * 0.08));
    const particles: typeof particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 100 + Math.random() * 200;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        baseX: cx + Math.cos(angle) * radius,
        baseY: cy + Math.sin(angle) * radius,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        p.x = p.baseX + Math.sin(time * p.speed + p.phase) * 30;
        p.y = p.baseY + Math.cos(time * p.speed * 0.7 + p.phase) * 20;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 40;
          p.y += (dy / dist) * force * 40;
        }

        const flicker = 0.5 + Math.sin(time * 2 + p.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity * flicker})`;
        ctx.fill();
      });


      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 2500) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${0.08 * (1 - Math.sqrt(dist) / 50)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[2] pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}


function Gold3DText({ scrollProgress }: { scrollProgress: number }) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    let animId: number;
    const tick = () => {
      const t = Date.now() * 0.001;
      if (h1Ref.current) {
        const rotateY = Math.sin(t * 0.3) * 8;
        const rotateX = Math.cos(t * 0.2) * 3;
        h1Ref.current.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(50px)`;
        h1Ref.current.style.backgroundPosition = `${50 + Math.sin(t) * 30}% ${50 + Math.cos(t * 0.7) * 30}%`;
        h1Ref.current.style.opacity = String(1 - scrollRef.current * 2);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-[3] pointer-events-none select-none overflow-hidden">
      <div
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <h1
          ref={h1Ref}
          className="font-display font-black tracking-[0.15em] uppercase leading-none"
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
            transformStyle: "preserve-3d",
            background: `linear-gradient(
              135deg,
              #8B6914 0%,
              #C9A84C 15%,
              #F5E6A3 30%,
              #C9A84C 45%,
              #8B6914 55%,
              #C9A84C 65%,
              #F5E6A3 75%,
              #C9A84C 85%,
              #8B6914 100%
            )`,
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: `drop-shadow(0 0 40px rgba(201,168,76,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))`,
            willChange: "transform, background-position, opacity",
          }}
        >
          ARTVAULT
        </h1>
      </div>
    </div>
  );
}


function MorphingBackground() {
  const currentRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ currentIdx: 0, nextIdx: 1 });

  useEffect(() => {
    let animId: number;
    let startTime = Date.now();
    const DURATION = 4000;
    const TRANSITION = 1500;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const totalCycle = DURATION + TRANSITION;

      if (elapsed >= totalCycle) {

        startTime = Date.now();
        stateRef.current.currentIdx = stateRef.current.nextIdx;
        stateRef.current.nextIdx = (stateRef.current.nextIdx + 1) % featuredImages.length;


        if (currentRef.current) {
          currentRef.current.style.backgroundImage = `url(${featuredImages[stateRef.current.currentIdx]})`;
          currentRef.current.style.opacity = "1";
          currentRef.current.style.transform = "scale(1.05)";
          currentRef.current.style.filter = "blur(0px)";
        }

        if (nextRef.current) {
          nextRef.current.style.backgroundImage = `url(${featuredImages[stateRef.current.nextIdx]})`;
          nextRef.current.style.opacity = "0";
          nextRef.current.style.transform = "scale(1.1)";
          nextRef.current.style.filter = "blur(2px)";
        }
      } else if (elapsed >= DURATION) {

        const t = (elapsed - DURATION) / TRANSITION;
        const blend = Math.min(1, t);

        if (currentRef.current) {
          currentRef.current.style.opacity = String(1 - blend * 0.5);
          currentRef.current.style.transform = `scale(${1.05 + blend * 0.05})`;
          currentRef.current.style.filter = `blur(${blend * 2}px)`;
        }
        if (nextRef.current) {
          nextRef.current.style.opacity = String(blend);
          nextRef.current.style.transform = `scale(${1.1 - blend * 0.05})`;
          nextRef.current.style.filter = `blur(${(1 - blend) * 2}px)`;
        }
      }


      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="absolute inset-0 z-0">

      <div
        ref={currentRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${featuredImages[0]})`,
          willChange: "opacity, transform, filter",
        }}
      />

      <div
        ref={nextRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${featuredImages[1 % featuredImages.length]})`,
          opacity: 0,
          willChange: "opacity, transform, filter",
        }}
      />

      <div className="absolute inset-0 bg-[oklch(0.06_0.005_285_/_55%)] mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.06_0.005_285_/_40%)] to-transparent" />

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,8,5,0.5) 100%)",
        }}
      />
    </div>
  );
}


export default function CinematicHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollVal = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [scrollP, setScrollP] = useState(0);

  useEffect(() => {
    return scrollVal.on("change", (v) => setScrollP(v));
  }, [scrollVal]);


  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">

      <motion.div style={{ scale: heroScale }} className="absolute inset-0">
        <MorphingBackground />
      </motion.div>


      <HeroParticles />


      <Gold3DText scrollProgress={scrollP} />


      <motion.div
        style={{ opacity: heroOpacity, y: contentY } as any}
        className="relative z-[5] h-screen flex items-center"
      >
        <div className="container">
          <motion.div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-gold/60" />
              <span className="font-ui text-xs tracking-[0.4em] text-gold/80 uppercase">
                Ексклюзивна колекція
              </span>
            </motion.div>

            <div className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-6">
              <TextSplit text="Мистецтво" className="text-cream" delay={5} />
              <TextSplit text="без меж" className="gold-shimmer mt-2" delay={8} />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="font-body text-cream/70 text-base sm:text-lg md:text-xl max-w-lg leading-relaxed mb-8 sm:mb-10"
            >
              Відкрийте для себе ретельно відібрану колекцію цифрових шедеврів. Де класична естетика зустрічається з сучасним баченням.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-3 sm:gap-4 bg-gold text-background px-6 sm:px-8 py-3 sm:py-4 font-ui text-xs sm:text-sm tracking-[0.2em] font-medium group cursor-pointer !border-0 !outline-0"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    Дослідити колекцію
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link
                  href="/gallery3d"
                  className="inline-flex items-center gap-3 sm:gap-4 border border-gold/40 hover:border-gold text-gold hover:text-cream px-6 sm:px-8 py-3 sm:py-4 font-ui text-xs sm:text-sm tracking-[0.2em] font-medium group cursor-pointer transition-all duration-500 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gold/5 group-hover:bg-gold/15 transition-colors duration-500" />
                  <span className="relative z-10 flex items-center gap-4">
                    <Maximize2 size={16} />
                    3D Музей
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50 flex flex-col items-center gap-2 z-[5]"
      >
        <span className="font-ui text-[10px] tracking-[0.3em] uppercase">Скрольте</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>


      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[6] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />
    </section>
  );
}
