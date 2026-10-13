"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { WarpBackground } from "@/components/ui/warp-background";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import ImageTrail from "@/components/ImageTrail";
import Image from "next/image";
import InfiniteMenu from "@/components/InfiniteMenu";
import { portfolioData } from "@/data/portfolio";
import { BeamDivider } from "@/components/ui/BeamDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { Github, Linkedin, Instagram, MessageSquare, ArrowRight, ArrowUpRight, BadgeCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCountUp } from "@/hooks/useCountUp";
import { SocialCorner } from "@/components/layout/SocialCorner";
import { cn } from "@/lib/utils";

import Testimonial1 from "@/components/ui/testimonial-1";
import { IdentitySequence } from "./IdentitySequence";
import ScrollAdventure from "@/components/ui/animated-scroll";
import { ArgentLoopInfiniteSlider } from "@/components/ui/argent-loop-infinite-slider";
import { HorizontalTimeline } from "@/components/ui/horizontal-timeline";
import AtlasFAQ from "@/components/sections/faq/AtlasFAQ";
import PasoAPrecios from "@/components/sections/faq/PasoAPrecios";
import { GitHubShowcase } from "@/components/ui/github-showcase";
import PlanCatalogo from "@/components/ui/plan-catalogo";
import KaggleShowcase from "@/components/ui/kaggle-showcase";
import { WakaTimeShowcase } from "@/components/ui/wakatime-showcase";
import { ShowcaseStack } from "@/components/ui/showcase-stack";
import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";
import TituloTecnico from "@/components/ui/titulo-tecnico";

const showcaseMembers = [
    // Proceso de Atlas. Mapeo de campos hacia HorizontalTimeline:
    //   period      -> pildora de fecha (duracion del paso)
    //   role        -> titulo sobre la linea (nombre del paso)
    //   name        -> titulo de la card (entregable)
    //   description -> parrafo de la card
    // Sin `social`: estas cards no llevan boton sobre la imagen.
    {
        id: 'paso-1',
        period: 'Días 1 - 2',
        role: 'Descubrimiento',
        name: 'Entendemos tu negocio',
        description: 'Llamada de 30 minutos. Salimos con objetivos, alcance y presupuesto por escrito.',
        // Imagen propia: una llamada de descubrimiento de verdad. La tira mide
        // 370x88, o sea 4.2:1, y el recorte es `object-cover` centrado: de los
        // 941px de alto del original se ven los 397 del medio (filas 272-669),
        // que es justo donde caen las dos caras.
        image: '/brand/proceso-descubrimiento.webp'
    },
    {
        id: 'paso-2',
        period: 'Semana 1',
        role: 'Estrategia y arquitectura',
        name: 'Definimos qué va en cada pantalla',
        description: 'Ordenamos estructura, mensajes y recorrido. Antes de diseñar ya sabemos qué dice cada sección.',
        // Wireframes enlazados con chinchetas rojas. El recorte centrado deja la
        // banda del medio (filas 328-693 de 1024): el pie de la fila de arriba,
        // los enlaces y la cabeza de la de abajo, que es donde se lee la
        // estructura. Monocromo y rojo: la paleta de la casa sin tocar nada.
        image: '/brand/proceso-estrategia.webp'
    },
    {
        id: 'paso-3',
        period: 'Semana 1 - 2',
        role: 'Diseño',
        name: 'Prototipo navegable en Figma',
        description: 'Pantalla por pantalla, escritorio y móvil. No tocamos código hasta que el diseño te convence.',
        // Captura de Figma. El recorte centrado deja fuera la barra de título y
        // la de herramientas, y entra la banda del medio: panel de capas,
        // columnas de pantallas y estilos de texto (filas 330-805 de 1136).
        image: '/brand/proceso-diseno.webp'
    },
    {
        id: 'paso-4',
        period: 'Semana 2 - 3',
        role: 'Desarrollo',
        name: 'Código a medida, rápido y responsive',
        description: 'La tecnología que le sirva a tu negocio. Menos de 2 segundos de carga y lista para SEO.',
        // El editor y la página corriendo al lado, que es justo lo que dice la
        // tarjeta. El recorte centrado (filas 271-669 de 941) deja fuera la barra
        // de título y la de estado, y entra el árbol de archivos, el código y el
        // titular de la página ya renderizado.
        image: '/brand/proceso-desarrollo.webp'
    },
    {
        id: 'paso-5',
        period: 'Semana 4 + 30 días',
        role: 'Lanzamiento y soporte',
        name: 'Publicamos, medimos y acompañamos',
        description: 'Dominio, hosting y analítica listos. Te enseñamos a administrarla y seguimos 30 días contigo.',
        // Analítica después de publicar, que es la mitad de lo que promete la
        // tarjeta. El recorte centrado (filas 328-693 de 1024) agarra la curva,
        // las barras, el anillo y el canto del teléfono. Negro y rojo: la paleta
        // de la casa, sin un solo color de fuera.
        image: '/brand/proceso-lanzamiento.webp'
    },
    // 6. View more
    {
        id: 'view-more',
        name: 'Ver más',
        role: 'Ver todo el proceso',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
        social: { website: '/skills' }
    }
];

const GALLERY_IMAGES = [
    "/obra/obra-01.webp",
    "/obra/obra-02.webp",
    "/obra/obra-03.webp",
    "/obra/obra-04.webp",
    "/obra/obra-05.webp",
    "/obra/obra-06.webp",
];

const AboutLeadInImageStack = () => {
    const [randomData, setRandomData] = useState<{ src: string, rotate: number, x: number, y: number }[]>([]);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        const shuffled = [...GALLERY_IMAGES].sort(() => 0.5 - Math.random()).slice(0, 2);
        const data = shuffled.map((src, i) => {
            const offsetMultiplier = i === 0 ? -1 : 1;
            return {
                src,
                rotate: Math.round(offsetMultiplier * 15 + (Math.random() * 8 - 4)),
                x: Math.round(offsetMultiplier * 25 + (Math.random() * 10 - 5)),
                y: Math.round(Math.random() * 10 - 5),
            };
        });
        setRandomData(data);
    }, [mounted]);

    if (!mounted || randomData.length === 0) return null;

    return (
        <div className="relative flex items-center justify-center w-56 h-32 md:w-72 md:h-44 mb-8 lg:mb-10 overflow-visible">
            {randomData.map((item, i) => (
                <div
                    key={item.src}
                    className="absolute w-24 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden border-[4px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-white"
                    style={{
                        zIndex: i === 1 ? 20 : 10,
                        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
                    }}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={item.src}
                            alt="Gallery Piece"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100px, 120px"
                            priority={i === 1}
                        />
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Utility: Slide Reveal (Smooth & Cinematic) ---
const SlideReveal = ({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1],
            scale: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        }}
    >
        {children}
    </motion.div>
);

/* Card de la esquina: piezas de Atlas rotando cada 2s, con la barra de
   progreso del ciclo debajo.
   Las tres imagenes se montan a la vez y solo se cruza la opacidad: asi no
   hay parpadeo por carga en el primer ciclo, y son 87 KB en total. */
const VITRINA = ["/assets/vitrina/d1.webp", "/assets/vitrina/d2.webp", "/assets/vitrina/d3.webp"];
const VITRINA_MS = 2000;

const VitrinaDisenos = () => {
    const [i, setI] = useState(0);
    const [quieto, setQuieto] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setQuieto(true);
            return;
        }
        const id = window.setInterval(
            () => setI((n) => (n + 1) % VITRINA.length),
            VITRINA_MS
        );
        return () => window.clearInterval(id);
    }, []);

    return (
        /* Marco de cristal rodeando la imagen entera. Misma receta de liquid
           glass que la seccion de Testimonios —desenfoque + saturado de lo que
           hay detras, reflejo en el filo superior y sombra que despega la
           pieza— a un tercio de intensidad, que es lo que la deja apenas
           insinuada.
           El cristal esta en el contenedor y la imagen va DENTRO, con su
           propio recorte: asi el backdrop-filter desenfoca la foto roja del
           fondo, que es lo que le da el efecto, y no el diseño que la card
           esta enseñando. */
        <div
            className="relative w-[clamp(180px,24vw,320px)] rounded-[18px] p-[7px]"
            style={{
                background:
                    "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 48%, rgba(255,255,255,0.06) 100%)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(7px) saturate(150%)",
                WebkitBackdropFilter: "blur(7px) saturate(150%)",
                boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 20px rgba(0,0,0,0.28)",
            }}
        >
            <div className="relative aspect-[1.8/1] overflow-hidden rounded-[12px]">
                {VITRINA.map((src, n) => (
                    <Image
                        key={src}
                        src={src}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="320px"
                        className={cn(
                            "object-cover transition-opacity duration-700 ease-out",
                            n === i ? "opacity-100" : "opacity-0"
                        )}
                    />
                ))}

                {/* Barra de progreso del ciclo. La `key` la reinicia en cada
                    cambio, que es lo que hace que vuelva a correr de cero. */}
                <div className="absolute inset-x-3 bottom-3 h-[2px] overflow-hidden rounded-full bg-white/25">
                    <div
                        key={quieto ? "fijo" : i}
                        className="h-full w-full rounded-full bg-white"
                        style={
                            quieto
                                ? undefined
                                : { animation: `vitrinaProgreso ${VITRINA_MS}ms linear forwards` }
                        }
                    />
                </div>
            </div>

            <style jsx global>{`
                @keyframes vitrinaProgreso {
                    from { transform: translateX(-100%); }
                    to   { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

// --- Component 1: Editorial Lead-in ---
/* Tarjeta-hero del enfoque. La imagen de fondo ya trae el bodegon completo
   (fondo acanalado + telefono), asi que aqui solo va la capa de interfaz
   encima: pastilla, logo, titular, bloque de texto, CTA y firma.

   El telefono vive en el centro-izquierda de la foto, de ahi el reparto:
   columna izquierda arriba/abajo, columna derecha con el peso tipografico, y
   el centro despejado para no taparlo. */
const AboutLeadIn = () => {
    const t = useTranslations('about');

    return (
        <div className="w-full max-w-[1650px] mx-auto px-6 py-6">
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full overflow-hidden rounded-[28px] md:rounded-[44px] aspect-[16/10] md:aspect-[1.938/1]"
            >
                {/* Fondo */}
                <Image
                    src="/assets/enfoque-hero.webp"
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 1650px) 100vw, 1650px"
                    className="object-cover"
                />

                {/* Velo: la foto es roja y saturada justo donde cae el titular.
                    Sin esto el blanco no aguanta. Va mas denso a la derecha. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.30) 62%, rgba(0,0,0,0.58) 100%)",
                    }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.34) 0%, transparent 28%, transparent 66%, rgba(0,0,0,0.46) 100%)",
                    }}
                />

                {/* ---------- Capa de interfaz ---------- */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8 lg:p-12 text-white">

                    {/* Fila superior */}
                    <div className="flex items-start justify-between gap-6">
                        <span className="inline-flex items-center gap-2.5 rounded-full bg-white/12 py-2 pl-2 pr-5 backdrop-blur-md ring-1 ring-inset ring-white/20">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90">
                                <BadgeCheck className="h-4 w-4 text-black" strokeWidth={2.2} />
                            </span>
                            <span className="text-[13px] font-medium tracking-[-0.01em]">
                                {t('leadIn.role')}
                            </span>
                        </span>

                        <span className="hidden text-right text-[13px] leading-snug text-white/75 md:block">
                            Disponibles
                            <br />
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#DAFF6B]" />
                                para proyectos
                            </span>
                        </span>
                    </div>

                    {/* Pastilla del ano flotando junto al telefono, como en la
                        referencia. Posicion en % para que siga al motivo de la
                        foto al cambiar de ancho. */}
                    <span className="absolute left-[38%] top-[62%] hidden rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-black lg:block">
                        0 resultados
                    </span>

                    {/* Fila central: logo a la izquierda, titular a la derecha */}
                    <div className="flex flex-1 items-center justify-between gap-6 py-4">
                        <Image
                            src="/brand/atlas-circle.png"
                            alt="Atlas"
                            width={128}
                            height={128}
                            className="hidden h-16 w-16 rounded-full object-cover md:block lg:h-[88px] lg:w-[88px]"
                        />

                        <div className="ml-auto max-w-[52%] text-right">
                            {/* El superindice va EN FLUJO, no posicionado en absoluto.
                                Antes iba absolute con un desplazamiento en em y se
                                montaba sobre la letra; asi ocupa su propio hueco en
                                la linea y no puede solaparse con ninguna letra a
                                ningun ancho. align-super lo sube sin sacarlo del
                                flujo, y al ir dentro del text-right queda arriba a
                                la derecha de la linea 1. */}
                            {/* TituloTecnico NO compone el texto: el <h2> de
                                abajo sigue siendo el que manda en la
                                maquetacion —clamp, leading, tracking, el salto
                                de linea y el (01) volado quedan intactos— y el
                                efecto solo lee donde ha caido cada letra para
                                pintar encima. El (01) se marca con
                                data-tec-ignorar para que se quede como texto
                                normal: es otro cuerpo y otro color, y metido en
                                el juego de las rayas solo ensuciaria. Su clase
                                text-white/70 le da color propio, asi que no le
                                afecta el transparent que recibe el h2. */}
                            <TituloTecnico secuencia={["No", "apareces."]}>
                                <h2 className="font-black uppercase leading-[0.86] tracking-[-0.03em] text-[clamp(1.75rem,5.2vw,5.5rem)]">
                                    Te buscan,
                                    <span data-tec-ignorar className="ml-[0.1em] align-super text-[0.26em] font-bold tracking-[-0.01em] text-white/70">
                                        (01)
                                    </span>
                                    <br />
                                    No apareces.
                                </h2>
                            </TituloTecnico>
                        </div>
                    </div>

                    {/* Fila inferior: firma a la izquierda, texto y CTA a la derecha */}
                    <div className="flex items-end justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            {/* Misma jerarquia que el "OUT NOW / Q Industrial" de
                                la referencia: etiqueta pequena arriba, nombre
                                debajo, y la card de piezas cerrando la esquina. */}
                            <div>
                                <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-white/50">
                                    Una nota del fundador
                                </span>
                                <span className="mt-1 block font-signature text-3xl leading-none text-white lg:text-4xl">
                                    {t('leadIn.signature')}
                                </span>
                            </div>
                            <VitrinaDisenos />
                        </div>

                        <div className="max-w-[46%] text-right">
                            <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                (El problema)
                            </span>
                            <p className="mt-2 hidden text-[15px] leading-snug text-white/85 md:block lg:text-base">
                                Cada día sin presencia digital es un cliente que
                                <br className="hidden lg:block" /> compara, duda y compra en otro lado.
                            </p>

                            <Link
                                href="/contact"
                                className="group mt-5 inline-flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-black transition-transform duration-300 hover:scale-[1.03]"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                <span className="text-[12px] font-bold uppercase tracking-[0.12em] lg:text-[13px]">
                                    Quiero aparecer
                                </span>
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

/* Encabezado de precios: una sola palabra, grande y pegada a la izquierda,
   que se disuelve hacia abajo y a la que la primera card se le monta encima.

   El relleno NO es un color plano atenuado: va de un gris medio arriba hasta
   el negro exacto de la pagina abajo (background-clip: text) y encima lleva
   una mascara que apaga la opacidad. Las dos capas juntas son lo que hace que
   la palabra se hunda en el fondo en vez de quedar recortada — mismo criterio
   que la palabra "Testimonios".

   useInView y no whileInView: con el scroll suave de Lenis de este proyecto,
   whileInView no llega a dispararse de forma fiable. */

/* Espejo exacto de la palabra "Testimonios".

   Lo que hace que aquello funcione no es la curva sino el CONTRASTE: alli
   la palabra (#B6B6B6) esta a solo 46 niveles de su fondo (#E4E4E4), un
   1.59:1 — un fantasma. Aqui se arrancaba en #C8C8C8 sobre negro: 200
   niveles, 12.55:1, ocho veces mas fuerte. Por eso se leia como un gris
   intenso con un corte, y no como una palabra que se disuelve.

   Se replican sus mismos saltos (7, 12, 17 y 10 niveles) partiendo del
   negro, escalados a 58 niveles: 1.85:1. Un punto por encima del 1.55:1
   del espejo exacto — lo justo para que no se vea apagado y para que el
   recorrido del degradado se aprecie, sin dejar de ser un fantasma.
   La ultima parada es el negro exacto de la pagina. */
/* La seccion "CONSTRUIMOS / presencia digital." (AuditFunnel) y la
   CapsulaTitular que iba en su titular se retiraron del front el
   2026-09-24. El codigo esta guardado entero en _archivo/AuditFunnel.tsx,
   con las instrucciones para volver a montarla. */

const PRECIOS_FILL =
    "linear-gradient(to bottom, #3A3A3A 0%, #313131 34%, #222222 58%, #0D0D0D 80%, #000000 100%)";
/* Como la de Testimonios, con el apagado 4 puntos mas tarde: asi se ve mas
   recorrido del relleno antes de que la opacidad se lo coma. */
const PRECIOS_MASK =
    "linear-gradient(to bottom, #000 0%, #000 62%, rgba(0,0,0,0.62) 81%, transparent 97%)";

const PreciosHeading = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div
            ref={ref}
            /* El margen inferior negativo es lo que deja que la primera card
               del stack pase por encima del pie de la palabra. */
            className="relative z-0 w-full max-w-[1700px] mx-auto px-6 md:px-10 mt-24 md:mt-32"
        >
            {/* Sustituye al rotulo "Nuestros planes" en monoespaciada. Mantiene
                su misma entrada para no tocar el escalonado de la cabecera. */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-5"
            >
                <EtiquetaSeccion codigo="Atlas® — Planes" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 26 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Precios"
                className="-mb-[0.2em] select-none font-black leading-[0.9] tracking-[-0.045em] text-[16vw] sm:text-[clamp(4rem,13.5vw,15rem)]"
                style={{
                    backgroundImage: PRECIOS_FILL,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitMaskImage: PRECIOS_MASK,
                    maskImage: PRECIOS_MASK,
                }}
            >
                Precios.
            </motion.h2>
        </div>
    );
};

// --- Tech Stack Logos (from portfolio.ts project data) ---
const TECH_LOGOS = [
    { name: "Python", slug: "python" },
    { name: "TensorFlow", slug: "tensorflow" },
    { name: "Next.js", slug: "nextdotjs" },
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Docker", slug: "docker" },
    { name: "FastAPI", slug: "fastapi" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "LangChain", slug: "langchain" },
    { name: "Firebase", slug: "firebase" },
    { name: "Spring Boot", slug: "springboot" },
    { name: "Solidity", slug: "solidity" },
    { name: "Go", slug: "go" },
    { name: "Prisma", slug: "prisma" },
    { name: "Flask", slug: "flask" },
];

// --- Component 2: Core Engineering Panel ---
// --- Component 1: Core Engineering Panel (Stats) ---
const CoreEngineeringPanel = ({ scrollYProgress }: { scrollYProgress: any }) => {
    // Panel 1 exits between 0.45 and 0.65
    const opacity = useTransform(scrollYProgress, [0.45, 0.6], [1, 0]);
    const scale = useTransform(scrollYProgress, [0.45, 0.6], [1, 0.9]);
    const blur = useTransform(scrollYProgress, [0.45, 0.6], [0, 10]);

    return (
        <div className="w-screen h-full flex items-center justify-center bg-background transition-colors duration-500 overflow-hidden">
            <motion.div
                style={{
                    opacity,
                    scale,
                    filter: `blur(${blur}px)`,
                    willChange: "transform, opacity, filter",
                }}
                className="w-full h-full flex items-center justify-center"
            >
                <Testimonial1 />
            </motion.div>
        </div>
    );
};

// EmergingResearchPanel removed as per user request


// --- Component 3: Profile Intersection ---
// Optimized ProfilePanel (Restored to Original Design with Cinematic Transitions)
// ProfilePanel removed and replaced by IdentitySequence component


// --- Unified Typography-Focused Card for Bitwise Symmetry ---
const ClosingCard = ({ title, subtitle, desc, index, direction }: { title: string, subtitle: string, desc: string, index: number, direction: 'left' | 'right' }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`group relative h-[50vh] flex flex-col justify-center ${direction === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
    >
        <div className={`flex flex-col gap-6 relative z-10 w-full px-4 ${direction === 'right' ? 'items-end' : 'items-start'}`}>
            {/* Minimalist Index & Role Indicator */}
            <div className={`flex items-center gap-6 w-full ${direction === 'left' ? 'flex-row-reverse' : ''}`}>
                <span className="text-xl md:text-2xl font-serif-elegant italic text-muted-foreground/30 group-hover:text-primary transition-colors duration-500">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <div className="h-px bg-foreground/10 flex-1 group-hover:bg-primary/30 transition-colors duration-500" />
                <span className="text-[11px] md:text-[13px] font-mono uppercase tracking-[0.3em] text-primary/80 font-semibold group-hover:tracking-[0.4em] transition-all duration-700">
                    {subtitle}
                </span>
            </div>

            {/* Title with subtle hover shift */}
            <h4 className={`text-4xl md:text-5xl lg:text-[64px] font-black text-foreground tracking-tighter leading-[1.1] transition-all duration-500 ${direction === 'right' ? 'group-hover:pr-4 origin-right' : 'group-hover:pl-4 origin-left'}`}>
                {title}
            </h4>

            {/* Description fading in slightly on hover */}
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-muted-foreground/60 leading-relaxed max-w-[85%] font-medium mt-4 group-hover:text-foreground/90 transition-colors duration-500 line-clamp-3">
                {desc}
            </p>
        </div>
    </motion.div>
);

const ViewMoreCard = ({ href, title }: { href: string, title: string }) => {
    const t = useTranslations('about');
    return (
        <Link href={href} className="group block h-[50vh] flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative flex flex-col items-center justify-center gap-10"
            >
                {/* Minimalist circular arrow */}
                <div className="w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-700 ease-out">
                    <ArrowRight className="w-10 h-10 text-primary group-hover:text-primary-foreground group-hover:translate-x-2 transition-all duration-500" />
                </div>

                <div className="text-center space-y-4">
                    <p className="text-[12px] md:text-[14px] font-mono uppercase tracking-[0.4em] text-muted-foreground group-hover:text-primary transition-colors">{t('closing.discoverMore')}</p>
                    <h4 className="text-4xl lg:text-5xl font-black text-foreground/80 group-hover:text-foreground transition-all">{title}</h4>
                </div>
            </motion.div>
        </Link>
    );
};

const GhostedHeader = ({ label, part1, part2, direction = "left" }: { label: string, part1: string, part2: string, direction?: "left" | "right" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`space-y-3 mb-16 h-32 flex flex-col justify-end ${direction === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
    >
        <div className={`flex items-center gap-4 ${direction === 'right' ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-px bg-primary/50" />
            <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] text-primary/80 font-bold">
                {label}
            </span>
        </div>
        <h3 className={`text-4xl md:text-5xl lg:text-5xl xl:text-[54px] font-black uppercase tracking-tighter leading-none flex items-center gap-x-3 gap-y-1 ${direction === 'right' ? 'flex-row-reverse flex-wrap-reverse justify-start' : 'flex-wrap'}`}>
            <span className="text-foreground drop-shadow-sm">{part1}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/20 to-transparent dark:from-white/20 dark:to-transparent">{part2}</span>
        </h3>
    </motion.div>
);




// --- Component 5: Audit Funnel ---
const ScrollHijackSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, mass: 0.5 });
    const [isComp2Visible, setIsComp2Visible] = React.useState(false);
    const [showBorder, setShowBorder] = React.useState(true);

    // Hooks moved to top level to avoid React Hook Rules violations
    const borderOpacity = useTransform(smoothProgress, [0.1, 0.15], [1, 0]);
    const xShift = useTransform(smoothProgress, [0, 0.1, 0.4, 1], ["0vw", "0vw", "-100vw", "-100vw"]);

    useMotionValueEvent(smoothProgress, "change", (v: any) => {
        // Hard toggle for the decorative border to ensure it's GONE
        if (v >= 0.20 && showBorder) setShowBorder(false);
        if (v < 0.15 && !showBorder) setShowBorder(true);

        // Trigger precisely as the second panel begins to enter the viewport
        if (v >= 0.30 && !isComp2Visible) setIsComp2Visible(true);
        if (v < 0.25 && isComp2Visible) setIsComp2Visible(false);
    });

    const { scrollYProgress: exitProgressRaw } = useScroll({
        target: sectionRef,
        offset: ["end end", "end start"]
    });

    // Apply a spring physics wrapper to make the scale/fade exit incredibly buttery smooth
    const exitProgress = useSpring(exitProgressRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });



    const exitScale = useTransform(exitProgress, [0, 1], [1, 0.85]);
    const exitOpacity = useTransform(exitProgress, [0, 1], [1, 0]); // Changed to 1 to ensure full fade out
    const exitBorderRadius = useTransform(exitProgress, [0, 1], ["0px", "40px"]);

    return (
        <div ref={sectionRef} className="relative h-[600vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
                <motion.div
                    style={{ scale: exitScale, opacity: exitOpacity, borderRadius: exitBorderRadius }}
                    className="w-full h-full relative origin-center"
                >
                    {/* Decorative curved edges with hard unmount for guaranteed removal */}
                    <AnimatePresence>
                        {showBorder && (
                            <motion.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                                style={{
                                    opacity: borderOpacity,
                                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                                }}
                                className="absolute top-0 left-0 right-0 h-48 border-t-2 border-x-2 border-neutral-200 dark:border-zinc-800 rounded-t-[50px] md:rounded-t-[80px] pointer-events-none z-[100]"
                            />
                        )}
                    </AnimatePresence>
                    <motion.div
                        className="flex h-full"
                        style={{
                            width: "200vw",
                            x: xShift
                        }}
                    >
                        <div className="h-full w-screen flex-shrink-0">
                            <CoreEngineeringPanel scrollYProgress={smoothProgress} />
                        </div>
                        <div className="h-full w-screen flex-shrink-0">
                            <IdentitySequence isVisible={isComp2Visible} scrollYProgress={smoothProgress} />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default function AboutSection() {
    console.log('SHOWCASE MEMBERS:', showcaseMembers.map(m => m.id));
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // REALIGNED TIMING: Parent is ~900vh long. The first 100vh delay = ~11% (0.11) of total scroll.
    const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.92]);
    const opacity = useTransform(scrollYProgress, [0.03, 0.12], [1, 0]);
    const yLeadIn = useTransform(scrollYProgress, [0, 0.12], [0, -80]);

    const leadInTriggerRef = useRef(null);

    return (
        <section
            id="about"
            ref={containerRef}
            className="relative bg-background text-foreground dark:bg-black dark:text-white transition-colors duration-500"
        >
            {/* 1. STICKY PLANE - Lead-in */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center z-0 overflow-hidden pointer-events-none">
                <motion.div
                    style={{ scale, opacity, y: yLeadIn }}
                    className="relative px-4 md:px-6 w-full max-w-[1700px] mx-auto"
                    ref={leadInTriggerRef}
                >
                    <AboutLeadIn />
                </motion.div>
            </div>

            {/* 2. OVERLAY LAYER - Hijack Zone & Footer */}
            <div className="relative pointer-events-none mt-[20vh] md:mt-[20vh]">
                {/* Content wrapper with background - rounded corners removed to allow animated border to control the shape */}
                <div className="bg-background dark:bg-black transition-colors duration-500 pointer-events-auto relative">

                    <ScrollHijackSection />
                    <ScrollAdventure />
                    <ArgentLoopInfiniteSlider />
                    {/* Seamless solid background section overlapping the slider's dead space */}
                    <div className="-mt-[50vh] flex flex-col items-center w-full bg-background relative z-20 pt-32 pb-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full flex flex-col items-center max-w-[1700px] px-4 md:px-6"
                        >
                            <div className="mb-6 md:mb-10 text-center space-y-4">
                            </div>
                            <div className="w-full pb-0">
                                <HorizontalTimeline data={showcaseMembers.map((member) => ({
                                    title: member.id === 'view-more' ? 'Ver todo el proceso' : (member.role || member.name),
                                    isEnd: member.id === 'view-more',
                                    period: 'period' in member ? member.period : undefined,
                                    content: member.id === 'view-more' ? (
                                        <Link
                                            href={member.social?.website || '/skills'}
                                            className="relative flex items-center h-[140px] w-[250px] z-30"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                                    <ArrowUpRight className="w-8 h-8 text-neutral-600 dark:text-neutral-400 transition-all duration-500 group-hover:text-primary-foreground group-hover:rotate-45 group-hover:scale-110" />
                                                </div>
                                                <span className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap drop-shadow-sm">
                                                    Ver más
                                                </span>
                                            </div>
                                        </Link>
                                    ) : (
                                        /* Tarjeta del paso. Estructura tomada de
                                           la referencia: cabecera clara con el
                                           numero en un bloque de acento y el
                                           nombre del paso, y debajo el cuerpo
                                           oscuro con imagen y texto.

                                           TODO CUADRADO, sin una sola esquina
                                           redondeada: es lo que la separa del
                                           resto de la pagina —que va de radios
                                           generosos— y lo que le da el aire de
                                           ficha tecnica que pedia la referencia.

                                           Sigue siendo vidrio liquido por detras.
                                           El brillo del backdrop no es capricho:
                                           detras hay una montana casi negra, y sin
                                           levantar un punto los negros el panel no
                                           devuelve nada y parece un recorte. */
                                        <div className="relative mt-4 w-[300px] overflow-hidden border border-neutral-200/60 bg-white/40 shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur-[48px] backdrop-saturate-[1.7] backdrop-brightness-[1.15] md:w-[370px] dark:border-white/[0.11] dark:bg-white/[0.04] dark:shadow-[0_22px_50px_rgba(0,0,0,0.55)]">
                                            {/* Filo especular arriba y canto en
                                                sombra abajo: juntos son el bisel. */}
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/55"
                                            />
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-black/20 dark:bg-black/40"
                                            />

                                            {/* ── Cabecera ── */}
                                            <div className="relative flex items-stretch border-b border-black/10 bg-white dark:border-white/10">
                                                {/* Aqui iba el numero del paso, y
                                                    sobraba: el circulo de la linea ya
                                                    lo lleva y se queda encendido
                                                    mientras la tarjeta esta abierta.
                                                    Distinto es el TITULO, que si se
                                                    desvanece de la linea cuando la
                                                    tarjeta aparece —eso es un relevo,
                                                    no una repeticion— y por eso se
                                                    queda en la cabecera.

                                                    Tampoco lo sustitui por el plazo:
                                                    tambien lo muestra la pildora
                                                    flotante al abrirse, asi que habria
                                                    cambiado un dato repetido por otro.

                                                    Como no faltaba informacion, el rojo
                                                    deja de rotular y pasa a ser
                                                    estructura: un filete a sangre en el
                                                    canto izquierdo. Sigue anclando la
                                                    cabecera y marcando el paso, sin
                                                    decir nada que ya este dicho. */}
                                                <span
                                                    aria-hidden="true"
                                                    className="w-[5px] shrink-0"
                                                    style={{ background: "var(--hero-accent, #E11D3A)" }}
                                                />
                                                <span className="flex min-w-0 flex-1 items-center truncate px-4 py-3 font-sans text-[12.5px] font-black uppercase leading-none tracking-[0.05em] text-neutral-900">
                                                    {member.role}
                                                </span>
                                                {/* Los mismos galones que firman las
                                                    etiquetas de seccion. Decorativos:
                                                    atan la ficha al resto de la pagina
                                                    sin fingir que son un boton. */}
                                                <svg width="34" height="9" viewBox="0 0 52 13" aria-hidden="true" className="mr-3.5 self-center shrink-0">
                                                    <path d="M0 0 L7 0 L12 6.5 L7 13 L0 13 Z" fill="var(--hero-accent, #E11D3A)" opacity="0.25" />
                                                    <path d="M11 0 L18 0 L23 6.5 L18 13 L11 13 Z" fill="var(--hero-accent, #E11D3A)" opacity="0.4" />
                                                    <path d="M22 0 L29 0 L34 6.5 L29 13 L22 13 Z" fill="var(--hero-accent, #E11D3A)" opacity="0.55" />
                                                    <path d="M33 0 L40 0 L45 6.5 L40 13 L33 13 Z" fill="var(--hero-accent, #E11D3A)" opacity="0.7" />
                                                </svg>
                                            </div>

                                            {/* ── Imagen ── */}
                                            <div className="relative h-[88px] w-full overflow-hidden border-b border-black/10 dark:border-white/10">
                                                <img
                                                    src={member.image}
                                                    alt=""
                                                    className="h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                                                />
                                            </div>

                                            {/* ── Cuerpo ── */}
                                            <div className="relative p-4">
                                                <h4 className="text-[15px] font-bold leading-tight tracking-[-0.01em] text-neutral-900 dark:text-white">
                                                    {member.name}
                                                </h4>
                                                {'description' in member && member.description && (
                                                    <p className="mt-1.5 text-[12.5px] leading-[1.5] text-neutral-600 dark:text-white/60">
                                                        {member.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }))} />
                            </div>
                        </motion.div>

                        {/* Preguntas (ocupa el sitio de la seccion de
                            certificaciones, que se retiro entera) y Precios,
                            que sube por encima como una lamina con parallax. */}
                        <PasoAPrecios
                            preguntas={<AtlasFAQ />}
                            precios={<>
                                {/* Encabezado de la seccion de planes */}
                                <PreciosHeading />

                                {/* Stacking Card Showcases. z-10 para montarse sobre
                                    el pie de la palabra "Precios." */}
                                <div className="relative z-10 -mt-[9vh]">
                                <ShowcaseStack>
                                    <div className="w-full">
                                        <PlanCatalogo />
                                    </div>
                                    <div className="w-full">
                                        <GitHubShowcase />
                                    </div>
                                    <div className="w-full">
                                        <KaggleShowcase />
                                    </div>
                                    <div className="w-full">
                                        <WakaTimeShowcase />
                                    </div>
                                </ShowcaseStack>
                                </div>

                                {/* Nota legal de los planes */}
                                <p className="w-full max-w-[1700px] mx-auto px-6 mt-4 text-xs text-black/40 dark:text-white/30 leading-relaxed">
                                    Precios referenciales en soles. El monto final depende del alcance, las integraciones y el contenido de cada proyecto.
                                </p>
                            </>}
                        />
                    </div>
                </div>
            </div>
        </section >
    );
};

