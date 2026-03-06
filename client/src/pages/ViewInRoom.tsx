import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Ruler, Image as ImageIcon } from "lucide-react";
import { getArtworkById, getImageUrl } from "@/lib/data";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function ViewInRoom() {
    const { id } = useParams<{ id: string }>();
    const artwork = getArtworkById(id || "");
    const [orientation, setOrientation] = useState<'wide' | 'tall' | 'square' | null>(null);

    if (!artwork) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-cream/60 font-ui">Твір не знайдено</p>
            </div>
        );
    }

    return (
        <PageTransition>

            {artwork && (
                <img
                    src={artwork.image}
                    alt="hidden"
                    className="hidden"
                    onLoad={(e) => {
                        const { naturalWidth, naturalHeight } = e.currentTarget;
                        const ratio = naturalWidth / naturalHeight;
                        if (ratio > 1.2) setOrientation('wide');
                        else if (ratio < 0.8) setOrientation('tall');
                        else setOrientation('square');
                    }}
                />
            )}

            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />


                <div className="container pt-20 sm:pt-24 pb-4">
                    <Link
                        href={`/artwork/${artwork.id}`}
                        className="inline-flex items-center gap-2 text-cream/50 hover:text-gold transition-colors font-ui text-sm tracking-wider uppercase"
                    >
                        <ArrowLeft size={16} />
                        Назад до твору
                    </Link>
                </div>


                <div className="flex-1 w-full bg-[#121110] flex items-center justify-center p-4 sm:p-8">

                    <div className="relative max-w-5xl w-full mx-auto" style={{ aspectRatio: "1200/800" }}>

                        <img
                            src={getImageUrl("/room-interior.jpg")}
                            alt="Interior room"
                            className="absolute inset-0 w-full h-full object-contain"
                        />


                        <div className="absolute inset-0 bg-black/10" />


                        <div
                            className="absolute z-10 flex items-center justify-center transition-all duration-700"
                            style={
                                orientation === 'tall' ? {

                                    top: "15%",
                                    left: "48%",
                                    width: "18%",
                                    height: "38%"
                                } : orientation === 'wide' ? {

                                    top: "28%",
                                    left: "40%",
                                    width: "32%",
                                    height: "25%"
                                } : {

                                    top: "25%",
                                    left: "45%",
                                    width: "23%",
                                    height: "28%"
                                }
                            }
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                className="relative flex items-center justify-center w-full h-full"
                            >

                                <div className="absolute inset-0 translate-y-2 translate-x-1 blur-[15px] bg-black/40 pointer-events-none" />


                                <div
                                    className="relative bg-gradient-to-br from-[#3a3028] via-[#2a2420] to-[#1e1a16] p-[3px] sm:p-[6px] md:p-[8px]"
                                    style={{
                                        boxShadow:
                                            "inset 1px 1px 0 rgba(255,255,255,0.08), inset -1px -1px 0 rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.4)",
                                    }}
                                >

                                    <div
                                        className="bg-gradient-to-br from-[#c5a55a] via-[#b8963e] to-[#a07a2e] p-[1px] sm:p-[2px]"
                                        style={{
                                            boxShadow:
                                                "inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.2)",
                                        }}
                                    >

                                        <img
                                            src={artwork.image}
                                            alt={artwork.title}

                                            className="block max-h-full max-w-full w-auto h-auto object-contain"
                                            style={{
                                                maxHeight: "15vh",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-background border-t border-gold/10 py-6 sm:py-8"
                >
                    <div className="container flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-3">
                            <ImageIcon size={18} className="text-gold/60" />
                            <div>
                                <h2 className="font-display text-lg text-cream font-bold">{artwork.title}</h2>
                                <p className="font-ui text-sm text-cream/50">{artwork.artist}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gold/10 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <Ruler size={14} className="text-gold/50" />
                            <span className="font-ui text-sm text-cream/70">{artwork.dimensions}</span>
                        </div>
                        <p className="font-ui text-xs text-cream/40 sm:ml-auto">
                            Приблизне зображення картини в інтер'єрі
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
