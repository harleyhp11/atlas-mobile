'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

import CardNav from '@/components/ui/CardNav';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { usePreloadState } from '@/components/ui/arc-preloader-hero';

function Clock() {
    const [time, setTime] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            setTime(`${h}:${m}:${s}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <span className="font-mono text-xl md:text-2xl font-black opacity-0">00:00:00</span>;

    return (
        <span className="font-mono text-xl md:text-2xl font-black text-gradient tracking-widest hover:tracking-[0.2em] transition-all duration-300">
            {time}
        </span>
    );
}

// Sub-links for the "About" dropdown
// Sub-links for the "About" dropdown
const useNavItems = () => {
    const t = useTranslations('navigation.menu');
    return [
        {
            label: "Estudio",
            links: [
                { label: t('servicios'), href: "/servicios", description: t('serviciosDesc') },
                { label: t('skills'), href: "/skills", description: t('skillsDesc') },
                { label: t('projects'), href: "/projects", description: t('projectsDesc') },
                { label: t('blog'), href: "/blog", description: t('blogDesc') },
            ]
        }
    ];
};

export function Navbar() {
    const t = useTranslations('navigation');
    const navItems = useNavItems();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const { scrollY } = useScroll();

    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    /* La barra ya no se pinta por tema, sino por lo que tiene DEBAJO. El
       motivo: hay secciones blancas dentro del tema oscuro (el tramo final de
       IdentitySequence, y la de Testimonios), y ahi el vidrio claro de siempre
       se volvia un bloque opaco con el logotipo blanco perdido dentro.

       Se mide de verdad en vez de marcar secciones a mano: elementsFromPoint
       en el centro de la pastilla devuelve la pila de elementos que hay bajo
       ese punto; se descartan los de la propia barra y se baja hasta el primero
       con un fondo lo bastante opaco. De ese color sale la luminancia, y con
       ella la decision. Asi funciona con cualquier seccion futura sin tocar
       nada aqui, y funciona tambien con el fondo de IdentitySequence, que es un
       color ANIMADO por Framer: getComputedStyle lo lee en vivo.

       El umbral es 0.55 y no 0.5: entre medias hay grises donde el blanco
       todavia aguanta, y saltar de piel en cada gris intermedio se veria como
       un parpadeo durante la transicion de gris a blanco. */
    const refPastilla = useRef<HTMLDivElement>(null);
    const [sueloClaro, setSueloClaro] = useState(false);

    useEffect(() => {
        const pastilla = refPastilla.current;
        if (!pastilla) return;
        let raf = 0;

        const medir = () => {
            raf = 0;
            const caja = pastilla.getBoundingClientRect();
            if (!caja.width) return;
            const x = Math.round(caja.left + caja.width / 2);
            const y = Math.round(caja.top + caja.height / 2);
            let claro = false;
            for (const el of document.elementsFromPoint(x, y)) {
                if (pastilla.contains(el)) continue;
                const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
                if (!m) continue;
                const alfa = m[3] !== undefined ? parseFloat(m[3]) : 1;
                if (alfa < 0.5) continue;
                const lum = (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) / 255;
                claro = lum > 0.55;
                break;
            }
            setSueloClaro((previo) => (previo === claro ? previo : claro));
        };

        const alMover = () => {
            if (!raf) raf = requestAnimationFrame(medir);
        };

        medir();
        window.addEventListener('scroll', alMover, { passive: true });
        window.addEventListener('resize', alMover);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', alMover);
            window.removeEventListener('resize', alMover);
        };
    }, []);
    
    // Consume preload state directly from context
    const { isPreloading: isPreloadActive } = usePreloadState();

    const isDark = resolvedTheme === 'dark';

    useEffect(() => {
        setMounted(true);
        const locale = document.cookie.split('; ').find(row => row.startsWith('locale='))?.split('=')[1] || 'en';
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        if (isMenuOpen) return; // Don't hide navbar when menu is open

        const direction = latest > lastScrollY ? 'down' : 'up';
        setIsScrolled(latest > 50);

        if (direction === 'down' && latest > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        setLastScrollY(latest);
    });

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);


    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleHomeClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        closeMenu();
    }, [pathname, closeMenu]);

    // Animation variants
    const navVariants = {
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
    };

    const menuVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    return (
        <>
            <motion.nav
                variants={navVariants}
                initial="hidden"
                animate={!isPreloadActive && (isVisible || isMenuOpen) ? 'visible' : 'hidden'}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed top-0 left-0 right-0 z-[100]"
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-3 md:py-4">
                    <motion.div
                        ref={refPastilla}
                        className={cn(
                            'flex items-center justify-between rounded-full transition-all duration-500',
                            /* Suelo claro: pastilla oscura, siempre, haya scroll o no
                               —sobre blanco el contenido no tiene donde apoyarse. */
                            sueloClaro
                                ? 'glass-navbar-sobre-claro px-5 py-2.5 backdrop-blur-2xl backdrop-saturate-[1.8]'
                                : isScrolled
                                    ? 'glass-navbar-claro px-5 py-2.5 backdrop-blur-2xl backdrop-saturate-[1.4]'
                                    : 'px-5 py-1.5'
                        )}
                        layout
                    >
                        {/* Brand anchor: Atlas logo, links home */}
                        <Link
                            href="/"
                            aria-label="Atlas - inicio"
                            className="relative group min-w-[104px] flex items-center"
                            onClick={handleHomeClick}
                        >
                            <Image
                                src="/brand/atlas-logo.png"
                                alt="Atlas - Digital Design & Systems"
                                width={1346}
                                height={280}
                                priority
                                sizes="(max-width: 768px) 112px, 136px"
                                /* El lockup del archivo es BLANCO. Sobre suelo
                                   claro se invierte a negro; sobre oscuro se
                                   queda como esta. Ya no depende del tema, que
                                   era el fallo: en tema oscuro sobre una seccion
                                   blanca quedaba blanco sobre blanco. */
                                className={cn(
                                    'h-6 md:h-7 w-auto transition-[opacity,filter] duration-500 group-hover:opacity-70',
                                    sueloClaro && 'invert'
                                )}
                            />
                        </Link>

                        {/* Desktop Navigation with CardNav */}
                        <div className="hidden lg:flex items-center gap-5">
                            {/* HOME */}
                            <Link
                                href="/"
                                onClick={handleHomeClick}
                                className={cn(
                                    'relative px-4 py-1.5 text-[13px] font-bold transition-all duration-300 rounded-full group',
                                    sueloClaro
                                        ? (pathname === '/' ? 'bg-black/[0.07] text-neutral-900' : 'text-neutral-500 hover:text-neutral-900')
                                        : (pathname === '/' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white')
                                )}
                            >
                                <span className="relative z-10">{t('home')}</span>
                            </Link>

                            <CardNav
                                items={navItems}
                                theme={isDark ? 'dark' : 'light'}
                                paletaDisparador={sueloClaro ? 'oscura' : 'clara'}
                                pathname={pathname}
                            />

                            {/* CONTACT (Direct Link) */}
                            <Link
                                href="/contact"
                                className={cn(
                                    'relative px-4 py-1.5 text-[13px] font-bold transition-all duration-300 rounded-full group',
                                    sueloClaro
                                        ? (pathname === '/contact' ? 'bg-black/[0.07] text-neutral-900' : 'text-neutral-500 hover:text-neutral-900')
                                        : (pathname === '/contact' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white')
                                )}
                            >
                                <span className="relative z-10">{t('contact')}</span>
                            </Link>
                        </div>

                        {/* Controles. Los tres botones de iconos que habia aqui
                            —Focus, idioma y tema— se quitaron a peticion.
                            Lo que se pierde, para que conste: el conmutador de
                            tema y el de idioma ya solo existen en el menu movil,
                            asi que en escritorio no hay forma de cambiarlos
                            desde la interfaz. El de "Focus" no se pierde nada:
                            apuntaba a un sitio externo de la plantilla. */}
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMenu}
                                className={cn('p-1.5 md:p-2 rounded-full transition-colors lg:hidden', sueloClaro ? 'bg-black/[0.06] text-neutral-900 hover:bg-black/[0.11]' : 'bg-white/10 text-white hover:bg-white/20')}
                                aria-label="Abrir o cerrar el menú"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={isMenuOpen ? 'close' : 'menu'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.nav >

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {
                    isMenuOpen && (
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[90] lg:hidden"
                        >
                            <motion.div
                                className="absolute inset-0 bg-background"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />

                            <div className="relative flex flex-col items-center justify-center h-full overflow-y-auto py-20">
                                <nav className="flex flex-col items-center gap-6">
                                    {/* Mobile Home */}
                                    <Link
                                        href="/"
                                        onClick={handleHomeClick}
                                        className="text-3xl font-black text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t('home')}
                                    </Link>

                                    <Link
                                        href="/contact"
                                        onClick={closeMenu}
                                        className="text-3xl font-black text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t('contact')}
                                    </Link>

                                    {/* Mobile Links grouped by Categories */}
                                    {navItems.map((category) => (
                                        <div key={category.label} className="flex flex-col items-center gap-4 py-4 border-b border-white/5 w-full last:border-0 text-center">
                                            <span className="text-[10px] font-black font-mono text-primary tracking-[0.3em] uppercase opacity-50">
                                                {category.label}
                                            </span>
                                            {category.links.map((link) => (
                                                <Link
                                                    key={link.label}
                                                    href={link.href}
                                                    onClick={closeMenu}
                                                    className={cn(
                                                        'text-2xl font-bold transition-all hover:scale-110 active:scale-95 duration-200',
                                                        pathname === link.href ? 'text-foreground' : 'text-muted-foreground/60 hover:text-foreground'
                                                    )}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </nav>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center gap-4 mt-12"
                                >
                                    {/* Aqui iba un conmutador ingles/indonesio de la
                                        plantilla. El sitio va solo en español, asi
                                        que no hay entre que elegir. */}
                                    {mounted && (
                                        <AnimatedThemeToggler
                                            className="px-6 py-6 glass-card text-sm font-medium hover:bg-muted/50 flex items-center gap-2"
                                        />
                                    )}
                                </motion.div>
                            </div>
                        </motion.div >
                    )
                }
            </AnimatePresence >
        </>
    );
}
