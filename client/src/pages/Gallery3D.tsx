
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, X, ShoppingCart, Heart, Eye, ChevronLeft, ChevronRight, Maximize2, Info, Home, Smartphone } from "lucide-react";
import { artworks, formatPrice, type Artwork } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";


interface Vec3 { x: number; y: number; z: number; }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }


function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}


function lerpAngle(a: number, b: number, t: number): number {
  return a + normalizeAngle(b - a) * t;
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}


const ROOM_WIDTH = 60;
const ROOM_DEPTH = 120;
const ROOM_HEIGHT = 16;
const WALL_Y = 0;


interface PaintingSlot {
  pos: Vec3;
  normal: Vec3;
  width: number;
  height: number;
  artworkIndex: number;
}

function buildPaintingSlots(): PaintingSlot[] {
  const slots: PaintingSlot[] = [];
  const paintings = artworks;
  let idx = 0;

  const paintingW = 7;
  const paintingH = 9;
  const hangY = ROOM_HEIGHT * 0.48;


  const leftCount = Math.min(5, paintings.length);
  for (let i = 0; i < leftCount; i++) {
    const zSpacing = ROOM_DEPTH / (leftCount + 1);
    slots.push({
      pos: { x: -ROOM_WIDTH / 2 + 0.15, y: hangY, z: -ROOM_DEPTH / 2 + zSpacing * (i + 1) },
      normal: { x: 1, y: 0, z: 0 },
      width: paintingW,
      height: paintingH,
      artworkIndex: idx++,
    });
  }


  const rightCount = Math.min(5, paintings.length - idx);
  for (let i = 0; i < rightCount; i++) {
    const zSpacing = ROOM_DEPTH / (rightCount + 1);
    slots.push({
      pos: { x: ROOM_WIDTH / 2 - 0.15, y: hangY, z: -ROOM_DEPTH / 2 + zSpacing * (i + 1) },
      normal: { x: -1, y: 0, z: 0 },
      width: paintingW,
      height: paintingH,
      artworkIndex: idx++,
    });
  }


  const backCount = Math.min(Math.max(0, paintings.length - idx), 3);
  for (let i = 0; i < backCount; i++) {
    const xSpacing = ROOM_WIDTH / (backCount + 1);
    slots.push({
      pos: { x: -ROOM_WIDTH / 2 + xSpacing * (i + 1), y: hangY, z: ROOM_DEPTH / 2 - 0.15 },
      normal: { x: 0, y: 0, z: -1 },
      width: paintingW,
      height: paintingH,
      artworkIndex: idx++,
    });
  }


  const frontCount = Math.min(Math.max(0, paintings.length - idx), 2);
  for (let i = 0; i < frontCount; i++) {
    const positions = [-ROOM_WIDTH / 2 + 10, ROOM_WIDTH / 2 - 10];
    slots.push({
      pos: { x: positions[i], y: hangY, z: -ROOM_DEPTH / 2 + 0.15 },
      normal: { x: 0, y: 0, z: 1 },
      width: paintingW,
      height: paintingH,
      artworkIndex: idx++,
    });
  }

  return slots;
}


function buildWalkOrder(slots: PaintingSlot[]): number[] {
  const leftWall: number[] = [];
  const rightWall: number[] = [];
  const backWall: number[] = [];
  const frontWall: number[] = [];

  slots.forEach((s, i) => {
    if (Math.abs(s.normal.x) > 0.5) {
      if (s.normal.x > 0) leftWall.push(i);
      else rightWall.push(i);
    } else {
      if (s.normal.z < 0) backWall.push(i);
      else frontWall.push(i);
    }
  });


  leftWall.sort((a, b) => slots[a].pos.z - slots[b].pos.z);
  backWall.sort((a, b) => slots[a].pos.x - slots[b].pos.x);
  rightWall.sort((a, b) => slots[b].pos.z - slots[a].pos.z);
  frontWall.sort((a, b) => slots[b].pos.x - slots[a].pos.x);

  return [...leftWall, ...backWall, ...rightWall, ...frontWall];
}


interface Camera {
  x: number; y: number; z: number;
  yaw: number;
  pitch: number;
}


function project(point: Vec3, cam: Camera, w: number, h: number): { x: number; y: number; depth: number } | null {

  let dx = point.x - cam.x;
  let dy = point.y - cam.y;
  let dz = point.z - cam.z;


  const cosY = Math.cos(-cam.yaw);
  const sinY = Math.sin(-cam.yaw);
  const rx = dx * cosY - dz * sinY;
  const rz = dx * sinY + dz * cosY;
  dx = rx;
  dz = rz;


  const cosP = Math.cos(-cam.pitch);
  const sinP = Math.sin(-cam.pitch);
  const ry = dy * cosP - dz * sinP;
  const rz2 = dy * sinP + dz * cosP;
  dy = ry;
  dz = rz2;

  if (dz < 0.5) return null;

  const fov = 1.2;
  const scale = (w * 0.5) / (dz * Math.tan(fov / 2));

  return {
    x: w / 2 + dx * scale,
    y: h / 2 - dy * scale,
    depth: dz,
  };
}


interface Spotlight {
  pos: Vec3;
  target: Vec3;
  intensity: number;
  color: string;
}

function buildSpotlights(slots: PaintingSlot[]): Spotlight[] {
  return slots.map(s => ({
    pos: {
      x: s.pos.x + s.normal.x * 4,
      y: ROOM_HEIGHT - 1,
      z: s.pos.z + s.normal.z * 4,
    },
    target: s.pos,
    intensity: 1.2,
    color: "rgba(201, 168, 76, 0.08)",
  }));
}


export default function Gallery3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();


  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {

      setIsMobileDevice(window.innerWidth < 1024 || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const camRef = useRef<Camera>({ x: 0, y: ROOM_HEIGHT * 0.35, z: -ROOM_DEPTH / 2 + 8, yaw: 0, pitch: 0 });
  const targetCamRef = useRef<Camera>({ ...camRef.current });
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0, startX: 0, startY: 0, dragged: false, button: -1 });


  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [imagesLoaded, setImagesLoaded] = useState(0);


  const slotsRef = useRef<PaintingSlot[]>(buildPaintingSlots());
  const walkOrderRef = useRef<number[]>(buildWalkOrder(slotsRef.current));
  const spotlightsRef = useRef<Spotlight[]>(buildSpotlights(slotsRef.current));


  const [selectedPainting, setSelectedPainting] = useState<number | null>(null);
  const [hoveredPainting, setHoveredPainting] = useState<number | null>(null);
  const [showUI, setShowUI] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);


  const cinematicRef = useRef<{
    active: boolean;
    startCam: Camera;
    endCam: Camera;
    startTime: number;
    duration: number;
    onComplete?: () => void;
  } | null>(null);


  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();


  const [introComplete, setIntroComplete] = useState(false);
  const introRef = useRef({ startTime: 0, duration: 3000 });


  useEffect(() => {
    let loaded = 0;
    artworks.forEach((art, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imagesRef.current.set(idx, img);
        loaded++;
        setImagesLoaded(loaded);
      };
      img.onerror = () => {

        const fallback = new Image();
        fallback.onload = () => {
          imagesRef.current.set(idx, fallback);
          loaded++;
          setImagesLoaded(loaded);
        };
        fallback.onerror = () => {
          loaded++;
          setImagesLoaded(loaded);
        };
        fallback.src = art.image;
      };
      img.src = art.image;
    });
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 6000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      keysRef.current.add(e.code.toLowerCase());
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === "Escape" && selectedPainting !== null) {
        flyBackFromPainting();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code.toLowerCase());
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedPainting]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const DRAG_THRESHOLD = 5;

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
      mouseRef.current.startX = e.clientX;
      mouseRef.current.startY = e.clientY;
      mouseRef.current.dragged = false;
      mouseRef.current.button = e.button;
    };
    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      mouseRef.current.button = -1;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseRef.current.isDown || selectedPainting !== null) return;

      const dx = e.clientX - mouseRef.current.lastX;
      const dy = e.clientY - mouseRef.current.lastY;


      const totalDx = e.clientX - mouseRef.current.startX;
      const totalDy = e.clientY - mouseRef.current.startY;
      if (Math.abs(totalDx) > DRAG_THRESHOLD || Math.abs(totalDy) > DRAG_THRESHOLD) {
        mouseRef.current.dragged = true;
      }


      if (mouseRef.current.dragged) {
        targetCamRef.current.yaw -= dx * 0.003;
        targetCamRef.current.pitch = clamp(targetCamRef.current.pitch + dy * 0.002, -0.5, 0.5);
      }

      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };


    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [selectedPainting]);


  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mouseRef.current.dragged) return;
    if (selectedPainting !== null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;
    const cam = camRef.current;


    let closestSlot = -1;
    let closestDist = Infinity;

    slotsRef.current.forEach((slot, idx) => {

      const hw = slot.width / 2;
      const hh = slot.height / 2;


      let right: Vec3, up: Vec3;
      if (Math.abs(slot.normal.x) > 0.5) {
        right = { x: 0, y: 0, z: slot.normal.x > 0 ? 1 : -1 };
        up = { x: 0, y: 1, z: 0 };
      } else {
        right = { x: slot.normal.z > 0 ? -1 : 1, y: 0, z: 0 };
        up = { x: 0, y: 1, z: 0 };
      }

      const corners = [
        { x: slot.pos.x - right.x * hw, y: slot.pos.y + hh, z: slot.pos.z - right.z * hw },
        { x: slot.pos.x + right.x * hw, y: slot.pos.y + hh, z: slot.pos.z + right.z * hw },
        { x: slot.pos.x + right.x * hw, y: slot.pos.y - hh, z: slot.pos.z + right.z * hw },
        { x: slot.pos.x - right.x * hw, y: slot.pos.y - hh, z: slot.pos.z - right.z * hw },
      ];

      const projected = corners.map(c => project(c, cam, w, h)).filter(Boolean) as { x: number; y: number; depth: number }[];
      if (projected.length < 4) return;


      let inside = false;
      for (let i = 0, j = projected.length - 1; i < projected.length; j = i++) {
        const xi = projected[i].x, yi = projected[i].y;
        const xj = projected[j].x, yj = projected[j].y;
        const intersect = ((yi > clickY) !== (yj > clickY))
          && (clickX < (xj - xi) * (clickY - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }

      if (inside) {
        const dist = projected[0].depth;
        if (dist < closestDist && dist < 40) {
          closestDist = dist;
          closestSlot = idx;
        }
      }
    });

    if (closestSlot >= 0) {
      flyToPainting(closestSlot);
    }
  }, [selectedPainting]);


  const flyToPainting = useCallback((slotIdx: number) => {
    const slot = slotsRef.current[slotIdx];
    const viewDist = 22;

    const targetYaw = Math.atan2(slot.normal.x, -slot.normal.z);

    const endCam: Camera = {
      x: slot.pos.x + slot.normal.x * viewDist,
      y: slot.pos.y,
      z: slot.pos.z + slot.normal.z * viewDist,
      yaw: targetYaw,
      pitch: 0,
    };

    cinematicRef.current = {
      active: true,
      startCam: { ...camRef.current },
      endCam,
      startTime: performance.now(),
      duration: 1800,
      onComplete: () => {


        camRef.current = { ...endCam };
        targetCamRef.current = { ...endCam };
        setSelectedPainting(slotIdx);
        cinematicRef.current = null;
      },
    };
  }, []);


  const flyBackFromPainting = useCallback(() => {
    if (selectedPainting === null) return;
    const slot = slotsRef.current[selectedPainting];
    const viewDist = 24;

    const endCam: Camera = {
      x: slot.pos.x + slot.normal.x * viewDist,
      y: ROOM_HEIGHT * 0.35,
      z: slot.pos.z + slot.normal.z * viewDist,
      yaw: camRef.current.yaw,
      pitch: 0,
    };

    setSelectedPainting(null);

    cinematicRef.current = {
      active: true,
      startCam: { ...camRef.current },
      endCam,
      startTime: performance.now(),
      duration: 1200,
      onComplete: () => {
        camRef.current = { ...endCam };
        targetCamRef.current = { ...endCam };
        cinematicRef.current = null;
      },
    };
  }, [selectedPainting]);


  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedPainting !== null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;
    const cam = camRef.current;

    let found = -1;
    slotsRef.current.forEach((slot, idx) => {
      const hw = slot.width / 2;
      const hh = slot.height / 2;
      let right: Vec3;
      if (Math.abs(slot.normal.x) > 0.5) {
        right = { x: 0, y: 0, z: slot.normal.x > 0 ? 1 : -1 };
      } else {
        right = { x: slot.normal.z > 0 ? -1 : 1, y: 0, z: 0 };
      }
      const corners = [
        { x: slot.pos.x - right.x * hw, y: slot.pos.y + hh, z: slot.pos.z - right.z * hw },
        { x: slot.pos.x + right.x * hw, y: slot.pos.y + hh, z: slot.pos.z + right.z * hw },
        { x: slot.pos.x + right.x * hw, y: slot.pos.y - hh, z: slot.pos.z + right.z * hw },
        { x: slot.pos.x - right.x * hw, y: slot.pos.y - hh, z: slot.pos.z - right.z * hw },
      ];
      const projected = corners.map(c => project(c, cam, w, h)).filter(Boolean) as { x: number; y: number; depth: number }[];
      if (projected.length < 4) return;

      let inside = false;
      for (let i = 0, j = projected.length - 1; i < projected.length; j = i++) {
        const xi = projected[i].x, yi = projected[i].y;
        const xj = projected[j].x, yj = projected[j].y;
        const intersect = ((yi > my) !== (yj > my))
          && (mx < (xj - xi) * (my - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }

      if (inside && projected[0].depth < 40) {
        found = idx;
      }
    });
    setHoveredPainting(found >= 0 ? found : null);
  }, [selectedPainting]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();


    introRef.current.startTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      const cam = camRef.current;
      const target = targetCamRef.current;


      const introElapsed = time - introRef.current.startTime;
      const introProgress = clamp(introElapsed / introRef.current.duration, 0, 1);
      if (introProgress < 1 && !introComplete) {
        const t = easeInOutQuart(introProgress);
        cam.z = lerp(-ROOM_DEPTH / 2 - 20, -ROOM_DEPTH / 2 + 8, t);
        cam.y = lerp(ROOM_HEIGHT * 0.8, ROOM_HEIGHT * 0.35, t);
        cam.pitch = lerp(-0.3, 0, t);
        cam.yaw = lerp(0.3, 0, t);
        target.z = cam.z;
        target.y = cam.y;
        target.pitch = cam.pitch;
        target.yaw = cam.yaw;
      } else if (!introComplete) {
        setIntroComplete(true);
      }


      if (cinematicRef.current?.active) {
        const cin = cinematicRef.current;
        const elapsed = time - cin.startTime;
        const t = easeInOutQuart(clamp(elapsed / cin.duration, 0, 1));

        cam.x = lerp(cin.startCam.x, cin.endCam.x, t);
        cam.y = lerp(cin.startCam.y, cin.endCam.y, t);
        cam.z = lerp(cin.startCam.z, cin.endCam.z, t);
        cam.yaw = lerpAngle(cin.startCam.yaw, cin.endCam.yaw, t);
        cam.pitch = lerp(cin.startCam.pitch, cin.endCam.pitch, t);

        if (elapsed >= cin.duration) {
          cin.onComplete?.();
        }
      }

      else if (introComplete && selectedPainting === null) {
        const speed = 12 * dt;
        const keys = keysRef.current;


        const forward = { x: -Math.sin(target.yaw), z: Math.cos(target.yaw) };
        const strafe = { x: Math.cos(target.yaw), z: Math.sin(target.yaw) };

        if (keys.has("keyw") || keys.has("w") || keys.has("arrowup")) {
          target.x += forward.x * speed;
          target.z += forward.z * speed;
        }
        if (keys.has("keys") || keys.has("s") || keys.has("arrowdown")) {
          target.x -= forward.x * speed;
          target.z -= forward.z * speed;
        }
        if (keys.has("keya") || keys.has("a")) {
          target.x -= strafe.x * speed;
          target.z -= strafe.z * speed;
        }
        if (keys.has("keyd") || keys.has("d")) {
          target.x += strafe.x * speed;
          target.z += strafe.z * speed;
        }

        if (keys.has("arrowleft")) target.yaw += 1.5 * dt;
        if (keys.has("arrowright")) target.yaw -= 1.5 * dt;


        const margin = 3;
        target.x = clamp(target.x, -ROOM_WIDTH / 2 + margin, ROOM_WIDTH / 2 - margin);
        target.z = clamp(target.z, -ROOM_DEPTH / 2 + margin, ROOM_DEPTH / 2 - margin);


        cam.x = lerp(cam.x, target.x, 8 * dt);
        cam.y = lerp(cam.y, target.y, 8 * dt);
        cam.z = lerp(cam.z, target.z, 8 * dt);
        cam.yaw = lerpAngle(cam.yaw, target.yaw, 10 * dt);
        cam.pitch = lerp(cam.pitch, target.pitch, 10 * dt);
      }


      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, w, h);


      drawRoom(ctx, cam, w, h, time);


      drawPaintings(ctx, cam, w, h, time);


      drawSpotlightEffects(ctx, cam, w, h, time);


      drawAmbientParticles(ctx, cam, w, h, time);


      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);


      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 1000; i++) {
        const gx = Math.random() * w;
        const gy = Math.random() * h;
        const gb = Math.random() * 255;
        ctx.fillStyle = `rgb(${gb},${gb},${gb})`;
        ctx.fillRect(gx, gy, 1, 1);
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };


    function drawRoom(ctx: CanvasRenderingContext2D, cam: Camera, w: number, h: number, time: number) {
      const hw = ROOM_WIDTH / 2;
      const hd = ROOM_DEPTH / 2;


      const floorCorners: Vec3[] = [
        { x: -hw, y: 0, z: -hd },
        { x: hw, y: 0, z: -hd },
        { x: hw, y: 0, z: hd },
        { x: -hw, y: 0, z: hd },
      ];
      drawQuad(ctx, cam, w, h, floorCorners, "#0d0b09", "rgba(201,168,76,0.02)");


      for (let i = -hw; i <= hw; i += 6) {
        const p1 = project({ x: i, y: 0.01, z: -hd }, cam, w, h);
        const p2 = project({ x: i, y: 0.01, z: hd }, cam, w, h);
        if (p1 && p2) {
          ctx.strokeStyle = "rgba(201,168,76,0.04)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      for (let i = -hd; i <= hd; i += 6) {
        const p1 = project({ x: -hw, y: 0.01, z: i }, cam, w, h);
        const p2 = project({ x: hw, y: 0.01, z: i }, cam, w, h);
        if (p1 && p2) {
          ctx.strokeStyle = "rgba(201,168,76,0.04)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }


      const ceilCorners: Vec3[] = [
        { x: -hw, y: ROOM_HEIGHT, z: -hd },
        { x: hw, y: ROOM_HEIGHT, z: -hd },
        { x: hw, y: ROOM_HEIGHT, z: hd },
        { x: -hw, y: ROOM_HEIGHT, z: hd },
      ];
      drawQuad(ctx, cam, w, h, ceilCorners, "#080706", null);


      const wallColor = "#100e0c";
      const wallBorder = "rgba(201,168,76,0.06)";


      drawQuad(ctx, cam, w, h, [
        { x: -hw, y: 0, z: -hd },
        { x: -hw, y: 0, z: hd },
        { x: -hw, y: ROOM_HEIGHT, z: hd },
        { x: -hw, y: ROOM_HEIGHT, z: -hd },
      ], wallColor, wallBorder);


      drawQuad(ctx, cam, w, h, [
        { x: hw, y: 0, z: hd },
        { x: hw, y: 0, z: -hd },
        { x: hw, y: ROOM_HEIGHT, z: -hd },
        { x: hw, y: ROOM_HEIGHT, z: hd },
      ], wallColor, wallBorder);


      drawQuad(ctx, cam, w, h, [
        { x: hw, y: 0, z: hd },
        { x: -hw, y: 0, z: hd },
        { x: -hw, y: ROOM_HEIGHT, z: hd },
        { x: hw, y: ROOM_HEIGHT, z: hd },
      ], wallColor, wallBorder);


      drawQuad(ctx, cam, w, h, [
        { x: -hw, y: 0, z: -hd },
        { x: hw, y: 0, z: -hd },
        { x: hw, y: ROOM_HEIGHT, z: -hd },
        { x: -hw, y: ROOM_HEIGHT, z: -hd },
      ], wallColor, wallBorder);


      const moldingY = ROOM_HEIGHT * 0.75;
      const moldingY2 = ROOM_HEIGHT * 0.15;
      [moldingY, moldingY2].forEach(my => {

        const lm1 = project({ x: -hw + 0.05, y: my, z: -hd }, cam, w, h);
        const lm2 = project({ x: -hw + 0.05, y: my, z: hd }, cam, w, h);
        if (lm1 && lm2) {
          ctx.strokeStyle = "rgba(201,168,76,0.1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(lm1.x, lm1.y);
          ctx.lineTo(lm2.x, lm2.y);
          ctx.stroke();
        }

        const rm1 = project({ x: hw - 0.05, y: my, z: -hd }, cam, w, h);
        const rm2 = project({ x: hw - 0.05, y: my, z: hd }, cam, w, h);
        if (rm1 && rm2) {
          ctx.strokeStyle = "rgba(201,168,76,0.1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rm1.x, rm1.y);
          ctx.lineTo(rm2.x, rm2.y);
          ctx.stroke();
        }
      });
    }


    function drawQuad(ctx: CanvasRenderingContext2D, cam: Camera, w: number, h: number, corners: Vec3[], fillColor: string, strokeColor: string | null) {
      const projected = corners.map(c => project(c, cam, w, h));
      if (projected.some(p => p === null)) return;
      const pts = projected as { x: number; y: number; depth: number }[];

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }


    function drawPaintings(ctx: CanvasRenderingContext2D, cam: Camera, w: number, h: number, time: number) {
      const slots = slotsRef.current;


      const sortedSlots = slots.map((s, i) => ({
        slot: s, idx: i,
        depth: Math.sqrt((s.pos.x - cam.x) ** 2 + (s.pos.z - cam.z) ** 2)
      })).sort((a, b) => b.depth - a.depth);

      sortedSlots.forEach(({ slot, idx }) => {
        const hw = slot.width / 2;
        const hh = slot.height / 2;


        let right: Vec3, up: Vec3;
        if (Math.abs(slot.normal.x) > 0.5) {
          right = { x: 0, y: 0, z: slot.normal.x > 0 ? 1 : -1 };
          up = { x: 0, y: 1, z: 0 };
        } else {
          right = { x: slot.normal.z > 0 ? -1 : 1, y: 0, z: 0 };
          up = { x: 0, y: 1, z: 0 };
        }


        const frameMargin = 0.5;
        const fhw = hw + frameMargin;
        const fhh = hh + frameMargin;

        const frameCorners: Vec3[] = [
          { x: slot.pos.x - right.x * fhw + slot.normal.x * 0.05, y: slot.pos.y + fhh, z: slot.pos.z - right.z * fhw + slot.normal.z * 0.05 },
          { x: slot.pos.x + right.x * fhw + slot.normal.x * 0.05, y: slot.pos.y + fhh, z: slot.pos.z + right.z * fhw + slot.normal.z * 0.05 },
          { x: slot.pos.x + right.x * fhw + slot.normal.x * 0.05, y: slot.pos.y - fhh, z: slot.pos.z + right.z * fhw + slot.normal.z * 0.05 },
          { x: slot.pos.x - right.x * fhw + slot.normal.x * 0.05, y: slot.pos.y - fhh, z: slot.pos.z - right.z * fhw + slot.normal.z * 0.05 },
        ];

        const projFrame = frameCorners.map(c => project(c, cam, w, h));
        if (projFrame.some(p => p === null)) return;
        const fpts = projFrame as { x: number; y: number; depth: number }[];


        ctx.save();
        ctx.shadowColor = "rgba(201,168,76,0.15)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;


        ctx.beginPath();
        ctx.moveTo(fpts[0].x, fpts[0].y);
        for (let i = 1; i < fpts.length; i++) ctx.lineTo(fpts[i].x, fpts[i].y);
        ctx.closePath();


        const avgX = (fpts[0].x + fpts[2].x) / 2;
        const avgY = (fpts[0].y + fpts[2].y) / 2;
        const frameGrad = ctx.createLinearGradient(fpts[0].x, fpts[0].y, fpts[2].x, fpts[2].y);
        frameGrad.addColorStop(0, "#c9a84c");
        frameGrad.addColorStop(0.3, "#e8d48b");
        frameGrad.addColorStop(0.5, "#c9a84c");
        frameGrad.addColorStop(0.7, "#a08030");
        frameGrad.addColorStop(1, "#c9a84c");
        ctx.fillStyle = frameGrad;
        ctx.fill();


        ctx.strokeStyle = "#a08030";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();


        const paintCorners: Vec3[] = [
          { x: slot.pos.x - right.x * hw + slot.normal.x * 0.1, y: slot.pos.y + hh, z: slot.pos.z - right.z * hw + slot.normal.z * 0.1 },
          { x: slot.pos.x + right.x * hw + slot.normal.x * 0.1, y: slot.pos.y + hh, z: slot.pos.z + right.z * hw + slot.normal.z * 0.1 },
          { x: slot.pos.x + right.x * hw + slot.normal.x * 0.1, y: slot.pos.y - hh, z: slot.pos.z + right.z * hw + slot.normal.z * 0.1 },
          { x: slot.pos.x - right.x * hw + slot.normal.x * 0.1, y: slot.pos.y - hh, z: slot.pos.z - right.z * hw + slot.normal.z * 0.1 },
        ];

        const projPaint = paintCorners.map(c => project(c, cam, w, h));
        if (projPaint.some(p => p === null)) return;
        const ppts = projPaint as { x: number; y: number; depth: number }[];


        const img = imagesRef.current.get(slot.artworkIndex);
        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(ppts[0].x, ppts[0].y);
          for (let i = 1; i < ppts.length; i++) ctx.lineTo(ppts[i].x, ppts[i].y);
          ctx.closePath();
          ctx.clip();


          const minX = Math.min(...ppts.map(p => p.x));
          const maxX = Math.max(...ppts.map(p => p.x));
          const minY = Math.min(...ppts.map(p => p.y));
          const maxY = Math.max(...ppts.map(p => p.y));

          ctx.drawImage(img, minX, minY, maxX - minX, maxY - minY);


          const glowIntensity = 0.08 + Math.sin(time * 0.001 + idx) * 0.03;
          const glow = ctx.createRadialGradient(
            (minX + maxX) / 2, minY, 0,
            (minX + maxX) / 2, minY, (maxY - minY)
          );
          glow.addColorStop(0, `rgba(201,168,76,${glowIntensity})`);
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glow;
          ctx.fillRect(minX, minY, maxX - minX, maxY - minY);

          ctx.restore();
        } else {

          ctx.beginPath();
          ctx.moveTo(ppts[0].x, ppts[0].y);
          for (let i = 1; i < ppts.length; i++) ctx.lineTo(ppts[i].x, ppts[i].y);
          ctx.closePath();
          ctx.fillStyle = "#1a1714";
          ctx.fill();
        }


        if (slot.artworkIndex < artworks.length) {
          const art = artworks[slot.artworkIndex];
          const plateY = slot.pos.y - hh - 1.5;
          const plateCenter: Vec3 = {
            x: slot.pos.x + slot.normal.x * 0.15,
            y: plateY,
            z: slot.pos.z + slot.normal.z * 0.15,
          };
          const projPlate = project(plateCenter, cam, w, h);
          if (projPlate && projPlate.depth < 35) {
            const fontSize = Math.max(8, Math.min(14, 200 / projPlate.depth));
            ctx.save();
            ctx.font = `${fontSize}px "DM Sans", sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = `rgba(201,168,76,${clamp(1 - projPlate.depth / 40, 0.2, 0.8)})`;
            ctx.fillText(art.title, projPlate.x, projPlate.y);
            ctx.font = `${fontSize * 0.75}px "DM Sans", sans-serif`;
            ctx.fillStyle = `rgba(201,168,76,${clamp(1 - projPlate.depth / 40, 0.1, 0.5)})`;
            ctx.fillText(`${art.artist}, ${art.year}`, projPlate.x, projPlate.y + fontSize * 1.2);
            ctx.restore();
          }
        }
      });
    }


    function drawSpotlightEffects(ctx: CanvasRenderingContext2D, cam: Camera, w: number, h: number, time: number) {
      spotlightsRef.current.forEach((light, i) => {
        const projLight = project(light.pos, cam, w, h);
        if (!projLight || projLight.depth > 50) return;


        const intensity = 0.03 + Math.sin(time * 0.0005 + i * 1.5) * 0.01;
        const radius = Math.max(5, 80 / projLight.depth);
        const glow = ctx.createRadialGradient(projLight.x, projLight.y, 0, projLight.x, projLight.y, radius);
        glow.addColorStop(0, `rgba(201,168,76,${intensity})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(projLight.x - radius, projLight.y - radius, radius * 2, radius * 2);
      });
    }


    const particles: { x: number; y: number; z: number; vx: number; vy: number; size: number; life: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: (Math.random() - 0.5) * ROOM_WIDTH,
        y: Math.random() * ROOM_HEIGHT,
        z: (Math.random() - 0.5) * ROOM_DEPTH,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.2 + 0.05,
        size: Math.random() * 1.5 + 0.5,
        life: Math.random(),
      });
    }

    function drawAmbientParticles(ctx: CanvasRenderingContext2D, cam: Camera, w: number, h: number, time: number) {
      particles.forEach(p => {
        p.x += p.vx * 0.016;
        p.y += p.vy * 0.016;
        p.life = (Math.sin(time * 0.001 + p.x + p.z) + 1) / 2;

        if (p.y > ROOM_HEIGHT) { p.y = 0; p.x = (Math.random() - 0.5) * ROOM_WIDTH; }

        const proj = project({ x: p.x, y: p.y, z: p.z }, cam, w, h);
        if (!proj || proj.depth > 50) return;

        const alpha = p.life * 0.3 * clamp(1 - proj.depth / 50, 0, 1);
        const size = Math.max(0.5, p.size * 10 / proj.depth);

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, size);
        grad.addColorStop(0, `rgba(201,168,76,${alpha})`);
        grad.addColorStop(1, `rgba(201,168,76,0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [introComplete, selectedPainting]);


  const selectedArtwork = selectedPainting !== null
    ? artworks[slotsRef.current[selectedPainting]?.artworkIndex]
    : null;

  if (isMobileDevice) {
    return (
      <div className="min-h-screen bg-soft-black text-cream flex items-center justify-center p-6 text-center">
        <div className="max-w-md flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5 text-gold">
            <Smartphone size={32} />
          </div>
          <h1 className="font-display font-medium text-2xl">3D Галерея недоступна на мобільних пристроях</h1>
          <p className="font-sans text-cream/70 leading-relaxed">
            Для найкращого досвіду занурення та повноцінного керування 3D-простором, будь ласка, відкрийте цю сторінку на комп'ютері або ноутбуці.
          </p>
          <Link href="/gallery">
            <button className="mt-4 px-8 py-3 bg-gold text-soft-black font-ui text-sm tracking-widest uppercase hover:bg-gold-light transition-colors">
              Перейти до 2D Галереї
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60] bg-black">

      <AnimatePresence>
        {imagesLoaded < artworks.length && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[100] bg-[#0a0908] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border border-gold/40 mb-6"
            />
            <span className="font-display text-gold/80 text-xl tracking-[0.3em]">ARTVAULT</span>
            <span className="font-ui text-cream/40 text-xs tracking-[0.2em] mt-2">
              ЗАВАНТАЖЕННЯ 3D ГАЛЕРЕЇ
            </span>
            <div className="w-48 h-px bg-gold/10 mt-6 overflow-hidden">
              <motion.div
                className="h-full bg-gold/50"
                initial={{ width: "0%" }}
                animate={{ width: `${(imagesLoaded / artworks.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="font-ui text-cream/30 text-[10px] mt-3 tracking-wider">
              {imagesLoaded} / {artworks.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>


      <canvas
        ref={canvasRef}
        className={`w-full h-full ${hoveredPainting !== null && selectedPainting === null ? "cursor-pointer" : selectedPainting !== null ? "cursor-default" : "cursor-grab"}`}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />


      <AnimatePresence>
        {showInstructions && introComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="bg-[rgba(10,9,8,0.85)] backdrop-blur-xl border border-gold/20 px-8 py-5 text-center">
              <p className="font-ui text-cream/70 text-sm tracking-wider mb-3">
                Ласкаво просимо до 3D Галереї
              </p>
              <div className="flex gap-6 justify-center text-cream/40 font-ui text-xs tracking-wider flex-wrap">
                <span><kbd className="px-2 py-1 border border-gold/20 text-gold/60 mr-1">W A S D / ↑↓</kbd> Рух</span>
                <span><kbd className="px-2 py-1 border border-gold/20 text-gold/60 mr-1">Перетягування / ←→</kbd> Огляд</span>
                <span><kbd className="px-2 py-1 border border-gold/20 text-gold/60 mr-1">Клік</kbd> Обрати картину</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between"
      >
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-2 bg-[rgba(10,9,8,0.7)] backdrop-blur-xl border border-gold/20 hover:border-gold/40 transition-colors cursor-pointer"
          >
            <Home size={16} className="text-gold/70" />
            <span className="font-ui text-cream/70 text-xs tracking-[0.15em] uppercase">На головну</span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/gallery">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-[rgba(10,9,8,0.7)] backdrop-blur-xl border border-gold/20 hover:border-gold/40 transition-colors cursor-pointer"
            >
              <span className="font-ui text-cream/70 text-xs tracking-[0.15em] uppercase">2D Галерея</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>


      {selectedPainting === null && introComplete && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="w-6 h-6 border border-gold/20 rotate-45" />
        </div>
      )}


      <AnimatePresence>
        {selectedArtwork && selectedPainting !== null && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] z-40 bg-[rgba(10,9,8,0.92)] backdrop-blur-2xl border-l border-gold/20 overflow-y-auto"
          >
            <div className="p-6 sm:p-8">

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={flyBackFromPainting}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-gold/20 hover:border-gold/50 text-cream/60 hover:text-gold transition-all cursor-pointer"
              >
                <X size={18} />
              </motion.button>


              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-ui text-[10px] tracking-[0.4em] text-gold/60 uppercase"
              >
                {selectedArtwork.category}
              </motion.span>


              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-display text-3xl sm:text-4xl text-cream font-bold mt-3 mb-2 leading-tight"
              >
                {selectedArtwork.title}
              </motion.h2>


              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-body text-cream/60 text-lg mb-6"
              >
                {selectedArtwork.artist}, {selectedArtwork.year}
              </motion.p>


              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="h-px bg-gradient-to-r from-gold/40 via-gold/10 to-transparent mb-6 origin-left"
              />


              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-body text-cream/60 text-sm leading-relaxed mb-8"
              >
                {selectedArtwork.description}
              </motion.p>


              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 gap-3 mb-8"
              >
                {[
                  { label: "Розмір", value: selectedArtwork.dimensions },
                  { label: "Техніка", value: selectedArtwork.medium },
                  { label: "Рік", value: selectedArtwork.year.toString() },
                  { label: "Категорія", value: selectedArtwork.category },
                ].map((item, i) => (
                  <div key={item.label} className="p-3 border border-gold/10 bg-[rgba(201,168,76,0.03)]">
                    <span className="font-ui text-[10px] tracking-[0.2em] text-gold/40 uppercase block mb-1">{item.label}</span>
                    <span className="font-ui text-cream/80 text-sm">{item.value}</span>
                  </div>
                ))}
              </motion.div>


              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6"
              >
                <span className="font-ui text-[10px] tracking-[0.3em] text-gold/40 uppercase block mb-1">Ціна</span>
                <span className="font-display text-3xl text-gold font-bold">
                  {formatPrice(selectedArtwork.price)}
                </span>
              </motion.div>


              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <motion.button
                  whileHover={!isInCart(selectedArtwork.id) ? { scale: 1.02, boxShadow: "0 0 30px rgba(201,168,76,0.2)" } : {}}
                  whileTap={!isInCart(selectedArtwork.id) ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (!isInCart(selectedArtwork.id)) {
                      addToCart(selectedArtwork);
                      toast.success(`"${selectedArtwork.title}" додано до кошика`);
                    }
                  }}
                  disabled={isInCart(selectedArtwork.id)}
                  className={`w-full flex items-center justify-center gap-3 py-4 font-ui text-xs tracking-[0.2em] uppercase font-medium transition-all ${isInCart(selectedArtwork.id)
                    ? "bg-gold/20 border border-gold text-gold cursor-default"
                    : "bg-gold text-[#0a0908] hover:bg-gold-light cursor-pointer"
                    }`}
                >
                  <ShoppingCart size={16} />
                  {isInCart(selectedArtwork.id) ? "У кошику" : "Додати до кошика"}
                </motion.button>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const was = isFavorite(selectedArtwork.id);
                      toggleFavorite(selectedArtwork.id);
                      toast.success(was ? `"${selectedArtwork.title}" видалено з обраних` : `"${selectedArtwork.title}" додано до обраних`);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border font-ui text-xs tracking-[0.15em] uppercase transition-all cursor-pointer ${isFavorite(selectedArtwork.id)
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/30 text-cream/60 hover:text-gold hover:border-gold/60"
                      }`}
                  >
                    <Heart size={16} className={isFavorite(selectedArtwork.id) ? "fill-gold" : ""} />
                    {isFavorite(selectedArtwork.id) ? "В обраних" : "Обране"}
                  </motion.button>

                  <Link href={`/artwork/${selectedArtwork.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-5 py-3 border border-gold/30 text-cream/60 hover:text-gold hover:border-gold/60 font-ui text-xs tracking-[0.15em] uppercase transition-all cursor-pointer"
                    >
                      <Eye size={16} />
                      Деталі
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {selectedPainting !== null && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const walkOrder = walkOrderRef.current;
                const curWalkIdx = walkOrder.indexOf(selectedPainting);
                const prevWalkIdx = (curWalkIdx - 1 + walkOrder.length) % walkOrder.length;
                const prev = walkOrder[prevWalkIdx];
                setSelectedPainting(null);
                setTimeout(() => flyToPainting(prev), 100);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-[rgba(10,9,8,0.7)] backdrop-blur border border-gold/20 hover:border-gold/50 text-gold/60 hover:text-gold transition-all cursor-pointer"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const walkOrder = walkOrderRef.current;
                const curWalkIdx = walkOrder.indexOf(selectedPainting);
                const nextWalkIdx = (curWalkIdx + 1) % walkOrder.length;
                const next = walkOrder[nextWalkIdx];
                setSelectedPainting(null);
                setTimeout(() => flyToPainting(next), 100);
              }}
              className="absolute right-[440px] max-sm:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-[rgba(10,9,8,0.7)] backdrop-blur border border-gold/20 hover:border-gold/50 text-gold/60 hover:text-gold transition-all cursor-pointer"
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}
      </AnimatePresence>


      {introComplete && selectedPainting === null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-4 z-20"
        >
          <div className="w-32 h-48 bg-[rgba(10,9,8,0.7)] backdrop-blur border border-gold/20 p-2">
            <svg viewBox={`${-ROOM_WIDTH / 2 - 2} ${-ROOM_DEPTH / 2 - 2} ${ROOM_WIDTH + 4} ${ROOM_DEPTH + 4}`} className="w-full h-full">

              <rect
                x={-ROOM_WIDTH / 2} y={-ROOM_DEPTH / 2}
                width={ROOM_WIDTH} height={ROOM_DEPTH}
                fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5"
              />

              {slotsRef.current.map((slot, i) => (
                <circle
                  key={i}
                  cx={slot.pos.x} cy={slot.pos.z}
                  r={1.2}
                  fill="rgba(201,168,76,0.4)"
                />
              ))}

              <g transform={`translate(${camRef.current.x}, ${camRef.current.z}) rotate(${-camRef.current.yaw * 180 / Math.PI})`}>
                <polygon
                  points="0,-2 -1.5,2 1.5,2"
                  fill="rgba(201,168,76,0.8)"
                />
              </g>
            </svg>
            <span className="font-ui text-[8px] text-gold/40 tracking-wider text-center block mt-1">КАРТА</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
