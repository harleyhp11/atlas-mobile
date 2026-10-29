'use client';

import { useEffect, useRef, useState } from 'react';
import { Flecha, FlechaDer, FlechaIzq } from '../iconos';

/* Los diseños de Harley en Figma, en su ficha (la captura entera, con la
   interfaz de Figma alrededor): un riel con scroll-snap nativo (se
   desliza con el dedo) y dos flechas redondas que lo mueven una tarjeta.
   Es el unico JS propio de /nosotros: las flechas y saber si el riel esta
   en un extremo (calculado en un rAF por scroll, pasivo). */

export type ItemCarrusel = { id: string; titulo: string; rol: string; src: string; completo: string };

const PASO = 290; // 280 de tarjeta + 10 de espacio

export function Carrusel({ items }: { items: ItemCarrusel[] }) {
    const riel = useRef<HTMLUListElement>(null);
    const [bordes, setBordes] = useState({ inicio: true, fin: false });

    useEffect(() => {
        const el = riel.current;
        if (!el) return;
        let raf = 0;
        const medir = () => {
            raf = 0;
            const inicio = el.scrollLeft <= 4;
            const fin = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
            setBordes((b) => (b.inicio === inicio && b.fin === fin ? b : { inicio, fin }));
        };
        const alScroll = () => {
            if (!raf) raf = requestAnimationFrame(medir);
        };
        medir();
        el.addEventListener('scroll', alScroll, { passive: true });
        window.addEventListener('resize', alScroll);
        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener('scroll', alScroll);
            window.removeEventListener('resize', alScroll);
        };
    }, []);

    const mover = (dir: 1 | -1) => {
        const el = riel.current;
        if (!el) return;
        if ((dir < 0 && bordes.inicio) || (dir > 0 && bordes.fin)) return;
        const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollBy({ left: dir * PASO, behavior: reducido ? 'auto' : 'smooth' });
    };

    return (
        <div className="nos-carrusel">
            <div className="nos-pieza-cab">
                <span className="m-mono nos-pieza-t">Lo que se ve</span>
                <span className="m-mono nos-pieza-sub">En Figma</span>
            </div>
            <ul ref={riel} id="nos-riel" className="nos-riel" aria-label="Diseños de Harley en Figma">
                {items.map((p) => (
                    <li key={p.id} className="nos-riel-item">
                        <a href={p.completo} target="_blank" rel="noopener noreferrer">
                            <span className="nos-riel-img">
                                <img src={p.src} width={720} height={424} alt="" loading="lazy" decoding="async" />
                                <span className="nos-riel-ir" aria-hidden="true">
                                    <Flecha />
                                </span>
                            </span>
                            <span className="nos-riel-titulo">{p.titulo}</span>
                            <span className="nos-riel-rol">{p.rol}</span>
                            <span className="sr-only">, ver la captura completa (abre en otra pestaña)</span>
                        </a>
                    </li>
                ))}
            </ul>
            <div className="nos-flechas">
                <button
                    type="button"
                    className="nos-flecha"
                    aria-controls="nos-riel"
                    aria-label="Diseño anterior"
                    aria-disabled={bordes.inicio || undefined}
                    onClick={() => mover(-1)}
                >
                    <FlechaIzq />
                </button>
                <button
                    type="button"
                    className="nos-flecha"
                    aria-controls="nos-riel"
                    aria-label="Diseño siguiente"
                    aria-disabled={bordes.fin || undefined}
                    onClick={() => mover(1)}
                >
                    <FlechaDer />
                </button>
            </div>
        </div>
    );
}
