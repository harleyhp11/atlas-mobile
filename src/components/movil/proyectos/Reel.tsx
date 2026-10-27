'use client';

import { useEffect, useRef } from 'react';

/* El reel de diseños: las piezas de la galeria de Atlas en una tira que
   corre de derecha a izquierda.

   Al medio es una cinta plana, con las imagenes tal cual (sin shader ni
   3D, para que se vean nitidas). Solo en los bordes la tira se dobla: por
   la derecha cada pieza entra bajando desde arriba y por la izquierda se
   va cayendo hacia abajo, siguiendo la curva e inclinada segun su
   pendiente.

   Corre sola, despacio; el scroll y el dedo la empujan, con inercia. Solo
   se anima en pantalla; con movimiento reducido no corre sola (se puede
   arrastrar igual). */

const PIEZAS = ['sitio-web', 'obra-02', 'app-golf', 'obra-05', 'obra-01', 'laboratorio', 'obra-04', 'obra-03', 'obra-06'];
const BASE = 26; // lo que corre sola, en px/s
const GAP = 10;

export function Reel() {
    const caja = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = caja.current;
        if (!el) return;
        const piezas = [...el.querySelectorAll<HTMLElement>('.pry-reel-pieza')];
        const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

        let W = 0;
        let P = 0; // ancho de cada pieza
        let L = 0; // largo de la tira completa
        let zona = 0; // ancho de cada borde donde se dobla
        let caida = 0; // cuanto sube o baja en el borde
        let desplazado = 0;
        let empuje = 0; // velocidad extra (scroll y dedo), px/s
        let ultimo = performance.now();
        let raf = 0;
        let visible = false;
        let ultimoScroll = window.scrollY;

        const medir = () => {
            W = el.clientWidth;
            P = piezas[0]?.offsetWidth ?? 0;
            L = PIEZAS.length * (P + GAP);
            zona = Math.min(W * 0.34, P);
            caida = P * 0.17;
            pedir();
        };

        const colocar = () => {
            for (let i = 0; i < piezas.length; i++) {
                // posicion en la tira, dando la vuelta: entra por la derecha
                let x = (((i * (P + GAP) - desplazado) % L) + L) % L;
                if (x > W + P) x -= L;
                const c = x + P / 2;
                // cuanto se metio en el borde derecho (sube) o izquierdo (baja)
                const der = Math.min(1.25, Math.max(0, (c - (W - zona)) / zona));
                const izq = Math.min(1.25, Math.max(0, (zona - c) / zona));
                const k = der || izq;
                const y = (der ? -1 : 1) * caida * k * k;
                // inclinada segun la pendiente de la curva en ese punto
                const ang = -Math.atan((2 * caida * k) / zona) * 0.6;
                const s = 1 - 0.08 * k;
                piezas[i].style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${ang.toFixed(4)}rad) scale(${s.toFixed(4)})`;
            }
        };

        const cuadro = () => {
            const ahora = performance.now();
            const dt = Math.min(0.05, (ahora - ultimo) / 1000);
            ultimo = ahora;
            desplazado += ((reducido ? 0 : BASE) + empuje) * dt;
            empuje *= Math.pow(0.05, dt);
            colocar();
            raf = visible && (!reducido || Math.abs(empuje) > 1) ? requestAnimationFrame(cuadro) : 0;
        };
        function pedir() {
            if (!raf) raf = requestAnimationFrame(cuadro);
        }

        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) {
                ultimo = performance.now();
                pedir();
            }
        });
        io.observe(el);
        const ro = new ResizeObserver(medir);
        ro.observe(el);

        // el scroll empuja la tira, con mesura
        const alScroll = () => {
            const dy = window.scrollY - ultimoScroll;
            ultimoScroll = window.scrollY;
            if (visible) {
                empuje = Math.max(-520, Math.min(520, empuje + dy * 2.2));
                pedir();
            }
        };
        window.addEventListener('scroll', alScroll, { passive: true });

        // el dedo la arrastra de lado (el vertical sigue siendo scroll)
        let gesto: { id: number; x: number; y: number; t: number; lado: boolean } | null = null;
        const bajar = (e: PointerEvent) => {
            gesto = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), lado: false };
        };
        const mover = (e: PointerEvent) => {
            if (!gesto || gesto.id !== e.pointerId) return;
            const dx = e.clientX - gesto.x;
            if (!gesto.lado) {
                const dy = Math.abs(e.clientY - gesto.y);
                if (dy > 8 && dy > Math.abs(dx)) {
                    gesto = null;
                    return;
                }
                if (Math.abs(dx) < 6) return;
                gesto.lado = true;
                el.setPointerCapture?.(e.pointerId);
            }
            const t = performance.now();
            desplazado -= dx;
            empuje = Math.max(-2400, Math.min(2400, (-dx / Math.max(8, t - gesto.t)) * 1000));
            gesto.x = e.clientX;
            gesto.t = t;
            pedir();
        };
        const soltar = () => {
            gesto = null;
        };
        el.addEventListener('pointerdown', bajar);
        el.addEventListener('pointermove', mover);
        el.addEventListener('pointerup', soltar);
        el.addEventListener('pointercancel', soltar);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener('scroll', alScroll);
            el.removeEventListener('pointerdown', bajar);
            el.removeEventListener('pointermove', mover);
            el.removeEventListener('pointerup', soltar);
            el.removeEventListener('pointercancel', soltar);
        };
    }, []);

    return (
        <div ref={caja} className="pry-reel-tira" role="img" aria-label="Nueve piezas de la galería de diseños de Atlas, en una tira que corre sola">
            {PIEZAS.map((p) => (
                <div key={p} className="pry-reel-pieza" aria-hidden="true">
                    <img src={`/assets/movil/reel/${p}.webp`} width={900} height={600} alt="" loading="lazy" decoding="async" draggable={false} />
                </div>
            ))}
        </div>
    );
}
