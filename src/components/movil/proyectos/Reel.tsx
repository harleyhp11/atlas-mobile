'use client';

import { useEffect, useRef } from 'react';

/* El reel de diseños: las piezas de la galeria de Atlas en una tira que
   corre sola y se curva como una pantalla concava (la referencia "Reel
   Flux"): al centro las piezas se ven bajas y a los lados crecen, con un
   filo rojo arriba. Lo inesperado:
     · la curva se acentua a medida que la seccion llega al centro de la
       pantalla, y se aplana al irse;
     · el scroll empuja la tira (cuanto mas rapido bajas, mas corre);
     · con el dedo se arrastra de lado, con inercia.

   Es un canvas 2D (no WebGL): cada cuadro dibuja la tira en columnas de
   2 px, cada una con su alto. Solo corre en pantalla; con movimiento
   reducido queda quieta (se puede arrastrar igual). */

const PIEZAS = ['sitio-web', 'obra-02', 'app-golf', 'obra-05', 'obra-01', 'laboratorio', 'obra-04', 'obra-03', 'obra-06'];

export function Reel() {
    const caja = useRef<HTMLDivElement>(null);
    const lienzo = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const el = caja.current;
        const cv = lienzo.current;
        const cx = cv?.getContext('2d');
        if (!el || !cv || !cx) return;
        const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const imgs = PIEZAS.map((p) => {
            const im = new Image();
            im.decoding = 'async';
            im.src = `/assets/movil/reel/${p}.webp`;
            im.onload = () => pedir();
            return im;
        });

        let W = 0;
        let H = 0;
        let dpr = 1;
        const medir = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = el.clientWidth;
            H = el.clientHeight;
            cv.width = Math.round(W * dpr);
            cv.height = Math.round(H * dpr);
            pedir();
        };

        let desplazado = 0;
        let empuje = 0; // velocidad extra (scroll y dedo), px/s
        let curva = reducido ? 0.7 : 0.25;
        let ultimo = performance.now();
        let raf = 0;
        let visible = false;
        let ultimoScroll = window.scrollY;

        const dibujar = () => {
            const ahora = performance.now();
            const dt = Math.min(0.05, (ahora - ultimo) / 1000);
            ultimo = ahora;

            // la curva sigue a la posicion de la seccion en pantalla
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const centro = 1 - Math.min(1, Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.75));
            const meta = reducido ? 0.7 : 0.2 + 0.85 * centro;
            curva += (meta - curva) * Math.min(1, dt * 4);

            if (!reducido) desplazado += (34 + empuje) * dt;
            else desplazado += empuje * dt;
            empuje *= Math.pow(0.04, dt); // la inercia se apaga en ~1 s

            const P = Math.round(W * 0.58); // ancho de cada pieza
            const G = 8;
            const L = PIEZAS.length * (P + G);
            const h0 = H * 0.46; // alto al centro
            const paso = 2;

            cx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cx.clearRect(0, 0, W, H);
            for (let x = 0; x < W; x += paso) {
                const w = (((x + desplazado) % L) + L) % L;
                const k = Math.floor(w / (P + G));
                const local = w - k * (P + G);
                if (local >= P) continue;
                const d = (x + paso / 2 - W / 2) / (W / 2);
                const h = h0 * (1 + curva * d * d);
                const y = (H - h) / 2;
                const im = imgs[k];
                if (im.complete && im.naturalWidth) {
                    const sw = (im.naturalWidth / P) * paso;
                    cx.drawImage(im, (local / P) * im.naturalWidth, 0, Math.max(1, sw), im.naturalHeight, x, y, paso + 0.6, h);
                } else {
                    cx.fillStyle = '#17181a';
                    cx.fillRect(x, y, paso + 0.6, h);
                }
                // el filo: rojo arriba, blanco tenue abajo
                cx.fillStyle = 'rgba(225, 29, 58, 0.85)';
                cx.fillRect(x, y - 2, paso + 0.6, 1.5);
                cx.fillStyle = 'rgba(255, 255, 255, 0.28)';
                cx.fillRect(x, y + h + 1, paso + 0.6, 1);
            }
            raf = visible ? requestAnimationFrame(dibujar) : 0;
        };
        function pedir() {
            if (!raf) raf = requestAnimationFrame(dibujar);
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

        // el scroll empuja la tira
        const alScroll = () => {
            const dy = window.scrollY - ultimoScroll;
            ultimoScroll = window.scrollY;
            if (visible && !reducido) empuje = Math.max(-900, Math.min(900, empuje + dy * 6));
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
                if (Math.abs(e.clientY - gesto.y) > 8 && Math.abs(e.clientY - gesto.y) > Math.abs(dx)) {
                    gesto = null;
                    return;
                }
                if (Math.abs(dx) < 6) return;
                gesto.lado = true;
                el.setPointerCapture?.(e.pointerId);
            }
            const t = performance.now();
            desplazado -= dx;
            empuje = (-dx / Math.max(1, t - gesto.t)) * 1000 * 0.6;
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
            <canvas ref={lienzo} aria-hidden="true" />
        </div>
    );
}
