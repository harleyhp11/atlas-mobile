"use client";
import { cn } from "@/lib/utils";
import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  isEnd?: boolean;
  period?: string;
}

/* Luz de los marcadores del timeline.

   La activa lleva cuatro capas: un aro fino pegado al borde, un halo cercano,
   un resplandor amplio y muy tenue, y una sombra oscura debajo que le da peso.
   Sumadas se leen como una sola luz blanda y no como un borde encendido.

   Van como clase y no como estilo en linea porque necesitan variante por
   tema: en claro el fondo de la seccion es blanco, la bolita se invierte a
   negro y la luz pasa a ser sombra. */
const LUZ_ACTIVA =
  "shadow-[0_0_0_5px_rgba(0,0,0,0.09),0_0_20px_rgba(0,0,0,0.28),0_0_46px_rgba(0,0,0,0.14),0_6px_18px_rgba(0,0,0,0.28)] " +
  "dark:shadow-[0_0_0_5px_rgba(255,255,255,0.16),0_0_20px_rgba(255,255,255,0.55),0_0_50px_rgba(255,255,255,0.30),0_6px_18px_rgba(0,0,0,0.55)]";

/* Las inactivas no brillan: solo se despegan del fondo lo justo. */
const LUZ_INACTIVA =
  "shadow-[0_3px_10px_rgba(0,0,0,0.10)] " +
  "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_12px_rgba(0,0,0,0.45)]";

/* Tramo inicial del recorrido reservado al titular: hasta aqui el carrusel no
   se mueve, solo sube el encabezado. A partir de INICIO arranca el timeline. */
const INICIO = 0.12;

/* Capsula incrustada en el titular: una imagen fija en blanco y negro.
   El recorte panoramico (720x302) coincide con la proporcion de la pastilla,
   asi que object-cover no llega a recortar nada. */
function CintaMedia() {
  return (
    <span
      aria-hidden="true"
      className="relative ml-[0.16em] hidden h-[0.76em] w-[1.85em] shrink-0 translate-y-[0.02em] overflow-hidden rounded-full align-middle md:inline-block"
    >
      <img
        src="/assets/capsula-portafolio.webp"
        alt=""
        decoding="async"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
    </span>
  );
}

export const HorizontalTimeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Paso mas lejano que ha alcanzado la linea de progreso AHORA MISMO.
  // Deliberadamente no es acumulativo: bajando, todos los pasos anteriores
  // quedan abiertos; subiendo, se van cerrando otra vez. Si fuese permanente,
  // al volver al principio las cards de los primeros pasos seguirian
  // desplegadas y se comerian el titular.
  const alcanzadoRef = useRef(-1);
  const [alcanzado, setAlcanzado] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [scrollWidth, setScrollWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      const updateDimensions = () => {
        if (scrollRef.current) {
          setScrollWidth(scrollRef.current.scrollWidth);
          setViewportWidth(window.innerWidth);
        }
      };

      updateDimensions();

      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });

      resizeObserver.observe(scrollRef.current);
      window.addEventListener("resize", updateDimensions);

      return () => {
        if (scrollRef.current) {
          resizeObserver.unobserve(scrollRef.current);
        }
        resizeObserver.disconnect();
        window.removeEventListener("resize", updateDimensions);
      };
    }
  }, [data]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // El avance se remapea al tramo util: durante la subida del titular el
    // carrusel esta quieto, asi que ningun paso debe marcarse activo todavia.
    const avance = Math.max(0, (latest - INICIO) / (1 - INICIO));
    const blueLineTip = avance * window.innerWidth;

    let current = -1;
    for (let i = 0; i < data.length; i++) {
      const el = itemRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        const start = rect.left;
        const nextEl = itemRefs.current[i + 1];
        const end = nextEl ? nextEl.getBoundingClientRect().left : rect.left + rect.width;

        if (blueLineTip >= start && blueLineTip < end) {
          current = i;
          break;
        }
      }
    }
    setActiveIndex(current);

    // El despliegue se calcula aparte de "activo". El test de activo exige que
    // el puntero caiga DENTRO del rango de un paso, y en los extremos no cae
    // en ninguno (current = -1); ademas un scroll rapido puede saltarse uno y
    // dejar un hueco. Aqui basta con que el puntero haya pasado el inicio del
    // paso, asi que no hay huecos posibles y es reversible.
    let hasta = -1;
    for (let i = 0; i < data.length; i++) {
      const el = itemRefs.current[i];
      if (el && el.getBoundingClientRect().left <= blueLineTip) hasta = i;
    }
    if (hasta !== alcanzadoRef.current) {
      alcanzadoRef.current = hasta;
      setAlcanzado(hasta);
    }
  });

  // Transform scroll progress into horizontal movement
  const xTransform = useTransform(
    scrollYProgress,
    [INICIO, 1],
    [0, -Math.max(0, scrollWidth - viewportWidth + 200)] // Stop exactly when the right edge comes into view
  );

  // El titular sube un poco mas rapido que la pagina durante ese primer tramo:
  // es lo que hace legible que primero se retira el titulo y luego se mueve
  // el carrusel, en vez de que las dos cosas arranquen a la vez.
  const tituloY = useTransform(scrollYProgress, [0, INICIO], [0, -70]);

  const headerRef = useRef<HTMLDivElement>(null);

  const opacityTransform = useTransform(scrollYProgress, [INICIO, INICIO + 0.04], [0, 1]);
  const progressWidth = useTransform(scrollYProgress, [INICIO, 1], ["0%", "100%"]);

  return (
    <div
      className="w-full bg-background font-sans relative"
      ref={containerRef}
      style={{ height: "400vh" }} // Tall container for scrolling
    >
      {/* Fondo: la cumbre. Va en su propia capa y NO dentro del carril: ese
          contenedor es z-40 y tapaba el titular, que vive fuera del sticky
          para poder irse con el scroll.

          El envoltorio es absolute (asi no ocupa sitio en el flujo) y dentro
          va un sticky de una pantalla de alto: la foto se queda quieta como
          un telon durante las 400vh de recorrido en vez de desplazarse.

          Solo en tema oscuro, igual que el shader de la card de metricas: en
          claro esta seccion pinta las mascaras del final de la linea y los
          circulos de los pasos en blanco, y sobre una foto negra quedarian
          como manchas. */}
      {/* OJO: este envoltorio no puede llevar overflow-hidden. Un overflow
          distinto de visible lo convierte en contenedor de scroll, y entonces
          el sticky de dentro se ancla a ESE contenedor —que no scrollea— en
          vez de a la pagina: la foto deja de quedarse fija y sube con el
          titular. Tampoco hace falta recortar nada: el hijo mide una pantalla
          y la foto es absolute dentro de el, asi que no desborda. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden dark:block">
        <div className="sticky top-0 h-screen w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/brand/proceso-cumbre.webp)" }}
          />
          {/* Velo vertical: cierra arriba y abajo, donde viven el titular y
              los pasos, y deja respirar la franja central por la que asoma la
              cresta. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.45) 34%, rgba(0,0,0,0.35) 62%, rgba(0,0,0,0.78) 100%)",
            }}
          />
        </div>
      </div>

      {/* Header/Title area - Now outside the sticky container so it scrolls away normally */}
      <motion.div
        ref={headerRef}
        style={{ y: tituloY }}
        className="absolute top-12 md:top-24 left-0 right-0 px-4 md:px-8 lg:px-10 z-20 w-full max-w-[1750px] mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* --- FONDO: halo lima muy sutil detrás del titular --- */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[10%] -inset-y-[60%] -z-10"
            style={{ background: "radial-gradient(45% 55% at 30% 50%, rgba(218,255,107,0.04) 0%, transparent 70%)" }}
          />

          {/* --- PASTILLAS: seccion + numero de pasos (5 en los datos) --- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center justify-start"
          >
            {/* La misma etiqueta que el resto de secciones. Antes eran una
                pastilla blanca y un circulo solapados; se cambian por el
                componente compartido para que las cabeceras de la pagina
                hablen todas el mismo idioma. */}
            <EtiquetaSeccion codigo="Proceso" texto="05" />
          </motion.div>

          {/* Bloque pegado a la izquierda del contenedor. */}
          <div className="w-max max-w-full">
          {/* --- TITULAR: jerarquia de la referencia. "Cómo" pequeño y
                  apagado arriba, "Trabajamos" enorme debajo y la capsula de
                  medios cerrando la linea. Vuelve la condensada (Anton): es
                  lo que da el caracter de la referencia y ademas permite una
                  palabra mucho mas grande en el mismo ancho. --- */}
            <h2 className="font-condensed uppercase leading-[0.82] tracking-[-0.005em] text-[clamp(2.5rem,12.4vw,13rem)]">
              <span className="block text-[0.2em] leading-none tracking-[0.06em] text-foreground/40">
                Cómo
              </span>
              <span className="mt-[0.14em] flex items-center">
                <span className="bg-gradient-to-b from-foreground from-[20%] via-foreground/55 via-[55%] to-foreground/0 to-[86%] bg-clip-text text-transparent">
                  Trabajamos
                </span>
                <CintaMedia />
              </span>
            </h2>
          </div>

        </motion.div>
      </motion.div>

      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden w-full max-w-[100vw] z-40">
        {/* The horizontal track */}
        <div className="relative w-full flex items-center justify-center h-full">
          {/* Background Line - Faded at edges */}
          <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 overflow-hidden h-[2px] bg-[linear-gradient(to_right,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]" />

          {/* Progress Line.
              Mismo reparto de paradas de siempre: el color arranca en el
              origen, llega a su punto mas vivo al 10% y de ahi se desvanece
              durante el resto del recorrido. Pasa de rojo a blanco, que sobre
              la foto de la cumbre se recorta mucho mejor: el rojo competia
              con la roca en vez de despegarse de ella.
              El arranque va al 35% y no a blanco pleno para que la cabeza de
              la linea siga siendo el punto mas luminoso. */}
          <motion.div
            style={{
              width: progressWidth,
              opacity: opacityTransform,
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-white/35 via-white to-transparent from-[0%] via-[10%] rounded-full z-10"
          />

          {/* Scrolling Content */}
          <motion.div
            ref={scrollRef}
            style={{ x: xTransform }}
            className="flex flex-row items-center px-8 md:px-32 w-max gap-12 md:gap-24 absolute left-0 top-1/2 -translate-y-1/2 z-20"
          >
            {data.map((item, index) => {
              const isEven = index % 2 === 0; // Alternating logic
              const isActive = activeIndex === index;
              // `abierto` gobierna el contenido desplegado; `isActive` se queda
              // solo para el marcador, que debe seguir marcando donde estas.
              const abierto = isActive || index <= alcanzado;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative w-[320px] md:w-[420px] shrink-0 h-0 group cursor-pointer"
                >
                  {/* Marcador sobre la linea: numero del paso en un circulo.
                      El item final ("ver mas") no numera, mantiene el punto. */}
                  <div className={cn(
                    "absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background flex items-center justify-center border-none z-20 transition-transform duration-500",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )}>
                    {item.isEnd ? (
                      <div className={cn(
                        "h-4 w-4 rounded-full border transition-colors duration-500",
                        isActive
                          ? "bg-primary border-primary"
                          : "bg-neutral-300 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-700 group-hover:bg-primary group-hover:border-primary"
                      )} />
                    ) : (
                      <div className={cn(
                        "grid h-10 w-10 place-items-center rounded-full border font-mono text-[16px] font-bold tabular-nums tracking-[-0.03em] transition-all duration-500",
                        isActive
                          // bg-foreground se invierte con el tema: blanca sobre
                          // el negro, negra sobre el blanco. Con bg-white fija
                          // desaparecia en tema claro.
                          ? cn("border-foreground bg-foreground text-background", LUZ_ACTIVA)
                          : cn(
                              "border-neutral-300 bg-white text-neutral-500 dark:border-white/15 dark:bg-[#111] dark:text-white/70 group-hover:border-foreground group-hover:text-foreground",
                              LUZ_INACTIVA
                            )
                      )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    )}
                  </div>

                  {item.isEnd ? (
                    <>
                      {/* Mask to hide the line after the end circle */}
                      <div
                        className="absolute top-1/2 left-5 h-[20px] w-full bg-background -translate-y-1/2 z-10"
                        style={{
                          boxShadow: '400px 0 0 0 hsl(var(--background)), 800px 0 0 0 hsl(var(--background)), 1200px 0 0 0 hsl(var(--background)), 1600px 0 0 0 hsl(var(--background)), 2000px 0 0 0 hsl(var(--background)), 2400px 0 0 0 hsl(var(--background)), 2800px 0 0 0 hsl(var(--background)), 3200px 0 0 0 hsl(var(--background)), 3600px 0 0 0 hsl(var(--background)), 4000px 0 0 0 hsl(var(--background))'
                        }}
                      />
                      {/* The content block for View More (small card) */}
                      <div className={cn(
                        "absolute left-10 top-1/2 -translate-y-1/2 z-30 transition-transform duration-500",
                        abierto ? "scale-105 translate-x-2" : "group-hover:scale-105 group-hover:translate-x-2"
                      )}>
                        {item.content}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* TITLE - Fades out on hover */}
                      <div className={cn(
                        "absolute left-10 w-[280px] md:w-[350px] transition-all duration-500 z-20",
                        !isEven ? 'bottom-4' : 'top-4'
                      )}>
                        <div className={cn(
                          "transition-all duration-500",
                          abierto ? "opacity-0 translate-x-2" : "group-hover:opacity-0 group-hover:translate-x-2"
                        )}>
                          <h3 className="text-2xl md:text-[1.75rem] font-black leading-[1.05] tracking-[-0.02em] text-neutral-900 dark:text-white">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* DATE - Fades in on hover, on the OPPOSITE side */}
                      {item.period && (
                        <div className={cn(
                          "absolute left-8 transition-all duration-500 z-20 pointer-events-none",
                          !isEven ? 'top-4' : 'bottom-4',
                          abierto ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                          !isEven && abierto ? "-translate-y-1" : "",
                          !isEven && !abierto ? "group-hover:-translate-y-1" : "",
                          isEven && abierto ? "translate-y-1" : "",
                          isEven && !abierto ? "group-hover:translate-y-1" : ""
                        )}>
                          <div className="inline-block px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-sm">
                            <span className="text-[10px] md:text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">{item.period}</span>
                          </div>
                        </div>
                      )}

                      {/* CARD - Appears on the SAME side as Title, replacing it */}
                      <div className={cn(
                        "absolute left-8 w-full pr-4 transition-all duration-500 ease-out z-30",
                        !isEven ? 'bottom-2' : 'top-2',
                        abierto ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100",
                        !isEven && !abierto ? "translate-y-4 group-hover:translate-y-0" : "",
                        isEven && !abierto ? "-translate-y-4 group-hover:translate-y-0" : ""
                      )}>
                        {item.content}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
