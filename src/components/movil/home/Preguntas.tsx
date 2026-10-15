'use client';

import { useEffect, useRef, useState } from 'react';
import { anclar } from '../anclar';
import { Ceja } from '../Ceja';
import { Titular } from '../Titular';
import './preguntas.css';

/* (07) Preguntas — el FAQ de Reachwise ("Questions, answered.") sobre negro.

   A la izquierda, un riel vertical que se llena de rojo con el scroll: la
   punta del relleno sigue una linea a media pantalla y brilla; cada punto se
   enciende cuando el relleno lo alcanza. Solo pinta: no fija nada ni mueve
   el scroll.

   Acordeon de uno abierto, como servicios: al abrir otra pregunta se cierra
   la anterior, y la fila tocada se queda quieta bajo el dedo (anclar). Las
   preguntas y respuestas son las del brief de la version movil. */

const PREGUNTAS = [
    {
        q: '¿Cuánto cuesta?',
        a: 'Cada plan tiene un rango publicado y antes de empezar te damos el monto final por escrito. Si tu proyecto no encaja, lo cotizamos según el alcance real.',
    },
    {
        q: '¿Cuánto tarda?',
        a: 'Landing page: 7–10 días. Web corporativa: 2–3 semanas. Software a medida: desde 4 semanas. La fecha queda fijada desde la primera reunión.',
    },
    {
        q: '¿Cómo trabajamos?',
        a: 'Cinco etapas, trato directo con quien diseña y programa, y tu aprobación en cada paso. Nada se publica sin que lo veas.',
    },
    {
        q: '¿Y después del lanzamiento?',
        a: '30 días de soporte incluidos, atención directa por WhatsApp y capacitación para que administres tu web.',
    },
    {
        q: '¿Hacen sistemas, apps e IA?',
        a: 'Sí. Partimos de tu proceso real y construimos la herramienta alrededor de él: reservas, pedidos, paneles, apps y automatizaciones con IA.',
    },
];

const dos = (n: number) => String(n).padStart(2, '0');

export function Preguntas() {
    const [abierta, setAbierta] = useState<number | null>(null);
    const lista = useRef<HTMLDivElement>(null);

    // Relleno del riel segun el scroll. Un rAF por scroll; estilos y clases
    // a mano, sin re-render de React.
    useEffect(() => {
        const el = lista.current;
        if (!el) return;
        const riel = el.querySelector<HTMLElement>('.h-faq-riel');
        const puntos = Array.from(el.querySelectorAll<HTMLElement>('.h-faq-punto'));
        if (!riel) return;
        let pedido = false;
        const pintar = () => {
            pedido = false;
            // el riel va del centro del primer punto al del ultimo, midan lo
            // que midan las filas (abrir una pregunta las cambia)
            const L = el.getBoundingClientRect();
            const c0 = puntos[0].getBoundingClientRect();
            const cN = puntos[puntos.length - 1].getBoundingClientRect();
            const y0 = c0.top + c0.height / 2;
            riel.style.top = `${(y0 - L.top).toFixed(1)}px`;
            riel.style.height = `${(cN.top + cN.height / 2 - y0).toFixed(1)}px`;
            // Avance del relleno: 0 cuando el riel asoma por abajo (70 % de la
            // pantalla) y 1 cuando su final cruza la mitad... o antes, si la
            // pagina se acaba: asi siempre termina de llenarse.
            const vh = window.innerHeight;
            const r = riel.getBoundingClientRect();
            const arriba = r.top + window.scrollY;
            const tope = document.documentElement.scrollHeight - vh;
            const s0 = arriba - vh * 0.7;
            const s1 = Math.max(s0 + 1, Math.min(arriba + r.height - vh * 0.55, tope));
            const avance = Math.min(1, Math.max(0, (window.scrollY - s0) / (s1 - s0)));
            const lleno = avance * r.height;
            el.style.setProperty('--lleno', `${lleno.toFixed(1)}px`);
            el.dataset.lleno = avance <= 0 ? 'vacio' : avance >= 1 ? 'lleno' : 'a-medias';
            for (const p of puntos) {
                const b = p.getBoundingClientRect();
                p.classList.toggle('is-alcanzado', avance > 0 && b.top + b.height / 2 - r.top <= lleno + 0.5);
            }
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
        // abrir y cerrar cambia el alto de la lista mientras dura la animacion
        const ro = new ResizeObserver(alMover);
        ro.observe(el);
        return () => {
            window.removeEventListener('scroll', alMover);
            window.removeEventListener('resize', alMover);
            ro.disconnect();
        };
    }, []);

    const tocar = (i: number, boton: HTMLElement) => {
        anclar(boton);
        setAbierta((a) => (a === i ? null : i));
    };

    return (
        <section id="preguntas" className="h-faq" data-tono="oscuro" aria-labelledby="preguntas-t">
            <div className="m-wrap">
                <Ceja n="07">Preguntas</Ceja>
                <Titular id="preguntas-t" className="m-h2 h-faq-h2" texto="Preguntas, respondidas." destacar="respondidas." />

                <div ref={lista} className="h-faq-lista" data-lleno="vacio">
                    <span className="h-faq-riel" aria-hidden="true">
                        <span className="h-faq-relleno" />
                        <i className="h-faq-cabeza" />
                    </span>

                    {PREGUNTAS.map((p, i) => {
                        const abierto = abierta === i;
                        return (
                            <div key={p.q} className={`h-faq-item${abierto ? ' is-open' : ''}`}>
                                <span className="h-faq-punto" aria-hidden="true" />
                                <h3 className="h-faq-h">
                                    <button
                                        type="button"
                                        id={`faq-b-${i}`}
                                        className="h-faq-btn"
                                        aria-expanded={abierto}
                                        aria-controls={`faq-p-${i}`}
                                        onClick={(e) => tocar(i, e.currentTarget)}
                                    >
                                        <span className="h-faq-n">{dos(i + 1)}</span>
                                        <span className="h-faq-q">{p.q}</span>
                                        <span className="h-faq-mas" aria-hidden="true">
                                            <i />
                                            <i />
                                        </span>
                                    </button>
                                </h3>
                                <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} className="h-faq-panel" inert={!abierto}>
                                    <div className="h-faq-panel-in">
                                        <p>{p.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
