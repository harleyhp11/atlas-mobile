'use client';

import { useEffect, useRef } from 'react';
import { Boton } from '../Boton';
import { Ceja } from '../Ceja';
import { Titular } from '../Titular';
import './trabajos.css';

/* (05) Trabajos — un muro de piezas en dos columnas, sobre negro, con el
   titular en el centro.

   Dos movimientos que se suman, cada uno en su propia capa:
     · bucle continuo: una columna sube y la otra baja sin parar (CSS,
       pausado fuera de pantalla con data-loop);
     · parallax con el scroll: las columnas se separan en sentidos opuestos y
       el titular va a otro ritmo. Lo mueve animation-timeline: view() donde
       existe y un rAF por scroll donde no. Solo translate: nada se fija ni
       secuestra el scroll.

   Las imagenes son las piezas de la galeria de Atlas (las mismas del
   mosaico del escritorio) mas las portadas de Utopp, REGO y La Leña, en blanco y
   negro como alla. Son decorativas: el boton del centro lleva a los
   proyectos. */

const COLUMNA_A = ['rego', 'obra-02', 'la-lena', 'app-golf', 'obra-06', 'sitio-web'];
const COLUMNA_B = ['obra-01', 'obra-04', 'utopp', 'obra-05', 'laboratorio', 'obra-03'];

function Columna({ piezas, lado }: { piezas: string[]; lado: 'a' | 'b' }) {
    return (
        <div className={`h-trab-col h-trab-col--${lado}`}>
            <div className="h-trab-pista">
                {/* dos copias: el bucle cierra sin costura */}
                {[0, 1].map((copia) => (
                    <div key={copia} className="h-trab-grupo">
                        {piezas.map((p) => (
                            <img key={p} src={`/assets/movil/trabajos/${p}.webp`} width={480} height={720} alt="" loading="lazy" decoding="async" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Trabajos() {
    const seccion = useRef<HTMLElement>(null);

    // Respaldo del parallax para navegadores sin animation-timeline.
    useEffect(() => {
        const el = seccion.current;
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

    return (
        <section ref={seccion} id="trabajos" className="h-trabajos" data-tono="oscuro" aria-labelledby="trabajos-t">
            <div className="h-trab-muro" data-loop aria-hidden="true">
                <Columna piezas={COLUMNA_A} lado="a" />
                <Columna piezas={COLUMNA_B} lado="b" />
            </div>

            <div className="h-trab-centro">
                <div className="h-trab-centro-in">
                    <Ceja n="05">Trabajos</Ceja>
                    <Titular id="trabajos-t" className="m-h2 h-trab-h2" texto="Lo que hemos construido." destacar="construido." />
                    <Boton href="/projects" variante="claro" chico>
                        Ver proyectos
                    </Boton>
                </div>
            </div>
        </section>
    );
}
