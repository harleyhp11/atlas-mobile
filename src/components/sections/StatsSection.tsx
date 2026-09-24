"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { Book } from "@/components/ui/book";
import { portfolioData } from "@/data/portfolio";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";


const CATEGORY_COLORS: Record<string, string> = {
    'applied-ai': '#9D2127', // Deep Red
    'software-development': '#7DC1C1', // Teal
    'more': '#FED954', // Yellow
};

/* ------------------------------------------------------------ cinta

   Franja a todo el ancho de la ventana con un video dentro. Sustituye al
   encabezado que habia aqui.

   El video original (4.6 MB, 21 s, con dominante turquesa) se recorto a
   12 s, se paso a blanco y negro (hue=s=0) con un punto de contraste, y se
   recodifico a H.264 y VP9: ~1.4 MB. El B/N va en la codificacion y no en
   un filter de CSS: sale mas limpio y no cuesta nada en cada fotograma.
   Se sirve el webm primero y el mp4 como respaldo para Safari.

   Se pausa cuando la cinta sale de pantalla, y con prefers-reduced-motion
   no llega a montarse: queda el poster fijo.                           */

const CINTA_ALTO = "h-[clamp(170px,23vh,300px)]";

/* Miniaturas en blanco y negro, las mismas piezas del mosaico de Atlas que
   se usan en los titulares de los planes. El B/N va horneado en el archivo,
   no en un filter de CSS. */
const CINTA_THUMBS = [
    "/assets/plan-thumbs/bn/plan-01.webp",
    "/assets/plan-thumbs/bn/plan-02.webp",
    "/assets/plan-thumbs/bn/plan-03.webp",
    "/assets/plan-thumbs/bn/plan-04.webp",
];

/** Una repeticion del rotulo: titulo + miniatura redonda al costado. */
function CintaItem({ src }: { src: string }) {
    return (
        // El tamano va en el contenedor, no en el texto: la miniatura se mide
        // en `em` y si el font-size vive en el <span> hermano, el `em` de la
        // imagen se resuelve contra el heredado (16px) y sale diminuta.
        <span className="flex items-center gap-[0.42em] px-[0.5em] text-[clamp(1.6rem,3.4vw,3.2rem)] leading-none">
            <span
                className="font-display font-extrabold uppercase tracking-[-0.03em] text-white"
                style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
            >
                Nuestros diseños
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt=""
                aria-hidden="true"
                width={320}
                height={320}
                loading="lazy"
                // Rectangulo apaisado con las esquinas muy abiertas. El radio se
                // queda por debajo de la mitad del alto a proposito: si lo iguala
                // o lo supera, el navegador lo recorta a pildora y se pierden los
                // tramos rectos que lo hacen leer como rectangulo.
                className="h-[1.2em] w-[2.1em] shrink-0 rounded-[0.46em] object-cover ring-1 ring-white/35 shadow-[0_2px_18px_rgba(0,0,0,0.5)]"
            />
        </span>
    );
}

function CintaGaleria() {
    const caja = React.useRef<HTMLDivElement>(null);
    const ref = React.useRef<HTMLVideoElement>(null);
    const reduce = useReducedMotion();
    // Un solo observador gobierna el video y el rotulo: apenas la cinta sale de
    // pantalla los dos se detienen, y el scroll hacia la galeria (que escala
    // imagenes hasta 9x) se queda con el main thread para el.
    const [aLaVista, setALaVista] = React.useState(false);

    React.useEffect(() => {
        const caja_ = caja.current;
        if (!caja_ || reduce) return;
        const io = new IntersectionObserver(
            ([e]) => {
                setALaVista(e.isIntersecting);
                const v = ref.current;
                if (!v) return;
                if (e.isIntersecting) v.play().catch(() => {});
                else v.pause();
            },
            { threshold: 0.05 }
        );
        io.observe(caja_);
        return () => io.disconnect();
    }, [reduce]);

    return (
        <div
            ref={caja}
            className={cn(
                "relative w-full overflow-hidden border-y border-white/10 bg-black",
                CINTA_ALTO
            )}
            style={{ contain: "paint" }}
        >
            {reduce ? (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/assets/cinta-galeria.webp')" }}
                />
            ) : (
                <video
                    ref={ref}
                    aria-hidden="true"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/assets/cinta-galeria.webp"
                    className="absolute inset-0 h-full w-full object-cover"
                >
                    <source src="/assets/cinta-galeria.webm" type="video/webm" />
                    <source src="/assets/cinta-galeria.mp4" type="video/mp4" />
                </video>
            )}

            {/* Velo: el video tiene zonas casi blancas y el rotulo tambien es
                blanco. Sin esto, el texto desaparece justo cuando pasa la mano
                luminosa. */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 40%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.55) 100%)",
                }}
            />

            {/* El rotulo corre de lado a lado por encima del video. */}
            <div className="absolute inset-0 flex items-center">
                <InfiniteMarquee
                    items={CINTA_THUMBS.map((src, i) => <CintaItem key={i} src={src} />)}
                    speed={26}
                    paused={!reduce && !aLaVista}
                    className="w-full py-0"
                />
            </div>
        </div>
    );
}

export default function StatsSection({ scrollYProgress, showOnly }: { scrollYProgress?: any, showOnly?: 'top' | 'bottom' }) {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);


    const blogs = portfolioData.blogs.slice(0, 6);
    const visibleCount = 3;

    useEffect(() => {
        const galleryImages = [
            { src: '/gallery/atlas-sitio-web.webp', alt: 'Pieza de Atlas: Tu idea, un sitio web que la hace real' },
            { src: '/gallery/FotoSC1.webp', alt: 'Foto SC1' },
            { src: '/gallery/FotoSC2.webp', alt: 'Foto SC2' },
            { src: '/gallery/FotoSC3.webp', alt: 'Foto SC3' },
            { src: '/gallery/FotoSC4.webp', alt: 'Foto SC4' },
            { src: '/gallery/FotoSC5.webp', alt: 'Foto SC5' },
            { src: '/gallery/academicaffairsdivision1.webp', alt: 'Academic Affairs' },
            { src: '/gallery/computernetworkpracticumassistant2.webp', alt: 'Computer Network' },
            { src: '/gallery/dataentryassistant1.webp', alt: 'Data Entry' },
            { src: '/gallery/delegateaiesecfutureleaders20241.webp', alt: 'AIESEC' },
            { src: '/gallery/environmentalhygieneteam1.webp', alt: 'Hygiene Team 1' },
            { src: '/gallery/environmentalhygieneteam2.webp', alt: 'Hygiene Team 2' },
            { src: '/gallery/logisticsoperatorcampusexpo20242.webp', alt: 'Logistics' },
            { src: '/gallery/researchassistant1.webp', alt: 'Research Assistant 1' },
            { src: '/gallery/researchassistant2.webp', alt: 'Research Assistant 2' },
        ];
        // ZoomParallax solo muestra images.slice(0, 7), y el indice 0 es el que
        // crece hasta ocupar toda la pantalla. La pieza de Atlas va fija en esa
        // posicion; el resto se baraja como antes.
        const [destacada, ...resto] = galleryImages;
        setImages([destacada, ...resto.sort(() => 0.5 - Math.random())]);
        setLoading(false);
    }, []);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % blogs.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + blogs.length) % blogs.length);
    };

    // Helper to get visible blogs in an infinite way
    const getVisibleBlogs = () => {
        const result = [];
        for (let i = 0; i < visibleCount; i++) {
            result.push(blogs[(currentIndex + i) % blogs.length]);
        }
        return result;
    };

    if (loading || images.length === 0) return (
        <div className="h-[400px] w-full flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <section className="relative z-20 bg-background overflow-visible flex flex-col items-center transition-colors duration-500">
            {/* Header for the Gallery Section */}
            {(showOnly === 'top' || !showOnly) && (
                <>
                    <div className="w-full py-[clamp(72px,11vh,150px)]">
                        <CintaGaleria />
                    </div>

                    {/* Immersive Zoom Parallax Component */}
                    <div className="w-full">
                        <ZoomParallax images={images}>
                            <Link 
                                href="/gallery" 
                                className="group flex items-center gap-3 px-6 py-3.5 bg-foreground text-background rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl border border-border/10"
                            >
                                Ver galería
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </ZoomParallax>
                    </div>
                </>
            )}

            {/* Book Showcase Integration */}
            {(showOnly === 'bottom' || !showOnly) && (
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-16 pb-32 space-y-16 relative">
                    <div className="flex items-center justify-between border-b border-border/50 pb-8">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                Latest Stories
                            </h3>
                            <p className="text-muted-foreground/60 font-medium uppercase tracking-widest text-xs">Articles • Insights • Technical Deep Dives</p>
                        </div>
                        <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-colors group">
                            Browse Full Archive
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                    </div>

                    <div className="relative group/slider flex items-center justify-center">
                        {/* Navigation Buttons - Positioned relatively to the container */}
                        <div className="absolute left-0 top-[35%] -translate-y-1/2 z-30 hidden lg:block">
                            <button
                                onClick={prevSlide}
                                className="p-4 rounded-full bg-muted/10 border border-border/50 text-foreground transition-all hover:bg-muted/20 hover:scale-110 active:scale-95"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="absolute right-0 top-[35%] -translate-y-1/2 z-30 hidden lg:block">
                            <button
                                onClick={nextSlide}
                                className="p-4 rounded-full bg-muted/10 border border-border/50 text-foreground transition-all hover:bg-muted/20 hover:scale-110 active:scale-95"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="absolute inset-x-0 top-[35%] -translate-y-1/2 z-30 flex justify-between px-2 lg:hidden">
                            <button
                                onClick={prevSlide}
                                className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-visible w-full lg:max-w-[1400px] mx-auto px-4 md:px-12">
                            <div className="flex gap-8 md:gap-24 justify-center pt-12 pb-32 min-h-[600px] items-start relative">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {getVisibleBlogs().map((blog, index) => (
                                        <motion.div
                                            key={blog.id}
                                            layout
                                            initial={{ opacity: 0, x: direction * 50, scale: 0.9, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, x: direction * -50, scale: 0.9, filter: "blur(10px)" }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 26,
                                            }}
                                            className="group relative w-[200px] md:w-[260px] flex-shrink-0"
                                        >
                                            <Link href={`/blog/${blog.slug}`} className="block relative z-10 group/book">
                                                {/* Glow Effect - Inside Link for better hover detection */}
                                                <div
                                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] aspect-square -z-10 blur-[80px] opacity-0 group-hover/book:opacity-70 group-hover/book:scale-110 transition-all duration-700 rounded-full pointer-events-none"
                                                    style={{
                                                        background: `radial-gradient(circle, ${CATEGORY_COLORS[blog.category]} 0%, transparent 70%)`,
                                                    }}
                                                />

                                                <Book
                                                    title={blog.title}
                                                    color={CATEGORY_COLORS[blog.category] || '#222222'}
                                                    textColor={
                                                        (index % 2 !== 0 && blog.category === 'applied-ai')
                                                            ? '#FFFFFF'
                                                            : 'var(--ds-gray-1000)'
                                                    }
                                                    variant={index % 2 === 0 ? 'stripe' : 'simple'}
                                                    textured
                                                    width={{ sm: 160, md: 220, lg: 260 }}
                                                />

                                                <div className="mt-8 space-y-3 opacity-0 group-hover/book:opacity-100 transition-all duration-500 translate-y-4 group-hover/book:translate-y-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-muted/20 border border-border/50 text-foreground/60">
                                                            {blog.category.replace(/-/g, ' ')}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                                                            {new Date(blog.date).getFullYear()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                                                        {blog.excerpt}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center md:hidden pt-8">
                        <Link href="/blog" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-colors group">
                            Browse Full Archive
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}
