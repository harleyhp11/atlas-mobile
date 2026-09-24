"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";

/* Los tres servicios, los mismos que anuncia el hero. El primero va en
   blanco y los otros dos apagados, como en la referencia: no es una lista de
   iguales, es una jerarquia. */
const SERVICIOS = [
    "Diseño & desarrollo web",
    "Software a medida",
    "Apps & e-commerce",
];

/* Sello circular. El texto va sobre un textPath de una circunferencia, que es
   la unica forma de curvar tipografia de verdad en la web sin ir colocando
   letra por letra con transformadas. */
function SelloCircular({ texto }: { texto: string }) {
    return (
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
            <defs>
                <path
                    id="sello-atlas"
                    fill="none"
                    d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                />
            </defs>
            <text
                className="fill-white/45 font-sans uppercase"
                style={{ fontSize: 13, letterSpacing: "0.26em" }}
            >
                <textPath href="#sello-atlas" startOffset="0%">
                    {texto}
                </textPath>
            </text>
            {/* La marca de dentro: tres elipses giradas, el mismo garabato de
                alambre que lleva la referencia. */}
            <g className="stroke-white/30" fill="none" strokeWidth="1">
                <ellipse cx="100" cy="100" rx="30" ry="13" />
                <ellipse cx="100" cy="100" rx="30" ry="13" transform="rotate(-18 100 100)" />
                <ellipse cx="100" cy="100" rx="30" ry="13" transform="rotate(-36 100 100)" />
            </g>
        </svg>
    );
}

export default function CTASection() {
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations('ctaSection');

    return (
        <section ref={sectionRef} className="relative overflow-hidden bg-background">
            {/* El bloque lleva la MISMA proporcion que la foto (3420x1838).
                Con la proporcion igualada, bg-cover no recorta nada y la
                imagen entra entera; y como el archivo mide 3420px de ancho,
                por debajo de esa anchura solo se reduce, nunca se amplia.
                Ese ancho no es capricho: un fondo CSS se dibuja al tamano en
                pixeles CSS, pero se rasteriza a la resolucion real de la
                pantalla, asi que en una retina de 1500px hacen falta ~3000px
                de origen para que no se vea blando. */}
            <div className="relative w-full aspect-[3420/1838]">
                {/* Solo en tema oscuro: la foto es casi negra y en claro
                    dejaria la rotulacion blanca flotando sobre un agujero. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 hidden bg-cover bg-center dark:block"
                    style={{ backgroundImage: "url(/brand/cta-monolito.webp)" }}
                />
                {/* Velo SOLO en el ultimo tercio. El 72% superior queda intacto
                    —la foto se ve tal cual el archivo— y solo se oscurece el
                    pie, que es donde hace falta para que el corte hacia el
                    footer no sea seco. */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 hidden dark:block"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.35) 88%, rgba(0,0,0,0.75) 100%)",
                    }}
                />

                {/* ─── Rotulacion sobre la foto ────────────────────────────
                    Posiciones en porcentaje y tamanos en vw, nunca en px: el
                    alto del bloque lo manda el aspect-ratio, o sea que cambia
                    con el ancho de la ventana, y cualquier medida fija se
                    descuadraria al primer cambio de viewport. */}
                <div className="absolute inset-0 z-20 px-6 md:px-10 lg:px-14">
                    {/* Fila de arriba: el nombre a la izquierda y los servicios
                        a la derecha, alineados por su borde superior. */}
                    <div className="flex items-start justify-between pt-[3.5%]">
                        <div className="min-w-0">
                            <p className="font-condensed uppercase leading-none tracking-[0.02em] text-white/35 text-[clamp(0.9rem,1.9vw,1.9rem)]">
                                Estudio digital &lsquo;26
                            </p>
                            <h2 className="mt-[0.12em] font-condensed uppercase leading-[0.82] tracking-[-0.01em] text-white text-[clamp(2.6rem,8.6vw,10rem)]">
                                Agencia
                            </h2>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="font-sans leading-none text-white/40 text-[clamp(0.62rem,0.95vw,0.95rem)]">
                                /qué hacemos
                            </p>
                            <ul className="mt-[0.9em] space-y-[0.22em]">
                                {SERVICIOS.map((servicio, i) => (
                                    <li
                                        key={servicio}
                                        className={`font-sans uppercase leading-[1.08] tracking-[-0.01em] text-[clamp(0.85rem,1.85vw,1.85rem)] ${
                                            i === 0 ? "text-white" : "text-white/30"
                                        }`}
                                    >
                                        {servicio}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sello, a media altura por la izquierda. */}
                    <div className="absolute left-6 top-[50%] hidden h-[clamp(88px,11vw,168px)] w-[clamp(88px,11vw,168px)] md:block lg:left-14">
                        <SelloCircular texto="Atlas · Estudio digital · Lima · Perú · " />
                    </div>

                    {/* Marca circular, enfrente del sello. */}
                    <span className="absolute right-6 top-[50%] hidden h-[clamp(30px,3vw,46px)] w-[clamp(30px,3vw,46px)] items-center justify-center rounded-full border border-white/60 font-sans font-bold leading-none text-white text-[clamp(0.8rem,1.5vw,1.4rem)] md:inline-flex lg:right-14">
                        A
                    </span>

                    {/* El ano es textura, no informacion. Antes iba a un 7% de
                        alfa plano; ahora lleva el mismo degradado que se disuelve
                        hacia abajo que usan "Precios." y "Testimonios", asi que
                        las cifras nacen arriba y se apagan contra la roca en vez
                        de flotar como un bloque gris uniforme.
                        Las paradas van concentradas entre el 8% y el 96%: el
                        degradado se resuelve contra la caja del elemento, no
                        contra la mancha de tinta, y repartidas de 0 a 100 la
                        mitad de la rampa caeria en aire por encima de las cifras. */}
                    <span
                        aria-hidden="true"
                        className="absolute right-6 bottom-[16%] select-none font-condensed leading-[0.78] tracking-[-0.02em] text-[clamp(3.5rem,11.5vw,14rem)] lg:right-14"
                        style={{
                            backgroundImage:
                                "linear-gradient(180deg, rgba(255,255,255,0.26) 8%, rgba(255,255,255,0.13) 52%, rgba(255,255,255,0.015) 96%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        2026
                    </span>

                    {/* El cierre, repartido a los dos lados de la roca. El
                        tracking enorme es lo que lo convierte en un remate de
                        pagina en lugar de en una frase suelta. */}
                    {/* El bottom sale de una cuenta, no de tantear: las cintas
                        van giradas 6 grados sobre 200vw, asi que en los bordes
                        de la pantalla suben tan(6 grados) x media pantalla por
                        encima de su cruce —a 1500px de ancho, unos 79px. Con el
                        cruce a 60px del pie, el abanico llega hasta ~139px, y
                        el 25% (≈200px) deja el rotulo limpio por encima. */}
                    <Link
                        href="/contact"
                        className="group absolute inset-x-6 bottom-[25%] flex items-center justify-between lg:inset-x-14"
                    >
                        {["Construyamos", "algo juntos"].map((palabra) => (
                            <span
                                key={palabra}
                                className="font-sans font-bold uppercase leading-none tracking-[0.42em] text-white/85 transition-colors duration-500 group-hover:text-white text-[clamp(0.75rem,1.7vw,1.7rem)]"
                            >
                                {palabra}
                            </span>
                        ))}
                    </Link>
                </div>

                {/* Las cintas se cruzan al pie del bloque y no en el centro: la
                    X pasa por la base de la roca, asi deja libres el movil y el
                    haz de luz. Cada cinta se centra sola en su contenedor
                    (absolute top-1/2), de modo que el alto de esta caja ES la
                    altura del cruce. Va en z-10, por debajo de la rotulacion
                    (z-20), para que ninguna banda le pase por encima al texto. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[120px]">
                    <InfiniteRibbon rotation={6} baseVelocity={1} className="z-10 py-5 border-y border-blue-200 dark:border-white/5 shadow-xl" background="bg-white dark:bg-zinc-900" textColor="text-blue-700 dark:text-zinc-400 font-mono tracking-tighter">
                        {t('ribbon1')}
                    </InfiniteRibbon>
                    <InfiniteRibbon rotation={-6} reverse={true} baseVelocity={1.2} className="z-20 py-5 border-y border-white/40 dark:border-white/10 shadow-2xl" background="bg-blue-600 dark:bg-black" textColor="text-white font-bold tracking-widest uppercase">
                        {t('ribbon2')}
                    </InfiniteRibbon>
                </div>
            </div>
        </section>
    );
}
