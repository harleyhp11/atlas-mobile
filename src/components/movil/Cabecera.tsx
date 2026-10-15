'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Boton } from './Boton';
import { MENU, WHATSAPP } from './datos';

/* Cabecera flotante + menu a pantalla completa.

   Cabecera: transparente sobre el hero; a los 40 px de scroll pasa a
   capsula de vidrio. Se esconde al bajar y vuelve al subir. Toma el tono
   (claro u oscuro) de la seccion que tiene debajo, leyendo `data-tono`.
   Todo eso son atributos en el <header> escritos a mano en un solo rAF por
   scroll: ningun re-render de React mientras se hace scroll.

   Menu: se abre como un circulo que nace en la hamburguesa. Bloquea el
   scroll, deja el resto de la pagina `inert`, enfoca el primer enlace, se
   cierra con Escape y devuelve el foco al boton. */

type Enlace = { n: string; label: string; href: string };

type Props = {
    enlaces?: Enlace[];
    /* 'arriba': transparente hasta hacer scroll. 'fija': capsula desde el inicio. */
    inicio?: 'arriba' | 'fija';
    estado?: boolean;
    ctaRojo?: boolean;
};

const formato = () =>
    new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Lima' });

export function RelojLima() {
    const [hm, setHm] = useState<string[] | null>(null);
    useEffect(() => {
        const f = formato();
        const tic = () => setHm(f.format(new Date()).split(':'));
        tic();
        const id = window.setInterval(tic, 15000);
        return () => window.clearInterval(id);
    }, []);
    return (
        <strong>
            {hm ? (
                <>
                    {hm[0]}
                    <span className="m-reloj-sep">:</span>
                    {hm[1]}
                </>
            ) : (
                '--:--'
            )}
        </strong>
    );
}

export function Cabecera({ enlaces = MENU, inicio = 'arriba', estado = false, ctaRojo = false }: Props) {
    const cab = useRef<HTMLElement>(null);
    const boton = useRef<HTMLButtonElement>(null);
    const menu = useRef<HTMLDivElement>(null);
    const [abierto, setAbierto] = useState(false);

    // Scroll: estado de la capsula y ocultar al bajar.
    useEffect(() => {
        let ultimo = window.scrollY;
        let pedido = false;
        const pintar = () => {
            pedido = false;
            const el = cab.current;
            if (!el) return;
            const y = window.scrollY;
            el.dataset.estado = y > 40 || inicio === 'fija' ? 'flotante' : 'arriba';
            if (el.dataset.menu === 'true') {
                el.dataset.oculta = 'false';
            } else if (y > ultimo + 6 && y > 180) {
                el.dataset.oculta = 'true';
            } else if (y < ultimo - 6 || y <= 180) {
                el.dataset.oculta = 'false';
            }
            ultimo = y;
        };
        const alScroll = () => {
            if (!pedido) {
                pedido = true;
                requestAnimationFrame(pintar);
            }
        };
        pintar();
        window.addEventListener('scroll', alScroll, { passive: true });
        return () => window.removeEventListener('scroll', alScroll);
    }, [inicio]);

    // Tono: la seccion que pasa por debajo de la cabecera (banda de 2 px a
    // la altura de su centro).
    useEffect(() => {
        let io: IntersectionObserver | null = null;
        const montar = () => {
            io?.disconnect();
            io = new IntersectionObserver(
                (es) => {
                    for (const e of es) {
                        if (e.isIntersecting && cab.current) {
                            cab.current.dataset.tono = (e.target as HTMLElement).dataset.tono || 'oscuro';
                        }
                    }
                },
                { rootMargin: `-40px 0px -${Math.max(0, window.innerHeight - 42)}px 0px` }
            );
            document.querySelectorAll<HTMLElement>('[data-tono]').forEach((s) => io!.observe(s));
        };
        montar();
        window.addEventListener('resize', montar);
        return () => {
            io?.disconnect();
            window.removeEventListener('resize', montar);
        };
    }, []);

    const cerrar = useCallback(() => setAbierto(false), []);

    // Abrir / cerrar: bloqueo de scroll, inert, foco y Escape.
    useEffect(() => {
        const raiz = document.documentElement;
        const contenido = document.getElementById('m-contenido');
        if (cab.current) cab.current.dataset.menu = String(abierto);
        if (!abierto) {
            raiz.style.overflow = '';
            contenido?.removeAttribute('inert');
            return;
        }
        raiz.style.overflow = 'hidden';
        contenido?.setAttribute('inert', '');
        const t = window.setTimeout(() => menu.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }), 380);
        const tecla = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setAbierto(false);
                boton.current?.focus();
            }
        };
        window.addEventListener('keydown', tecla);
        return () => {
            window.clearTimeout(t);
            window.removeEventListener('keydown', tecla);
        };
    }, [abierto]);

    const alternar = () => {
        const b = boton.current?.getBoundingClientRect();
        if (b && menu.current) {
            menu.current.style.setProperty('--mx', `${b.left + b.width / 2}px`);
            menu.current.style.setProperty('--my', `${b.top + b.height / 2}px`);
        }
        setAbierto((v) => !v);
    };

    return (
        <>
            <header ref={cab} className="m-cab" data-estado={inicio === 'fija' ? 'flotante' : 'arriba'} data-tono="oscuro" data-oculta="false">
                <div className="m-cab-capsula">
                    <a className="m-cab-logo" href="/" aria-label="Atlas, ir al inicio">
                        <img src="/brand/atlas-logo-movil.webp" width={97} height={22} alt="" fetchPriority="high" />
                    </a>
                    {estado && (
                        <span className="m-cab-estado">
                            <i className="m-ping m-ping--siempre" data-loop aria-hidden="true" />
                            <span>Disponibles</span>
                        </span>
                    )}
                    <a className={`m-cab-cta${ctaRojo ? ' m-cab-cta--rojo' : ''}`} href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                        Cotizar<span className="sr-only"> por WhatsApp</span>
                    </a>
                    <button
                        ref={boton}
                        type="button"
                        className="m-cab-menu"
                        aria-expanded={abierto}
                        aria-controls="m-menu"
                        aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
                        onClick={alternar}
                    >
                        <span />
                        <span />
                    </button>
                </div>
            </header>

            <div
                ref={menu}
                id="m-menu"
                className="m-menu"
                data-abierto={abierto}
                role="dialog"
                aria-modal="true"
                aria-label="Menú"
                aria-hidden={!abierto}
                inert={!abierto}
            >
                <nav className="m-menu-in" aria-label="Secciones">
                    <ul className="m-menu-links">
                        {enlaces.map((l, i) => (
                            <li key={l.href}>
                                <a href={l.href} onClick={cerrar} style={{ '--i': i } as React.CSSProperties}>
                                    <small>{l.n}</small>
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="m-menu-pie">
                        <Boton href={WHATSAPP} externo>
                            Escríbenos por WhatsApp
                        </Boton>
                        <div className="m-menu-datos">
                            <div>
                                <span className="m-mono">Hora en Lima</span>
                                <RelojLima />
                            </div>
                            <div style={{ alignItems: 'flex-end', textAlign: 'right' }}>
                                <span className="m-mono">Estado</span>
                                <span className="m-menu-dispo">
                                    <i className="m-ping" aria-hidden="true" />
                                    Disponibles para proyectos
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
