"use client";

import { ArrowUp, ExternalLink } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Auralis from "@/components/ui/auralis";
import TituloTecnico from "@/components/ui/titulo-tecnico";
import { cn } from "@/lib/utils";

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const count = useMotionValue(1);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [count, value, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

/* Paleta del shader de la barra de metricas.
   [0] es el velo que pinta los pliegues de la seda y [1] la luz especular
   (el shader ignora el tercero, va de reserva). El velo lleva el rojo de
   marca; la luz se queda casi blanca con un sesgo rosado, porque si tambien
   la pones roja el tejido pierde el brillo y la tarjeta deja de leerse como
   seda negra con pliegues rojos para leerse como un bloque rojo plano.
   Definida fuera del componente a proposito: Auralis tiene `colors` en su
   dep array, y una literal nueva por render recompilaria el shader entero. */
const SEDA_ROJA = ["#8C1224", "#FFF0F3", "#18181b"];

/* ─── Insignia de seccion ────────────────────────────────────────────────
   Pastilla + circulo separados y cosidos por una barrita. Las dos piezas
   comparten construccion: una seda de tres capas, porque un degradado de
   dos paradas se ve plano y plastico a este tamano. La pastilla va en
   plata y el circulo en rojo de marca.

     1. Degradado diagonal con valles grises entre las crestas claras, que
        es lo que da la sensacion de tela plegada.
     2. Un campo de curvas que se desplaza en bucle. Va en SVG y no en CSS:
        un repeating-linear-gradient solo sabe hacer lineas rectas y lo que
        se pedia era oleaje.
     3. Un brillo radial arriba a la izquierda, como luz rozando la tela.

   Los pliegues dependen del material: sobre el plata son sombra (curvas
   en negro translucido) y sobre el rojo son luz (curvas en blanco). Por eso
   Oleaje recibe el trazo como prop en vez de tenerlo fijo.

   Tipografia: la etiqueta en Bricolage Grotesque (font-display), una
   grotesca de formas anchas y algo raras que a este tamano y en caja alta
   parece etiqueta editorial; el numero en la monoespaciada, que es el
   contrapunto tecnico y ademas alinea las cifras. */

const OLA_SEGUNDOS = 16;   // vuelta completa del oleaje
const OLA_LINEAS = 8;      // curvas apiladas
const ALTO_INSIGNIA = 32;  // px; manda sobre la pastilla y el circulo

/* Costura entre las dos piezas: no se tocan, las une esta barrita. El
   degradado va de la plata al rojo para que la linea pertenezca a las dos
   y no parezca un resto pegado a una de ellas. */
const COSTURA_ANCHO = 7;
const COSTURA_ALTO = 2;
const COSTURA_FONDO = "linear-gradient(90deg, rgba(206,206,200,0.95) 0%, rgba(225,29,58,0.95) 100%)";

const FONDO_SEDA =
  "radial-gradient(130% 160% at 18% -15%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 44%), " +
  "linear-gradient(112deg, #EFEFEA 0%, #C6C6C0 28%, #EDEDE8 50%, #ABABA5 76%, #DCDCD7 100%)";

/* La version roja del mismo material. El destello va mas suave que en el
   plata (0.30 y no 0.55): sobre un fondo oscuro ese brillo se lee mucho
   mas, y al 0.55 el circulo salia lavado por arriba. */
const FONDO_SEDA_ROJA =
  "radial-gradient(130% 160% at 18% -15%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 46%), " +
  "linear-gradient(112deg, #F2294B 0%, #B5122B 30%, #E11D3A 54%, #8C1224 80%, #C4152F 100%)";

/* Tinta de la insignia. Casi negro y no negro puro: sobre el plata, el
   #000 corta demasiado y le quita el aire de material. */
const TINTA_INSIGNIA = "#0B0B0B";

function Oleaje({ trazo }: { trazo: string }) {
  /* Onda de periodo 50 trazada de -50 a 250. El grupo se desplaza
     exactamente un periodo, asi que el bucle no tiene costura, y el
     sobrante por los dos lados evita que se vea el borde del trazo. */
  const curva = (y: number, amplitud: number) => {
    let d = `M-50 ${y} Q-37.5 ${y - amplitud} -25 ${y}`;
    for (let x = 0; x <= 250; x += 25) d += ` T${x} ${y}`;
    return d;
  };

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 200 ${ALTO_INSIGNIA}`}
      /* slice y no none: mantiene la densidad de la onda igual en la
         pastilla ancha y en el circulo estrecho. Con "none" el circulo
         comprimiria las curvas casi cinco veces. */
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g style={{ animation: `insigniaOla ${OLA_SEGUNDOS}s linear infinite` }}>
        {Array.from({ length: OLA_LINEAS }).map((_, i) => (
          <path
            key={i}
            d={curva(2 + i * 5.6, 2.2 + (i % 3) * 1.3)}
            fill="none"
            stroke={trazo}
            strokeWidth={0.65}
          />
        ))}
      </g>
    </svg>
  );
}

function InsigniaCompromiso({ etiqueta, numero }: { etiqueta: string; numero: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center drop-shadow-[0_8px_28px_rgba(255,255,255,0.13)]"
    >
      {/* Keyframes locales: solo hay una insignia en la pagina, asi que no
          compensa ensuciar globals.css. El nombre va prefijado para que no
          choque con nada. */}
      <style>{`@keyframes insigniaOla { to { transform: translateX(-50px); } }`}</style>

      <span
        className="relative inline-flex items-center overflow-hidden rounded-full px-[14px]"
        style={{
          height: ALTO_INSIGNIA,
          background: FONDO_SEDA,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.18)",
        }}
      >
        <Oleaje trazo="rgba(0,0,0,0.17)" />
        <span
          className="relative font-display text-[9px] font-extrabold uppercase leading-none tracking-[0.14em]"
          style={{ color: TINTA_INSIGNIA }}
        >
          {etiqueta}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="shrink-0 rounded-full"
        style={{ width: COSTURA_ANCHO, height: COSTURA_ALTO, background: COSTURA_FONDO }}
      />

      {/* Ya no se solapa con la pastilla, asi que tampoco necesita el anillo
          del color de la seccion que antes hacia de junta. En su lugar lleva
          su propio halo rojo, que es lo que lo despega del negro. */}
      <span
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{
          height: ALTO_INSIGNIA,
          width: ALTO_INSIGNIA,
          background: FONDO_SEDA_ROJA,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 14px rgba(225,29,58,0.38)",
        }}
      >
        <Oleaje trazo="rgba(255,255,255,0.30)" />
        <span className="relative font-mono text-[9.5px] font-medium leading-none tabular-nums text-white">
          {numero}
        </span>
      </span>
    </motion.div>
  );
}

export default function Testimonial1() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  interface StatItem {
    value: number;
    decimals: number;
    prefix?: string;
    suffix: string;
    label: string;
    href: string;
    cta: string;
  }

  const stats: StatItem[] = [
    {
      value: 2,
      decimals: 0,
      suffix: "–4 Semanas",
      label: "Entrega",
      href: "/resume",
      cta: "Ver currículum",
    },
    {
      value: 2,
      decimals: 0,
      prefix: "<",
      suffix: "s de carga",
      label: "Velocidad",
      href: "/projects",
      cta: "Ver proyectos",
    },
    {
      value: 100,
      decimals: 0,
      suffix: "%",
      label: "Responsive",
      href: "/skills",
      cta: "Ver capacidades",
    },
    {
      value: 30,
      decimals: 0,
      suffix: " Días",
      label: "Soporte",
      href: "/skills",
      cta: "Ver servicios",
    },
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen w-full grid place-content-center py-16 px-4 md:px-8 lg:px-16 relative">
      <div className="max-w-6xl mx-auto">
        {/* Insignia de seccion */}
        <div className="mb-7 flex justify-center">
          <InsigniaCompromiso etiqueta="Focus" numero="02" />
        </div>

        {/* Main Heading with Refined Block Reveal Animation */}
        <div className="text-center max-w-5xl mx-auto relative text-neutral-900 dark:text-white px-4 space-y-1 md:space-y-2">
          {[
            /* Las barras que barren cada linea al revelarla. El rojo lee el
               mismo token que el acento del hero, asi que cambiarlo alli
               cambia tambien esta barra; el gris claro en vez de blanco puro
               porque sobre negro el blanco pleno da un flash y aqui la barra
               ocupa toda la linea. */
            { text: "Rápido. Impecable. Puntual.", color: "var(--hero-accent, #E11D3A)", delay: 0, tecnico: false },
            /* La segunda linea lleva el mismo efecto que "NO APARECES" del
               tramo de arriba: el cuadro de seleccion que recorre las palabras
               y las cambia por su contorno a rayas. Solo la segunda, no las
               dos: el efecto es el remate de la frase, y en las dos lineas
               dejaria de ser un acento para convertirse en el fondo. */
            { text: "Así lo garantizamos.", color: "#EDEDED", delay: 0.15, tecnico: true }
          ].map((line, i) => (
            /* El overflow-hidden se quita SOLO en la linea tecnica: el canvas
               de TituloTecnico se sale 64px del bloque para dibujar el marco y
               las motas, y recortado ahi el efecto queda decapitado. La barra
               que barre no lo necesita —se recorta ella sola con clip-path—,
               asi que quitarlo no le cambia nada. */
            <div key={i} className={cn("relative block py-1.5", !line.tecnico && "overflow-hidden")}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  delay: line.delay + 0.35,
                  duration: 0.01
                }}
              >
                {/* La opacidad se mudo del h1 a este envoltorio a proposito.
                    TituloTecnico pinta en un canvas HERMANO del texto, asi que
                    con la animacion en el h1 la tinta del canvas aparecia de
                    golpe mientras el texto todavia estaba invisible. */}
                {line.tecnico ? (
                  <TituloTecnico secuencia={["Así lo", "garantizamos."]}>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
                      {line.text}
                    </h1>
                  </TituloTecnico>
                ) : (
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
                    {line.text}
                  </h1>
                )}
              </motion.div>

              {/* The Refined Revealer Block */}
              <motion.div
                initial={{ clipPath: i % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
                whileInView={{
                  clipPath: i % 2 === 0 
                    ? ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0 0 100%)"]
                    : ["inset(0 0 0 100%)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 100% 0 0)"]
                }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.75,
                  times: [0, 0.45, 0.55, 1],
                  delay: line.delay,
                  ease: [0.85, 0, 0.15, 1]
                }}
                className="absolute inset-0 z-10"
                style={{ backgroundColor: line.color }}
              />
            </div>
          ))}
        </div>

        {/* Glassmorphic Stats Bar */}
        <div className="sm:flex grid grid-cols-2 gap-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl mt-12 w-full mx-auto px-8 py-10 border rounded-2xl border-white/20 dark:border-white/5 shadow-2xl relative overflow-hidden">
          {/* Fondo WebGL (Auralis). Solo en tema oscuro: es un shader oscuro y en
              claro dejaria el texto negro ilegible. */}
          <Auralis
            colors={SEDA_ROJA}
            height="100%"
            className="absolute inset-0 z-0 hidden dark:block pointer-events-none opacity-70"
          />

          {/* Resplandor interior. Era azul de la plantilla original; ahora
              acompania al rojo del shader. Va en rgba y no en clase de
              Tailwind porque el token --hero-accent es un hex y el
              modificador de opacidad (/10) no sabe aplicarle alfa. */}
          <div
            className="absolute top-0 left-1/4 w-1/2 h-full blur-[100px] pointer-events-none"
            style={{ backgroundColor: "rgba(225,29,58,0.10)" }}
          />

          {stats.map((stat, index) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex-1 relative z-10"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex flex-col items-center justify-center relative h-full group">
                {index !== 0 && (
                  <div className="hidden sm:block w-0.5 h-12 border border-dashed border-neutral-200 dark:border-zinc-700 absolute -left-4" />
                )}

                <div className="flex flex-col items-center text-center transition-all duration-300 group-hover:opacity-40">
                  <span className="text-[10px] sm:text-xs font-medium text-neutral-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    {stat.label}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tighter flex items-baseline">
                    {stat.prefix && <span className="text-lg sm:text-2xl mr-0.5">{stat.prefix}</span>}
                    <Counter value={stat.value} decimals={stat.decimals} />
                    <span className="text-lg sm:text-2xl ml-0.5">{stat.suffix}</span>
                  </div>
                </div>

                {/* Smoky / Foggy Hover Reveal - Perfected Opacity */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-[-20px] flex items-center justify-center z-20 pointer-events-none"
                    >
                      {/* The 'Smoke' Layer - Solid Center Masking */}
                      <div
                        className="absolute inset-0 bg-white dark:bg-zinc-950 backdrop-blur-[50px]"
                        style={{
                          maskImage: 'radial-gradient(circle, black 45%, transparent 95%)',
                          WebkitMaskImage: 'radial-gradient(circle, black 45%, transparent 95%)',
                        }}
                      />

                      <span className="relative text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 drop-shadow-md z-30">
                        {stat.cta}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
