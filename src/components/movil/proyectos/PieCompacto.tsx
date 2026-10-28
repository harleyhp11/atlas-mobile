'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { WHATSAPP } from '../datos';
import { Flecha, SimboloAtlas } from '../iconos';

/* El pie de las paginas de proyectos: una billetera.

   Tres tarjetas premium asoman de un bolsillo de cuero (negro que se
   enciende en rojo, con costura). Son los accesos: escribir por WhatsApp,
   cotizar y ver los servicios. Cuando el pie entra en pantalla las
   tarjetas suben y se abren en abanico, el monto del bolsillo cuenta hasta
   S/ 400 —el precio de entrada real— y los hologramas brillan. Tocar el
   bolsillo las guarda o las vuelve a sacar. Con movimiento reducido salen
   abiertas y quietas.

   `soloNav`: para las paginas que ya cierran con su propio llamado (/nosotros,
   con su isla roja de WhatsApp): deja solo la navegacion y la linea legal.
   Por defecto es false, asi que /projects, sus fichas y /servicios no cambian. */

const TARJETAS = [
    { clase: 'is-azul', etiqueta: 'Servicios', detalle: 'Webs, apps, software e IA', href: '/#servicios' },
    { clase: 'is-plata', etiqueta: 'WhatsApp', detalle: '+51 985 149 671', href: WHATSAPP, externo: true },
    { clase: 'is-grafito', etiqueta: 'Cotizar', detalle: 'Precio por escrito', href: '/contact' },
];

const ENLACES = [
    { label: 'Inicio', href: '/' },
    { label: 'Proyectos', href: '/projects' },
    { label: 'Precios', href: '/servicios' },
    { label: 'Contacto', href: '/contact' },
];

export function PieCompacto({ soloNav = false }: { soloNav?: boolean } = {}) {
    const escena = useRef<HTMLDivElement>(null);
    const monto = useRef<HTMLSpanElement>(null);
    const [abierta, setAbierta] = useState(false);
    const tocada = useRef(false);

    // se abre sola al entrar en pantalla, y se guarda al irse (si nadie la toco)
    useEffect(() => {
        const el = escena.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (!tocada.current) setAbierta(e.isIntersecting);
            },
            { threshold: 0.55 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // el monto cuenta hasta 400 cada vez que se abre
    useEffect(() => {
        const el = monto.current;
        if (!el) return;
        const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!abierta || reducido) {
            el.textContent = '400';
            return;
        }
        let raf = 0;
        const t0 = performance.now();
        const paso = (t: number) => {
            const p = Math.min(1, (t - t0) / 1100);
            el.textContent = String(Math.round(400 * (1 - (1 - p) ** 4)));
            if (p < 1) raf = requestAnimationFrame(paso);
        };
        raf = requestAnimationFrame(paso);
        return () => cancelAnimationFrame(raf);
    }, [abierta]);

    return (
        <footer className="pry-pie" data-tono="oscuro">
            <div className="m-wrap">
                {!soloNav && (
                    <>
                        <p className="pry-pie-ceja m-mono">
                            <i aria-hidden="true" />
                            ¿El siguiente es el tuyo?
                        </p>
                        <h2 className="pry-pie-t">Todo para empezar, en un bolsillo.</h2>

                        <div ref={escena} className="pry-bill" data-abierta={abierta ? '' : undefined}>
                            <div className="pry-bill-caja" aria-hidden="true">
                                <span>Atlas</span>
                            </div>

                            <ul className="pry-bill-tarjetas">
                                {TARJETAS.map((t, i) => (
                                    <li key={t.etiqueta} className={`pry-bill-t ${t.clase}`} style={{ '--i': i } as CSSProperties}>
                                        <a href={t.href} {...(t.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})} tabIndex={abierta ? 0 : -1}>
                                            {/* el nombre arriba, grande, como el VISA de una tarjeta: es lo
                                                que se ve de las de atras en el abanico */}
                                            <span className="pry-bill-marca">{t.etiqueta}</span>
                                            <span className="pry-bill-chip" aria-hidden="true" />
                                            <span className="pry-bill-dato">
                                                <SimboloAtlas />
                                                <small>{t.detalle}</small>
                                            </span>
                                            <span className="pry-bill-ir" aria-hidden="true">
                                                <Flecha />
                                            </span>
                                            {t.externo && <span className="sr-only"> (abre WhatsApp)</span>}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="pry-bill-bolsillo"
                                aria-pressed={abierta}
                                aria-label={abierta ? 'Guardar las tarjetas' : 'Sacar las tarjetas'}
                                onClick={() => {
                                    tocada.current = true;
                                    setAbierta((a) => !a);
                                }}
                            >
                                <span className="pry-bill-costura" aria-hidden="true" />
                                <span className="pry-bill-label">Tu web, desde</span>
                                <span className="pry-bill-monto">
                                    S/ <span ref={monto}>400</span>
                                    <small>.00</small>
                                </span>
                                <span className="pry-bill-pista m-mono">{abierta ? 'Toca una tarjeta · o el bolsillo para guardarlas' : 'Toca el bolsillo para sacarlas'}</span>
                            </button>
                        </div>
                    </>
                )}

                <nav className="pry-pie-nav" aria-label="Pie de página">
                    <ul>
                        {ENLACES.map((e) => (
                            <li key={e.href}>
                                <a href={e.href}>{e.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <p className="pry-pie-legal">
                    <span>© {new Date().getFullYear()} Atlas · Lima, Perú</span>
                    <a href="#m-contenido">Volver arriba</a>
                </p>
            </div>
        </footer>
    );
}
