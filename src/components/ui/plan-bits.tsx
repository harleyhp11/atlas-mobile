"use client";

/* =====================================================================
   PLANES — dos superficies por plan, no una card partida.

   Antes la card era una sola pieza dividida por una línea vertical, y
   todo el texto caía sobre el mismo fondo negro: se leía como un muro.

   Ahora cada plan son DOS tarjetas dentro del mismo hueco:

     · Izquierda, BLANCA — identidad. Quién eres, qué es y para quién.
       El contraste la convierte en lo primero que se mira.
     · Derecha, NEGRA — la decisión. Precio, entregables y el botón.

   El plan 04 rompe el patrón a propósito: una sola superficie negra con
   el acento lima. Es el único "a medida", y que no se parezca a los
   otros tres es justamente lo que lo señala.

   La jerarquía la carga el color, no el tamaño de letra, para que el
   bloque de texto deje de sentirse abrumador.
   ===================================================================== */

import React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Trama diagonal muy tenue: da materia al degradado y evita el banding
 *  que se ve en los degradados planos sobre negro. */
const TEXTURE =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Cpath d='M0 6L6 0' stroke='%23fff' stroke-opacity='0.5' stroke-width='0.5'/%3E%3C/svg%3E\")";

/* Radios anidados: el marco exterior siempre algo mas abierto que las
   piezas de dentro, si no el hueco entre curvas se ve torcido. */
const SHELL = "rounded-[2rem] md:rounded-[2.25rem]";
const CARD = "rounded-[1.5rem] md:rounded-[1.65rem]";
const PAD = "p-7 md:p-9";

/* "Liquid glass" del marco: el desenfoque por si solo se ve plano sobre
   negro. Lo que da la sensacion de vidrio es saturar lo que hay detras,
   un reflejo interior en el borde superior y una sombra que lo despega
   del fondo. Mismo criterio que las flechas de Testimonios. */
const SHELL_GLASS: React.CSSProperties = {
    background:
        "linear-gradient(150deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 46%, rgba(255,255,255,0.07) 100%)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(22px) saturate(170%)",
    WebkitBackdropFilter: "blur(22px) saturate(170%)",
    boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
};

/* ---------------------------------------------- superficie oscura

   Un degradado lineal de dos paradas sobre negro se lee como un telon.
   Esta superficie apila cuatro capas que por separado casi no se ven y
   juntas dan profundidad, manteniendo el negro como color dominante:

     1. MALLA — tres focos radiales en posiciones impares (nunca en el
        centro ni en las esquinas exactas). Es lo que evita la simetria
        que delata a un degradado hecho por defecto.
     2. BARRIDO CONICO — gira la luz alrededor de una esquina alta, como
        si la card estuviera bajo una fuente que no se ve.
     3. DESTELLO — una banda estrecha en diagonal, el reflejo especular
        de una superficie pulida. Es la capa "llamativa".
     4. TRAMA — grano diagonal que rompe el banding de los degradados
        sobre negro y da materia.

   Ninguna capa pasa de 0.10 de alfa: la suma aclara lo justo.        */

const DARK_BASE = "#07070A";

const DARK_MESH = [
    "radial-gradient(115% 85% at 86% -12%, rgba(255,255,255,0.10) 0%, transparent 56%)",
    "radial-gradient(95% 75% at 6% 112%, rgba(255,255,255,0.06) 0%, transparent 60%)",
    "radial-gradient(55% 50% at 64% 40%, rgba(196,202,214,0.045) 0%, transparent 72%)",
].join(", ");

/* El barrido conico es el que puede delatar el truco: si dos paradas
   contiguas saltan de golpe aparece una arista recta que se lee como un
   pliegue, y si el valor en 0deg no coincide con el de 360deg se ve la
   costura del cierre. Por eso las transiciones van repartidas y el
   gradiente empieza y termina en el mismo valor. */
const DARK_SWEEP =
    "conic-gradient(from 205deg at 18% 6%," +
    " rgba(255,255,255,0.07) 0deg," +
    " rgba(255,255,255,0.03) 62deg," +
    " rgba(255,255,255,0) 134deg," +
    " rgba(255,255,255,0) 212deg," +
    " rgba(255,255,255,0.035) 288deg," +
    " rgba(255,255,255,0.058) 336deg," +
    " rgba(255,255,255,0.07) 360deg)";

const DARK_SHEEN =
    "linear-gradient(90deg, transparent 36%," +
    " rgba(255,255,255,0.05) 46%, rgba(255,255,255,0.085) 50%," +
    " rgba(255,255,255,0.05) 54%, transparent 64%)";

/** Fondo de las mini-cards negras. `aura` es el halo propio del plan. */
function DarkSurface({ aura }: { aura: string }) {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundColor: DARK_BASE }} />
            <div className="absolute inset-0" style={{ background: DARK_MESH }} />
            <div className="absolute inset-0" style={{ background: DARK_SWEEP }} />
            {/* El destello se desborda y se gira: asi la banda cruza entera
                sin que se vean sus extremos. */}
            <div
                className="absolute -inset-[35%] rotate-[24deg]"
                style={{ background: DARK_SHEEN }}
            />
            <div className="absolute inset-0" style={{ background: aura }} />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: TEXTURE }} />
        </div>
    );
}

/* ------------------------------------------------ adorno de la esquina

   Malla que nace en la esquina inferior derecha y se abre hacia dentro de
   la tarjeta. Tres familias de formas, para que no se lea como un patron
   repetido:

     · ARCOS concentricos centrados EN la esquina — son los que declaran
       de donde parte todo.
     · ARISTAS que se cruzan formando una red irregular.
     · NODOS de cuatro calibres (punto, disco, anillo y rombo).

   La densidad decae hacia el interior con una mascara radial centrada en
   la esquina: sin ella el dibujo se leeria como un grafico y competiria
   con el texto. Todo va aria-hidden y por debajo del contenido.        */
const CORNER_DECAY =
    "radial-gradient(circle at 100% 100%, #000 0%, #000 34%, rgba(0,0,0,0.55) 58%, transparent 82%)";

function CornerNodes() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 420 300"
            fill="none"
            // Desbordada y recortada por el overflow de la card: asi la malla
            // se corta contra el borde en vez de quedar flotando dentro.
            className="pointer-events-none absolute -bottom-[6%] -right-[3%] w-[82%] max-w-[430px] text-black"
            style={{ WebkitMaskImage: CORNER_DECAY, maskImage: CORNER_DECAY }}
        >
            {/* Arcos centrados en la esquina (420,300). */}
            <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" fill="none">
                <path d="M310 300 A110 110 0 0 1 420 190" />
                <path d="M235 300 A185 185 0 0 1 420 115" />
                <path d="M155 300 A265 265 0 0 1 420 35" />
            </g>

            {/* Rayos cortos saliendo del vertice. */}
            <g stroke="currentColor" strokeOpacity="0.08" strokeWidth="1">
                <path d="M420 300 L330 150" />
                <path d="M420 300 L250 268" />
                <path d="M420 300 L352 96" />
            </g>

            {/* Red de aristas. */}
            <g stroke="currentColor" strokeOpacity="0.13" strokeWidth="1">
                <path d="M392 268 L368 214 L318 176 L272 118 L200 84 L128 126 L36 108" />
                <path d="M392 268 L352 292" />
                <path d="M368 214 L300 262 L238 292" />
                <path d="M300 262 L252 224 L196 170 L128 126" />
                <path d="M318 176 L252 224" />
                <path d="M252 224 L164 244 L86 268" />
                <path d="M196 170 L120 196 L48 176" />
                <path d="M164 244 L120 196" />
            </g>

            {/* Discos macizos: los mas pequenos. */}
            <g fill="currentColor" fillOpacity="0.18">
                <circle cx="392" cy="268" r="4" />
                <circle cx="352" cy="292" r="2.5" />
                <circle cx="300" cy="262" r="3" />
                <circle cx="252" cy="224" r="2.5" />
                <circle cx="196" cy="170" r="3.5" />
                <circle cx="120" cy="196" r="2.5" />
                <circle cx="272" cy="118" r="3" />
                <circle cx="128" cy="126" r="2.5" />
                <circle cx="48" cy="176" r="3" />
            </g>

            {/* Anillos: el calibre grande. */}
            <g stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.1" fill="none">
                <circle cx="368" cy="214" r="6" />
                <circle cx="318" cy="176" r="4.5" />
                <circle cx="238" cy="292" r="5" />
                <circle cx="164" cy="244" r="4" />
                <circle cx="86" cy="268" r="5.5" />
                <circle cx="200" cy="84" r="4" />
                <circle cx="36" cy="108" r="5" />
            </g>

            {/* Rombos: rompen la monotonia de tanto circulo. */}
            <g stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" fill="none">
                <rect x="340" y="140" width="11" height="11" transform="rotate(45 345.5 145.5)" />
                <rect x="90" y="216" width="9" height="9" transform="rotate(45 94.5 220.5)" />
                <rect x="264" y="196" width="7" height="7" transform="rotate(45 267.5 199.5)" />
            </g>
        </svg>
    );
}

/** Miniatura incrustada en el titular, entre palabra y palabra. Va en `em`
 *  para que escale con el cuerpo del titulo en cada breakpoint. */
function PlanThumb({ src }: { src: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt=""
            aria-hidden="true"
            width={320}
            height={320}
            loading="lazy"
            className="mx-[0.16em] inline-block h-[0.82em] w-[1.18em] -translate-y-[0.06em] rounded-[0.34em] object-cover align-middle ring-1 ring-black/10"
        />
    );
}

/** Parte el titular para meter la miniatura tras la primera palabra. Si el
 *  titulo es de una sola palabra (plan 04), la miniatura va al final. */
function titleWithThumb(title: string, thumb: string) {
    const [head, ...rest] = title.split(" ");
    const tail = rest.join(" ");
    return (
        <>
            {head}
            <PlanThumb src={thumb} />
            {tail}
        </>
    );
}

export interface PlanCardProps {
    /** Ancla de la sección, p. ej. "plan-01". */
    id: string;
    /** Número que va en el sello. */
    index: string;
    /** Titular a dos tonos. */
    title: string;
    /** Miniatura que se incrusta dentro del titular. */
    thumb: string;
    titleMuted: string;
    description: string;
    price: string;
    priceNote: string;
    delivery: string;
    features: string[];
    cta: string;
    /** El plan premium: una sola superficie, en lima. */
    accent?: boolean;
    /** Posición del halo, para que cada plan respire distinto. */
    aura: string;
}

export function PlanCard(props: PlanCardProps) {
    const { id, accent = false } = props;
    const ref = React.useRef<HTMLDivElement>(null);
    // useInView y no whileInView: con el scroll suave de Lenis de este
    // proyecto whileInView no llega a dispararse de forma fiable.
    const inView = useInView(ref, { once: true, margin: "-12%" });

    return (
        <section id={id} className="mx-auto w-full max-w-[1700px] px-6 py-4 md:px-10">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(SHELL, "relative overflow-hidden p-2.5 md:p-3")}
                style={SHELL_GLASS}
            >
                <div
                    className={cn(
                        "grid grid-cols-1 gap-2.5 md:gap-3 lg:min-h-[440px]",
                        !accent && "lg:grid-cols-[1.05fr_0.95fr]"
                    )}
                >
                    {accent ? <SolidPlan {...props} inView={inView} /> : <SplitPlan {...props} inView={inView} />}
                </div>
            </motion.div>
        </section>
    );
}

/* ------------------------------------------------ planes 01 · 02 · 03 */

function SplitPlan({
    inView,
    index,
    title,
    thumb,
    titleMuted,
    description,
    price,
    priceNote,
    delivery,
    features,
    cta,
    aura,
}: PlanCardProps & { inView: boolean }) {
    return (
        <>
            {/* ------------------------------------ identidad (blanca) */}
            <article className={cn(CARD, PAD, "relative flex flex-col gap-8 overflow-hidden bg-[#F4F4F1]")}>
                {/* El halo del plan, invertido para leerse sobre blanco. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-multiply"
                    style={{ background: aura }}
                />
                {/* Sombra suave hacia la esquina inferior derecha: da profundidad
                    al papel y asienta la constelacion que va encima. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(75% 80% at 100% 100%, rgba(0,0,0,0.07) 0%, transparent 62%)",
                    }}
                />
                <CornerNodes />

                {/* flex-1 + justify-center: el bloque se reparte el alto que
                    deja la fila de entrega, en vez de quedarse pegado arriba. */}
                <div className="relative z-10 flex flex-1 flex-col justify-center">
                    {/* Numero y titular en la misma fila: el numero hace de
                        folio, como en una portada editorial. */}
                    <div className="flex items-start gap-4">
                        <span className="mt-[0.35em] grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black font-mono text-[12px] font-bold tabular-nums text-white">
                            {index}
                        </span>

                        {/* Titular y texto comparten columna; el numero queda
                            colgado en el margen, como el folio de una portada.
                            Si el parrafo volviera al borde de la card, su borde
                            izquierdo no cuadraria con el del titular. */}
                        <div>
                            {/* Dos familias, no una atenuada: la grotesca de
                                display para la linea en negro y la serif italica
                                que ya firma el resto del sitio para la segunda.
                                El tracking se relaja en la serif, que no quiere
                                el apretado negativo que pide una sans pesada. */}
                            <h3 className="text-[clamp(2.05rem,3.4vw,3.15rem)] leading-[0.98] text-black">
                                <span className="block font-display font-extrabold tracking-[-0.038em]">{titleWithThumb(title, thumb)}</span>
                                <span className="-ml-[0.02em] block font-serif-elegant text-[1.07em] font-normal italic tracking-[-0.012em] text-black/45">
                                    {titleMuted}
                                </span>
                            </h3>

                            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-black/55">{description}</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 border-t border-black/10 pt-4">
                    <div className="flex items-baseline justify-between gap-4">
                        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/40">Entrega</span>
                        <span className="text-[15px] font-semibold text-black">{delivery}</span>
                    </div>
                </div>
            </article>

            {/* -------------------------------------- decisión (negra) */}
            <article className={cn(CARD, PAD, "relative flex flex-col gap-6 overflow-hidden bg-[#07070A]")}>
                <DarkSurface aura={aura} />

                <PriceBlock price={price} priceNote={priceNote} inView={inView} />
                <div className="relative z-10 h-px w-full bg-white/[0.08]" />
                <FeatureList features={features} />
                <PlanCta label={cta} />
            </article>
        </>
    );
}

/* -------------------------------------------------- fondo de video

   Fondo del plan 04. El original venia en HEVC, que Chrome y Firefox no
   reproducen — se habria visto negro en la mayoria de navegadores. Se
   recodifico a H.264 y VP9 (webm primero, que pesa la mitad) y se bajo a
   1280px: de 9.05 MB a 1.19 MB.

   El video se pausa cuando la card no esta en pantalla, y con
   prefers-reduced-motion no llega a montarse: queda el poster fijo.    */
function PlanVideo() {
    const ref = React.useRef<HTMLVideoElement>(null);
    const reduce = useReducedMotion();

    React.useEffect(() => {
        const el = ref.current;
        if (!el || reduce) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) el.play().catch(() => {});
                else el.pause();
            },
            { threshold: 0.05 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [reduce]);

    if (reduce) {
        return (
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/plan-04-bg.webp')" }}
            />
        );
    }

    return (
        <video
            ref={ref}
            aria-hidden="true"
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/plan-04-bg.webp"
            className="absolute inset-0 h-full w-full object-cover"
        >
            <source src="/assets/plan-04-bg.webm" type="video/webm" />
            <source src="/assets/plan-04-bg.mp4" type="video/mp4" />
        </video>
    );
}

/* ------------------------------------------------------------ plan 04 */

function SolidPlan({
    inView,
    index,
    title,
    thumb,
    titleMuted,
    description,
    price,
    priceNote,
    delivery,
    features,
    cta,
    aura,
}: PlanCardProps & { inView: boolean }) {
    return (
        <article
            className={cn(CARD, "relative overflow-hidden bg-[#07070A]")}
        >
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                <PlanVideo />
                {/* Velo repartido, no uniforme: denso en los tercios donde cae
                    el texto y abierto en el centro, que es justo por donde pasa
                    la cinta blanca. Asi el video se ve moverse sin comerse la
                    legibilidad. */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.70) 24%," +
                            " rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.70) 76%, rgba(0,0,0,0.86) 100%)",
                    }}
                />
                {/* Y un refuerzo suave arriba y abajo, donde estan el rotulo y
                    la fila de entrega. */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 34%, transparent 66%, rgba(0,0,0,0.5) 100%)",
                    }}
                />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: TEXTURE }} />
            </div>

            <div className={cn("relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14", PAD)}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-1 flex-col justify-center">
                        <div className="flex items-start gap-4">
                            <span className="mt-[0.35em] grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white font-mono text-[12px] font-bold tabular-nums text-black">
                                {index}
                            </span>

                            <div>
                                <h3 className="text-[clamp(2.05rem,3.4vw,3.15rem)] leading-[0.98] text-white">
                                    <span className="block font-display font-extrabold tracking-[-0.038em]">{titleWithThumb(title, thumb)}</span>
                                    <span className="-ml-[0.02em] block font-serif-elegant text-[1.07em] font-normal italic tracking-[-0.012em] text-white/60">
                                        {titleMuted}
                                    </span>
                                </h3>

                                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/45">{description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/[0.08] pt-4">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">Entrega</span>
                            <span className="text-[15px] font-semibold text-white">{delivery}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <PriceBlock price={price} priceNote={priceNote} inView={inView} />
                    <div className="h-px w-full bg-white/[0.08]" />
                    <FeatureList features={features} />
                    <PlanCta label={cta} />
                </div>
            </div>
        </article>
    );
}

/* -------------------------------------------------------------- piezas */

/* Barrido de aparicion del precio. Es el mismo recurso de la seccion
   "Rapido. Impecable. Puntual.": un bloque cruza por encima con clip-path
   tapando el texto y sale por el lado contrario; el texto solo enciende su
   opacidad a mitad del recorrido, cuando esta cubierto.

   Aqui se dispara con useInView y no con whileInView: en este proyecto, con
   el scroll suave de Lenis, whileInView no llega a dispararse de forma
   fiable. */
const SWEEP_IN = "inset(0 100% 0 0)";
const SWEEP_OUT = "inset(0 0 0 100%)";
const SWEEP_FULL = "inset(0 0% 0 0)";

function PriceBlock({
    price,
    priceNote,
    inView,
}: {
    price: string;
    priceNote: string;
    inView: boolean;
}) {
    const reduce = useReducedMotion();

    return (
        <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">Inversión</span>

            <div className="relative mt-2 block overflow-hidden py-1">
                <motion.p
                    initial={reduce ? false : { opacity: 0 }}
                    animate={inView || reduce ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.38, duration: 0.01 }}
                    className="text-[clamp(2.1rem,3.3vw,3rem)] font-black leading-none tracking-[-0.04em] tabular-nums text-white"
                >
                    {price}
                </motion.p>

                {/* La barra que barre. Blanca: es el unico acento que queda
                    en la paleta y sobre negro lee como un destello. */}
                {!reduce && (
                    <motion.div
                        aria-hidden="true"
                        initial={{ clipPath: SWEEP_IN }}
                        animate={
                            inView
                                ? { clipPath: [SWEEP_IN, SWEEP_FULL, SWEEP_FULL, SWEEP_OUT] }
                                : { clipPath: SWEEP_IN }
                        }
                        transition={{
                            duration: 0.75,
                            times: [0, 0.45, 0.55, 1],
                            delay: 0.06,
                            ease: [0.85, 0, 0.15, 1],
                        }}
                        className="absolute inset-0 z-10 bg-white"
                    />
                )}
            </div>

            <p className="mt-2 text-[13px] text-white/35">{priceNote}</p>
        </div>
    );
}

function FeatureList({ features }: { features: string[] }) {
    return (
        <ul className="relative z-10 flex flex-col gap-3">
            {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                    <span
                        className="mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/70"
                    >
                        <Check className="h-[11px] w-[11px]" strokeWidth={3} />
                    </span>
                    <span className="text-[14.5px] leading-snug text-white/70">{f}</span>
                </li>
            ))}
        </ul>
    );
}

/** Botón ancho con la flecha en su propio disco, como en la referencia. */
function PlanCta({ label }: { label: string }) {
    return (
        <Link
            href="/contact"
            className="group/cta relative z-10 mt-auto flex items-center justify-between gap-4 rounded-full border border-white/12 bg-white/[0.04] py-2 pl-6 pr-2 transition-colors duration-300 hover:bg-white/[0.08]"
        >
            <span className="whitespace-nowrap text-[14px] font-semibold text-white">{label}</span>
            <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover/cta:rotate-45"
            >
                <ArrowUpRight className="h-[18px] w-[18px]" />
            </span>
        </Link>
    );
}
