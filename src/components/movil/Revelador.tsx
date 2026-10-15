'use client';

import { useEffect } from 'react';

/* Un solo par de IntersectionObserver para toda la home movil, en vez de un
   observador por componente:

     · [data-rv] y [data-in]: les pone .is-in UNA vez al entrar en pantalla
       (el CSS hace el resto) y avisa con el evento 'm-in';
     · [data-cuenta]: contador que sube desde 0 al entrar;
     · [data-loop]: bucles de CSS (cintas, pings, escenas) — .is-off fuera de
       pantalla, que los pausa;
     · video[data-src]: carga diferida, play solo en pantalla, y nunca con
       movimiento reducido ni con ahorro de datos (se queda el poster).

   Ademas pone .is-tap en los botones al tocarlos, para la animacion. */

const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function contar(el: HTMLElement) {
    const fin = Number(el.dataset.cuenta);
    if (!Number.isFinite(fin)) return;
    if (reducido()) {
        el.textContent = String(fin);
        return;
    }
    const dura = Number(el.dataset.dura || 1400);
    const t0 = performance.now();
    const paso = (t: number) => {
        const p = Math.min(1, (t - t0) / dura);
        const e = 1 - (1 - p) ** 4;
        el.textContent = String(Math.round(fin * e));
        if (p < 1) requestAnimationFrame(paso);
    };
    el.textContent = '0';
    requestAnimationFrame(paso);
}

export function Revelador() {
    useEffect(() => {
        (window as unknown as { __mListo?: boolean }).__mListo = true;
        const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        const sinVideo = reducido() || conexion?.saveData === true;

        const entradas = new IntersectionObserver(
            (es) => {
                for (const e of es) {
                    if (!e.isIntersecting) continue;
                    const el = e.target as HTMLElement;
                    entradas.unobserve(el);
                    el.classList.add('is-in');
                    el.dispatchEvent(new CustomEvent('m-in'));
                    if (el.dataset.cuenta) contar(el);
                    el.querySelectorAll<HTMLElement>('[data-cuenta]').forEach(contar);
                }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
        );

        const bucles = new IntersectionObserver(
            (es) => {
                for (const e of es) {
                    const el = e.target as HTMLElement;
                    el.classList.toggle('is-off', !e.isIntersecting);
                    if (el instanceof HTMLVideoElement && !sinVideo) {
                        if (e.isIntersecting) {
                            if (!el.src && el.dataset.src) el.src = el.dataset.src;
                            el.play().catch(() => {});
                        } else {
                            el.pause();
                        }
                    }
                }
            },
            { rootMargin: '120px 0px' }
        );

        const observar = () => {
            document
                .querySelectorAll<HTMLElement>('[data-rv]:not(.is-in), [data-in]:not(.is-in)')
                .forEach((el) => entradas.observe(el));
            document.querySelectorAll<HTMLElement>('[data-loop], video[data-src]').forEach((el) => bucles.observe(el));
        };
        observar();

        // Lo que se monta despues (paneles que se abren) tambien se observa.
        // Agrupado: las escenas animadas cambian el DOM en cada fotograma y no
        // hace falta re-escanear la pagina a ese ritmo.
        let pendiente = 0;
        const mo = new MutationObserver(() => {
            if (pendiente) return;
            pendiente = window.setTimeout(() => {
                pendiente = 0;
                observar();
            }, 250);
        });
        mo.observe(document.body, { childList: true, subtree: true });

        const tap = (ev: PointerEvent) => {
            const b = (ev.target as Element | null)?.closest?.('.m-btn');
            if (!b) return;
            b.classList.add('is-tap');
            window.setTimeout(() => b.classList.remove('is-tap'), 700);
        };
        document.addEventListener('pointerdown', tap, { passive: true });

        return () => {
            entradas.disconnect();
            bucles.disconnect();
            mo.disconnect();
            window.clearTimeout(pendiente);
            document.removeEventListener('pointerdown', tap);
        };
    }, []);

    return null;
}
