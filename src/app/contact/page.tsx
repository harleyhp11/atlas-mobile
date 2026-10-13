'use client';

import { useState, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Send, AlertCircle, Loader2, Disc, Music, ArrowUpRight, Sparkles, HelpCircle, MessageSquare, ExternalLink, Github, Linkedin, Twitter, Instagram, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioData } from '@/data/portfolio';
import { GlowingCard, GlowingCardTitle, GlowingCardLabel } from '@/components/ui/glowing-card';
import dynamic from 'next/dynamic';

const Lanyard = dynamic<{ position?: [number, number, number], gravity?: [number, number, number], isLowPowerMode?: boolean }>(() => import('@/components/three/Lanyard').then(mod => mod.Lanyard), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-transparent"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
});

const DynamicScrollVelocity = dynamic(() => import('@/components/ui/ScrollVelocity'), { ssr: false });
const Meteors = dynamic(() => import('@/components/ui/meteors').then(mod => mod.Meteors), { ssr: false });

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { DeferredMount } from '@/components/ui/DeferredMount';

function SocialTicker({ items, direction = 'left', speed = 30, isLowPowerMode = false }: { items: any[], direction?: 'left' | 'right', speed?: number, isLowPowerMode?: boolean }) {
    // 8x duplication ensures enough width to cover large screens twice over, allowing -50% translation without empty gaps on the right edge.
    const multipliedItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];

    return (
        <div className="flex overflow-hidden relative w-full group/ticker py-4 select-none">
            <motion.div
                className="flex flex-nowrap hover:[animation-play-state:paused]"
                initial={{ x: direction === 'left' ? 0 : '-50%' }}
                animate={isLowPowerMode ? { x: direction === 'left' ? 0 : '-50%' } : { x: direction === 'left' ? '-50%' : 0 }}
                transition={{
                    ease: "linear",
                    duration: speed * 4, // 4x duration because 8x duplication travels 4x further than 2x duplication
                    repeat: Infinity,
                }}
                style={{ width: "max-content" }}
            >
                {multipliedItems.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className="pr-4">
                        <SocialCard item={item} />
                    </div>
                ))}
            </motion.div>

            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </div>
    );
}

const socialIconsMap: Record<string, React.ElementType> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    discord: Disc,
    spotify: Music
};

function SocialCard({ item }: { item: any }) {
    const Icon = item.image || ArrowUpRight;
    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-[140px] w-[280px] flex-col justify-between rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 shadow-sm dark:shadow-2xl transition-all hover:bg-neutral-50 dark:hover:bg-white/5 hover:border-neutral-300 hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-md overflow-hidden flex-shrink-0"
        >
            <div className="absolute -top-6 -right-6 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-125 duration-700">
                <Icon className="w-40 h-40" />
            </div>

            <div className="relative z-10 flex items-center gap-4">
                <div className="relative h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner ring-1 ring-white/5">
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{item.name}</span>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground/80">@{item.username}</span>
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 group-hover:text-foreground/70 transition-colors">
                    Connect
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary opacity-50 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
        </a>
    );
}

/* EL NUMERO SALE DE UN SOLO SITIO: portfolioData.personal.phone. Aqui solo se
   le quitan espacios y el "+" porque wa.me exige los digitos pelados, con el
   codigo de pais delante (51 = Peru). */
const WHATSAPP_ATLAS = (portfolioData.personal.phone ?? '').replace(/\D/g, '');

/* Las cuatro opciones son los cuatro planes de /servicios (servicios/datos.ts),
   en singular porque aqui se elige UNO. Si cambian los planes, cambiar tambien
   esta lista. */
const TIPOS_PROYECTO = [
    'Tienda online',
    'Landing page',
    'Web corporativa',
    'Software a medida',
    'Otro / aún no lo sé',
];

/* RANGOS EN SOLES, NO EN DOLARES. La referencia traia "Menos de $5,000", pero
   $5,000 son unos S/ 18,500: mas que todo el catalogo de Atlas junto. Los
   cortes salen de los precios publicados de los planes —tienda S/ 400-1,200,
   landing 600-1,500, corporativa 900-2,500, software a medida—, asi que cada
   rango cae sobre algo que Atlas de verdad vende. */
const PRESUPUESTOS = [
    'Menos de S/ 600',
    'S/ 600 – 1,200',
    'S/ 1,200 – 2,500',
    'Más de S/ 2,500',
    'Aún no lo sé',
];

type DatosContacto = {
    nombre: string;
    whatsapp: string;
    tipo: string;
    negocio: string;
    presupuesto: string;
    mensaje: string;
};

const VACIO: DatosContacto = { nombre: '', whatsapp: '', tipo: '', negocio: '', presupuesto: '', mensaje: '' };

/* EL MENSAJE QUE LLEGA A WHATSAPP.

   Cada dato va con su ✅ delante, a proposito. Algunos clientes de WhatsApp
   —el de escritorio en Mac, por lo menos— se comen los saltos de linea del
   enlace y juntan todo en un parrafo. Con la marca delante de cada dato, aunque
   pase eso, cada cosa sigue leyendose separada:

     "... Estos son mis datos: ✅ Nombre: Harley ✅ Proyecto: Web corporativa ..."

   Los *asteriscos* son negrita y los _guiones bajos_ cursiva en WhatsApp.

   Lo que la persona escribe se arregla lo justo para que el mensaje tenga
   coherencia —mayuscula inicial, punto final en el detalle— sin reescribirle
   nada. Los campos opcionales vacios no salen. */
const capital = (t: string) => t.charAt(0).toLocaleUpperCase('es') + t.slice(1);
const nombrePropio = (t: string) => t.replace(/(^|\s)(\p{L})/gu, (_, sep, letra) => sep + letra.toLocaleUpperCase('es'));
const conPunto = (t: string) => (/[.!?…]$/.test(t) ? t : t + '.');

function armarMensaje(d: DatosContacto): string {
    const item = (etiqueta: string, valor: string) => `✅ *${etiqueta}:* ${valor}`;
    const nombre = nombrePropio(d.nombre.trim());
    const whatsapp = d.whatsapp.trim();
    const negocio = d.negocio.trim();
    const mensaje = d.mensaje.trim();

    const lineas = [
        'Hola Atlas 👋',
        'Quiero cotizar un proyecto. Estos son mis datos:',
        '',
        item('Nombre', nombre),
    ];
    if (whatsapp) lineas.push(item('WhatsApp de contacto', whatsapp));
    lineas.push(item('Proyecto', d.tipo));
    if (negocio) lineas.push(item('Negocio', capital(negocio)));
    if (d.presupuesto) lineas.push(item('Presupuesto', d.presupuesto));
    if (mensaje) lineas.push('', '💬 *Detalle:*', conPunto(capital(mensaje)));
    lineas.push('', '_Enviado desde la web de Atlas_');
    return lineas.join('\n');
}

const LINEA =
    "peer block w-full appearance-none border-0 border-b-2 border-foreground/20 bg-transparent py-2.5 px-0 text-xl font-medium text-foreground focus:border-foreground focus:outline-none focus:ring-0 transition-colors duration-300";

/* Etiqueta flotante. En un campo normal baja dentro de la linea cuando esta
   vacio (peer-placeholder-shown). En un select o en un campo con texto de
   ejemplo se queda SIEMPRE arriba: si bajara, se montaria encima del "Ej.
   Restaurante" o de la opcion elegida. */
const ETIQUETA =
    "pointer-events-none absolute top-3 -z-10 origin-[0] -translate-y-8 scale-75 transform text-sm font-bold tracking-widest text-muted-foreground duration-300 peer-focus:text-foreground";
const ETIQUETA_BAJA =
    " peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-8 peer-focus:scale-75";

const InputGroup = ({ label, name, type = "text", value, onChange, required = false, marcador, opciones, inputMode, autoComplete, maxLength }: any) => {
    const fija = type === 'select' || !!marcador;
    return (
        <div className="group relative z-0 w-full mb-10">
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    maxLength={maxLength}
                    rows={1}
                    className={cn(LINEA, "resize-y min-h-[50px] max-h-[200px]")}
                    placeholder=" "
                />
            ) : type === 'select' ? (
                <>
                    <select
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={cn(LINEA, "cursor-pointer pr-10", !value && "text-foreground/35")}
                    >
                        <option value="" disabled className="bg-background text-foreground/50">Elige una opción</option>
                        {opciones.map((o: string) => (
                            <option key={o} value={o} className="bg-background text-foreground">{o}</option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-4 w-5 h-5 text-foreground/40 transition-colors group-focus-within:text-foreground" />
                </>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    className={cn(LINEA, "placeholder:font-normal placeholder:text-foreground/30")}
                    placeholder={marcador ?? " "}
                />
            )}
            <label className={cn(ETIQUETA, !fija && ETIQUETA_BAJA)}>
                {label.toUpperCase()}
            </label>
        </div>
    );
};

/* EL FORMULARIO YA NO MANDA CORREO: ARMA UN WHATSAPP.

   Antes enviaba a /api/contact (nodemailer), que devuelve 500 porque faltan
   EMAIL_USER y EMAIL_APP_PASSWORD. Ahora junta lo que se escribio en un mensaje
   ordenado y abre wa.me con el texto ya puesto: la persona solo pulsa enviar
   dentro de WhatsApp. Sin servidor de por medio, no hay nada que pueda fallar
   de nuestro lado.

   No se vacia el formulario al abrir WhatsApp: si la persona vuelve sin haber
   enviado, sigue teniendo lo que escribio. */
function ContactForm() {
    const t = useTranslations('contact');
    const [datos, setDatos] = useState<DatosContacto>(VACIO);
    const [abriendo, setAbriendo] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        /* api.whatsapp.com y NO wa.me. wa.me redirige a esta misma direccion y,
           en esa redireccion, su servidor cambia cada emoji por "�" (lo
           comprobado: manda %E2%9C%85 y reenvia %EF%BF%BD). Las tildes las
           respeta; los emojis no. Yendo directo al destino final no hay
           redireccion que los rompa. */
        const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_ATLAS}&text=${encodeURIComponent(armarMensaje(datos))}`;

        /* Sin "noopener" en la llamada a proposito: con el, window.open devuelve
           null aunque SI abra, y no habria forma de saber si un bloqueador lo
           freno. Se corta el opener a mano despues. */
        const ventana = window.open(url, '_blank');
        if (ventana) ventana.opener = null;
        else window.location.href = url;

        setAbriendo(true);
        setTimeout(() => setAbriendo(false), 2500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setDatos((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="w-full relative z-20">
            {/* Typography Header - Creative & Big */}
            <div className="mb-16">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-foreground relative z-10">
                    {t('hero.title')}
                </h2>
                <p className="text-lg text-muted-foreground mt-4 font-light max-w-md">
                    {t('hero.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10">
                    <InputGroup label={t('form.name')} name="nombre" value={datos.nombre} onChange={handleChange} autoComplete="name" maxLength={80} required />
                    <InputGroup label={t('form.whatsapp')} name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={datos.whatsapp} onChange={handleChange} />
                    <InputGroup label={t('form.projectType')} name="tipo" type="select" opciones={TIPOS_PROYECTO} value={datos.tipo} onChange={handleChange} required />
                    <InputGroup label={t('form.businessType')} name="negocio" marcador={t('form.businessPlaceholder')} maxLength={60} value={datos.negocio} onChange={handleChange} />
                </div>
                <InputGroup label={t('form.budget')} name="presupuesto" type="select" opciones={PRESUPUESTOS} value={datos.presupuesto} onChange={handleChange} />
                <InputGroup
                    label={t('form.messagePlaceholder')} // Using placeholder label style
                    name="mensaje"
                    type="textarea"
                    maxLength={800}
                    value={datos.mensaje}
                    onChange={handleChange}
                />

                {/* El boton de envio es la tarjeta con punto viajero
                    (components/ui/glowing-card). Dos ajustes respecto al
                    original, por ser un boton y no un adorno:
                      · el texto, mas pequeño para que "ENVIAR MENSAJE" quepa;
                      · los extremos del brillo en gris en vez de negro. Con
                        negro, la primera y la ultima letra se perdian contra
                        el fondo casi negro de la tarjeta, y es el boton que
                        hay que leer. */}
                <GlowingCard
                    as="button"
                    type="submit"
                    className="mt-2"
                    style={{ '--gc-texto': 'clamp(1.75rem, 3vw, 2.75rem)', '--gc-sombra': '#8a8a8a' } as React.CSSProperties}
                >
                    <GlowingCardTitle>{abriendo ? t('form.opening') : t('form.submit')}</GlowingCardTitle>
                    <GlowingCardLabel>{t('form.via')}</GlowingCardLabel>
                </GlowingCard>
            </form>
        </div>
    );
}

const socialDescriptions: Record<string, string> = {
    GitHub: "Open Source",
    LinkedIn: "Professional",
    Twitter: "Thoughts",
    Instagram: "Lifestyle",
    Discord: "Community",
    Spotify: "Music"
};

import { usePerformance } from '@/hooks/usePerformance';

export default function ContactPage() {
    const t = useTranslations('contact');
    const { isLowPowerMode } = usePerformance();

    const getSocialItem = (platform: string) => {
        const link = portfolioData.personal.socialLinks.find(l => l.platform.toLowerCase() === platform);
        return {
            name: (link?.platform || platform).charAt(0).toUpperCase() + (link?.platform || platform).slice(1),
            username: link?.username || '@user',
            body: socialDescriptions[link?.platform || platform] || "Connect",
            image: socialIconsMap[platform.toLowerCase()] || ArrowUpRight,
            url: link?.url || '#'
        };
    };

    const row1Real = ['linkedin', 'github', 'instagram'].map(getSocialItem);
    const row2Real = ['twitter', 'discord', 'spotify'].map(getSocialItem);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });



    return (
        <div ref={containerRef} className="relative bg-background selection:bg-primary/20">
            {/* 2. HEADER & BACKGROUNDS */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-background/60 backdrop-blur-[2px] pointer-events-none z-0" />
            <DeferredMount>
                <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
                    {!isLowPowerMode && <Meteors number={50} />}
                </div>
            </DeferredMount>

            {/* 3. MAIN CONTENT: (Header + Form + Lanyard) */}
            <div className="relative z-10">

                {/* Header Section (Flows normally) */}
                <div className="relative w-full pt-48 pb-20">
                    <div className="w-full flex items-center justify-center opacity-20 select-none pointer-events-none">
                        <DynamicScrollVelocity
                            texts={[t('hero.ticker.build'), t('hero.ticker.freelance')]}
                            velocity={20}
                            className="text-7xl md:text-[9rem] font-black tracking-tight uppercase whitespace-nowrap"
                            isLowPowerMode={isLowPowerMode}
                        />
                    </div>
                </div>

                {/* Interaction Section (Lanyard + Social + Form) */}
                {/* We keep this relative and stable. No shrinking or fading here. */}
                <div className="container-creative px-4 md:px-8 max-w-[1800px] mx-auto pb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                        {/* LEFT COLUMN: Lanyard */}
                        <div className="col-span-1 lg:col-span-4 relative lg:sticky top-0 h-[400px] md:h-[500px] lg:h-[90vh] pointer-events-none z-20">
                            {/* Anchor Slot/Bar for Lanyard */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 md:w-64 lg:w-96 h-2 bg-gradient-to-r from-transparent via-foreground/20 to-transparent blur-[2px] rounded-full z-30 mt-[-1px]" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 lg:w-48 h-[3px] bg-gradient-to-r from-transparent via-foreground/40 to-transparent rounded-full z-30" />

                            <DeferredMount fallback={<div className="w-full h-full flex items-center justify-center opacity-50"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                                <div className="w-full h-full pointer-events-auto overflow-visible">
                                    {!isLowPowerMode ? (
                                        <ErrorBoundary fallback={<div className="w-full h-full flex items-center justify-center opacity-50">Interactive Card Unavailable</div>}>
                                            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} isLowPowerMode={isLowPowerMode} />
                                        </ErrorBoundary>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-8">
                                            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-primary/5">
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 italic font-serif">
                                                    Archive ID // Static
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DeferredMount>
                        </div>

                        {/* RIGHT COLUMN: Content Stack */}
                        <div className="col-span-1 lg:col-span-8 flex flex-col gap-16 relative z-10 pt-10 lg:pt-0">

                            {/* Social Connect */}
                            <motion.div
                                className="w-full"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex flex-col gap-1">
                                    <SocialTicker items={row1Real} direction="right" speed={50} isLowPowerMode={isLowPowerMode} />
                                    <SocialTicker items={row2Real} direction="left" speed={50} isLowPowerMode={isLowPowerMode} />
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <ContactForm />
                            </motion.div>


                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
