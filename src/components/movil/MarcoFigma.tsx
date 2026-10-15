'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/* El recuadro de seleccion de Figma sobre una palabra, con la etiqueta de
   medidas ("Puntual 168 × 52"). Las medidas son las de verdad: se leen de la
   caja de la palabra y, al entrar en pantalla, cuentan desde cero. Si la
   palabra cambia de tamaño (la rotativa del hero), cuentan del valor viejo
   al nuevo. */

type Props = {
    children: ReactNode;
    etiqueta?: string;
    arriba?: boolean;
    clave?: string | number;
    className?: string;
};

export function MarcoFigma({ children, etiqueta, arriba, clave, className = '' }: Props) {
    const ref = useRef<HTMLSpanElement>(null);
    const [med, setMed] = useState<[number, number]>([0, 0]);
    const mostrado = useRef<[number, number]>([0, 0]);
    const [txt, setTxt] = useState<[number, number]>([0, 0]);
    const activo = useRef(false);

    // Medir: al montar, al cambiar la palabra, al cargar la fuente y al
    // redimensionar.
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const medir = () => setMed([Math.round(el.offsetWidth), Math.round(el.offsetHeight)]);
        medir();
        const ro = new ResizeObserver(medir);
        ro.observe(el);
        document.fonts?.ready.then(medir);
        return () => ro.disconnect();
    }, [clave]);

    // Contar hacia la medida nueva, pero solo despues de entrar en pantalla.
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        const animar = () => {
            const desde = mostrado.current;
            const hasta = med;
            if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
                mostrado.current = hasta;
                setTxt(hasta);
                return;
            }
            const t0 = performance.now();
            const paso = (t: number) => {
                const p = Math.min(1, (t - t0) / 900);
                const e = 1 - (1 - p) ** 3;
                const v: [number, number] = [
                    Math.round(desde[0] + (hasta[0] - desde[0]) * e),
                    Math.round(desde[1] + (hasta[1] - desde[1]) * e),
                ];
                mostrado.current = v;
                setTxt(v);
                if (p < 1) raf = requestAnimationFrame(paso);
            };
            raf = requestAnimationFrame(paso);
        };
        if (activo.current || el.classList.contains('is-in')) {
            activo.current = true;
            animar();
        } else {
            const alEntrar = () => {
                activo.current = true;
                animar();
            };
            el.addEventListener('m-in', alEntrar, { once: true });
            return () => {
                el.removeEventListener('m-in', alEntrar);
                cancelAnimationFrame(raf);
            };
        }
        return () => cancelAnimationFrame(raf);
    }, [med]);

    return (
        <span ref={ref} className={`m-marco${arriba ? ' m-marco--arriba' : ''} ${className}`} data-in>
            {children}
            <span className="m-marco-caja" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
            </span>
            <em className="m-marco-etq" aria-hidden="true">
                {etiqueta && <span>{etiqueta}</span>}
                <b>
                    {txt[0]} × {txt[1]}
                </b>
            </em>
        </span>
    );
}
