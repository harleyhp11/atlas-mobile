"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from "lucide-react";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { portfolioData } from "@/data/portfolio";
import { IdeaToProduct } from "@/components/sections/IdeaToProduct";

/* Los tres servicios, los mismos que anuncia el hero. El primero va en
   blanco y los otros dos apagados, como en la referencia: no es una lista de
   iguales, es una jerarquia. */
const SERVICIOS = [
    "Diseño & desarrollo web",
    "Software a medida",
    "Apps & e-commerce",
];

const ENCENDIDO_MS = 2000;

/* Los tres servicios se encienden por turnos, uno cada dos segundos.

   No es un fundido: el que entra arranca como un tubo de neon —prende, se cae,
   vuelve, duda y ya se queda— con la animacion servicioPrende de globals.css.
   Sobre esta foto tiene sentido narrativo, porque hay un haz de luz cruzando la
   escena. El que se apaga si va con un fundido normal de 700ms: dos parpadeos a
   la vez, uno entrando y otro saliendo, serian ruido.

   Con movimiento reducido no hay turnos: se queda encendido el primero, que es
   el estado que ya tenia la lista antes de animarse. */
function ServiciosEncendidos() {
    const [activo, setActivo] = useState(0);
    const [ciclo, setCiclo] = useState(0);

    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(() => {
            setActivo((i) => (i + 1) % SERVICIOS.length);
            setCiclo((c) => c + 1);
        }, ENCENDIDO_MS);
        return () => clearInterval(id);
    }, []);

    return (
        <ul className="mt-[1.1em] space-y-[0.5em]">
            {SERVICIOS.map((servicio, i) => (
                <li
                    key={servicio}
                    className={`font-space-mono uppercase leading-[1.1] tracking-[0.02em] transition-[color] duration-700 text-[clamp(0.6rem,1.15vw,1.05rem)] ${
                        i === activo ? "text-white" : "text-white/40"
                    }`}
                >
                    {/* El span va con `key` del ciclo: al cambiar, React lo
                        remonta y la animacion CSS se relanza desde cero. Sin eso
                        la clase ya estaria puesta y el parpadeo solo ocurriria
                        una vez en toda la vida del componente. */}
                    {i === activo ? (
                        <span key={ciclo} className="servicio-prende inline-block">
                            {servicio}
                        </span>
                    ) : (
                        <span className="inline-block">{servicio}</span>
                    )}
                </li>
            ))}
        </ul>
    );
}

/* Fondo de video del boton "Contactar". NO es el video
   del heroe: aquel es 1920x1080 y 2,9 MB, y decodificar Full HD para una
   pastilla de 280px es tirar bateria. Este es un recorte de 640x160 y 8
   segundos en bucle, 67 kB.

   El velo negro por encima no es decorativo: sin el, el texto blanco cae sobre
   un video que cambia de luminancia todo el rato y hay fotogramas en los que
   desaparece. Al pasar el cursor el velo se abre y deja ver el movimiento sin
   perder el rotulo. */
function FondoVideo() {
    const video = useRef<HTMLVideoElement>(null);

    /* Con movimiento reducido el video se queda en su primer fotograma: sigue
       siendo el mismo fondo, pero quieto. */
    useEffect(() => {
        if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        video.current?.pause();
    }, []);

    return (
        <>
            <video
                ref={video}
                aria-hidden="true"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/assets/boton-cta.webp"
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src="/assets/boton-cta.mp4" type="video/mp4" />
            </video>
            <span
                aria-hidden="true"
                className="absolute inset-0 bg-black/55 transition-colors duration-500 group-hover:bg-black/25"
            />
        </>
    );
}

/* Boton "Contactar": abre WhatsApp directo con un saludo ya escrito, al
   numero de Atlas de portfolioData. api.whatsapp.com y no wa.me: wa.me
   redirige a esta misma direccion y por el camino estropea los emojis del
   mensaje (lo mismo que se resolvio en /contact). */
const WHATSAPP_ATLAS = (portfolioData.personal.phone ?? "").replace(/\D/g, "");
const MENSAJE_WHATSAPP = "Hola Atlas 👋 Quiero hablar sobre un proyecto.";
const URL_WHATSAPP = `https://api.whatsapp.com/send?phone=${WHATSAPP_ATLAS}&text=${encodeURIComponent(MENSAJE_WHATSAPP)}`;

function BotonVideo() {
    return (
        <a
            href={URL_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar a Atlas por WhatsApp"
            className="group relative inline-flex items-center gap-5 overflow-hidden rounded-full py-2 pl-8 pr-2 ring-1 ring-white/25 transition-[box-shadow] duration-500 hover:ring-white/70"
        >
            <FondoVideo />
            <span className="relative font-sans font-bold uppercase leading-none tracking-[0.2em] text-white text-[clamp(0.72rem,1.05vw,1rem)]">
                Contactar
            </span>
            <span className="relative grid h-[clamp(34px,3.2vw,46px)] w-[clamp(34px,3.2vw,46px)] place-items-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-[46%] w-[46%]" />
            </span>
        </a>
    );
}

export default function CTASection() {

    const t = useTranslations('ctaSection');

    return (
        <section className="relative overflow-hidden bg-background">
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
                {/* Idea → producto: la tarjeta de vidrio a la derecha del
                    celular, en el hueco entre la lista "/qué hacemos" y el
                    "2026". Pegada a la derecha, alineada con el margen de la
                    lista y del "2026" (lg:right-14 = 3.5rem), y baja: termina
                    poco antes de que empiece el "2026". z-[5]: por encima de
                    la foto y los reflectores, por debajo de las cintas (z-10).
                    Entra deslizandose desde la derecha (ver IdeaToProduct); el
                    overflow-hidden de la seccion la recorta mientras tanto. */}
                <div className="absolute z-[5]" style={{ right: "3.5rem", top: "35%" }}>
                    <IdeaToProduct />
                </div>

                {/* pointer-events-none: esta capa cubre toda la foto y, si no,
                    se tragaria el hover de la tarjeta de abajo. Lo que si se
                    usa (titular, boton, lista) lo recupera con -auto. */}
                <div className="pointer-events-none absolute inset-0 z-20 px-6 md:px-10 lg:px-14">
                    {/* Fila de arriba: el nombre a la izquierda y los servicios
                        a la derecha, alineados por su borde superior. */}
                    <div className="flex items-start justify-between pt-[3.5%]">
                        {/* El bloque va en flujo normal desde arriba y no en
                            posiciones absolutas: es una columna —ojal, titular,
                            boton— y con porcentajes sueltos cada pieza se
                            descuadraba por su lado al cambiar el ancho.
                            El max-w del 56% lo mantiene en la mitad izquierda de
                            la foto, que es la zona oscura; la derecha la ocupa el
                            haz de luz y ahi el blanco se pierde.
                            El pt del 4% baja SOLO esta columna: los servicios de
                            la derecha siguen alineados con el borde de arriba,
                            que es donde tienen que estar. */}
                        <div className="pointer-events-auto min-w-0 max-w-[56%] pt-[4%]">
                            {/* Recupera el "Lima, Perú" que llevaba el sello
                                circular: al quitarlo, era el unico sitio de la
                                seccion que decia donde esta el estudio. */}
                            <p className="font-condensed uppercase leading-none tracking-[0.02em] text-white/35 text-[clamp(0.78rem,1.55vw,1.5rem)]">
                                Estudio digital &middot; Lima, Perú
                            </p>
                            {/* El cierre de la pagina ya no es el nombre del
                                estudio sino lo que el lector puede hacer. En tres
                                lineas y no en una: a este tamaño una sola linea
                                se saldria de la mitad oscura, y apiladas el
                                bloque gana la masa que le toca a un remate. */}
                            <h2 className="mt-[0.45em] font-condensed uppercase leading-[0.82] tracking-[-0.015em] text-white text-[clamp(2.2rem,7.4vw,8.6rem)]">
                                Hagamos
                                <br />
                                realidad
                                <br />
                                tu idea.
                            </h2>
                            <div className="mt-[7%]">
                                <BotonVideo />
                            </div>
                        </div>

                        <div className="pointer-events-auto shrink-0 text-right">
                            <p className="font-sans leading-none text-white/40 text-[clamp(0.62rem,0.95vw,0.95rem)]">
                                /qué hacemos
                            </p>
                            <ServiciosEncendidos />
                        </div>
                    </div>

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
