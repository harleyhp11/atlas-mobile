"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

const techStackItems = [
    // 5 AI & Data
    ...portfolioData.techStack.filter(s => s.name === 'TensorFlow' || s.name === 'PyTorch' || s.name === 'LangChain' || s.name === 'Scikit-learn' || s.name === 'OpenCV'),
    // 5 Software Engineering
    ...portfolioData.techStack.filter(s => s.name === 'TypeScript' || s.name === 'Next.js' || s.name === 'Python' || s.name === 'Node.js' || s.name === 'React')
].slice(0, 10);

const toolItems = portfolioData.tools.slice(0, 10);

/* Las dos cintas viven ahora DENTRO de la tarjeta oscura del stack, al pie de
   la foto de neon, asi que van pequenas y en blanco.

   El blanco de los logos no es un color: es `brightness(0) invert(1)`. Cada
   logo trae su propia marca —el verde de Node, el azul de Docker, el naranja
   de TensorFlow— y en fila eso es justo el ruido que sobraba. brightness(0)
   aplana todo pixel opaco a negro conservando el alfa, e invert(1) lo sube a
   blanco: quedan siluetas limpias de la forma real del logo, sin recortar
   nada a mano ni pedir una version monocroma de cada marca.

   Los rotulos van al 85% y no al 100%: a plena opacidad competian con los
   titulares de la tarjeta de vidrio que tienen encima. */
const ScrollerItem = ({ name, icon }: { name: string; icon: string }) => (
    <div className="flex items-center gap-2.5 px-6 py-1">
        <div className="relative h-5 w-5 flex-shrink-0">
            <Image
                src={icon}
                alt={name}
                fill
                className="object-contain [filter:brightness(0)_invert(1)]"
                unoptimized
            />
        </div>
        <p className="whitespace-nowrap text-[12.5px] font-semibold tracking-[-0.01em] text-white/85">
            {name}
        </p>
    </div>
);

/* El degradado de los bordes se cierra antes que en la version anterior (8% y
   no 10%): la cinta mide ahora el ancho de una tarjeta, no el de la pagina, y
   con el fundido largo se comia media fila de logos. */
const CINTA =
    "relative flex w-full overflow-hidden " +
    "[mask-image:linear-gradient(to_right,_rgba(0,0,0,0),rgba(0,0,0,1)_8%,rgba(0,0,0,1)_92%,rgba(0,0,0,0))]";

/* 40s y no 30: la lista es la misma pero los items son mas cortos, asi que a
   la velocidad de antes el bucle se sentia nervioso. La seccion busca lo
   contrario. */
const DURACION = 40;

export const BrandScroller = () => {
    return (
        <div className={CINTA}>
            <motion.div
                animate={{ x: ["-50%", "0%"] }}
                transition={{ duration: DURACION, ease: "linear", repeat: Infinity }}
                className="flex whitespace-nowrap"
            >
                {/* Dos copias para que el bucle cierre sin costura */}
                <div className="flex shrink-0">
                    {techStackItems.map((item, idx) => (
                        <ScrollerItem key={`tech-1-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
                <div className="flex shrink-0">
                    {techStackItems.map((item, idx) => (
                        <ScrollerItem key={`tech-2-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export const BrandScrollerReverse = () => {
    return (
        <div className={CINTA}>
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: DURACION, ease: "linear", repeat: Infinity }}
                className="flex whitespace-nowrap"
            >
                <div className="flex shrink-0">
                    {toolItems.map((item, idx) => (
                        <ScrollerItem key={`tool-1-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
                <div className="flex shrink-0">
                    {toolItems.map((item, idx) => (
                        <ScrollerItem key={`tool-2-${idx}`} name={item.name} icon={item.icon} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
