/* Acordeones de un solo abierto (servicios, preguntas): si al abrir uno se
   cierra otro de mas arriba, la fila tocada subiria de golpe. */

/* Mantiene `el` en la misma altura de pantalla mientras el acordeon se
   reacomoda (~la duracion de la transicion). Se corta si el usuario empieza
   a hacer scroll por su cuenta. */
export function anclar(el: HTMLElement, ms = 820) {
    const y0 = el.getBoundingClientRect().top;
    const t0 = performance.now();
    let vivo = true;
    // El <html> tiene scroll-behavior: smooth. Un navegador que no conozca
    // behavior 'instant' lo tomaria como 'auto' y haria cada correccion
    // suave: la fila iria y volveria. Mientras dura, el scroll es seco.
    const html = document.documentElement;
    const antes = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    const soltar = () => {
        vivo = false;
        html.style.scrollBehavior = antes;
    };
    window.addEventListener('touchstart', soltar, { passive: true, once: true });
    window.addEventListener('wheel', soltar, { passive: true, once: true });
    const paso = () => {
        if (!vivo) return;
        const d = el.getBoundingClientRect().top - y0;
        if (Math.abs(d) > 0.5) window.scrollBy({ top: d, behavior: 'instant' as ScrollBehavior });
        if (performance.now() - t0 < ms) requestAnimationFrame(paso);
        else {
            soltar();
            window.removeEventListener('touchstart', soltar);
            window.removeEventListener('wheel', soltar);
        }
    };
    requestAnimationFrame(paso);
}
