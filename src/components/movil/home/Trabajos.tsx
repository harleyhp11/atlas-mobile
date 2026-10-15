'use client';

import { useEffect, useRef } from 'react';
import { Ceja } from '../Ceja';
import { Titular } from '../Titular';
import './trabajos.css';

/* (05) Trabajos — un muro de portadas en dos columnas, sobre negro y sin
   texto bajo el titular. Al hacer scroll, una columna sube y la otra baja:
   solo es un desplazamiento (translate), no fija la seccion ni secuestra el
   scroll.

     · Donde existe, lo mueve el propio navegador con animation-timeline:
       view() (CSS, en el compositor). Si no, un rAF por scroll escribe --p.
     · Las portadas van en blanco y negro y pasan a color al cruzar el centro
       de la pantalla.
     · Solo trabajo real: los recortes salen de las portadas de los cinco
       proyectos de Atlas (dos por proyecto) y cada tarjeta abre su ficha. */

type Proyecto = { nombre: string; cat: string; slug: string };

const P: Record<string, Proyecto> = {
    rego: { nombre: 'REGO Premium', cat: 'Hotelería', slug: 'rego-premium' },
    workup: { nombre: 'WorkUP', cat: 'IA & empleo', slug: 'workup' },
    fluxa: { nombre: 'Fluxa', cat: 'Fintech', slug: 'fluxa' },
    utopp: { nombre: 'Utopp', cat: 'Comunidad universitaria', slug: 'utopp' },
    peru: { nombre: 'Perú Travel', cat: 'Turismo', slug: 'peru-travel' },
};

// [proyecto, recorte, alto de la imagen a 480 de ancho]
type Carta = [keyof typeof P, 'a' | 'b', number];

const COLUMNA_A: Carta[] = [
    ['rego', 'a', 600],
    ['fluxa', 'a', 480],
    ['peru', 'a', 600],
    ['utopp', 'b', 480],
    ['workup', 'b', 600],
];
const COLUMNA_B: Carta[] = [
    ['workup', 'a', 480],
    ['utopp', 'a', 600],
    ['fluxa', 'b', 600],
    ['peru', 'b', 480],
    ['rego', 'b', 480],
];

function Columna({ cartas, lado }: { cartas: Carta[]; lado: 'a' | 'b' }) {
    return (
        <div className={`h-trab-col h-trab-col--${lado}`}>
            {cartas.map(([clave, recorte, alto]) => {
                const p = P[clave];
                return (
                    <a key={`${clave}-${recorte}`} className="h-trab-carta" href={`/projects/${p.slug}`}>
                        <span className="h-trab-img">
                            <img
                                src={`/assets/movil/trabajos/${clave}-${recorte}.webp`}
                                width={480}
                                height={alto}
                                alt={`Portada de la web de ${p.nombre}`}
                                loading="lazy"
                                decoding="async"
                            />
                        </span>
                        <span className="h-trab-pie">
                            <b>{p.nombre}</b>
                            <small>{p.cat}</small>
                        </span>
                    </a>
                );
            })}
        </div>
    );
}

export function Trabajos() {
    const grilla = useRef<HTMLDivElement>(null);

    // Respaldo del desplazamiento para navegadores sin animation-timeline.
    useEffect(() => {
        const el = grilla.current;
        if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')) return;
        let pedido = false;
        const pintar = () => {
            pedido = false;
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
            el.style.setProperty('--p', p.toFixed(4));
        };
        const alMover = () => {
            if (!pedido) {
                pedido = true;
                requestAnimationFrame(pintar);
            }
        };
        pintar();
        window.addEventListener('scroll', alMover, { passive: true });
        window.addEventListener('resize', alMover);
        return () => {
            window.removeEventListener('scroll', alMover);
            window.removeEventListener('resize', alMover);
        };
    }, []);

    // Blanco y negro → color al cruzar la franja central de la pantalla.
    useEffect(() => {
        const el = grilla.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (es) => {
                for (const e of es) e.target.classList.toggle('is-color', e.isIntersecting);
            },
            { rootMargin: '-36% 0px -36% 0px' }
        );
        el.querySelectorAll('.h-trab-carta').forEach((c) => io.observe(c));
        return () => io.disconnect();
    }, []);

    return (
        <section id="trabajos" className="h-trabajos" data-tono="oscuro" aria-labelledby="trabajos-t">
            <div className="m-wrap">
                <Ceja n="05">Trabajos</Ceja>
                <Titular id="trabajos-t" className="m-h2 h-trab-h2" texto="Lo que hemos construido." destacar="construido." />
            </div>
            <div ref={grilla} className="h-trab-grilla">
                <Columna cartas={COLUMNA_A} lado="a" />
                <Columna cartas={COLUMNA_B} lado="b" />
            </div>
        </section>
    );
}
