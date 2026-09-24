"use client";

import React, { useRef } from "react";
import { motion, useTransform, useSpring, easeOut, easeInOut, circOut } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { portfolioData } from "@/data/portfolio";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { BrandScroller, BrandScrollerReverse } from "@/components/ui/brand-scroller";
import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";
import { DiscoSeda } from "@/components/ui/silk-disc";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import MagneticEffect from "@/components/ui/MagneticEffect";

interface IdentitySequenceProps {
    scrollYProgress: any; // Parent scroll progress [0, 1]
    isVisible: boolean;
}

/* Muestrario de Atlas para el panel grande. Deliberadamente NO usa
   portfolioData.personal.avatar: ese dato lo comparten la ProfileCard y el
   carne 3D de /contact, donde un mosaico se veria ilegible. */
const PANEL_IMAGE = "/about/atlas-mosaico-2.webp";

/* Fondo de la tarjeta de contacto: el limbo de un planeta con el arco de
   luz naranja. Del frame original (3840x2152) solo se guarda la banda que
   contiene el arco y a 1800px de ancho; la tarjeta es casi 9:1 y con el
   frame entero se descargaria cinco veces mas pixel del que llega a verse.
   Pesa 7,8 kB porque es todo degradado suave, que es lo que mejor comprime
   webp.

   El original tiraba a naranja. El viraje a rojo esta horneado en el asset
   (ffmpeg colorchannelmixer=gg=0.58:bb=0.66) y no aplicado por CSS: bajar
   el canal verde convierte el naranja en rojo conservando la luminosidad,
   mientras que un hue-rotate, que seria lo evidente, se lleva el arco al
   magenta (probado a -14 y a -20 grados). Ademas asi no hay filtro en
   tiempo de ejecucion ni contexto de apilamiento extra. */
const FOTO_CTA = "/brand/cta-arco.webp";

/* Velo sobre la foto. No es un oscurecido plano: cierra en los dos extremos
   (a la izquierda vive la identidad, a la derecha los botones) y se abre en
   la franja central, que es justo por donde cruza el arco. Asi el texto
   blanco mantiene contraste sin tener que apagar la imagen entera. */
const VELO_CTA =
    "linear-gradient(90deg, rgba(8,3,2,0.88) 0%, rgba(8,3,2,0.74) 34%, " +
    "rgba(8,3,2,0.26) 58%, rgba(8,3,2,0.58) 82%, rgba(8,3,2,0.80) 100%)";

/* Las dos verticales de la retícula, a los tercios. Van como componente y
   no como una sola capa a lo alto del bloque porque tienen que cortarse
   justo en la banda de la cinta: se montan fila por fila, y la fila de los
   logos simplemente no la lleva. El hueco resultante es lo que deja pasar
   los logos limpios, y las dos reglas horizontales de esa banda son las que
   lo rematan para que se lea intencionado y no como un fallo. */
function GuiasVerticales() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute inset-y-0 left-1/3 w-px bg-black/[0.08] dark:bg-white/[0.07]" />
            <span className="absolute inset-y-0 left-2/3 w-px bg-black/[0.08] dark:bg-white/[0.07]" />
        </div>
    );
}

export const IdentitySequence = ({ scrollYProgress, isVisible }: IdentitySequenceProps) => {
    const t = useTranslations("about");
    const [isHovered, setIsHovered] = React.useState(false);

    // Map the parent's scroll progress (0.4 to 0.85) to local progress (0 to 1).
    // This leaves 0.85 to 1.0 (approx 90vh) as a "pause" where the user can just read the Tech Stack before it scrolls away.
    const localProgress = useTransform(scrollYProgress, [0.4, 0.85], [0, 1]);

    // 1. Card Transformation (Entrance & Scaling)
    const cardScale = useTransform(localProgress, [0, 0.4], [0.8, 1], { ease: easeInOut });
    const cardY = useTransform(localProgress, [0, 0.4], ["60vh", "0vh"], { ease: easeInOut });
    const cardBorderRadius = useTransform(localProgress, [0.1, 0.4], ["60px", "0px"], { ease: easeInOut });

    // 2. Internal Content Scroll
    const contentY = useTransform(localProgress, [0.35, 1], ["0%", "-70%"], { ease: easeInOut });

    // 3. Elements specific animations
    const phase0Opacity = useTransform(localProgress, [0, 0.15], [1, 0]);
    const cardContentOpacity = useTransform(localProgress, [0.1, 0.3], [0, 1]);
    const textOpacity = useTransform(localProgress, [0.85, 1], [0, 1]);

    // 4. Background Color Transition (Smoothing the exit)
    const cardBg = useTransform(
        localProgress,
        [0.8, 1],
        ["#EBEBEB", "#FFFFFF"]
    );
    const cardBgDark = useTransform(
        localProgress,
        [0.8, 1],
        ["#18181b", "#000000"]
    );

    const { resolvedTheme } = useTheme();
    const cardBgValue = resolvedTheme === 'dark' ? cardBgDark : cardBg;

    // Dynamic vault frame gradients that always match the card's transitioning background
    const vaultGradientDown = useTransform(cardBgValue, (color: string) => {
        const hex = color.replace('#', '');
        return `linear-gradient(to bottom, #${hex}, #${hex}00)`;
    });
    const vaultGradientUp = useTransform(cardBgValue, (color: string) => {
        const hex = color.replace('#', '');
        return `linear-gradient(to top, #${hex}, #${hex}00)`;
    });

    // Servicios de Atlas. Cada palabra va seguida del mismo grafico (rombo sobre
    // circulo lima) que ya usaba la seccion como separador.
    const marqueeWords = [
        "Web Design",
        "Landing Pages",
        "Apps",
        "Software a Medida",
        "E-commerce",
    ];

    const marqueeItems = marqueeWords.flatMap((word, i) => [
        <span key={`word-${i}`} className="text-[10rem] md:text-[16rem] font-black uppercase tracking-tighter mx-12 text-black dark:text-white leading-none whitespace-nowrap">
            {word}
        </span>,
        /* Disco con el shader Silk dentro. Antes llevaba un degradado diagonal
           rojo pintado a mano; ahora el relleno es el mismo tejido que la card
           de Testimonios, con una receta propia que mete el rojo de marca en
           la paleta. El degradado de reserva se queda como background del
           contenedor: si WebGL no arranca, el disco no se ve negro.
           El aro de luz, la sombra interior y el rombo siguen por encima del
           canvas, que es lo que le mantiene el volumen. */
        <div
            key={`icon-${i}`}
            className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 overflow-hidden rounded-full flex items-center justify-center mx-12"
            style={{
                background:
                    "linear-gradient(145deg, #FF7063 0%, #EE3A2E 44%, #B5110A 100%)",
                boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -18px 38px rgba(0,0,0,0.16), 0 0 38px rgba(238,58,46,0.20)",
            }}
        >
            <DiscoSeda className="absolute inset-0 h-full w-full" />
            <span aria-hidden="true" className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
            <svg viewBox="0 0 100 100" className="relative w-20 h-20 md:w-32 md:h-32 fill-[#26060B]">
                <path d="M50 0 C60 30 100 40 100 50 C100 60 60 70 50 100 C40 70 0 60 0 50 C0 40 40 30 50 0" />
            </svg>
        </div>,
    ]);

    return (
        <div className="relative w-screen h-full flex flex-col items-center justify-center overflow-hidden bg-background dark:bg-black">
            {/* Phase 0: The Lead-in UI (Visible before card scales) */}
            <motion.div
                style={{ opacity: phase0Opacity }}
                className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none -translate-y-12"
            >
                {/* Center Unified Action - Magnetic Group */}
                <div className="mb-16 pointer-events-auto">
                    <MagneticEffect>
                        <div className="group flex items-center gap-2 cursor-pointer">
                            <div className="relative px-10 py-5 rounded-full bg-black dark:bg-white group-hover:bg-[#c1e44a] dark:group-hover:bg-[#c1e44a] overflow-hidden transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(193,228,74,0.3)]">
                                <div className="relative z-10 h-7 overflow-hidden">
                                    <div className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2">
                                        <span className="text-white dark:text-black group-hover:text-black font-bold text-xl leading-7 transition-colors duration-500">
                                            {t("leadIn.aboutMe")}
                                        </span>
                                        <span className="text-black font-bold text-xl leading-7 transition-colors duration-500">
                                            {t("leadIn.aboutMe")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-16 h-16 rounded-full bg-black dark:bg-white group-hover:bg-[#c1e44a] dark:group-hover:bg-[#c1e44a] overflow-hidden flex items-center justify-center transition-all duration-500 shadow-lg">
                                <div className="relative z-10 h-8 overflow-hidden">
                                    <div className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2">
                                        <ArrowUpRight className="w-8 h-8 text-white dark:text-black group-hover:text-black transition-colors duration-500" />
                                        <ArrowUpRight className="w-8 h-8 text-black transition-colors duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MagneticEffect>
                </div>

                {/* Unified Bottom Labels Layer */}
                <div className="w-full max-w-[1200px] flex items-center justify-between px-12">
                    <div className="flex items-center gap-3 text-zinc-500 dark:text-white/60 text-sm font-medium tracking-tight">
                        <motion.span
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-4 h-4 flex items-center justify-center"
                        >
                            ↓
                        </motion.span>
                        <span>{t("leadIn.scroll")}</span>
                    </div>

                    <div className="text-zinc-500 dark:text-white/60 text-sm font-medium tracking-tight">
                        {t("leadIn.shortStory")}
                    </div>
                </div>
            </motion.div>

            {/* The Main Card Container */}
            <motion.div
                style={{
                    scale: cardScale,
                    y: cardY,
                    borderRadius: cardBorderRadius,
                    backgroundColor: cardBgValue,
                    willChange: "transform, background-color",
                }}
                className="relative w-full h-full flex flex-col overflow-hidden origin-bottom z-10"
            >
                {/* Unified Scrolling Content Wrapper */}
                <motion.div
                    style={{ y: contentY }}
                    className="relative w-full flex flex-col items-center"
                >
                    {/* Phase 1: Marquee Header (Top of the long card) */}
                    <div className="w-full h-screen flex items-center justify-center flex-shrink-0">
                        <motion.div style={{ opacity: cardContentOpacity }} className="w-full">
                            <InfiniteMarquee
                                items={marqueeItems}
                                speed={42}
                                className="w-full"
                                itemClassName="py-12"
                            />
                        </motion.div>
                    </div>

                    {/* Phase 2: The Large Portrait (The "Explore" area) */}
                    <div className="relative w-full h-[100vh] flex flex-col items-center flex-shrink-0 px-4 md:px-10 lg:px-20">
                        {/* Sizing wrapper - not clipped */}
                        <div
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="relative w-full h-full max-w-[1500px] group/photo cursor-pointer"
                        >
                            {/* Image area - THIS is what clips. Vault frame is OUTSIDE this. */}
                            <div className="absolute inset-0 overflow-hidden">
                                <motion.div
                                    // Sin `scale: photoScale`: el panel muestra el mosaico
                                    // entero, y cualquier zoom lo recortaria.
                                    animate={{
                                        filter: isHovered ? "grayscale(0%) contrast(1)" : "grayscale(100%) contrast(1.1)",
                                    }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="relative w-full h-full"
                                >
                                    <div className="absolute inset-0">
                                        {/* Antes este envoltorio medía 130vh y sobresalía 50px
                                            por lado para dar juego al parallax. Ahora calca el
                                            panel: el mosaico se ve entero, sin recorte. */}
                                        <div className="absolute inset-0">
                                            <div className="relative h-full w-full">
                                                <Image
                                                    src={PANEL_IMAGE}
                                                    alt="Muestrario de sitios disenados por Atlas"
                                                    fill
                                                    // object-contain y no object-cover: el mosaico
                                                    // entra completo aunque sobre algo de alto.
                                                    className="object-contain object-center grayscale-0"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Vault frame - OUTSIDE overflow-hidden, extends 1px beyond clip edge to cover it */}
                            <div className="absolute inset-0 pointer-events-none z-20">
                                {/* Top bar: -top-px + h-[52px] covers the clip edge by 1px */}
                                <motion.div style={{ backgroundColor: cardBgValue }} className="absolute -top-px left-0 w-full h-[52px]" />
                                <motion.div style={{ background: vaultGradientDown }} className="absolute top-[50px] left-0 w-full h-32" />
                                
                                {/* Bottom bar: -bottom-px + h-[52px] covers the clip edge by 1px */}
                                <motion.div style={{ backgroundColor: cardBgValue }} className="absolute -bottom-px left-0 w-full h-[52px]" />
                                <motion.div style={{ background: vaultGradientUp }} className="absolute bottom-[50px] left-0 w-full h-32" />
                            </div>
                        </div>
                    </div>

                    {/* Phase 3: Final Layout Text */}
                    {/* Phase 4: Tech Stack & Tools Scrollers */}
                    <motion.div
                        style={{ opacity: textOpacity }}
                        className="relative w-full max-w-[1700px] mx-auto py-20 flex flex-col flex-shrink-0"
                    >
                        <div className="relative px-8 md:px-16 lg:px-24 pb-7">
                            <GuiasVerticales />
                            <EtiquetaSeccion codigo="Atlas® — Stack" texto="Tecnología que usamos" />
                        </div>

                        {/* Las dos cintas, la misma lista de logos corriendo en
                            sentidos opuestos. Es la unica fila SIN verticales:
                            ese hueco es el que deja correr los logos, y las dos
                            horizontales son las que lo cierran por arriba y por
                            abajo. Como el hueco de las guias se genera por no
                            pintarlas en esta fila, crece solo al meter la
                            segunda cinta. */}
                        <div className="relative flex flex-col gap-2 border-y border-black/[0.08] dark:border-white/[0.07] py-7">
                            <BrandScroller />
                            <BrandScrollerReverse />
                        </div>

                        {/* CTA: tarjeta de contacto */}
                        <div className="relative px-8 md:px-16 lg:px-24 pt-14">
                            <GuiasVerticales />
                            {/* isolate para que las dos capas de fondo con
                                -z-10 se queden dentro de la tarjeta en vez de
                                colarse por debajo de la seccion. El fondo no
                                tiene variante de tema: la tarjeta es oscura
                                en claro y en oscuro, asi que su texto es
                                blanco fijo y no text-zinc-900. */}
                            {/* max-w y centrada: a todo el ancho del bloque la
                                tarjeta se estiraba demasiado y el arco de la foto
                                quedaba como una raya perdida en el medio. */}
                            <div className="relative isolate mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black px-8 py-7 md:px-10 lg:flex-row lg:gap-10">
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 -z-10 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${FOTO_CTA})` }}
                                />
                                <span aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: VELO_CTA }} />

                                {/* Identidad */}
                                <div className="flex items-center gap-4 shrink-0">
                                    {/* El avatar va limpio: el badge de LinkedIn
                                        que llevaba encima no era enlace ni hacia
                                        nada, solo rompia el circulo. */}
                                    <Image
                                        src="/brand/atlas-circle.png"
                                        alt="Atlas"
                                        width={128}
                                        height={128}
                                        className="w-14 h-14 rounded-full object-cover shrink-0"
                                    />
                                    <div className="leading-tight">
                                        <p className="text-[15px] font-semibold text-white whitespace-nowrap">Harley</p>
                                        <p className="text-[13px] text-white/55 whitespace-nowrap">Fundador de Atlas</p>
                                    </div>
                                </div>

                                {/* Cita del fundador. Las comillas van como capa
                                    aparte y no dentro del parrafo: asi no empujan
                                    la primera linea ni cuentan para el ancho, y
                                    pueden salirse por arriba del bloque, que es lo
                                    que las hace flotar. aria-hidden porque el
                                    lector de pantalla ya lee la cita.

                                    Son huecas, como en la referencia: relleno
                                    transparente y el dibujo lo hace el contorno
                                    del propio glifo (-webkit-text-stroke). Dibujarlas
                                    en SVG habria sido adivinar la forma; asi salen
                                    del tipo que ya usa la pagina y calzan solas.

                                    El texto en gris y no en blanco: la voz de
                                    Harley no compite con el boton, lo acompana. */}
                                <div className="relative flex-1">
                                    <span
                                        aria-hidden="true"
                                        className="font-display pointer-events-none absolute -left-1.5 -top-7 select-none text-[62px] font-bold leading-none"
                                        style={{
                                            color: "transparent",
                                            WebkitTextStroke: "1.5px rgba(255,255,255,0.28)",
                                        }}
                                    >
                                        &ldquo;
                                    </span>
                                    {/* Partida asi y no por el punto original: con
                                        "Aumenta tus ingresos." arriba, la segunda
                                        frase no cabia en una linea y dejaba
                                        "medida." huerfana abajo. Repartido por la
                                        mitad, cada frase ocupa su renglon. */}
                                    <p className="font-serif-elegant relative text-[16px] italic leading-[1.5] tracking-tight text-white/80 text-center md:text-[19px] lg:text-left">
                                        Aumenta tus ingresos y saca el máximo a tu inversión.
                                        <br />
                                        Diseño y desarrollo a medida.
                                    </p>
                                </div>

                                {/* Llamada a la accion. Una sola pieza en vez de
                                    la gota roja mas la pastilla de vidrio: una
                                    barra recta, transparente, que se rellena de
                                    blanco al pasar el cursor.
                                    Cantos rectos a proposito dentro de una
                                    tarjeta de esquinas muy redondeadas: es el
                                    contraste el que la hace leer como boton y no
                                    como otra pastilla mas. */}
                                <Link
                                    href="/contact"
                                    className="group relative flex w-full shrink-0 items-center justify-center overflow-hidden border border-white/30 px-7 py-4 transition-colors duration-500 hover:border-white lg:w-[280px]"
                                >
                                    {/* El blanco no aparece: barre. Es un scaleX
                                        anclado a la izquierda, que se compone en GPU
                                        y no repinta, al contrario que animar el
                                        background-color. La curva es la misma de
                                        entrada suave que usa el resto de la pagina,
                                        y medio segundo para que se vea el gesto. */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                                    />
                                    {/* El rotulo rueda: el de arriba sube y sale, y
                                        una copia entra por abajo. Dos copias del
                                        mismo texto dentro de una caja recortada, las
                                        dos moviendose a la vez, que es lo que hace
                                        que se lea como un cilindro girando y no como
                                        un texto que se va y otro que llega. */}
                                    <span className="relative block overflow-hidden text-[12.5px] font-bold uppercase leading-none tracking-[0.09em]">
                                        <span className="block text-white transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[140%] group-hover:text-black">
                                            Reservar una llamada
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 block translate-y-[140%] text-white transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:text-black"
                                        >
                                            Reservar una llamada
                                        </span>
                                    </span>
                                    {/* El mas crece en vez de girar: un signo de mas
                                        tiene simetria de cuatro ordenes, asi que
                                        cualquier rotacion de 90 grados no se ve. */}
                                    <Plus
                                        aria-hidden="true"
                                        strokeWidth={1.25}
                                        className="absolute right-5 h-[18px] w-[18px] text-white transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.35] group-hover:text-black"
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Marcas de encuadre en los cruces de la rejilla, como
                            en el hero. Cierran el bloque por abajo y son lo que
                            hace que las dos verticales se lean como retícula y
                            no como dos lineas sueltas. */}
                        <div aria-hidden="true" className="pointer-events-none relative mt-14 h-px w-full bg-black/[0.08] dark:bg-white/[0.07]">
                            {["0%", "33.333%", "66.666%", "100%"].map((x) => (
                                <span
                                    key={x}
                                    className="absolute h-[9px] w-[9px] border border-black/20 dark:border-white/25"
                                    style={{ left: x, top: "50%", transform: "translate(-50%, -50%)" }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
