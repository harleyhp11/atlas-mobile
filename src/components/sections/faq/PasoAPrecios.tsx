"use client";

/* PASO DE PREGUNTAS A PRECIOS — transicion con parallax.

   La seccion de Precios sube como una lamina oscura de esquinas redondeadas
   y tapa a la de Preguntas. Mientras tanto, Preguntas se queda atras: avanza
   mas lento que el scroll (baja hasta un 28% de la pantalla), se encoge un
   poco hacia su borde inferior, redondea sus esquinas y se apaga bajo un
   velo negro. El efecto es de profundidad: una hoja pasando por encima de
   otra, no un corte seco entre el papel claro y el negro.

   Detalles que importan:
     · El progreso se mide sobre la LAMINA (de que asoma por abajo a que
       llega arriba), no sobre Preguntas, que es mas alta que la pantalla.
     · La lamina no lleva transform ni overflow: dentro estan las tarjetas
       apiladas de los planes, que usan position: sticky, y cualquiera de las
       dos cosas las romperia.
     · La lamina es una columna flex centrada, IGUAL que el bloque donde
       vivian los planes: asi las tarjetas conservan su ancho de siempre
       (1215 px a 1512; como bloque normal se estiraban a 1507). De paso, al
       ser flex, el margen superior del titular "Precios." no se escapa por
       encima de la lamina.
     · La lamina usa el mismo bg-background que el bloque que la contiene,
       para que donde termina no se vea costura.
     · Con movimiento reducido no hay parallax: las dos secciones quedan una
       debajo de la otra, tal cual. */

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function PasoAPrecios({ preguntas, precios }: { preguntas: ReactNode; precios: ReactNode }) {
    const lamina = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: lamina, offset: ["start end", "start start"] });

    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "28vh"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
    const radio = useTransform(scrollYProgress, [0, 0.3], [0, 40]);
    const velo = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

    return (
        <>
            <motion.div
                className="relative mt-8 w-full origin-bottom overflow-hidden md:mt-12"
                style={reduce ? undefined : { y, scale, borderRadius: radio }}
            >
                {preguntas}
                {!reduce && (
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-20 bg-black"
                        style={{ opacity: velo }}
                    />
                )}
            </motion.div>

            <div
                ref={lamina}
                className="relative z-20 flex w-full flex-col items-center rounded-t-[2.75rem] bg-background shadow-[0_-40px_90px_-20px_rgba(0,0,0,0.45)]"
            >
                {precios}
            </div>
        </>
    );
}

export default PasoAPrecios;
