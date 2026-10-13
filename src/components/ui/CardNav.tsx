'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Navigation, Rocket, BookOpen, ImageIcon, FileText, MessageCircle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

/* EL ACENTO DEL PANEL: ROJO DE ATLAS EN VEZ DEL VERDE DE LA PLANTILLA.

   Van DOS tonos, no uno, porque ningún rojo pasa AA contra blanco y contra el
   panel oscuro (#161616) a la vez: sobre blanco hace falta luminancia ≤0.183
   y sobre el panel ≥0.211. Son requisitos opuestos.

       tema      antes              ahora              contraste
       oscuro    #D1FF4D (15.6:1)   #FF4D5E            5.58:1 sobre #161616
       claro     #8cb815 ( 2.34:1)  #E11D3A            4.73:1 sobre blanco

   El #E11D3A es el rojo que ya usa el resto del sitio. El tema claro, de paso,
   queda arreglado: el verde oscuro que traía la plantilla daba 2.34:1, o sea
   suspendía AA de calle. */

// Los rotulos del panel desplegable. Estaban sueltos en el JSX y ademas en
// primera persona ("my latest builds", "my CV"), que es la voz del autor de la
// plantilla, no la nuestra.
const PANEL = {
    servicios:   { titulo: 'Servicios',    desc: 'Los planes y sus precios' },
    proyectos:   { titulo: 'Proyectos',    desc: 'Lo último que construimos' },
    capacidades: { titulo: 'Capacidades',  desc: 'Qué hacemos y con qué' },
    notas:       { titulo: 'Notas',        desc: 'Ideas y apuntes' },
    galeria:     { titulo: 'Galería',      desc: 'Archivo visual' },
    curriculum:  { titulo: 'Currículum',   desc: 'CV del fundador' },
    chat:        { titulo: 'Chat',         desc: 'Muy pronto' },
} as const;

interface NavLink {
    label: string;
    href: string;
    description?: string;
}

interface NavItem {
    label: string;
    links: NavLink[];
}

interface CardNavProps {
    items: NavItem[];
    theme?: 'light' | 'dark';
    pathname?: string;
    /* Paleta SOLO del disparador, que vive sobre la pastilla de la barra y
       tiene que seguirla: la barra cambia de piel segun el suelo que tenga
       debajo, no segun el tema. El panel desplegable NO usa esto: ese se sigue
       mandando por `theme`, porque se abre fuera de la pastilla y sobre el
       fondo de la pagina. */
    paletaDisparador?: 'clara' | 'oscura';
}

function GridSnake({ theme }: { theme: string }) {
    const [pathX, setPathX] = useState<number[]>([]);
    const [pathY, setPathY] = useState<number[]>([]);
    
    useEffect(() => {
        const cols = 11; // ~264px max width
        const rows = 6;  // ~144px max height
        const gridSize = 24;
        
        let x = Math.floor(Math.random() * cols) * gridSize;
        let y = Math.floor(Math.random() * rows) * gridSize;
        
        const px = [x];
        const py = [y];
        
        for (let i = 0; i < 40; i++) {
            const isHorizontal = Math.random() > 0.5;
            const step = (Math.random() > 0.5 ? 1 : -1) * gridSize;
            
            if (isHorizontal) {
                x += step;
                if (x < 0) x = (cols - 1) * gridSize;
                else if (x >= cols * gridSize) x = 0;
            } else {
                y += step;
                if (y < 0) y = (rows - 1) * gridSize;
                else if (y >= rows * gridSize) y = 0;
            }
            
            px.push(x);
            py.push(y);
        }
        setPathX(px);
        setPathY(py);
    }, []);

    if (pathX.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "absolute top-0 left-0 w-[24px] h-[24px]",
                        theme === 'dark' ? (i === 0 ? "bg-white/20" : "bg-white/10") : (i === 0 ? "bg-black/20" : "bg-black/10")
                    )}
                    animate={{
                        x: pathX,
                        y: pathY,
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.15
                    }}
                />
            ))}
        </div>
    )
}

function ActiveDot({ theme }: { theme: string }) {
    /* El punto va pegado al titular de la tarjeta, así que tiene que llevar su
       mismo tono o se verían dos rojos distintos uno al lado del otro. El color
       va en `style` y no en clase arbitraria porque Tailwind resuelve
       `bg-[#...]` leyendo el texto del fuente: un valor calculado no lo vería. */
    const tono = theme === 'dark' ? '#FF4D5E' : '#E11D3A';
    return (
        <span className="inline-flex ml-2 -translate-y-px align-middle">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: tono }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: tono, boxShadow: `0 0 5px ${tono}cc` }}></span>
            </span>
        </span>
    );
}

function MegaBoxBig({ href, icon: Icon, title, desc, theme, pathname }: any) {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);
    
    return (
        <Link href={href} className={cn(
            "group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 h-40 overflow-hidden",
            theme === 'dark'
                ? cn("bg-[#161616] hover:bg-[#1f1f1f] hover:shadow-xl hover:shadow-black/50", isActive ? "border-[#FF4D5E]/50 shadow-[0_0_15px_rgba(255,77,94,0.05)]" : "border-white/10 hover:border-white/20")
                : cn("hover:bg-white hover:shadow-xl hover:shadow-black/10", isActive ? "bg-white border-[#E11D3A]/80 shadow-md shadow-[#E11D3A]/10" : "bg-black/[0.02] border-black/10 hover:border-black/20")
        )}>
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Random Snake Animation */}
            <GridSnake theme={theme} />

            <Icon className={cn("w-6 h-6 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3", theme === 'dark' ? (isActive ? "text-[#FF4D5E]" : "text-white/70 group-hover:text-white") : (isActive ? "text-[#E11D3A]" : "text-black/70 group-hover:text-black"))} />

            <div className="relative z-10 mt-auto">
                <h4 className={cn("font-bold text-[15px] mb-1.5 transition-colors duration-300 flex items-center", theme === 'dark' ? (isActive ? "text-[#FF4D5E]" : "text-white") : (isActive ? "text-[#E11D3A]" : "text-black"))}>
                    {title}
                    {isActive && <ActiveDot theme={theme} />}
                </h4>
                <p className={cn("text-xs font-medium leading-relaxed transition-colors duration-300", theme === 'dark' ? "text-white/60 group-hover:text-white/80" : "text-black/60 group-hover:text-black/80")}>{desc}</p>
            </div>
            
            {/* Soft Glow overlay on hover */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                theme === 'dark' ? "bg-gradient-to-tr from-transparent via-white/5 to-transparent" : "bg-gradient-to-tr from-transparent via-black/5 to-transparent"
            )} />
        </Link>
    )
}

function MegaBoxSmall({ href, icon: Icon, title, desc, theme, pathname }: any) {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);
    
    return (
        <Link href={href} className={cn(
            "group relative flex flex-col justify-center rounded-2xl border p-4 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden",
            theme === 'dark'
                ? cn("bg-[#161616] hover:bg-[#1f1f1f] hover:shadow-xl hover:shadow-black/50", isActive ? "border-[#FF4D5E]/50 shadow-[0_0_15px_rgba(255,77,94,0.05)]" : "border-white/10 hover:border-white/20")
                : cn("hover:bg-white hover:shadow-xl hover:shadow-black/10", isActive ? "bg-white border-[#E11D3A]/80 shadow-md shadow-[#E11D3A]/10" : "bg-black/[0.02] border-black/10 hover:border-black/20")
        )}>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h4 className={cn("font-bold text-sm mb-1.5 transition-colors duration-300 flex items-center", theme === 'dark' ? (isActive ? "text-[#FF4D5E]" : "text-white") : (isActive ? "text-[#E11D3A]" : "text-black"))}>
                        {title}
                        {isActive && <ActiveDot theme={theme} />}
                    </h4>
                    <p className={cn("text-[11px] font-medium leading-relaxed transition-colors duration-300", theme === 'dark' ? "text-white/60 group-hover:text-white/80" : "text-black/60 group-hover:text-black/80")}>{desc}</p>
                </div>
                <div className={cn("p-1.5 rounded-xl transition-colors duration-300", theme === 'dark' ? "group-hover:bg-white/10" : "group-hover:bg-black/5")}>
                    <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12", theme === 'dark' ? (isActive ? "text-[#FF4D5E]" : "text-white/40 group-hover:text-white/80") : (isActive ? "text-[#E11D3A]" : "text-black/40 group-hover:text-black/80"))} />
                </div>
            </div>
        </Link>
    )
}

function SidebarLink({ href, icon: Icon, title, desc, theme, pathname }: any) {
    const isChat = href === '#';
    const isActive = pathname === href || (href !== '#' && pathname?.startsWith(`${href}/`));
    
    const className = cn(
        "group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-500 overflow-hidden relative",
        theme === 'dark'
            ? cn("bg-[#161616] hover:bg-[#1f1f1f]", isActive ? "border-[#FF4D5E]/50 shadow-[0_0_15px_rgba(255,77,94,0.05)]" : "border-white/10 hover:border-white/20")
            : cn("hover:bg-white", isActive ? "bg-white border-[#E11D3A]/80 shadow-sm shadow-[#E11D3A]/10" : "bg-black/[0.02] border-black/10 hover:border-black/20"),
        isChat ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:scale-[1.02] hover:-translate-x-1 hover:shadow-xl"
    );

    const content = (
        <>
            <div className="flex-1 relative z-10">
                <h4 className={cn("font-bold text-sm mb-1.5 transition-colors duration-300 flex items-center", theme === 'dark' ? (isActive ? "text-[#FF4D5E]" : "text-white") : (isActive ? "text-[#E11D3A]" : "text-black"))}>
                    {title}
                    {isActive && <ActiveDot theme={theme} />}
                </h4>
                <p className={cn("text-[11px] font-medium transition-colors duration-300", theme === 'dark' ? "text-white/60 group-hover:text-white/80" : "text-black/60 group-hover:text-black/80")}>{desc}</p>
            </div>
            <Icon className={cn("w-5 h-5 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6", theme === 'dark' ? (isActive ? "text-[#FF4D5E]" : "text-white/40 group-hover:text-white/80") : (isActive ? "text-[#E11D3A]" : "text-black/40 group-hover:text-black/80"))} />
            
            {/* Subtle highlight */}
            {!isChat && (
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                    theme === 'dark' ? "bg-gradient-to-r from-transparent to-white/[0.02]" : "bg-gradient-to-r from-transparent to-black/[0.02]"
                )} />
            )}
        </>
    );

    if (isChat) {
        return (
            <div className={className}>
                {content}
            </div>
        );
    }

    return (
        <Link href={href} className={className}>
            {content}
        </Link>
    )
}

export default function CardNav({
    items,
    theme = "dark",
    pathname = "/",
    paletaDisparador
}: CardNavProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const aboutItem = items.find(i => i.label === "About") || items[0];
    const allHrefs = ['/servicios', '/projects', '/skills', '/blog', '/gallery', '/resume'];
    const isActive = useMemo(() => {
        return allHrefs.some(href => pathname === href || pathname.startsWith(`${href}/`));
    }, [pathname]);

    return (
        <div ref={containerRef} className="relative">
            <motion.button
                onMouseEnter={() => setIsExpanded(true)}
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "relative px-4 py-1.5 text-[13px] font-bold transition-all duration-300 rounded-full flex items-center gap-1.5 group",
                    paletaDisparador === 'clara'
                        ? (isActive ? "bg-white/15 text-white" : "text-white/60 hover:text-white")
                        : paletaDisparador === 'oscura'
                        ? (isActive ? "bg-black/[0.07] text-neutral-900" : "text-neutral-500 hover:text-neutral-900")
                        : isActive
                            ? (theme === 'dark' ? "text-white bg-white/10" : "text-black bg-black/5")
                            : (theme === 'dark' ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black")
                )}
            >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <span className="relative z-10 flex items-center gap-2">
                    {isActive && isExpanded && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center"
                        >
                            <motion.span
                                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="w-1.5 h-1.5 rounded-full bg-[#E11D3A] shadow-[0_0_8px_rgba(225,29,58,0.6)]"
                            />
                        </motion.div>
                    )}
                    {aboutItem.label}
                </span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                >
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </motion.div>
            </motion.button>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        onMouseLeave={() => setIsExpanded(false)}
                        initial={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                        animate={{ opacity: 1, y: 20, scale: 1, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, scale: 0.98, x: "-50%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute top-full left-1/2 z-[100] pointer-events-auto"
                    >
                        <div className={cn(
                            "relative w-[850px] rounded-[1.5rem] border shadow-2xl flex backdrop-blur-2xl transition-all overflow-hidden",
                            theme === 'dark'
                                ? "bg-[#0a0a0a]/95 border-white/10 shadow-black/80"
                                : "bg-white/95 border-black/10 shadow-black/5"
                        )}>
                            {/* Left Main Area */}
                            <div className="flex-1 p-5 flex flex-col gap-4">
                                {/* Top 2 big boxes */}
                                <div className="grid grid-cols-2 gap-4">
                                    <MegaBoxBig href="/servicios" icon={Layers} title={PANEL.servicios.titulo} desc={PANEL.servicios.desc} theme={theme} pathname={pathname} />
                                    <MegaBoxBig href="/projects" icon={Rocket} title={PANEL.proyectos.titulo} desc={PANEL.proyectos.desc} theme={theme} pathname={pathname} />
                                </div>
                                {/* Fila de abajo: dos cajas. Eran tres; Credenciales se retiro del sitio. */}
                                <div className="grid grid-cols-2 gap-4">
                                    <MegaBoxSmall href="/skills" icon={Navigation} title={PANEL.capacidades.titulo} desc={PANEL.capacidades.desc} theme={theme} pathname={pathname} />
                                    <MegaBoxSmall href="/blog" icon={BookOpen} title={PANEL.notas.titulo} desc={PANEL.notas.desc} theme={theme} pathname={pathname} />
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className={cn(
                                "w-[280px] p-4 flex flex-col justify-center gap-4 border-l",
                                theme === 'dark' ? "border-white/5" : "border-black/5"
                            )}>
                                <SidebarLink href="/gallery" icon={ImageIcon} title={PANEL.galeria.titulo} desc={PANEL.galeria.desc} theme={theme} pathname={pathname} />
                                <SidebarLink href="/resume" icon={FileText} title={PANEL.curriculum.titulo} desc={PANEL.curriculum.desc} theme={theme} pathname={pathname} />
                                <SidebarLink href="#" icon={MessageCircle} title={PANEL.chat.titulo} desc={PANEL.chat.desc} theme={theme} pathname={pathname} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
