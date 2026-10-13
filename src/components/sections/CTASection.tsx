"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";

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

/* Fondo de video compartido por los dos botones de la seccion. NO es el video
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

function BotonVideo({ onAbrir, abierto }: { onAbrir: () => void; abierto: boolean }) {
    return (
        <button
            type="button"
            onClick={onAbrir}
            aria-expanded={abierto}
            aria-controls="panel-contacto"
            className="group relative inline-flex items-center gap-5 overflow-hidden rounded-full py-2 pl-8 pr-2 ring-1 ring-white/25 transition-[box-shadow] duration-500 hover:ring-white/70"
        >
            <FondoVideo />
            <span className="relative font-sans font-bold uppercase leading-none tracking-[0.2em] text-white text-[clamp(0.72rem,1.05vw,1rem)]">
                Lo quiero
            </span>
            <span className="relative grid h-[clamp(34px,3.2vw,46px)] w-[clamp(34px,3.2vw,46px)] place-items-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-[46%] w-[46%]" />
            </span>
        </button>
    );
}

/* ─── Panel de contacto ───────────────────────────────────────────────────
   Se abre desde abajo, en la esquina donde vive el "2026". No es una pagina
   nueva: el visitante ha recorrido todo el sitio y mandarlo a /contact aqui es
   pedirle una navegacion mas justo en el momento en que decidio escribir.

   El envio va al endpoint que el proyecto YA tiene, /api/contact (nodemailer),
   con los campos que ese endpoint espera. No hay servicio nuevo ni inventado.
   Si EMAIL_USER y EMAIL_APP_PASSWORD no estan puestas en el entorno, el
   endpoint responde error y el panel lo dice: mejor eso que un "enviado" falso.

   El vidrio va en estilo EN LINEA y no en una clase de globals.css: el
   minificador de CSS de este proyecto se come la propiedad backdrop-filter sin
   prefijo y deja la pastilla sin desenfoque (ya paso con la barra). En linea no
   pasa por ese paso. */
type Estado = "listo" | "enviando" | "enviado" | "error";

function PanelContacto({ onCerrar }: { onCerrar: () => void }) {
    const [estado, setEstado] = useState<Estado>("listo");

    const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const datos = new FormData(e.currentTarget);
        setEstado("enviando");
        try {
            const r = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: datos.get("nombre"),
                    email: datos.get("email"),
                    message: datos.get("mensaje"),
                    subject: "Nuevo contacto desde la web",
                }),
            });
            setEstado(r.ok ? "enviado" : "error");
        } catch {
            setEstado("error");
        }
    };

    const campo =
        "w-full rounded-full border border-white/12 bg-white/[0.07] px-5 py-3.5 font-sans text-[13.5px] text-white outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-white/30 focus:border-white/45 focus:bg-white/[0.11] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.07)]";
    /* Sin punto rojo delante. El rojo se queda SOLO en el boton de enviar: con
       un punto por etiqueta habia cuatro focos rojos compitiendo en una tarjeta
       de 520px, y el que importa es el que se pulsa. */
    const etiqueta =
        "mb-2 block font-space-mono text-[9.5px] uppercase tracking-[0.2em] text-white/55";

    return (
        <motion.div
            id="panel-contacto"
            initial={{ y: 64, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 64, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            /* bottom en px y no en %: la banda de las cintas mide 120px fijos,
               asi que un porcentaje del alto del bloque dejaba el panel por
               debajo de ellas en unos anchos y muy alto en otros. 136 da 16px
               de holgura sobre las cintas en cualquier ventana. */
            className="absolute bottom-[136px] right-6 z-30 w-[min(520px,46%)] overflow-hidden rounded-[38px] border border-white/16 p-6 lg:right-14"
            style={{
                background:
                    "linear-gradient(158deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(30px) saturate(1.8) brightness(1.08)",
                WebkitBackdropFilter: "blur(30px) saturate(1.8) brightness(1.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30), 0 34px 80px rgba(0,0,0,0.55)",
            }}
        >
            {/* Luz cayendo por el borde de arriba. Un cristal real no se ilumina
                plano: recibe la luz por un canto y se apaga hacia el otro, y es
                ese degradado —no el desenfoque— lo que le da espesor. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.09] to-transparent"
            />

            <div className="relative flex items-start justify-between gap-5">
                <div className="min-w-0">
                    <span className="inline-flex items-center rounded-full border border-white/14 bg-black/35 px-4 py-1.5">
                        <span className="font-space-mono text-[10.5px] uppercase tracking-[0.18em] text-white/85">
                            Hablemos
                        </span>
                    </span>
                    {/* La tarjeta crecio y la cabecera se quedaba flaca: esta
                        linea le da voz y le dice al lector que esperar despues
                        de enviar. */}
                    <p className="mt-3.5 font-sans text-[14px] leading-snug text-white/70">
                        Cuéntanos qué necesitas y te escribimos.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCerrar}
                    aria-label="Cerrar el formulario"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/14 text-white/70 transition-colors duration-300 hover:border-white/50 hover:text-white"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>

            <span aria-hidden="true" className="relative my-5 block h-px w-full bg-white/10" />

            <form onSubmit={enviar} className="relative flex flex-col gap-3.5">
                {/* Nombre y email en fila. La tarjeta crecio a lo ancho, y
                    apilar tres campos en una columna la habria hecho crecer
                    tambien a lo alto —justo donde no hay sitio, porque el pie
                    del bloque lo ocupan las cintas. */}
                <div className="grid grid-cols-2 gap-3.5">
                    {[
                        { id: "nombre", etiqueta: "Tu nombre", tipo: "text", marcador: "¿Cómo te llamas?" },
                        { id: "email", etiqueta: "Tu email", tipo: "email", marcador: "nombre@correo.com" },
                    ].map((c) => (
                        <div key={c.id}>
                            <label htmlFor={c.id} className={etiqueta}>
                                {c.etiqueta}
                            </label>
                            <input id={c.id} name={c.id} type={c.tipo} required placeholder={c.marcador} className={campo} />
                        </div>
                    ))}
                </div>

                <div>
                    <label htmlFor="mensaje" className={etiqueta}>
                        Tu mensaje
                    </label>
                    <textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        rows={3}
                        placeholder="Cuéntanos en dos líneas qué tienes en mente."
                        className={`${campo} min-h-[108px] resize-none rounded-[26px]`}
                    />
                </div>

                {/* El mismo video que el boton grande de la izquierda, y ningun
                    rojo en toda la tarjeta. Va a todo el ancho: en una tarjeta
                    de 520px una pastilla pequeña en una esquina no se lee como
                    el final del recorrido. */}
                <button
                    type="submit"
                    disabled={estado === "enviando" || estado === "enviado"}
                    className="group relative mt-1 flex w-full items-center justify-between overflow-hidden rounded-full py-2 pl-7 pr-2 ring-1 ring-white/25 transition-[box-shadow,opacity] duration-500 hover:ring-white/70 disabled:opacity-60"
                >
                    <FondoVideo />
                    <span className="relative font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-white">
                        {estado === "enviando" ? "Enviando" : estado === "enviado" ? "Enviado" : "Enviar mensaje"}
                    </span>
                    <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </button>

                {/* aria-live: el estado cambia sin recargar, y sin esto un lector
                    de pantalla no anuncia nada al enviar. Debajo del boton y no
                    al lado: al lado le comia el ancho justo cuando el boton pasa
                    a ocuparlo entero. */}
                <p aria-live="polite" className="min-h-[14px] font-sans text-[11.5px] leading-tight text-white/60">
                    {estado === "enviado" && "Recibido. Te escribimos pronto."}
                    {estado === "error" && "No se pudo enviar. Escríbenos por correo."}
                </p>
            </form>
        </motion.div>
    );
}

export default function CTASection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [panelAbierto, setPanelAbierto] = useState(false);

    /* El panel se despliega solo al llegar aqui, sin que haya que pulsar nada.
       El umbral es 0.55 y no 1: el bloque mide mas que muchas ventanas (su
       aspect es 3420/1838, unos 812px de alto a 1512 de ancho) y esperar a
       verlo entero no se cumpliria nunca en pantallas bajas.

       `once: true` a proposito: si se reabriera cada vez que la seccion vuelve
       a entrar en vista, reaparecerra encima de alguien que lo cerro. Cerrar
       gana siempre. */
    const seccionALaVista = useInView(sectionRef, { amount: 0.55, once: true });

    useEffect(() => {
        if (seccionALaVista) setPanelAbierto(true);
    }, [seccionALaVista]);
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
                        <div className="min-w-0 max-w-[56%] pt-[4%]">
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
                                <BotonVideo
                                    abierto={panelAbierto}
                                    onAbrir={() => {
                                        setPanelAbierto(true);
                                        /* Si ya estaba abierto, el boton deja de
                                           "abrir" y pasa a llevar al usuario al
                                           primer campo, que es lo unico util que
                                           le queda por hacer. */
                                        requestAnimationFrame(() =>
                                            document.getElementById("nombre")?.focus()
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="font-sans leading-none text-white/40 text-[clamp(0.62rem,0.95vw,0.95rem)]">
                                /qué hacemos
                            </p>
                            <ServiciosEncendidos />
                        </div>
                    </div>

                    <AnimatePresence>
                        {panelAbierto && <PanelContacto onCerrar={() => setPanelAbierto(false)} />}
                    </AnimatePresence>

                    {/* Marca circular a media altura por la derecha. Se aparta
                        cuando el panel esta abierto: cae justo detras de el y
                        verla asomar por el vidrio se lee como un descuido. */}
                    <span className={`absolute right-6 top-[50%] hidden h-[clamp(30px,3vw,46px)] w-[clamp(30px,3vw,46px)] items-center justify-center rounded-full border border-white/60 font-sans font-bold leading-none text-white transition-opacity duration-500 text-[clamp(0.8rem,1.5vw,1.4rem)] md:inline-flex lg:right-14 ${panelAbierto ? "opacity-0" : "opacity-100"}`}>
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
