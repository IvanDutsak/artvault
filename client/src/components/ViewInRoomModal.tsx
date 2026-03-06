import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import type { Artwork } from "@/lib/data";

interface ViewInRoomModalProps {
    artwork: Artwork;
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewInRoomModal({ artwork, isOpen, onClose }: ViewInRoomModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex flex-col bg-[#121212] p-4 sm:p-8"
                    onClick={onClose}
                >

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 text-cream/50 hover:text-gold transition-colors z-50 cursor-pointer"
                        onClick={onClose}
                    >
                        <X size={28} />
                    </motion.button>


                    <div
                        className="flex-1 flex items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative flex items-center justify-center"
                            style={{ maxWidth: "90%", maxHeight: "85%" } as any}
                        >

                            <div className="absolute inset-0 -inset-x-20 -inset-y-16 bg-white/[0.03] blur-[80px] rounded-full pointer-events-none" />


                            <div
                                className="relative bg-[#2a2520] p-[10px] sm:p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.9),0_10px_30px_rgba(0,0,0,0.6)]"
                                style={{

                                    borderTop: "2px solid rgba(180,150,80,0.4)",
                                    borderLeft: "2px solid rgba(180,150,80,0.25)",
                                    borderRight: "1px solid rgba(80,60,30,0.5)",
                                    borderBottom: "1px solid rgba(80,60,30,0.5)",
                                }}
                            >

                                <div className="bg-[#f5f3ee] p-4 sm:p-8 md:p-10 shadow-[inset_0_0_12px_rgba(0,0,0,0.08)]">
                                    <img
                                        src={artwork.image}
                                        alt={artwork.title}
                                        className="block max-h-[55vh] max-w-full object-contain"
                                        style={{
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex-shrink-0 pt-4 sm:pt-6 flex flex-col gap-1 font-ui"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2 text-gold/70 text-xs tracking-[0.2em] uppercase">
                            <Ruler size={13} />
                            <span>Пропорції в інтер'єрі</span>
                        </div>
                        <p className="text-cream text-xl font-display">{artwork.dimensions}</p>
                        <p className="text-cream/40 text-xs">Приблизний розмір відносно середньої стіни</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
