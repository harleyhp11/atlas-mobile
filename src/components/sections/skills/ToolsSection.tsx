'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/* Las herramientas de Atlas y su icono.

   Vive aqui y no en portfolioData.tools porque esa lista es del portfolio
   original (Jupyter, Google Colab, Conda, Linux, Postman: instrumental de
   ciencia de datos) y la comparte la portada.

   El icono de VS Code apuntaba a upload.wikimedia.org, el unico fuera de los
   CDN de iconos. Ahora sale de devicon como el resto. */
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
const SIMPLE = 'https://cdn.simpleicons.org';

interface Herramienta { name: string; icon: string }

const FILA_SUPERIOR: Herramienta[] = [
    { name: 'Figma', icon: `${DEVICON}/figma/figma-original.svg` },
    { name: 'VS Code', icon: `${DEVICON}/vscode/vscode-original.svg` },
    { name: 'GitHub', icon: `${DEVICON}/github/github-original.svg` },
    { name: 'Vercel', icon: `${SIMPLE}/vercel` },
    { name: 'Notion', icon: `${SIMPLE}/notion` },
];

const FILA_INFERIOR: Herramienta[] = [
    { name: 'Git', icon: `${DEVICON}/git/git-original.svg` },
    { name: 'Supabase', icon: `${DEVICON}/supabase/supabase-original.svg` },
    { name: 'Stripe', icon: `${SIMPLE}/stripe` },
    { name: 'Cloudflare', icon: `${SIMPLE}/cloudflare` },
    { name: 'Google Analytics', icon: `${SIMPLE}/googleanalytics` },
];

export const ToolsSection = () => {
    const topRow = FILA_SUPERIOR;
    const bottomRow = FILA_INFERIOR;

    return (
        <section
            id="tools"
            className="py-32 relative bg-background min-h-[80vh] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* BACKGROUND AMBIENCE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--background)_0%,_#050505_100%)] z-0" />

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center mb-24 pointer-events-none select-none px-6"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xs font-bold uppercase tracking-[0.4em] text-foreground block mb-6"
                >
                    FLUJO DE TRABAJO
                </motion.span>
                <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-foreground mb-8 max-w-4xl mx-auto leading-[1.1]">
                    Nuestras herramientas
                </h2>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-foreground/60 leading-relaxed font-medium px-4">
                    Las plataformas con las que diseñamos, versionamos y publicamos. Nada exótico: herramientas probadas que hacen el trabajo predecible.
                </p>
            </motion.div>

            {/* MARQUEE ROWS - Constrained container for side spacing */}
            <div className="relative z-20 w-full max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12">
                <div className="flex flex-col gap-12 mask-horizontal-fixed">
                    {/* Row 1: Left to Right */}
                    <MarqueeRow items={topRow} direction="right" speed={45} />

                    {/* Row 2: Right to Left */}
                    <MarqueeRow items={bottomRow} direction="left" speed={40} />
                </div>
            </div>

            <div className="absolute bottom-12 text-center w-full pointer-events-none opacity-30 text-white/50">
            </div>

            {/* CSS Mask optimized for performance */}
            <style jsx global>{`
                .mask-horizontal-fixed {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    /* Hardware acceleration for mask rendering */
                    transform: translateZ(0); 
                }
            `}</style>
        </section>
    );
};

const MarqueeRow = ({ items, direction, speed }: { items: any[], direction: 'left' | 'right', speed: number }) => {
    // 4x duplication for ultra-smooth loop on all screen widths
    const doubledItems = [...items, ...items, ...items, ...items];

    return (
        <div className="flex w-full overflow-hidden py-4">
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d"
                }}
                animate={{
                    x: direction === 'right' ? ['-50%', '0%'] : ['0%', '-50%'],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledItems.map((tool, idx) => (
                    <ToolPill key={`${tool.name}-${idx}`} tool={tool} />
                ))}
            </motion.div>
        </div>
    );
};

const ToolPill = ({ tool }: { tool: Herramienta }) => {
    /* El icono ya viene resuelto en la lista; el mapa toolLogos que habia aqui
       sobraba en cuanto las herramientas dejaron de venir de portfolioData. */
    const iconUrl = tool.icon;

    return (
        <div className="flex items-center gap-6 px-10 py-5 bg-[#0a0a0a]/10 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full transition-all duration-300 hover:scale-105 hover:bg-black/20 dark:hover:bg-white/10 group select-none">
            <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
                <Image
                    src={iconUrl}
                    alt={tool.name}
                    fill
                    className={cn(
                        "object-contain filter grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]",
                        tool.name === 'GitHub' && "dark:invert"
                    )}
                    unoptimized
                />
            </div>
            <span className="text-xl md:text-2xl font-bold uppercase tracking-[0.1em] text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                {tool.name}
            </span>
        </div>
    );
};
