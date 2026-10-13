"use client";

import React, { useRef } from "react";
import { motion, useTransform, useSpring, easeOut, easeInOut, circOut, cubicBezier } from "framer-motion";
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

/* Las dos fotos, de Unsplash (licencia de uso comercial sin atribucion).
   No son dos imagenes bonitas sueltas: son la MISMA estructura —una
   perspectiva en fuga hacia un punto de luz: un hueco de escalera con tiras de
   neon, y un tunel con estelas de larga exposicion— en dos tratamientos
   enfrentados. Una en rojo de marca, la otra en blanco y negro. Antes las dos
   iban en color (rojo contra turquesa); asi el par es mas seco y el unico
   color de la seccion es el de Atlas.

   El blanco y negro va HORNEADO en el archivo, no con filter: grayscale(1),
   igual que el viraje a rojo de cta-arco. Encima de esa foto hay una tarjeta
   con backdrop-filter, y un filter en la imagen mete un contexto de
   composicion por medio; ademas asi no hay filtro en tiempo de ejecucion y el
   archivo baja de 94 a 40 kB.
   La conversion usa los pesos Rec.709 (0.2126/0.7152/0.0722) y no los 601 que
   trae PIL por defecto: el turquesa vivia en verde y azul, y con los pesos
   viejos el azul casi desaparecia y la foto quedaba plana. Lleva ademas
   +22% de contraste, porque una foto de color desaturada siempre pierde
   separacion: parte de lo que distinguia las formas era el tono.
   Recortadas a 1400x1400 y en webp, que es el ancho real que pide una tarjeta
   de ~700px en una pantalla a DPR 2. */
const FOTO_STACK = "/brand/stack-rojo.webp";
const FOTO_CITA = "/brand/cita-bn.webp";

/* Los velos no son un oscurecido plano, y van mas flojos que en la version
   anterior: estas fotos valen justamente por su color, y apagarlas al 46% para
   ganar contraste seria tirar a la basura lo que se fue a buscar. Solo cierran
   donde hace falta —el pie de la tarjeta del stack, que es donde corren las
   cintas en blanco— y dejan el resto casi limpio. El texto no depende de ellos:
   lo sostiene el vidrio. */
const VELO_STACK =
    "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 34%, " +
    "rgba(0,0,0,0.48) 76%, rgba(0,0,0,0.86) 100%)";
const VELO_CITA =
    "linear-gradient(196deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.07) 44%, " +
    "rgba(0,0,0,0.48) 100%)";

/* Relleno y mascara de la palabra gigante. El relleno se aplica con
   background-clip: text, o sea que el degradado se resuelve contra la CAJA del
   elemento y no contra la mancha de tinta; por eso las paradas van repartidas
   como estan y no de 0 a 100 a ojo. La mascara es la que la disuelve por abajo
   en vez de cortarla en seco. */
const RELLENO_PALABRA =
    "linear-gradient(to bottom, #BEBEBE 0%, #C6C6C6 34%, #D4D4D4 58%, #E9E9E9 80%, #FFFFFF 100%)";
const MASCARA_PALABRA =
    "linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.62) 79%, transparent 97%)";

/* El alto NO es un porcentaje redondo: es literalmente lo que sobra.
   El bloque entero tiene que caber en pantalla al final del scroll, y de la
   cuenta del contentY sale que su techo es 0.941·vh (era 0.857 con el -70%).
   Restandole los 230 que ocupan la palabra, la etiqueta y los rellenos, queda
   el alto maximo que la tarjeta puede tener en ESA ventana.
   Con un factor fijo —62vh— habia que elegir uno que sobreviviese a la ventana
   mas baja, y eso regalaba 60px en las altas. Asi cada ventana usa lo suyo.

   El 230 no salio a ojo: es el valor que deja el bloque centrado en pantalla.
   Con el, el aire por encima y por debajo queda en 88/76 a 768 de alto, 78/82
   a 950 y 95/98 a 1080 —antes eran 62 arriba y 153 abajo— y la tarjeta sube
   a 664px en una ventana de 950. */
const ALTO_TARJETA = "h-[clamp(400px,calc(94.1vh_-_230px),760px)]";

/* La tarjeta de vidrio. Lo que la hace vidrio y no un rectangulo gris es el
   brightness del backdrop-filter: sobre fondos casi negros, blur y saturate
   solos devuelven una mancha muerta. El saturate levanta el color que hay
   detras —el rojo del neon, el ambar de las columnas— y por eso cada una se
   tinta sola del color de su foto sin que haya que pintarselo.
   El degradado va de mas claro arriba a casi nada abajo, que es como se
   comporta un cristal real con la luz por encima, y el filete blanco de dentro
   (inset 0 1px) es el canto biselado.

   El min-h es lo que hace que las dos se lean como un sistema: la del stack
   lleva dos lineas y la de la cita casi el triple de contenido, y sin suelo
   comun median 178 y 366. Ahora la del stack respira en vez de encogerse, que
   es justo el gesto de la referencia.

   Va con clamp y no con un numero fijo porque compite con la banda de las
   cintas dentro de la misma tarjeta. De 900 de alto de ventana para arriba el
   clamp llega a 360, que es mas que el contenido de la cita, y las dos quedan
   EXACTAMENTE iguales. A 768 se queda en 307 y la de la cita sigue en 343: se
   descuadran 36px, que es el precio de que el vidrio no se coma las cintas
   —con 343 fijos las pisaria por 11px. */
function Vidrio({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="relative flex min-h-[clamp(190px,25vh,250px)] w-full max-w-[380px] flex-col items-center justify-center rounded-[64px] border border-white/20 px-8 py-8 text-center"
            style={{
                background:
                    "linear-gradient(158deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.06) 52%, rgba(255,255,255,0.025) 100%)",
                backdropFilter: "blur(26px) saturate(1.6) brightness(1.08)",
                WebkitBackdropFilter: "blur(26px) saturate(1.6) brightness(1.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), 0 30px 70px rgba(0,0,0,0.45)",
            }}
        >
            {children}
        </div>
    );
}

/* Ease-in-out sinusoidal. Se define aqui y no dentro del componente para no
   reconstruir la funcion en cada render. */
const CURVA_FONDO = cubicBezier(0.37, 0, 0.63, 1);

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

    /* 2. Recorrido interno. El -68% (antes -70%) es lo que resuelve el hueco
       que quedaba debajo de las tarjetas, y conviene entender por que: el
       envoltorio acaba subido un r% de su alto, asi que su borde inferior
       queda en (1-r)·(2·vh + alto del bloque). Con r=0.70 eso dejaba el bloque
       terminando en 797 de una ventana de 950 —153px de blanco muerto debajo—
       y ademas limitaba el bloque a 0.857·vh.
       Bajando r a 0.68 el bloque baja y ademas puede crecer hasta 0.941·vh.
       Dos problemas con una cifra.
       El coste que temia no existe: con r mas bajo la foto del panel anterior
       se queda mas rato en pantalla mientras el fondo aclara, y crei que eso
       enseñaria el fondo por las franjas del object-contain. Pero el mosaico
       es 2600x1445 (1.80) y el panel a pantalla completa ronda 1352x950
       (1.42): la foto se ajusta POR EL ANCHO, asi que las franjas caen arriba
       y abajo, que es justo donde el marco de la boveda las tapa. Solo en
       ventanas muy anchas y muy bajas (1920x720 y parecidas) se invierte y
       aparecen franjas laterales. */
    const contentY = useTransform(localProgress, [0.35, 1], ["0%", "-68%"], { ease: easeInOut });

    // 3. Elements specific animations
    const phase0Opacity = useTransform(localProgress, [0, 0.15], [1, 0]);
    const cardContentOpacity = useTransform(localProgress, [0.1, 0.3], [0, 1]);
    /* Entrada escalonada del tramo final. Antes esto era UNA sola opacidad
       sobre todo el bloque (textOpacity): aparecia de golpe, titulo y tarjetas
       a la vez. Ahora cada pieza tiene su propio tramo, solapados, asi que se
       lee como una secuencia —primero la palabra, luego la tarjeta roja, luego
       la de la cita— sin que ninguna espere a que acabe la anterior.

       Va atado a localProgress y no a un whileInView a proposito: todo lo de
       este componente se mueve con el scroll, y un disparador por interseccion
       habria metido un segundo reloj que no sabe nada de la secuencia. Ademas
       asi la entrada es reversible: subes y se deshace.

       El desplazamiento usa circOut: casi todo el recorrido ocurre al principio
       y el final se posa muy lento, que es lo que hace que aterrice en vez de
       llegar. La opacidad va lineal aparte, porque con la misma curva el
       elemento se quedaba visible pero todavia moviendose.

       Ojo: y/scale son transformadas, no afectan al layout. El alto del bloque
       —y con el toda la cuenta del presupuesto— se queda igual. */
    const opacidadTitulo = useTransform(localProgress, [0.84, 0.91], [0, 1]);
    const subeTitulo = useTransform(localProgress, [0.84, 0.93], [26, 0], { ease: circOut });

    const opacidadUno = useTransform(localProgress, [0.865, 0.945], [0, 1]);
    const subeUno = useTransform(localProgress, [0.865, 0.965], [52, 0], { ease: circOut });
    const escalaUno = useTransform(localProgress, [0.865, 0.965], [0.965, 1], { ease: circOut });

    const opacidadDos = useTransform(localProgress, [0.89, 0.97], [0, 1]);
    const subeDos = useTransform(localProgress, [0.89, 0.99], [52, 0], { ease: circOut });
    const escalaDos = useTransform(localProgress, [0.89, 0.99], [0.965, 1], { ease: circOut });

    // 4. Background Color Transition (Smoothing the exit)
    const cardBg = useTransform(
        localProgress,
        [0.8, 1],
        ["#EBEBEB", "#FFFFFF"]
    );
    /* En oscuro la tarjeta tambien acaba en BLANCO, igual que en claro: el
       tramo final —stack y tarjeta de contacto— es un panel claro a proposito,
       no una continuacion del negro.

       Nada de esto toca la velocidad del scroll: la pagina avanza igual y lo
       unico que cambia es cuanto recorrido de scroll tarda el color en hacer
       su camino. Tres decisiones, y las tres importan:

       - Ventana de 0.14 (0.78 -> 0.92) en vez de 0.06. En scroll real son
         ~38vh en vez de ~16vh, porque localProgress comprime [0.4, 0.85] del
         progreso del padre, que mide 600vh.
       - Curva CURVA_FONDO y no easeInOut cubico. Esto es lo que se me paso
         primero: el easeInOut cubico alarga las colas pero comprime el centro,
         asi que el tramo que de verdad se ve (del 10% al 90% del cambio) se
         quedaba en 0.42 de la ventana y duraba casi lo mismo que antes. Esta
         bezier es la ease-in-out sinusoidal: entra y sale suave igual, pero el
         centro se mantiene casi lineal y ocupa ~0.6 de la ventana. Resultado,
         el nucleo del cambio dura del orden del doble.
       - Empieza en 0.78 y no antes: a partir de ahi del panel de la foto solo
         queda en pantalla su franja inferior, que es justo la del marco —las
         barras y el degradado que copian el color de la tarjeta—, asi que
         aclararla es lo correcto. Antes de 0.78 la foto manda en pantalla y,
         al ir con object-contain, deja ver el fondo en dos franjas de 66px a
         los lados: subir el gris ahi se leeria como bandas claras flanqueando
         la imagen.

       Cerrar en 0.92 solapa el final de la rampa con la entrada escalonada del
       contenido, y eso ya no es el problema que era cuando el fondo acababa en
       negro: ahora lo que entra son dos tarjetas OSCURAS y un texto oscuro
       sobre suelo claro, asi que un gris a medio camino no rompe nada —es la
       situacion inversa a la de antes.
       Los numeros del solape con los tramos de entrada de mas abajo: a 0.88 el
       fondo va por #D4D4D5 con la palabra al 57%; a 0.90 por #F4F4F4 con la
       primera tarjeta al 44%; y a 0.92, cuando el fondo ya es blanco pleno,
       todavia queda la mayor parte de las dos entradas por delante.

       El gris de partida no necesita paradas intermedias: de #18181b a #FFFFFF
       el punto medio en sRGB cae en L*58 y el medio perceptual del tramo es
       L*54.5, asi que interpolar en RGB ya es casi uniforme al ojo aqui.

       Las fases anteriores se quedan en #18181b: por debajo del primer punto
       useTransform mantiene el primer valor. */
    const cardBgDark = useTransform(
        localProgress,
        [0.78, 0.92],
        ["#18181b", "#FFFFFF"],
        { ease: CURVA_FONDO }
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

                    {/* Phase 4: las dos tarjetas grandes */}
                    {/* El alto del bloque no es libre: entra en el `contentY`
                        (-70% de TODO el envoltorio), y de ahi sale que al final
                        del recorrido el bloque arranca en 0.6·vh - 0.7·alto. Para
                        que quepa entero en pantalla el alto tiene que quedarse
                        por debajo de 0.857·vh. Por eso las tarjetas miden en vh
                        y no en px: con clamp(420px, 62vh, 660px) mas los 128 de
                        relleno, la cuenta se cumple sola en 768, 900 y 1080 de
                        alto de ventana. Un alto fijo se salia de pantalla en
                        cuanto la ventana fuese baja.

                        El relleno de arriba baja a 24 porque ahora el aire lo
                        pone el titular. Y el titular no es gratis: el bloque
                        entero tiene que caber en una pantalla, asi que cada
                        pixel que ocupa la palabra se lo quita a las tarjetas.
                        La palabra se mide con min(10vw, 16vh) y no con 10vw a
                        secas: en una ventana ancha pero baja —1512x768— un
                        titular de 151px dejaba el bloque 16px por encima del
                        limite y se comia el borde superior. Atando la palabra
                        tambien al alto, en esas ventanas encoge ella (a 123px)
                        en vez de encoger las tarjetas siempre.
                        Para alargar las tarjetas sin pasarse del limite, el
                        sitio salio de recortar huecos que no se ven —mt-4 a
                        mt-3 sobre la palabra, mt-6 a mt-5 sobre la rejilla y 20
                        menos de relleno del bloque—, no de encoger nada. Con
                        esos 20px las tarjetas suben de 59vh a 62vh. */}
                    <motion.div
                        className="relative mx-auto flex w-full max-w-[1700px] flex-shrink-0 flex-col px-6 pb-[8px] pt-[40px] md:px-10 lg:px-12"
                    >
                        {/* Rotulo y palabra, calcados de Testimonios: misma
                            etiqueta centrada, misma palabra a sangre con
                            relleno degradado por background-clip y mascara que
                            la disuelve por abajo, y el mismo solape negativo
                            para que las tarjetas le pisen el pie —aqui el
                            solape sube de -0.06em a -0.30em: la palabra se mete
                            mas detras de las tarjetas, y cada pixel que esconde
                            es un pixel que la tarjeta puede crecer hacia abajo.
                            A -0.38em la palabra queda ademas mas pegada a ellas,
                            que es como deja de leerse como un rotulo suelto
                            encima y pasa a formar parte del mismo bloque.
                            Lo unico que cambia es el degradado: el de
                            Testimonios cierra en #E4E4E4, que es el fondo de
                            aquella seccion. Aqui el suelo es blanco puro, asi
                            que arranca mas oscuro y cierra en #FFF; si no, la
                            palabra se veria gris flotando sobre un borde. */}
                        <motion.div style={{ opacity: opacidadTitulo, y: subeTitulo }} className="flex justify-center">
                            <EtiquetaSeccion codigo="Atlas® — Tecnología" sobreClaro />
                        </motion.div>

                        <motion.h2
                            aria-hidden="true"
                            className="relative z-0 mt-3 select-none text-center font-bold text-[13vw] sm:text-[clamp(2.6rem,min(9.8vw,15.5vh),12rem)]"
                            style={{
                                letterSpacing: "-0.03em",
                                lineHeight: 0.9,
                                whiteSpace: "nowrap",
                                marginBottom: "-0.38em",
                                backgroundImage: RELLENO_PALABRA,
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                                WebkitMaskImage: MASCARA_PALABRA,
                                maskImage: MASCARA_PALABRA,
                                opacity: opacidadTitulo,
                                y: subeTitulo,
                            }}
                        >
                            Herramientas
                        </motion.h2>

                        <div className="relative z-[1] mt-5 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">

                            {/* ─── Tarjeta 1: el stack ─────────────────────── */}
                            <motion.article
                                style={{ opacity: opacidadUno, y: subeUno, scale: escalaUno, willChange: "transform, opacity" }}
                                className={cn(ALTO_TARJETA, "relative overflow-hidden rounded-[72px] bg-black")}
                            >
                                <Image
                                    src={FOTO_STACK}
                                    alt=""
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority={false}
                                />
                                <span aria-hidden="true" className="absolute inset-0" style={{ background: VELO_STACK }} />

                                {/* El vidrio va centrado sobre la tarjeta ENTERA
                                    y las cintas en absoluto al pie, no en un
                                    flex-1 por encima de ellas. Antes este se
                                    centraba en el hueco que dejaban las cintas y
                                    el de la cita sobre toda su tarjeta, asi que
                                    los dos quedaban a alturas distintas. Con los
                                    dos centrados sobre la misma caja, se alinean
                                    solos a cualquier tamaño. */}
                                <div className="absolute inset-0 flex items-center justify-center px-8">
                                    <Vidrio>
                                            {/* Sin ojal: la seccion ya se
                                                presenta con su etiqueta y su
                                                palabra arriba, y repetir
                                                "Atlas® — Stack" aqui era decir
                                                lo mismo dos veces.
                                                Space Mono, y no la JetBrains que la
                                                pagina ya carga: esa es una mono de
                                                editor, afinada para leer codigo a
                                                13px, y en grande se queda sosa.
                                                Space Mono viene de la maquina de
                                                escribir y tiene formas propias, que
                                                es lo que aguanta este tamaño.
                                                El tracking va a cero y no en
                                                negativo: una mono ya reparte el
                                                mismo ancho a cada letra, y
                                                apretarla ademas le quita lo unico
                                                que la hace reconocible. */}
                                            <h3 className="font-space-mono text-[clamp(1.7rem,3.15vw,2.9rem)] font-bold leading-[1.12] tracking-[0] text-white">
                                                Lo que
                                                <br />
                                                dominamos
                                            </h3>
                                    </Vidrio>
                                </div>

                                {/* Las dos cintas, al pie y dentro de la tarjeta.
                                    La de arriba corre a la derecha y la de abajo
                                    a la izquierda: en el mismo sentido se leerian
                                    como un solo bloque que se desliza. */}
                                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 pb-8">
                                    <BrandScroller />
                                    <BrandScrollerReverse />
                                </div>
                            </motion.article>

                            {/* ─── Tarjeta 2: la cita ──────────────────────── */}
                            <motion.article
                                style={{ opacity: opacidadDos, y: subeDos, scale: escalaDos, willChange: "transform, opacity" }}
                                className={cn(ALTO_TARJETA, "relative overflow-hidden rounded-[72px] bg-black")}
                            >
                                <Image
                                    src={FOTO_CITA}
                                    alt=""
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority={false}
                                />
                                <span aria-hidden="true" className="absolute inset-0" style={{ background: VELO_CITA }} />

                                {/* El logo, la firma y el boton salen del vidrio
                                    y se reparten por la tarjeta: arriba la marca,
                                    en medio solo la voz, abajo quien la dice y
                                    que hacer con ella. El vidrio deja de ser una
                                    ficha con de todo y pasa a contener una sola
                                    cosa, que es lo que le devuelve el peso a la
                                    cita. Ademas le calca la estructura a la otra
                                    tarjeta: vidrio al centro, banda abajo. */}
                                <div className="absolute inset-x-0 top-0 flex items-center gap-3 px-9 pt-8">
                                    <Image
                                        src="/brand/atlas-circle.png"
                                        alt="Atlas"
                                        width={128}
                                        height={128}
                                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                                    />
                                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/85">
                                        Atlas®
                                    </span>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center px-8">
                                    <Vidrio>
                                        {/* Las comillas son huecas: relleno
                                            transparente y el dibujo lo hace el
                                            contorno del propio glifo. Dibujarlas en
                                            SVG seria adivinar la forma; asi salen
                                            del tipo que ya usa la pagina. */}
                                        <span
                                            aria-hidden="true"
                                            className="font-display pointer-events-none block select-none text-[74px] font-bold leading-[0.62]"
                                            style={{ color: "transparent", WebkitTextStroke: "1.6px rgba(255,255,255,0.34)" }}
                                        >
                                            &ldquo;
                                        </span>

                                        {/* La cita responde a lo que se pregunta
                                            quien llega a esta seccion y ve una
                                            pared de logos: "¿conoceran lo mio?".
                                            Por eso no habla de resultados
                                            —eso ya lo hace el boton— sino de que
                                            la herramienta no es la restriccion.
                                            Va justo debajo de las dos cintas, asi
                                            que reencuadra lo que el lector acaba
                                            de ver en vez de cambiar de tema.

                                            Bricolage Grotesque, y ya no en
                                            italica. La Playfair se muda al titular
                                            de la otra tarjeta, asi que aqui habria
                                            sido repetir la misma voz dos veces; y
                                            el par serif-grotesca es mas interesante
                                            que dos serifas. Sube de 16.5 a 18.5,
                                            que es lo que pedia al quedarse sola
                                            dentro del vidrio. */}
                                        <p className="font-display mx-auto mt-3 max-w-[300px] text-[18.5px] font-normal leading-[1.5] tracking-[-0.01em] text-white/90">
                                            Ninguna tecnología nos limita. Elegimos la que tu proyecto necesita y construimos con ella.
                                        </p>

                                    </Vidrio>
                                </div>

                                {/* Banda del pie, a la altura de las cintas de la
                                    otra tarjeta. El boton lleva su propio
                                    backdrop-filter porque aqui ya no se apoya en
                                    el vidrio: va directo sobre la foto. */}
                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-9 pb-8">
                                    <span className="font-mono text-[10.5px] uppercase leading-[1.5] tracking-[0.2em] text-white/70">
                                        Harley
                                        <br />
                                        Fundador de Atlas
                                    </span>
                                    <Link
                                        href="/contact"
                                        className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/25 px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-500 hover:border-white hover:bg-white hover:text-black"
                                        style={{
                                            background: "rgba(255,255,255,0.10)",
                                            backdropFilter: "blur(18px) saturate(1.5) brightness(1.06)",
                                            WebkitBackdropFilter: "blur(18px) saturate(1.5) brightness(1.06)",
                                        }}
                                    >
                                        Reservar una llamada
                                        <Plus className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-90" />
                                    </Link>
                                </div>
                            </motion.article>

                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
