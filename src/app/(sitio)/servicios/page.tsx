"use client";

/* ─────────────────────────────────────────────────────────────────────────────
   /servicios — EL TABLERO

   La landing cuenta los planes como SECUENCIA: cada uno ocupa una pantalla y
   se apila con el scroll, así que es imposible ver dos precios a la vez. Esta
   página los cuenta como TABLA: las cuatro columnas en pantalla, con las filas
   alineadas entre sí (nombre / descripción / precio / entrega / incluye / botón)
   sobre una sola superficie continua separada por filetes de 1px. La
   comparación no es una función que se agrega: es la forma del bloque.

   REGISTROS DE MOVIMIENTO — solo hay tres en toda la página, y conviene que
   siga siendo así:
     1. AUTÓNOMO   — la cinta de la nota legal, que se desplaza sola y no
                     reacciona a nada.
     2. ATADO AL SCROLL — las verticales de la retícula y la entrada escalonada
                     de las cuatro columnas. Reversible: al subir se deshace.
     3. POR TIEMPO — cabecera, índice y cierre, disparados por useInView.
   Si alguien quiere añadir un cuarto registro "porque queda bien": no.

   EL ÚNICO EVENTO es la barra de tarifas del bloque 04. Todo lo demás se mueve
   con el repertorio de la casa y nada más. Una página con cinco momentos
   memorables no tiene ninguno.

   DOS CONDICIONES TÉCNICAS DEL REPO que esta página respeta:
     - Cero `whileInView`. Con el Lenis de este proyecto no dispara de forma
       fiable y el contenido se queda escondido tras el overflow de la máscara.
       Siempre `useInView(ref, { once: true, margin })`.
     - Cero `backdrop-filter`. No por el gotcha del minificador (aquí iría
       inline y sobreviviría) sino porque en una sección sin fotos detrás el
       desenfoque no tiene nada que refractar y degrada a un rectángulo gris.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    motion,
    useInView,
    useScroll,
    useSpring,
    useTransform,
    useReducedMotion,
    circOut,
} from "framer-motion";
import { ArrowUpRight, Check, Zap } from "lucide-react";

import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";
import { DeferredMount } from "@/components/ui/DeferredMount";
import { usePreloadState } from "@/components/ui/arc-preloader-hero";
import GlyphPortal from "@/components/ui/glyph-portal";
import { SuperficieOscura, Reticula, Escuadras } from "./fondo";
import Anillo from "./anillo";
import Navegador from "./navegador";
import { PLANES, NOTA_LEGAL } from "./datos";

/* La curva del sitio. Aparece en 19 archivos; cualquier entrada que no la use
   se siente de otro sitio. */
const CURVA = [0.16, 1, 0.3, 1] as const;

/* La curva seca, reservada en todo el repo para UNA sola cosa: el barrido que
   descubre un precio. */
const CURVA_SECA = [0.85, 0, 0.15, 1] as const;

const MUELLE = { stiffness: 100, damping: 30, mass: 0.1, restDelta: 0.001 };

const SWEEP_IN = "inset(0 100% 0 0)";
const SWEEP_FULL = "inset(0 0% 0 0)";
const SWEEP_OUT = "inset(0 0 0 100%)";

const GUTTER = "px-8 lg:px-12";

/* Foco visible. Los seis enlaces de la pagina lo llevan: sin esto, quien navega
   con teclado ve el rectangulo por defecto del navegador saltando por encima de
   pastillas redondeadas, y en el CTA del cierre (overflow-hidden) casi no se ve. */
const FOCO =
    "outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000] rounded-full";

/* ── 01 · El portal: ¿Qué vamos a CONSTRUIR? ────────────────────────────────── */

/** Lee la familia real detrás de --font-condensed y descarta las caras de
 *  respaldo de next/font.
 *
 *  ESTO NO ES COSMÉTICO. GlyphPortal comprueba con document.fonts.check() que
 *  TODAS las caras que le pides estén disponibles, y si falta una asume una
 *  fuente colgada y se queda ESTÁTICO a propósito. `var(--font-condensed)`
 *  resuelve a DOS caras: `Anton` y `"Anton Fallback"`, y la segunda es un
 *  @font-face con local() que para el FontFaceSet nunca "carga". Cuatro de
 *  cinco disponibles, y el zoom se apagaba. */
function pilaCondensada(): string {
    const sonda = document.createElement("span");
    sonda.style.cssText =
        "position:absolute;left:-9999px;visibility:hidden;font-family:var(--font-condensed)";
    document.body.appendChild(sonda);
    const resuelta = getComputedStyle(sonda).fontFamily;
    sonda.remove();
    const caras = (resuelta.match(/(?:[^,"']+|"[^"]*"|'[^']*')+/g) ?? [])
        .map((cara) => cara.trim())
        .filter((cara) => cara && !/fallback/i.test(cara));
    return [...caras, '"Arial Black"', "sans-serif"].join(", ");
}

function PortalServicios() {
    const [pila, setPila] = useState<string | null>(null);

    useEffect(() => {
        let resuelto = false;
        const resolver = () => {
            if (resuelto) return;
            resuelto = true;
            setPila(pilaCondensada());
        };
        /* El portal congela la tipografía al montar: mide la tinta del glifo con
           canvas para saber por dónde cabe la cámara. Si Anton aún no llegó mide
           Arial Black y luego la tinta se mueve por debajo. El tope evita que
           una fuente que nunca resuelve deje la página en blanco. */
        const tope = window.setTimeout(resolver, 1800);
        document.fonts.ready.then(resolver).catch(resolver);
        return () => {
            resuelto = true;
            window.clearTimeout(tope);
        };
    }, []);

    if (!pila) {
        return <div style={{ height: "100svh", background: "#FFFFFF" }} aria-hidden="true" />;
    }

    return (
        <GlyphPortal
            className="portal-atlas"
            word="CONSTRUIR?"
            fontFamily={pila}
            /* Anton es de un solo peso (400), ver layout.tsx. Pedirle 900 haría
               fallar el mismo document.fonts.check y apagar el movimiento. */
            fontWeight={400}
            /* Alturas de ventana que dura el recorrido de la cámara. Con 2.6
               quedaba casi pantalla y media de negro después del zoom: el
               margen del bloque de contenido vale (length - 1) ventanas, y es
               por donde se baja sin ver nada. */
            /* Alturas de ventana que dura el recorrido de la cámara. Medido:
               el clip se suelta en el 78% del recorrido, así que el 22% final
               es campo negro sin nada dentro. Con 1.9 eso eran ~320px; con 1.4
               quedan ~235px. Bajar más empieza a atropellar el zoom. */
            scrollLength={1.4}
            enterLabel="Ver los planes"
            hint="Desliza para entrar."
            style={{
                /* Papel blanco y, por dentro de las letras, el mismo negro de la
                   página: al atravesar la letra no hay salto de color. */
                "--gp-paper": "#FFFFFF",
                "--gp-ink": "#000000",
                "--gp-field": "#000000",
                "--gp-foreground": "#FFFFFF",
                fontFamily: "var(--font-sans)",
            }}
            background={
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        transform: "scale(var(--gp-field-scale,1))",
                        background:
                            "radial-gradient(70% 60% at 22% 12%, rgba(225,29,58,0.16) 0%, transparent 58%)," +
                            "radial-gradient(60% 55% at 84% 88%, rgba(255,255,255,0.05) 0%, transparent 62%)," +
                            "#000000",
                    }}
                />
            }
            front={
                <>
                    <div className={`absolute inset-x-0 top-28 ${GUTTER}`}>
                        {/* `sobreClaro` es obligatorio: el papel del portal es
                            blanco FIJO y no sigue el tema, así que sin esto la
                            etiqueta queda blanca sobre blanco. */}
                        <EtiquetaSeccion codigo="Atlas® — Servicios" sobreClaro />
                    </div>

                    {/* Anclada a `--gp-word-top`, que el componente recalcula en
                        cada layout con la posición real de la tinta: así queda
                        siempre a la misma distancia de la palabra. */}
                    <p
                        className="m-0 px-8 text-center text-[#000000]"
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: "calc(100% - var(--gp-word-top, 38%) + 22px)",
                            fontSize: "clamp(1.05rem, 2.1vw, 1.9rem)",
                            lineHeight: 1.2,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        ¿Qué vamos a
                    </p>
                </>
            }
        >
            {/* Vacío a propósito. Este bloque reserva una ventana entera
                (min-height + padding) y lo colapsa el CSS de abajo: con dos
                líneas dentro se veía una pantalla casi vacía justo cuando
                deberías estar llegando a los planes. El texto se mudó a la
                cabecera del tablero, que es su sitio.

                Va un nodo y no `undefined` porque el componente cae a un texto
                suyo en inglés cuando no hay hijos. */}
            <div aria-hidden="true" />
        </GlyphPortal>
    );
}

/* ── 02 · La cinta, con video de fondo ──────────────────────────────────────── */

function Cinta() {
    /* Un solo IntersectionObserver gobierna el video Y el desplazamiento: en
       cuanto la cinta sale de pantalla se paran los dos. Es el mismo patron que
       ya usa la cinta de la galeria en StatsSection, incluido el velo — el video
       tiene zonas casi blancas y el rotulo tambien es blanco, asi que sin velo
       el texto desaparece justo cuando pasa la parte luminosa.

       Con la preferencia de movimiento reducido no se monta el video (se queda
       el poster) y el texto no se desplaza: es la unica pieza de la pagina que
       se movia sola mas de cinco segundos sin forma de pararla. */
    const caja = useRef<HTMLDivElement>(null);
    const video = useRef<HTMLVideoElement>(null);
    const quieto = useReducedMotion();
    const [aLaVista, setALaVista] = useState(false);

    useEffect(() => {
        const nodo = caja.current;
        if (!nodo || quieto) return;
        const io = new IntersectionObserver(
            ([e]) => {
                setALaVista(e.isIntersecting);
                const v = video.current;
                if (!v) return;
                if (e.isIntersecting) v.play().catch(() => {});
                else v.pause();
            },
            { threshold: 0.05 }
        );
        io.observe(nodo);
        return () => io.disconnect();
    }, [quieto]);

    const texto = "Precios referenciales en soles";
    /* Dos copias seguidas y un recorrido de 0% a -50%: cuando la primera copia
       termina de salir, la segunda esta exactamente donde arranco la primera,
       asi que el bucle no tiene costura. */
    const copia = (
        <div className="flex shrink-0 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="flex items-center">
                    <span className="whitespace-nowrap font-condensed uppercase tracking-[0.02em] text-[clamp(1.4rem,2.2vw,2.1rem)] text-white">
                        {texto}
                    </span>
                    <span
                        aria-hidden="true"
                        className="mx-10 inline-block h-[6px] w-[6px] shrink-0"
                        style={{ background: "var(--hero-accent, #E11D3A)" }}
                    />
                </span>
            ))}
        </div>
    );

    return (
        <div
            ref={caja}
            className="relative flex h-[104px] items-center overflow-hidden border-y border-white/[0.07]"
            /* `contain: paint` le promete al navegador que nada de dentro pinta
               fuera: el video en bucle deja de invalidar la pagina entera. */
            style={{ contain: "paint" }}
        >
            {quieto ? (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/assets/cinta-galeria.webp')" }}
                />
            ) : (
                <video
                    ref={video}
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

            {/* Velo: sin el, el rotulo blanco se pierde cuando pasa la zona clara
                del video. Mas oscuro en los cantos, que es donde la mascara
                desvanece el texto y hace falta menos contraste. */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 18%, rgba(0,0,0,0.45) 82%, rgba(0,0,0,0.85) 100%)",
                }}
            />

            <motion.div
                className="relative flex"
                style={{ width: "max-content" }}
                animate={aLaVista && !quieto ? { x: ["0%", "-50%"] } : { x: "0%" }}
                transition={{ duration: 44, ease: "linear", repeat: Infinity }}
            >
                {copia}
                {copia}
            </motion.div>
        </div>
    );
}

/* ── 04 · La fila de precios: el único evento de la página ──────────────────── */

function FilaPrecios() {
    const ref = useRef<HTMLDivElement>(null);
    const activa = useInView(ref, { once: true, margin: "-25%" });
    const quieto = useReducedMotion();

    /* LA BARRA DE TARIFAS. Es el barrido de clip-path que en la landing revela
       el precio DENTRO de una tarjeta, sacado de la tarjeta y llevado al ancho
       entero del tablero. Mismo vocabulario, significado nuevo: el gesto pasa
       de decir "mira este" a decir "compáralos".

       Los tiempos están recalculados para el recorrido largo, y la cuenta
       incluye el delay de 0.08 (olvidarlo es lo fácil aquí):
         · la barra tapa del todo en  0.08 + 0.42 × 1.25 = 0.605s
         · empieza a retirarse en     0.08 + 0.56 × 1.25 = 0.780s
       O sea que la meseta en que tapa todo va de 0.605s a 0.780s, y las cuatro
       cifras tienen que encender DENTRO de esa ventana de 175ms. Escalonadas
       35ms desde 0.62 caen en 0.620 / 0.655 / 0.690 / 0.725: las cuatro dentro,
       con 55ms de margen por el lado de la salida. Se lee el sentido del
       barrido sin que ninguna se vea cambiar a la vista.

       Si alguien reajusta esto: el margen por abajo es de solo 15ms. Bajar la
       base a 0.60 deja la primera cifra encendiéndose a plena vista. */
    const retrasoCifra = (i: number) => 0.62 + i * 0.035;

    return (
        <div
            ref={ref}
            className="relative grid grid-cols-4 overflow-hidden border-y border-white/[0.07]"
        >
            {PLANES.map((p, i) => (
                <div key={p.numero} className="px-6 py-7">
                    {/* El tablero es una tabla visual, no una <table>: sin esto,
                        un lector de pantalla oye cuatro importes seguidos y no
                        puede saber cuál es de qué plan. */}
                    <motion.p
                        initial={quieto ? false : { opacity: 0 }}
                        animate={{ opacity: activa || quieto ? 1 : 0 }}
                        transition={{ delay: retrasoCifra(i), duration: 0.01 }}
                        aria-label={`${p.nombre}: ${p.precio}`}
                        className="font-sans font-black leading-none tracking-[-0.04em] tabular-nums text-white text-[clamp(1.35rem,2.6vw,2.4rem)]"
                    >
                        <span aria-hidden="true">{p.precio}</span>
                    </motion.p>
                    <motion.p
                        initial={quieto ? false : { opacity: 0 }}
                        animate={{ opacity: activa || quieto ? 1 : 0 }}
                        transition={{ delay: retrasoCifra(i) + 0.12, duration: 0.4, ease: CURVA }}
                        className="mt-2 text-[12.5px] leading-snug text-white/55"
                    >
                        {p.precioNota}
                    </motion.p>
                </div>
            ))}

            {/* Con reduced-motion la barra no se monta: globals.css mata
                cualquier animación con animation-duration 0.01ms !important, así
                que una barra blanca a pantalla completa podría quedarse fija
                encima de los precios. */}
            {!quieto && (
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 bg-white"
                    initial={{ clipPath: SWEEP_IN }}
                    animate={
                        activa
                            ? { clipPath: [SWEEP_IN, SWEEP_FULL, SWEEP_FULL, SWEEP_OUT] }
                            : { clipPath: SWEEP_IN }
                    }
                    transition={{
                        duration: 1.25,
                        times: [0, 0.42, 0.56, 1],
                        delay: 0.08,
                        ease: CURVA_SECA,
                    }}
                />
            )}
        </div>
    );
}

/* ── 03 · El tablero ────────────────────────────────────────────────────────── */

function Columna({
    plan,
    indice,
    progreso,
}: {
    plan: (typeof PLANES)[number];
    indice: number;
    progreso: ReturnType<typeof useSpring>;
}) {
    /* Escalonado POR PROGRESO DE SCROLL con tramos solapados: cada columna
       arranca antes de que la anterior termine, así el tablero se arma de
       izquierda a derecha como una mano que se abre, y no como cuatro bloques
       que caen. Es el modelo de IdentitySequence y es reversible: al subir se
       deshace solo. */
    const desde = 0.1 + indice * 0.025;
    const hasta = 0.55 + indice * 0.025;

    /* El @media de globals.css mata animaciones CSS, pero NO toca la matemática
       de scroll de Framer: sin esta guarda, un usuario con "Reducir movimiento"
       vería las cuatro columnas deslizándose igual. Con la preferencia activa
       los rangos se colapsan, así que y=0 y escala=1 desde el primer fotograma.
       La opacidad se deja: aparecer no es movimiento. */
    const quieto = useReducedMotion();
    const y = useTransform(progreso, [desde, hasta], quieto ? [0, 0] : [52, 0], { ease: circOut });
    const escala = useTransform(progreso, [desde, hasta], quieto ? [1, 1] : [0.965, 1], { ease: circOut });
    /* La opacidad va LINEAL y aparte, en un tramo más corto. Con la misma curva
       que el movimiento, el elemento termina de aparecer y todavía se está
       moviendo, que se lee como que llega tarde. */
    const opacidad = useTransform(progreso, [desde - 0.05, desde + 0.25], [0, 1]);

    const esUltima = indice === PLANES.length - 1;

    return (
        <motion.div
            style={{ y, scale: escala, opacity: opacidad }}
            className={`group relative flex flex-col overflow-hidden px-6 pt-8 pb-7 ${
                indice > 0 ? "border-l border-white/[0.07]" : ""
            } ${esUltima ? "bg-white/[0.02]" : ""}`}
        >
            {/* El halo rojo marca la única diferencia factual de esta columna:
                es la única sin cifra. Reemplaza al aura lima que este plan tiene
                en la landing; aquí no entra ni un lima. */}
            {esUltima && (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(58% 95% at 96% 100%, rgba(225,29,58,0.10) 0%, transparent 62%)",
                    }}
                />
            )}

            {/* Numeral gigante sangrando por el canto inferior: un solo nodo de
                texto estático, cero animación, y le da profundidad a una columna
                que por lo demás es plana. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[2.5rem] -left-2 select-none font-condensed leading-none text-[11rem] text-white/[0.06]"
            >
                {plan.numero}
            </span>

            {/* Destello especular al pasar el mouse. Solo transform y opacity,
                se compone en GPU. Las columnas no esconden nada, así que el
                hover no descubre información: solo acusa recibo. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-2/3 -translate-x-8 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[190%] group-hover:opacity-100"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.055) 50%, transparent 100%)",
                }}
            />

            <div className="relative z-10 flex flex-1 flex-col">
                {/* (A) Nombre — alto fijo para que las cuatro crucen alineadas */}
                <div className="min-h-[5.5rem]">
                    <p className="font-mono text-[11px] tabular-nums text-white/50">
                        {plan.numero}
                    </p>
                    <h2 className="mt-2 font-condensed uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(1.5rem,2.3vw,2.2rem)] text-white">
                        {plan.nombre}
                    </h2>
                </div>
            </div>
        </motion.div>
    );
}

function Tablero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "start start"],
    });
    /* Nunca se transforma el scrollYProgress crudo para movimiento visible:
       pasa siempre por un muelle antes. */
    const progreso = useSpring(scrollYProgress, MUELLE);
    /* Con la preferencia activa las verticales salen ya dibujadas en vez de
       crecer: la retícula es estructura, no un efecto que valga marear a nadie. */
    const quietoPagina = useReducedMotion();
    const dibujo = useTransform(progreso, [0.08, 0.5], quietoPagina ? [1, 1] : [0, 1]);

    return (
        <div ref={ref} className={`relative ${GUTTER}`}>
            <div className="relative">
                <Reticula dibujo={dibujo} />

                {/* Cabecera de la tabla */}
                <div className="relative z-10 grid grid-cols-4 border-b border-white/[0.07]">
                    {PLANES.map((p, i) => (
                        <div
                            key={p.numero}
                            className={`px-6 py-3 font-mono text-[11px] uppercase tracking-[0.1em] lg:text-[12px] ${
                                i > 0 ? "border-l border-white/[0.07]" : ""
                            }`}
                        >
                            <span className="text-white/40">{p.numero}</span>{" "}
                            <span className="text-white/85">{p.nombre}</span>
                        </div>
                    ))}
                </div>

                <div className="relative z-10 grid grid-cols-4">
                    {PLANES.map((p, i) => (
                        <Columna key={p.numero} plan={p} indice={i} progreso={progreso} />
                    ))}
                </div>

                {/* (C) Precio — el rótulo va una sola vez, pegado al canto:
                    decirlo cuatro veces sería ruido. Aquí nombra la fila, no la
                    celda. Y dice "Precio", no "Inversión": el que paga busca la
                    palabra precio. */}
                <p className="relative z-10 px-6 pt-8 pb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                    Precio
                </p>
                <div className="relative z-10">
                    <FilaPrecios />
                </div>

                {/* (D) Entrega */}
                <p className="relative z-10 px-6 pt-8 pb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                    Entrega
                </p>
                <div className="relative z-10 grid grid-cols-4 border-b border-white/[0.07]">
                    {PLANES.map((p, i) => (
                        <div
                            key={p.numero}
                            className={`px-6 py-5 ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
                        >
                            <p className="font-mono text-[14px] tabular-nums text-white/85">
                                {p.entrega}
                            </p>
                        </div>
                    ))}
                </div>

                {/* (E) Incluye — cuatro por columna, así que se alinean solos.
                    El rótulo va una vez, como el de Precio: repetirlo en cada
                    celda era decir cuatro veces lo mismo. */}
                <p className="relative z-10 px-6 pt-8 pb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                    Incluye
                </p>
                <div className="relative z-10 grid grid-cols-4 border-b border-white/[0.07]">
                    {PLANES.map((p, i) => (
                        <div
                            key={p.numero}
                            className={`px-6 py-6 ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
                        >
                            <ul className="space-y-3">
                                {p.incluye.map((f) => (
                                    <li key={f} className="flex gap-3">
                                        <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
                                            <Check className="h-[11px] w-[11px] text-white/70" strokeWidth={2.5} />
                                        </span>
                                        <span className="text-[13.5px] leading-snug text-white/70">
                                            {f}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* (F) El botón de cada columna */}
                <div className="relative z-10 grid grid-cols-4">
                    {PLANES.map((p, i) => (
                        <div
                            key={p.numero}
                            className={`px-6 py-6 ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
                        >
                            <Link
                                href="/contact"
                                className={`group/cta inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-2 pl-5 pr-2 text-[13px] text-white/85 transition-colors duration-300 hover:bg-white/[0.08] ${FOCO}`}
                            >
                                {p.cta}
                                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-black transition-transform duration-500 group-hover/cta:rotate-45">
                                    {/* Disco rojo que crece desde el centro: el
                                        rojo aparece en el instante de la
                                        intención, no como decoración fija. */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:scale-100"
                                        style={{ background: "var(--hero-accent, #E11D3A)" }}
                                    />
                                    <ArrowUpRight className="relative h-4 w-4 transition-colors duration-500 group-hover/cta:text-white" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── 06 · Cierre ────────────────────────────────────────────────────────────── */

/* EL BANCO DE LUZ DEL BOTÓN.

   Es la pieza firma del referente: un botón casi negro con la luz acumulada en
   su PIE. No es un resplandor, ni una sombra, ni una barra aparte, ni un
   subrayado de neón — es un degradado de fondo RECORTADO POR EL PROPIO BORDE
   REDONDEADO del botón. El `overflow-hidden` es obligatorio y es lo que hace el
   recorte: sin él la luz se escapa de las esquinas.

   EL COLOR NO ES EL DEL REFERENTE. Allá el banco va en cian (#3fe3ff y
   familia). Atlas es monocromo con un solo acento rojo, y meter cian abriría un
   hue nuevo justo en el elemento más visible de la página. Se trasladó la misma
   rampa —misma estructura de paradas, mismo reparto de luminancia— al rojo de
   marca. La técnica es idéntica; el tono es el nuestro. */
const BANCO_LUZ =
    "linear-gradient(to top," +
    " #ffc2cb 1px, #ffa8b5 2px, #ff8c9d 3px, #fa6d81 4px, #ef4a62 5px," +
    " #e02744 6px, #d0162f 7px, #c21029 8px, #a60f24 9px, #8a0f1e 10px," +
    " #73101a 12px, #671017 13px, #580e14 14px, #410b0f 16px," +
    " #2e080a 18px, #210607 20px, #160508 24px, #0e0407 30px," +
    " #0a0309 34px, #0a0309 100%)";

/* La sombra está CERRADA a propósito: el desenfoque exterior más grande es de
   8px al 10%. Nada de halo, nada de drop-shadow, nada de pseudo-elemento
   borroso por fuera — eso es justo lo que convierte este botón en el típico
   botón con glow de plantilla. */
const SOMBRA_BOTON = [
    "inset 0 3px 3px -2px rgba(255,210,218,.10)",
    "inset 1px 0 0 rgba(255,255,255,.09)",
    "inset -1px 0 0 rgba(255,255,255,.09)",
    "0 1px 0 rgba(234,152,165,.38)",
    "1px 0 0 rgba(234,152,165,.17)",
    "-1px 0 0 rgba(234,152,165,.17)",
    "0 0 8px rgba(235,60,85,.10)",
    "0 2px 5px -3px rgba(255,90,115,.45)",
].join(",");

/* Luz de canto con caída de 13px, ENMASCARADA para que se apague hacia arriba.
   Sin la máscara la luz lateral inunda el botón entero. */
const LUZ_CANTO: React.CSSProperties = {
    background:
        "linear-gradient(90deg, rgba(255,214,222,.70), rgba(255,214,222,0) 13px)," +
        "linear-gradient(270deg, rgba(255,214,222,.70), rgba(255,214,222,0) 13px)",
    WebkitMaskImage:
        "linear-gradient(to top,#000 0,#000 6px,rgba(0,0,0,.40) 12px,rgba(0,0,0,.15) 18px,rgba(0,0,0,.09) 24px,rgba(0,0,0,.02) 30px,rgba(0,0,0,.02) 100%)",
    maskImage:
        "linear-gradient(to top,#000 0,#000 6px,rgba(0,0,0,.40) 12px,rgba(0,0,0,.15) 18px,rgba(0,0,0,.09) 24px,rgba(0,0,0,.02) 30px,rgba(0,0,0,.02) 100%)",
};

function BotonLuz({ children }: { children: React.ReactNode }) {
    return (
        <Link
            href="/contact"
            className={`group/luz relative grid place-items-center overflow-hidden rounded-[14px] px-9 py-4 ${FOCO} !rounded-[14px]`}
            style={{ background: BANCO_LUZ, boxShadow: SOMBRA_BOTON }}
        >
            {/* Veta fina de luz cruzando SOLO el canto de arriba. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[22%] right-[38%] top-[0.8px] z-[1] h-[1.9px]"
                style={{
                    filter: "blur(.55px)",
                    background:
                        "linear-gradient(90deg,rgba(255,170,185,0) 0%,rgba(255,170,185,.58) 34%,rgba(255,205,215,.74) 50%,rgba(255,170,185,.58) 66%,rgba(255,170,185,0) 100%)",
                }}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
                style={LUZ_CANTO}
            />
            <span
                className="relative z-[2] flex items-center gap-4 font-sans text-[17px] font-medium leading-none text-white"
                style={{ textShadow: "0 1px 2px rgba(30,0,6,.5)" }}
            >
                {children}
                <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-500 group-hover/luz:translate-x-[3px]" />
            </span>
        </Link>
    );
}

/* LA TESELA. Caja de tamaño fijo con el icono clavado al canto izquierdo y la
   etiqueta a su derecha. NO es una pastilla centrada ni una fila flex: el icono
   va en `left:4`, la etiqueta arranca en `left:45` y entre los dos quedan 12px
   limpios. Nunca se solapan. */
function Tesela({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="relative h-[39px] w-[250px] rounded-[12px] border border-white/[0.115]"
            style={{
                background:
                    "linear-gradient(to top, rgba(255,205,212,.175) 0px, rgba(255,205,212,.128) 2px, rgba(255,205,212,.075) 4px, rgba(255,205,212,.026) 6px, rgba(255,255,255,.012) 9px, rgba(255,255,255,.012) 100%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.035)",
            }}
        >
            <i
                aria-hidden="true"
                className="absolute left-[4px] top-[4px] grid h-[29px] w-[29px] place-items-center rounded-[8px]"
                style={{
                    background:
                        "linear-gradient(to top, #e8606f 0px, #e04a5c 2px, #c8203a 4px, #a81730 6px, #88122a 8px, #6e1023 10px, #4e0c19 12px, #330810 14px, #220710 16px, #190713 19px, #14060f 23px, #10050b 29px)",
                    boxShadow:
                        "inset 1px 0 0 rgba(255,180,195,.40), inset -1px 0 0 rgba(255,180,195,.52), 0 0 6px rgba(235,70,95,.20), 0 3px 8px -5px rgba(255,110,135,.6)",
                }}
            >
                <Zap className="h-[14px] w-[14px] text-white/90" strokeWidth={1.8} />
            </i>
            <b className="absolute left-[45px] top-0 flex h-[39px] items-center whitespace-nowrap pt-[1.5px] font-sans text-[13px] font-normal text-white/[0.94]">
                {children}
            </b>
        </div>
    );
}

function Cierre() {
    const ref = useRef<HTMLElement>(null);
    const activa = useInView(ref, { once: true, margin: "-12%" });
    const quieto = useReducedMotion();

    return (
        <section ref={ref} className={`relative ${GUTTER} pb-28`}>
            <motion.div
                initial={quieto ? { opacity: 0 } : { y: 64, opacity: 0, scale: 0.98 }}
                animate={
                    activa
                        ? { y: 0, opacity: 1, scale: 1 }
                        : quieto
                            ? { opacity: 0 }
                            : { y: 64, opacity: 0, scale: 0.98 }
                }
                transition={{ duration: 0.62, ease: CURVA }}
                className="relative flex flex-col items-center border-t border-white/[0.07] px-4 pt-16 pb-4 text-center"
            >
                <Escuadras />

                <Tesela>Diseño y desarrollo · Lima</Tesela>

                <h2 className="mt-9 font-condensed uppercase leading-[0.92] tracking-[-0.015em] text-[clamp(2.2rem,5.4vw,4.4rem)] text-white">
                    ¿No sabes qué construir?
                </h2>

                <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-white/70">
                    Cuéntanos qué necesitas y te decimos qué plan encaja, cuánto
                    costaría y en cuánto lo tendrías. Si te conviene algo distinto
                    a lo de arriba, también te lo decimos.
                </p>

                <div className="mt-10">
                    <BotonLuz>Conversemos</BotonLuz>
                </div>

                {/* El anillo cierra la página: 37 tarjetas sobre un cilindro
                    girando bajo el CTA. Va a sangre, fuera del padding de la
                    sección, porque los cantos tienen que irse de pantalla. */}
                {/* Anillo y mock comparten escenario. El mock va DELANTE
                    (z 100) solapando el tercio inferior del anillo (z 5) y
                    sangrando por el canto de abajo: ese solape es el punto de
                    la composición, no un accidente de apilado. */}
                {/* El margen negativo tiene que negar TODO el padding de la
                    cadena, no solo el de la sección: section (px-8 / lg:px-12)
                    MÁS el px-4 de este bloque. Negando solo el primero quedaban
                    16px vivos a cada lado y se veían como una franja oscura
                    cortando las tarjetas contra el canto. */}
                {/* EL ALTO CRECE CON LA HOLGURA DEL ANILLO. El anillo baja su contenido
                    118 unidades de lienzo para no rebanarse los cantos, así que el
                    mock —que va anclado a `bottom:0`— tiene que bajar lo mismo o se
                    comería el anillo entero. El escenario va a sangre, o sea su ancho
                    ES el de la ventana, de modo que la escala del anillo vale
                    100vw/1172 y esas 118 unidades son 118/1172 = 10.07vw. */}
                <div className="relative mt-14 -mx-12 h-[calc(640px+10.07vw)] w-[calc(100%+6rem)] overflow-hidden lg:-mx-16 lg:w-[calc(100%+8rem)]">
                    <div className="absolute inset-x-0 top-0 z-[5]">
                        <Anillo />
                    </div>
                    <Navegador />
                </div>

                {/* La nota legal, completa y legible. Arriba pasa como cinta en
                    movimiento; una advertencia que solo vive en una banda que se
                    desplaza no vive. */}
                <p className="mt-10 max-w-[70ch] text-[12px] leading-relaxed text-white/55">
                    {NOTA_LEGAL}
                </p>
            </motion.div>
        </section>
    );
}

/* ── La página ──────────────────────────────────────────────────────────────── */

export default function ServiciosPage() {
    return (
        <main className="relative min-h-screen bg-[#000000]">
            {/* Sin esto el bloque de contenido del portal ocupa una ventana
                entera de negro entre el final del zoom y el tablero. */}
            <style>{`
                .portal-atlas [data-gp-content]{min-height:0;padding:0;}
            `}</style>
            {/* El portal va FUERA de cualquier ancestro con overflow: su pin usa
                position sticky, y el propio componente busca un ancestro con
                overflow para tomarlo por contenedor de scroll. Con el
                overflow-hidden que tenia este main, habria elegido un elemento
                que no scrollea y el recorrido habria quedado descuadrado. */}
            <PortalServicios />

            {/* El overflow-hidden baja aqui, que es lo unico que lo necesitaba:
                la capa de destello de la superficie va rotada y con -inset-35%. */}
            <div className="relative overflow-hidden">
                <SuperficieOscura />
                <div className="relative z-10">
                    <DeferredMount>
                        {/* La cabecera que antes vivía dentro del portal. Aquí
                            presenta el tablero en vez de flotar sola en una
                            pantalla negra. */}
                        {/* pt corto a propósito: cada píxel de aire aquí se
                            suma al negro que deja la cola del portal. */}
                        <header className={`${GUTTER} pt-10 pb-12`}>
                            <EtiquetaSeccion codigo="Planes" texto="02" />

                            {/* Mismo tratamiento que el "Cómo / Trabajamos" del
                                timeline, para que las cabeceras del sitio hablen
                                el mismo idioma: la primera palabra pequeña y
                                apagada, la segunda enorme en condensada y
                                disolviéndose hacia abajo con un degradado
                                recortado al texto.

                                Algo más chica que allá (10rem contra 13rem)
                                porque aquí el tablero viene justo debajo y un
                                titular a sangre se lo comería. */}
                            <h2 className="mt-7 font-condensed uppercase leading-[0.82] tracking-[-0.005em] text-[clamp(2.2rem,10vw,10rem)]">
                                <span className="block text-[0.2em] leading-none tracking-[0.06em] text-foreground/40">
                                    Cuánto
                                </span>
                                <span className="mt-[0.14em] block bg-gradient-to-b from-foreground from-[20%] via-foreground/55 via-[55%] to-foreground/0 to-[86%] bg-clip-text text-transparent">
                                    Cuesta
                                </span>
                            </h2>

                            {/* La frase que antes era el titular baja a bajada.
                                Dice lo mismo sin repetir la palabra del título. */}
                            <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-white/70">
                                Cuatro formas de empezar, y en cuánto las entregamos.
                            </p>
                        </header>
                        <Cinta />
                        <Tablero />
                        <Cierre />
                    </DeferredMount>
                </div>
            </div>
        </main>
    );
}
