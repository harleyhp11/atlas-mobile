"use client";

/* ─────────────────────────────────────────────────────────────────────────
   ARCHIVADO — no se compila ni se sirve.

   Es la seccion "CONSTRUIMOS / presencia digital." que vivia dentro de
   AboutSection.tsx, con su rastro de imagenes y la caja 3D (Bucket).
   Se retiro del front el 2026-09-24 a peticion de Harley; el codigo se
   guarda aqui intacto por si vuelve.

   Esta carpeta esta en el "exclude" de tsconfig.json, asi que TypeScript no
   la mira; y como nadie la importa, tampoco entra en el bundle.

   PARA RESTAURARLA
   1. Pegar los dos bloques de abajo de vuelta en
      src/components/sections/AboutSection.tsx:
        - CapsulaTitular  -> justo antes de "const PRECIOS_FILL"
        - AuditFunnel     -> justo antes de "const ScrollHijackSection"
   2. Volver a poner "import Bucket from '@/components/ui/bucket';"
      entre los imports.
   3. Volver a renderizar <AuditFunnel /> despues de la nota legal de los
      planes, dentro del mismo div.

   Los textos siguen en messages/*.json bajo about.architecting y
   about.digitalReality: no se han tocado.
   ───────────────────────────────────────────────────────────────────────── */

/* Capsula incrustada en el titular, igual que en "Cómo trabajamos": imagen
   fija en blanco y negro, forma de estadio, medida en em para que escale con
   el titular en cualquier breakpoint.
   Ojo: el titular vive dentro de un contenedor con mix-blend-difference, y un
   hijo no puede salirse de ese grupo de mezcla. Sobre el negro del fondo la
   diferencia deja la imagen tal cual; solo se invierte cuando pasa por encima
   del rastro de imagenes, que es el mismo comportamiento que ya tiene el
   texto. */
function CapsulaTitular() {
    return (
        <span
            aria-hidden="true"
            className="relative mx-[0.2em] hidden h-[0.68em] w-[1.75em] shrink-0 translate-y-[-0.05em] overflow-hidden rounded-full align-middle not-italic md:inline-block"
        >
            <img
                src="/assets/capsula-portafolio.webp"
                alt=""
                decoding="async"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/25" />
        </span>
    );
}

const AuditFunnel = () => {
    const isMobile = useIsMobile();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });
    const t = useTranslations('about');
    const tCommon = useTranslations('common');

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
    const lineScaleY = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);

    // Exit parallax to transition smoothly into the next section
    const { scrollYProgress: exitProgressRaw } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });
    const exitProgress = useSpring(exitProgressRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const yExit = useTransform(exitProgress, [0, 1], ["0%", "40%"]);
    const scaleExit = useTransform(exitProgress, [0, 1], [1, 0.85]);
    const opacityExit = useTransform(exitProgress, [0, 1], [1, 0]);

    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const galleryItems = [
            "/feature/icons/image1.webp",
            "/feature/icons/image2.webp",
            "/feature/icons/image3.webp",
            "/feature/icons/image4.webp",
            "/feature/icons/image5.webp",
            "/feature/icons/image6.webp",
            "/feature/icons/image7.webp",
            "/feature/icons/image8.webp"
        ];
        // Shuffle and pick 8 random images for the trail to avoid overwhelming the DOM
        const shuffled = [...galleryItems].sort(() => 0.5 - Math.random());
        setImages(shuffled.slice(0, 8));
    }, []);

    return (
        <div ref={sectionRef} className="relative overflow-visible group min-h-[80vh] md:min-h-[120vh] flex items-center justify-center bg-background z-10 pb-10 md:pb-32">
            <div className="flex flex-col items-center text-center py-20 md:py-40 space-y-12 md:space-y-16 pointer-events-none w-full origin-top">
                <motion.div
                    style={{ y: yExit, scale: scaleExit, opacity: opacityExit }}
                    className="space-y-6 md:space-y-10 flex flex-col items-center px-6 relative z-10 mix-blend-difference w-full"
                >
                    <motion.h4
                        style={{ scale, willChange: "transform" }}
                        className="text-4xl md:text-6xl lg:text-[7rem] font-black tracking-[-0.05em] text-white max-w-7xl tracking-tighter leading-[0.9] lg:px-6 uppercase text-center"
                    >
                        {t('architecting')} <br></br>
                        <motion.span
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-white italic font-serif-elegant font-light lowercase tracking-normal"
                        >
                            {/* La cadena viene de i18n como una sola pieza
                                ("Presencia digital"), asi que la parto por el
                                ultimo espacio en vez de trocear el diccionario:
                                funciona igual en cualquier idioma y si algun
                                dia es una sola palabra, degrada sin capsula. */}
                            {(() => {
                                const texto = t('digitalReality');
                                const corte = texto.lastIndexOf(' ');
                                if (corte < 0) return texto;
                                return (
                                    <>
                                        {texto.slice(0, corte)}
                                        <CapsulaTitular />
                                        {texto.slice(corte + 1)}
                                    </>
                                );
                            })()}
                        </motion.span>.
                    </motion.h4>
                </motion.div>

                <motion.div
                    style={{ y: yExit, scale: scaleExit, opacity: opacityExit }}
                    className="flex flex-col items-center gap-8 pt-12 pointer-events-auto w-full px-6"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        <Bucket trailImages={!isMobile ? images : undefined} />
                    </motion.div>
                </motion.div>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('/noise.svg')]" />
            </div>
        </div>
    );
};
