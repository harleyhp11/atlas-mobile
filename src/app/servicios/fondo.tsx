"use client";

/* ─────────────────────────────────────────────────────────────────────────────
   EL SUELO DE /servicios: dos planchas de video graduadas + retícula.

   DOS CAPAS, NO UNA. La de abajo va entera; la segunda se compone encima en
   `plus-lighter` al 35% y entra por una máscara desde el 21.5% hacia abajo. Eso
   levanta la mitad inferior sin tocar la superior, y es lo que le da
   profundidad en vez de leerse como un video pegado al fondo.

   EL GRADO VA COCIDO EN EL ARCHIVO, NO EN UN FILTRO SVG. La referencia aplica
   dos `feComponentTransfer` de 65 paradas sobre cada capa: una transformación
   por píxel recalculada en CADA fotograma de CADA video, que en varios
   navegadores saca el vídeo de la ruta acelerada. Como la curva es estática, se
   aplicó una sola vez al codificar (ffmpeg `curves`, muestreando la tabla cada
   4 paradas — son curvas suaves y el error no se ve). Resultado idéntico,
   coste de ejecución cero. Dos archivos en vez de uno: 239 KB + 172 KB, contra
   los 7.6 MB del original sin comprimir.

   LA PLANCHA ES PEGAJOSA Y MIDE UNA VENTANA. El bloque oscuro es mucho más alto
   que la pantalla; con `inset-0` el video se estiraría y las trazas saldrían
   enormes. Pegada arriba y con alto de ventana, el contenido desfila por
   delante de un escenario quieto, que es como está pensada la referencia.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from "react";
import { motion, MotionValue } from "framer-motion";

const TEXTURE =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Cpath d='M0 6L6 0' stroke='%23fff' stroke-opacity='0.5' stroke-width='0.5'/%3E%3C/svg%3E\")";

const PLANCHA = "/assets/fondo-planes.mp4";
const PLANCHA_2 = "/assets/fondo-planes-2.mp4";
const POSTER = "/assets/fondo-planes.webp";

export function SuperficieOscura() {
    const caja = useRef<HTMLDivElement>(null);
    const uno = useRef<HTMLVideoElement>(null);
    const dos = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const nodo = caja.current;
        const a = uno.current;
        const b = dos.current;
        if (!nodo || !a || !b) return;

        const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

        /* Las dos capas tienen que ir al mismo fotograma o el `plus-lighter`
           deja un fantasma desplazado. La primera manda; la segunda se corrige
           solo cuando se va más de 0.12s: por debajo no se percibe, y corregir
           en cada `timeupdate` provocaría saltos visibles. */
        const sincronizar = () => {
            if (Math.abs(b.currentTime - a.currentTime) > 0.12) {
                b.currentTime = a.currentTime;
            }
        };
        a.addEventListener("timeupdate", sincronizar);

        /* Un solo observador gobierna las dos: fuera de pantalla se paran. */
        const io = new IntersectionObserver(
            ([e]) => {
                const andando = e.isIntersecting && !quieto.matches;
                for (const v of [a, b]) {
                    if (andando) v.play().catch(() => {});
                    else v.pause();
                }
            },
            { threshold: 0.01 }
        );
        io.observe(nodo);

        const alCambiarPreferencia = () => {
            if (quieto.matches) for (const v of [a, b]) v.pause();
        };
        quieto.addEventListener("change", alCambiarPreferencia);
        alCambiarPreferencia();

        return () => {
            a.removeEventListener("timeupdate", sincronizar);
            quieto.removeEventListener("change", alCambiarPreferencia);
            io.disconnect();
        };
    }, []);

    const comunes = "absolute inset-0 h-full w-full object-cover";

    return (
        <div ref={caja} aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                {/* Plancha 1 — grado principal */}
                <video
                    ref={uno}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={POSTER}
                    className={comunes}
                    style={{ objectPosition: "center top" }}
                >
                    <source src={PLANCHA} type="video/mp4" />
                </video>

                {/* Plancha 2 — segunda pasada, levanta solo la mitad de abajo */}
                <video
                    ref={dos}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className={comunes}
                    style={{
                        objectPosition: "center top",
                        mixBlendMode: "plus-lighter",
                        opacity: 0.35,
                        WebkitMaskImage: "linear-gradient(180deg, transparent 21.5%, #000 100%)",
                        maskImage: "linear-gradient(180deg, transparent 21.5%, #000 100%)",
                    }}
                >
                    <source src={PLANCHA_2} type="video/mp4" />
                </video>

                {/* Velo, medido y no a ojo. Dibujando un fotograma en canvas
                    salen estas luminancias por cuarto de ancho:

                      1 y 2 (izquierda) → máx 0.0003, media ~0   · negro puro
                      3                 → máx 0.378,  media 0.0014
                      4 (derecha)       → máx 0.772,  media 0.0093

                    O sea: la izquierda no necesita velo ninguno, y a la derecha
                    lo que brilla son TRAZAS FINAS, no superficie — por eso la
                    media es 0.009 con picos de 0.77. Un velo uniforme fuerte
                    mata la atmósfera para tapar unos pocos píxeles. Este sube en
                    diagonal siguiendo justo donde está el ruido, y deja la
                    izquierda casi limpia, que es donde más texto hay. */
                }
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(100deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.46) 46%, rgba(0,0,0,0.62) 100%)",
                    }}
                />

                {/* Grano: rompe el banding de los degradados sobre negro. */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{ backgroundImage: TEXTURE, backgroundRepeat: "repeat" }}
                />
            </div>
        </div>
    );
}

/* Las tres verticales en los cuartos. `dibujo` es un motion value de 0 a 1
   atado al scroll: la tabla se dibuja sola a medida que aparece en vez de
   estar ya puesta. scaleY desde origin-top se compone en GPU; animar height
   forzaría layout en cada fotograma. */
export function Reticula({ dibujo }: { dibujo: MotionValue<number> }) {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {["25%", "50%", "75%"].map((x) => (
                <motion.span
                    key={x}
                    className="absolute inset-y-0 w-px origin-top bg-white/[0.07]"
                    style={{ left: x, scaleY: dibujo }}
                />
            ))}
        </div>
    );
}

/* Las marcas de encuadre: cuadrados huecos de 9px centrados EN la esquina, de
   modo que la mitad del cuadrado queda fuera del bloque. Cada esquina necesita
   su propio signo de translate; con el mismo -50%,-50% en las cuatro, las dos
   de la derecha y las dos de abajo se meterían hacia dentro. */
const ESQUINAS = [
    { pos: "left-0 top-0", t: "translate(-50%, -50%)" },
    { pos: "right-0 top-0", t: "translate(50%, -50%)" },
    { pos: "left-0 bottom-0", t: "translate(-50%, 50%)" },
    { pos: "right-0 bottom-0", t: "translate(50%, 50%)" },
];

export function Escuadras({ className = "" }: { className?: string }) {
    return (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
            {ESQUINAS.map((e) => (
                <span
                    key={e.pos}
                    className={`absolute ${e.pos} h-[9px] w-[9px] border border-white/25`}
                    style={{ transform: e.t }}
                />
            ))}
        </div>
    );
}
