
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import { artworks } from "@/lib/data";

const SHOWCASE_ARTWORKS = artworks.filter((a) => a.featured).slice(0, 5);
const PARTICLE_COUNT = 800;
const MORPH_DURATION = 2500;
const HOLD_DURATION = 3500;

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}


function generateShapeTargets(
  canvasW: number,
  canvasH: number,
  count: number,
  shapeIndex: number
): Array<{ x: number; y: number }> {
  const result: Array<{ x: number; y: number }> = [];
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const maxR = Math.min(canvasW, canvasH) * 0.35;

  switch (shapeIndex % 5) {
    case 0: {

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;

        const rx = maxR * 1.2;
        const ry = maxR * 0.85;
        const fill = 0.15 + Math.random() * 0.85;
        let x = cx + Math.cos(angle) * rx * fill;
        let y = cy + Math.sin(angle) * ry * fill;


        const holeX = cx - maxR * 0.35;
        const holeY = cy + maxR * 0.2;
        const holeR = maxR * 0.22;
        const dx = x - holeX;
        const dy = y - holeY;
        if (dx * dx + dy * dy < holeR * holeR) {

          const ha = Math.random() * Math.PI * 2;
          x = holeX + Math.cos(ha) * holeR + (Math.random() - 0.5) * 4;
          y = holeY + Math.sin(ha) * holeR + (Math.random() - 0.5) * 4;
        }


        if (i < count * 0.15) {
          const blobIdx = Math.floor(Math.random() * 5);
          const blobAngle = -0.6 + blobIdx * 0.35;
          const blobX = cx + Math.cos(blobAngle) * maxR * 0.65;
          const blobY = cy + Math.sin(blobAngle) * maxR * 0.45;
          x = blobX + (Math.random() - 0.5) * maxR * 0.18;
          y = blobY + (Math.random() - 0.5) * maxR * 0.18;
        }

        result.push({ x, y });
      }
      break;
    }
    case 1: {

      const brushLen = maxR * 2;
      const handleW = maxR * 0.08;
      const bristleLen = brushLen * 0.25;
      const bristleW = maxR * 0.2;

      const angle = -0.5;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      for (let i = 0; i < count; i++) {
        let lx: number, ly: number;
        if (Math.random() < 0.35) {

          lx = (Math.random() - 0.5) * bristleW;
          ly = -brushLen * 0.5 + Math.random() * bristleLen;

          const t = (ly - (-brushLen * 0.5)) / bristleLen;
          lx *= (1 - t * 0.6);
        } else {

          lx = (Math.random() - 0.5) * handleW;
          ly = -brushLen * 0.5 + bristleLen + Math.random() * (brushLen - bristleLen);

          const t = (ly - (-brushLen * 0.5 + bristleLen)) / (brushLen - bristleLen);
          lx *= (1 - t * 0.3);
        }

        result.push({
          x: cx + lx * cos - ly * sin,
          y: cy + lx * sin + ly * cos,
        });
      }
      break;
    }
    case 2: {

      const outerW = maxR * 1.3;
      const outerH = maxR * 1.0;
      const innerW = maxR * 0.95;
      const innerH = maxR * 0.7;
      for (let i = 0; i < count; i++) {
        const t = Math.random();
        const side = Math.floor(Math.random() * 4);
        let x: number, y: number;

        if (Math.random() < 0.5) {

          switch (side) {
            case 0: x = cx - outerW + t * outerW * 2; y = cy - outerH + (Math.random() - 0.5) * 10; break;
            case 1: x = cx - outerW + t * outerW * 2; y = cy + outerH + (Math.random() - 0.5) * 10; break;
            case 2: x = cx - outerW + (Math.random() - 0.5) * 10; y = cy - outerH + t * outerH * 2; break;
            default: x = cx + outerW + (Math.random() - 0.5) * 10; y = cy - outerH + t * outerH * 2; break;
          }
        } else if (Math.random() < 0.6) {

          switch (side) {
            case 0: x = cx - innerW + t * innerW * 2; y = cy - innerH + (Math.random() - 0.5) * 6; break;
            case 1: x = cx - innerW + t * innerW * 2; y = cy + innerH + (Math.random() - 0.5) * 6; break;
            case 2: x = cx - innerW + (Math.random() - 0.5) * 6; y = cy - innerH + t * innerH * 2; break;
            default: x = cx + innerW + (Math.random() - 0.5) * 6; y = cy - innerH + t * innerH * 2; break;
          }
        } else {

          const fx = (Math.random() - 0.5) * 2;
          const fy = (Math.random() - 0.5) * 2;
          x = cx + fx * (outerW + innerW) * 0.5;
          y = cy + fy * (outerH + innerH) * 0.5;

          if (Math.abs(x - cx) < innerW && Math.abs(y - cy) < innerH) {
            x = cx + (Math.random() < 0.5 ? -1 : 1) * (innerW + Math.random() * (outerW - innerW));
          }
        }


        if (i < count * 0.08) {
          const corner = Math.floor(Math.random() * 4);
          const cornerX = cx + (corner < 2 ? -1 : 1) * outerW;
          const cornerY = cy + (corner % 2 === 0 ? -1 : 1) * outerH;
          x = cornerX + (Math.random() - 0.5) * maxR * 0.2;
          y = cornerY + (Math.random() - 0.5) * maxR * 0.2;
        }

        result.push({ x, y });
      }
      break;
    }
    case 3: {

      const eyeW = maxR * 1.3;
      const eyeH = maxR * 0.55;
      for (let i = 0; i < count; i++) {
        let x: number, y: number;

        if (Math.random() < 0.25) {

          const irisR = maxR * 0.35;
          const a = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * irisR;
          x = cx + Math.cos(a) * r;
          y = cy + Math.sin(a) * r;
        } else if (Math.random() < 0.2) {

          const pupilR = maxR * 0.15;
          const a = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * pupilR;
          x = cx + Math.cos(a) * r;
          y = cy + Math.sin(a) * r;
        } else {

          const t = Math.random() * Math.PI * 2;
          const topCurve = Math.sin(t) * eyeH;
          const bottomCurve = -Math.sin(t) * eyeH;
          const xPos = Math.cos(t) * eyeW;
          if (Math.random() < 0.5) {
            x = cx + xPos;
            y = cy + topCurve + (Math.random() - 0.5) * 6;
          } else {
            x = cx + xPos;
            y = cy + bottomCurve + (Math.random() - 0.5) * 6;
          }
        }

        result.push({ x, y });
      }
      break;
    }
    case 4: {

      const letterH = maxR * 1.6;
      const letterW = maxR * 0.7;
      const spacing = maxR * 0.15;
      for (let i = 0; i < count; i++) {
        let x: number, y: number;
        const noise = () => (Math.random() - 0.5) * 5;

        if (Math.random() < 0.5) {

          const aCenter = cx - letterW * 0.5 - spacing;
          const t = Math.random();

          if (Math.random() < 0.4) {

            x = aCenter - letterW * 0.5 + t * letterW * 0.5 + noise();
            y = cy + letterH * 0.5 - t * letterH + noise();
          } else if (Math.random() < 0.5) {

            x = aCenter + t * letterW * 0.5 + noise();
            y = cy - letterH * 0.5 + t * letterH + noise();
          } else {

            const crossY = cy + letterH * 0.1;
            x = aCenter - letterW * 0.22 + Math.random() * letterW * 0.44 + noise();
            y = crossY + noise();
          }
        } else {

          const vCenter = cx + letterW * 0.5 + spacing;
          const t = Math.random();

          if (Math.random() < 0.5) {

            x = vCenter - letterW * 0.5 + t * letterW * 0.5 + noise();
            y = cy - letterH * 0.5 + t * letterH + noise();
          } else {

            x = vCenter + letterW * 0.5 - t * letterW * 0.5 + noise();
            y = cy - letterH * 0.5 + t * letterH + noise();
          }
        }

        result.push({ x, y });
      }
      break;
    }
  }

  return result;
}


export default function ParticleMorphing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { margin: "-5% 0px" });
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const currentShapeRef = useRef(0);
  const morphProgressRef = useRef(0);
  const phaseRef = useRef<"hold" | "morph">("hold");
  const phaseStartRef = useRef(Date.now());
  const targetsRef = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const [currentArtwork, setCurrentArtwork] = useState(0);
  const animIdRef = useRef<number>(0);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || 600;


      const targets: Array<Array<{ x: number; y: number }>> = [];
      for (let i = 0; i < SHOWCASE_ARTWORKS.length; i++) {
        targets.push(generateShapeTargets(canvas.width, canvas.height, PARTICLE_COUNT, i));
      }
      targetsRef.current = targets;


      if (particlesRef.current.length === 0) {
        const particles: Particle[] = [];
        const firstTargets = targets[0] || [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const t = firstTargets[i] || { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: t.x,
            targetY: t.y,
            originX: Math.random() * canvas.width,
            originY: Math.random() * canvas.height,
            size: Math.random() * 2.2 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            speed: 0.02 + Math.random() * 0.03,
            color: Math.random() > 0.3
              ? `rgba(201, 168, 76, OPACITY)`
              : Math.random() > 0.5
                ? `rgba(245, 230, 163, OPACITY)`
                : `rgba(180, 150, 60, OPACITY)`,
          });
        }
        particlesRef.current = particles;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", () => {
      mouseRef.current = { x: -1000, y: -1000 };
    });

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!isInView) {
      cancelAnimationFrame(animIdRef.current);
      return;
    }

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const elapsed = now - phaseStartRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const targets = targetsRef.current;


      if (phaseRef.current === "hold" && elapsed > HOLD_DURATION) {
        phaseRef.current = "morph";
        phaseStartRef.current = now;
        morphProgressRef.current = 0;

        const nextShape = (currentShapeRef.current + 1) % Math.max(1, targets.length);
        currentShapeRef.current = nextShape;
        setCurrentArtwork(nextShape);

        const nextTargets = targets[nextShape] || [];
        particlesRef.current.forEach((p, i) => {
          p.originX = p.x;
          p.originY = p.y;
          const t = nextTargets[i] || { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
          p.targetX = t.x;
          p.targetY = t.y;
        });
      } else if (phaseRef.current === "morph" && elapsed > MORPH_DURATION) {
        phaseRef.current = "hold";
        phaseStartRef.current = now;
      }

      if (phaseRef.current === "morph") {
        morphProgressRef.current = Math.min(1, elapsed / MORPH_DURATION);
      }

      const progress = phaseRef.current === "morph" ? morphProgressRef.current : 1;
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      particlesRef.current.forEach((p) => {
        const tx = p.originX + (p.targetX - p.originX) * eased;
        const ty = p.originY + (p.targetY - p.originY) * eased;

        const time = now * 0.001;
        const wobbleX = Math.sin(time * p.speed * 10 + p.targetX * 0.01) * 2;
        const wobbleY = Math.cos(time * p.speed * 8 + p.targetY * 0.01) * 2;

        p.x = tx + wobbleX;
        p.y = ty + wobbleY;


        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          p.x += (dx / dist) * force * 40;
          p.y += (dy / dist) * force * 40;
        }


        const flickerOpacity = p.opacity * (0.7 + Math.sin(time * 3 + p.targetX) * 0.3);
        const colorWithOpacity = p.color.replace("OPACITY", String(flickerOpacity));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size > 1.5 ? p.size * 1.5 : p.size, 0, Math.PI * 2);
        ctx.fillStyle = colorWithOpacity;
        ctx.fill();
      });


      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.35
      );
      gradient.addColorStop(0, "rgba(201, 168, 76, 0.015)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animIdRef.current);
    };
  }, [isInView]);

  const shapeNames = ["Палітра", "Пензель", "Рамка шедевру", "Око глядача", "ArtVault"];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-[oklch(0.05_0.003_285)] overflow-hidden"
    >

      <div className="container mb-8">
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
              Інтерактивне мистецтво
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream font-bold leading-tight mb-4">
            Символи мистецтва
          </h2>
          <p className="font-body text-cream/50 max-w-2xl mx-auto">
            Золоті частинки оживають, формуючи символи мистецького світу. Рухайте мишею, щоб взаємодіяти.
          </p>
        </motion.div>
      </div>


      <div className="container">
        <div className="relative w-full" style={{ height: "60vh", minHeight: "400px" }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            style={{ display: "block" }}
          />


          <motion.div
            key={currentArtwork}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="font-display text-lg text-gold/80">
              {SHOWCASE_ARTWORKS[currentArtwork]?.title || shapeNames[currentArtwork] || ""}
            </p>
            <p className="font-ui text-xs text-cream/40 tracking-wider">
              {SHOWCASE_ARTWORKS[currentArtwork]?.artist || ""}
            </p>
          </motion.div>


          <div className="absolute bottom-6 right-6 flex gap-2">
            {SHOWCASE_ARTWORKS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${i === currentArtwork ? "bg-gold w-6" : "bg-gold/20 w-2"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
