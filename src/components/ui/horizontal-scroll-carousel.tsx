"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import {
  Search, Target, Gauge, Code2, ClipboardList,
  MessageSquare, CalendarCheck, LineChart, KeyRound, LifeBuoy
} from "lucide-react";
import { EtiquetaSeccion } from "@/components/ui/etiqueta-seccion";

/* Los diez principios de trabajo de Atlas.

   Viven aqui y no en portfolioData.softSkills a proposito: aquel array lo
   comparten otras piezas, y estos textos son de esta pagina. Al dejar de
   leerlo, el carrusel deja de depender de datos que no le pertenecen.

   Cada tarjeta lleva un icono de lucide-react en lugar de las ilustraciones
   de illustrations.popsy.co que habia antes. Dos motivos: el doodle blanco
   chocaba con la estetica editorial oscura del resto del sitio, y eran diez
   peticiones a un servidor externo en cada carga. lucide ya se empaqueta con
   la app. */
const TARJETAS = [
  { id: 1,  title: "Entender el negocio",  Icon: Search,
    description: "Antes de diseñar preguntamos qué vendes, a quién y qué necesitas que pase." },
  { id: 2,  title: "Diseño con intención", Icon: Target,
    description: "Cada sección existe para mover a alguien a actuar, no para rellenar espacio." },
  { id: 3,  title: "Velocidad real",       Icon: Gauge,
    description: "Optimizamos para que tu web cargue en menos de dos segundos." },
  { id: 4,  title: "Código propio",        Icon: Code2,
    description: "Nada de plantillas recicladas ni constructores cerrados que te aten." },
  { id: 5,  title: "Alcance claro",        Icon: ClipboardList,
    description: "Precio, plazo y entregables por escrito desde el primer día." },
  { id: 6,  title: "Trato directo",        Icon: MessageSquare,
    description: "Hablas con quien diseña y programa, sin intermediarios." },
  { id: 7,  title: "Entrega puntual",      Icon: CalendarCheck,
    description: "Las fechas que comprometemos son las fechas que cumplimos." },
  { id: 8,  title: "Medir para mejorar",   Icon: LineChart,
    description: "Analítica desde el lanzamiento: decisiones con datos, no con corazonadas." },
  { id: 9,  title: "Autonomía",            Icon: KeyRound,
    description: "Te entregamos la web y te enseñamos a administrarla tú mismo." },
  { id: 10, title: "Acompañamiento",       Icon: LifeBuoy,
    description: "Treinta días de soporte después de publicar, incluidos." },
];

export const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-68%"]);

  return (
    <section
      ref={targetRef}
      className="relative h-[350vh] bg-background"
    >
      <div className="sticky top-0 flex flex-col h-screen overflow-hidden pb-8 md:pb-12">

        {/* CABECERA CON EL SISTEMA DE ATLAS. Es la hermana de "Proceso" en la
            home (horizontal-timeline.tsx), asi que habla exactamente igual:
            etiqueta con las cuñas rojas, "Cómo" pequeño y apagado arriba y
            "Trabajamos" grande en la condensada, con el mismo degradado. La
            barra blanca que habia debajo no existe en ninguna otra seccion: el
            acento lo pone la etiqueta, como en todas.

            Lo unico que cambia es la escala. Aqui el titulo comparte pantalla
            con tarjetas de 440px, asi que se mide tambien por el ALTO de la
            ventana (13.5vh). Ese tope sale de cuadrar un portatil de 768px de
            alto: titulo de 104px, bajada en UNA linea y la tarjeta entra con
            6px de sobra. Si la bajada vuelve a ocupar dos lineas, hay que
            bajar el 13.5vh o las tarjetas se cortan por abajo. */}
        <div className="w-full px-6 md:px-24 pt-6 md:pt-8 lg:pt-12 z-20 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-5">
              <EtiquetaSeccion codigo="Principios" texto="10" />
            </div>
            <h2 className="font-condensed uppercase leading-[0.82] tracking-[-0.005em] text-[clamp(2.5rem,min(9vw,13.5vh),9.5rem)]">
              <span className="block text-[0.2em] leading-none tracking-[0.06em] text-foreground/40">
                Cómo
              </span>
              <span className="mt-[0.14em] block bg-gradient-to-b from-foreground from-[20%] via-foreground/55 via-[55%] to-foreground/0 to-[86%] bg-clip-text text-transparent">
                Trabajamos
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Lo que cumplimos en cada proyecto, antes y después de lanzarlo.
            </p>
          </motion.div>
        </div>

        {/* Las tarjetas, con aire fijo respecto a la cabecera para que el texto no se pegue. */}
        <div className="flex-1 flex items-center w-full relative mt-4 lg:mt-6">
          <motion.div style={{ x }} className="flex gap-6 md:gap-8 px-6 md:px-24 absolute w-max">
            {TARJETAS.map((card) => {
              return <Card card={card} key={card.id} />;
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Card = ({ card }: { card: typeof TARJETAS[0] }) => {
  const { Icon } = card;
  return (
    <div
      key={card.id}
      className="group relative h-[320px] w-[240px] sm:h-[360px] sm:w-[280px] md:h-[400px] md:w-[320px] lg:h-[440px] lg:w-[380px] overflow-hidden bg-card/10 hover:bg-card/30 border border-border/80 shadow-sm flex-shrink-0 transition-colors duration-500 rounded-none max-h-[50vh] lg:max-h-[60vh]"
    >
      {/* Esquinas al pasar el raton, en el rojo de Atlas. Eran azules: el
          unico color de toda la pagina fuera de la paleta. */}
      <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-[2px] border-l-[2px] border-[#E11D3A] opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 transform -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
      <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-[2px] border-r-[2px] border-[#E11D3A] opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
      <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-[2px] border-l-[2px] border-[#E11D3A] opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 transform -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
      <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-[2px] border-r-[2px] border-[#E11D3A] opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />

      <div className="absolute inset-0 z-0 flex items-center justify-center p-6 sm:p-8 transition-transform duration-700 group-hover:scale-[1.03] opacity-60 group-hover:opacity-100">
        {/* Mismo hueco que ocupaba la ilustracion, mismo tamaño: solo cambia
            el contenido. Con strokeWidth 1 porque a este tamaño el grosor por
            defecto de lucide se ve tosco. */}
        <Icon className="w-1/2 h-1/2 text-foreground" strokeWidth={1} aria-hidden="true" />
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-100 pointer-events-none"></div>

      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 lg:p-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-3 lg:mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="p-2 border border-border bg-background/50 backdrop-blur-sm rounded-none">
            <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
          </div>
          <span className="text-[10px] lg:text-xs font-mono text-muted-foreground uppercase tracking-widest">
            #{String(card.id).padStart(2, '0')}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-foreground mb-2 lg:mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 leading-tight">
          {card.title}
        </h3>

        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150 border-t border-border/50 pt-3 lg:pt-4">
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
