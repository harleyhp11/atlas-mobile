"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

/* Los servicios de Atlas, agrupados en las tres columnas de la seccion.

   Viven aqui y no en portfolioData.hardSkills porque aquel array es la lista
   de habilidades tecnicas del portfolio original y lo consumen otras piezas.
   Estos son servicios que se venden, no habilidades que se declaran.

   `tipo` sustituye al antiguo `level` (beginner / intermediate / advanced /
   expert). El cambio no es cosmetico: un nivel es una autoevaluacion —y
   "BEGINNER" en la web de una agencia ahuyenta clientes—, mientras que el tipo
   dice algo util para quien esta cotizando. */
type TipoServicio = "core" | "medida" | "complementario";

const ETIQUETA_TIPO: Record<TipoServicio, string> = {
  core: "Servicio core",
  medida: "A medida",
  complementario: "Complementario",
};

/* Color de la barra segun el tipo de servicio.

   Tres tonos de la propia marca y no tres colores nuevos (verde, ambar,
   indigo, como en el diseño anterior): el sitio entero es monocromo con un
   solo acento rojo, y meter tres hues aqui reabriria el arcoiris que se quito
   de los tags de servicios y de la galeria.

   Ademas la escala DICE algo: el rojo es el acento de Atlas y se lo lleva lo
   que hacemos en casi todos los proyectos; el blanco, lo que se cotiza aparte;
   el gris, lo que se suma. Se lee de mas a menos sin necesidad de leyenda. */
const COLOR_TIPO: Record<TipoServicio, string> = {
  core: "var(--hero-accent, #E11D3A)",
  medida: "rgba(255,255,255,0.85)",
  complementario: "rgba(255,255,255,0.28)",
};

interface Servicio {
  name: string;
  tipo: TipoServicio;
  description: string;
}

const SERVICIOS: Record<"diseno" | "desarrollo" | "soporte", Servicio[]> = {
  diseno: [
    { name: "Diseño UI/UX", tipo: "core", description: "Interfaces pensadas para que el visitante haga lo que tu negocio necesita." },
    { name: "Landing pages", tipo: "core", description: "Una página, un objetivo: convertir visitas en contactos o ventas." },
    { name: "Prototipado en Figma", tipo: "core", description: "Prototipo navegable y aprobado antes de escribir una línea de código." },
    { name: "Identidad visual", tipo: "complementario", description: "Logo, paleta, tipografía y un sistema visual coherente en todos tus canales." },
    { name: "Diseño responsive", tipo: "core", description: "Pensado desde el móvil, que es donde está la mayor parte de tu tráfico." },
    { name: "Copy y jerarquía", tipo: "complementario", description: "Qué dice cada sección y en qué orden, para que el mensaje llegue." },
  ],
  desarrollo: [
    { name: "Webs corporativas", tipo: "core", description: "Sitios de varias páginas, rápidos y listos para posicionar en buscadores." },
    { name: "E-commerce", tipo: "medida", description: "Tiendas en línea con pasarela de pago, inventario y gestión de envíos." },
    { name: "Software a medida", tipo: "medida", description: "Sistemas internos que resuelven la operación real de tu negocio." },
    { name: "Aplicaciones web", tipo: "medida", description: "Plataformas con usuarios, roles, paneles y datos en tiempo real." },
    { name: "Integraciones", tipo: "complementario", description: "Pagos, CRM, WhatsApp, facturación y las herramientas que ya usas." },
    { name: "Performance y SEO técnico", tipo: "core", description: "Carga rápida, métricas sanas y una base sólida para aparecer en Google." },
  ],
  soporte: [
    { name: "Analítica y medición", tipo: "complementario", description: "Instalamos y configuramos el seguimiento para saber qué funciona." },
    { name: "Optimización de conversión", tipo: "complementario", description: "Ajustes sobre datos reales para que más visitas terminen en contacto." },
    { name: "Mantenimiento mensual", tipo: "complementario", description: "Actualizaciones, respaldos y monitoreo para que nada se caiga." },
    { name: "Hosting y dominio", tipo: "complementario", description: "Configuramos todo y te lo dejamos a tu nombre, no al nuestro." },
    { name: "Migraciones", tipo: "medida", description: "Traemos tu web actual a una base más rápida sin perder posicionamiento." },
    { name: "Capacitación", tipo: "complementario", description: "Te enseñamos a editar contenidos y a leer tus propias métricas." },
    { name: "Automatizaciones", tipo: "medida", description: "Conectamos procesos repetitivos para que dejen de consumirte horas." },
    { name: "Correo corporativo", tipo: "complementario", description: "Cuentas con tu dominio, configuradas y funcionando." },
    { name: "Contenido y actualizaciones", tipo: "complementario", description: "Cambios de texto, imágenes y nuevas secciones cuando los necesites." },
  ],
};

/* Cuantas se ven antes de pulsar "Ver mas". El contador del boton sale de
   restar esto al length del array, nunca de un numero escrito a mano. */
const VISIBLES = 3;

export const HardSkills = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    diseno: false,
    desarrollo: false,
    soporte: false
  });

  const toggleExpand = (category: string) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const categorizedSkills = SERVICIOS;

  return (
    <section id="hard-skills" className="w-full bg-background pt-32 md:pt-40 lg:pt-52 pb-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[1400px] px-4 md:px-8 mx-auto relative z-10 flex flex-col items-center">

        {/* Title */}
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="tracking-tighter text-balance text-4xl font-bold md:text-5xl lg:text-6xl text-foreground mb-4"
          >
            Qué hacemos
          </motion.h2>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs font-bold text-muted-foreground uppercase tracking-[0.4em] bg-muted/50 px-4 py-2 rounded-full"
          >
            Servicios y capacidades
          </motion.span>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex w-full items-center bg-white dark:bg-[#111111] border border-black/5 dark:border-white/10 rounded-full mb-8 shadow-sm relative z-20 overflow-hidden"
        >
          <div className="flex-1 text-center py-4 font-bold text-sm cursor-default relative z-10 overflow-hidden transition-colors duration-700 text-foreground hover:text-white dark:hover:text-black before:content-[''] before:absolute before:inset-0 before:bg-black dark:before:bg-white before:-z-10 before:transition-transform before:duration-700 before:ease-in-out before:origin-left before:scale-x-0 hover:before:scale-x-100">
            Diseño
          </div>
          <div className="w-px h-8 bg-black/10 dark:bg-white/10 shrink-0 relative z-20"></div>
          <div className="flex-1 text-center py-4 font-bold text-sm cursor-default relative z-10 overflow-hidden transition-colors duration-700 text-foreground hover:text-white dark:hover:text-black before:content-[''] before:absolute before:inset-0 before:bg-black dark:before:bg-white before:-z-10 before:transition-transform before:duration-700 before:ease-in-out before:origin-bottom before:scale-y-0 hover:before:scale-y-100">
            Desarrollo
          </div>
          <div className="w-px h-8 bg-black/10 dark:bg-white/10 shrink-0 relative z-20"></div>
          <div className="flex-1 text-center py-4 font-bold text-sm cursor-default relative z-10 overflow-hidden transition-colors duration-700 text-foreground hover:text-white dark:hover:text-black before:content-[''] before:absolute before:inset-0 before:bg-black dark:before:bg-white before:-z-10 before:transition-transform before:duration-700 before:ease-in-out before:origin-right before:scale-x-0 hover:before:scale-x-100">
            Crecimiento y soporte
          </div>
        </motion.div>

        {/* 3 Columns Grid (Kanban Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full relative z-10 items-stretch">

          {/* Column 1: AI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col bg-black/5 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[2rem] p-4 lg:p-6 shadow-sm h-full max-h-[650px]"
          >
            <div className="shrink-0 md:hidden inline-block px-6 py-2.5 bg-foreground text-background rounded-full font-bold text-sm mb-4 text-center w-max mx-auto shadow-md">
              Diseño
            </div>
            <div
              data-lenis-prevent={expanded.diseno ? "true" : undefined}
              onWheel={expanded.diseno ? (e) => e.stopPropagation() : undefined}
              className={cn(
                "flex flex-col gap-4 flex-grow min-h-0 transition-all duration-300 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full",
                expanded.diseno ? "overflow-y-auto" : "overflow-hidden"
              )}
            >
              <AnimatePresence>
                {categorizedSkills['diseno'].slice(0, expanded.diseno ? undefined : VISIBLES).map((skill, idx) => (
                  <SkillCard key={skill.name} skill={skill} delay={idx * 0.05} />
                ))}
              </AnimatePresence>
            </div>
            {categorizedSkills['diseno'].length > 3 && (
              <div className="shrink-0 mt-auto pt-4">
                <button
                  onClick={() => toggleExpand('diseno')}
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-foreground font-medium text-sm transition-colors border border-black/5 dark:border-white/5"
                >
                  {expanded.diseno ? (
                    <>Ver menos <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Ver más ({categorizedSkills['diseno'].length - VISIBLES}) <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Column 2: Software */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col bg-black/5 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[2rem] p-4 lg:p-6 shadow-sm h-full max-h-[650px]"
          >
            <div className="shrink-0 md:hidden inline-block px-6 py-2.5 bg-foreground text-background rounded-full font-bold text-sm mb-4 text-center w-max mx-auto shadow-md">
              Desarrollo
            </div>
            <div
              data-lenis-prevent={expanded.desarrollo ? "true" : undefined}
              onWheel={expanded.desarrollo ? (e) => e.stopPropagation() : undefined}
              className={cn(
                "flex flex-col gap-4 flex-grow min-h-0 transition-all duration-300 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full",
                expanded.desarrollo ? "overflow-y-auto" : "overflow-hidden"
              )}
            >
              <AnimatePresence>
                {categorizedSkills['desarrollo'].slice(0, expanded.desarrollo ? undefined : VISIBLES).map((skill, idx) => (
                  <SkillCard key={skill.name} skill={skill} delay={idx * 0.05} />
                ))}
              </AnimatePresence>
            </div>
            {categorizedSkills['desarrollo'].length > 3 && (
              <div className="shrink-0 mt-auto pt-4">
                <button
                  onClick={() => toggleExpand('desarrollo')}
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-foreground font-medium text-sm transition-colors border border-black/5 dark:border-white/5"
                >
                  {expanded.desarrollo ? (
                    <>Ver menos <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Ver más ({categorizedSkills['desarrollo'].length - VISIBLES}) <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Column 3: Additional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col bg-black/5 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[2rem] p-4 lg:p-6 shadow-sm h-full max-h-[650px]"
          >
            <div className="shrink-0 md:hidden inline-block px-6 py-2.5 bg-foreground text-background rounded-full font-bold text-sm mb-4 text-center w-max mx-auto shadow-md">
              Crecimiento y soporte
            </div>
            <div
              data-lenis-prevent={expanded.soporte ? "true" : undefined}
              onWheel={expanded.soporte ? (e) => e.stopPropagation() : undefined}
              className={cn(
                "flex flex-col gap-4 flex-grow min-h-0 transition-all duration-300 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full",
                expanded.soporte ? "overflow-y-auto" : "overflow-hidden"
              )}
            >
              <AnimatePresence>
                {categorizedSkills['soporte'].slice(0, expanded.soporte ? undefined : VISIBLES).map((skill, idx) => (
                  <SkillCard key={skill.name} skill={skill} delay={idx * 0.05} />
                ))}
              </AnimatePresence>
            </div>
            {categorizedSkills['soporte'].length > 3 && (
              <div className="shrink-0 mt-auto pt-4">
                <button
                  onClick={() => toggleExpand('soporte')}
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-foreground font-medium text-sm transition-colors border border-black/5 dark:border-white/5"
                >
                  {expanded.soporte ? (
                    <>Ver menos <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Ver más ({categorizedSkills['soporte'].length - VISIBLES}) <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

/* Tarjeta de servicio.

   Dos cosas que ya NO lleva, y no por descuido:

   - La barra de progreso. Medía un "nivel" inventado (95% para experto, 40%
     para principiante) y en la web de una agencia eso es una cifra sin
     respaldo. En su lugar va un filete fino y estatico: ocupa el mismo hueco
     vertical, asi que la tarjeta no se descompensa, pero no sugiere medida.
   - Los colores por nivel (azul, esmeralda, ambar, indigo). Eran cuatro
     acentos compitiendo en una pagina monocroma. La etiqueta de tipo va en
     gris y el degradado del hover, en neutro. */
const SkillCard = ({ skill, delay }: { skill: Servicio, delay: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: delay }}
      className="shrink-0 p-5 md:p-6 bg-white dark:bg-[#141414] border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg flex flex-col justify-start w-full relative overflow-hidden"
    >
      <div className="mb-4 relative z-10">
        <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
          {/* min-w-0 en el titulo y shrink-0 en el badge: sin esto, con
              titulos largos como "Optimizacion de conversion" el badge se caia
              a una segunda linea y esa tarjeta crecia mas que sus vecinas,
              rompiendo la alineacion de la columna. Ahora parte el titulo, que
              es lo que debe ceder. */}
          <h5 className="min-w-0 flex-1 font-sans font-bold text-base tracking-tight text-foreground/90 leading-tight group-hover:text-primary transition-colors">{skill.name}</h5>
          <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap border bg-muted/50 text-muted-foreground border-border/50">
            {ETIQUETA_TIPO[skill.tipo]}
          </span>
        </div>

        {/* La barra vuelve porque es lo que le daba cuerpo a la tarjeta, pero
            SIEMPRE al 100%. La de antes se llenaba a 40, 60, 80 o 95% segun un
            "nivel" —y un porcentaje parcial es una afirmacion: dice que de esto
            sabemos menos que de aquello—. Llena entera no mide nada: solo
            colorea la categoria que el badge ya nombra.
            La animacion de entrada se conserva, pero anima la ESCALA desde el
            borde izquierdo en vez del ancho: un scaleX se compone en GPU,
            mientras que animar width obliga a recalcular el layout en cada
            fotograma. */}
        <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "circOut", delay: 0.2 }}
            className="h-full w-full origin-left rounded-full"
            style={{ background: COLOR_TIPO[skill.tipo] }}
          />
        </div>
      </div>
      <p className="text-xs md:text-sm font-sans text-muted-foreground/80 leading-relaxed relative z-10">
        {skill.description}
      </p>

      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-foreground/20 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default HardSkills;
