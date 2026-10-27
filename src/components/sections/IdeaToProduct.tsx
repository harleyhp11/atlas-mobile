"use client";

/* =====================================================================
   IDEA → PRODUCTO · la historia de Atlas en seis escenas

   Tarjeta solida, horizontal y monocroma a la derecha del celular de la
   seccion final. Entra deslizandose desde la derecha poco despues de que
   la seccion aparece en pantalla, y cuenta en bucle, con un corte distinto
   entre escenas:

     01 Tu idea.               boceto punteado que se dibuja solo
     02 Hecha realidad.        encaja en la grilla y se rellena
        ── persiana ──         tiras blancas que tapan y destapan
     03 Vende 24/7.            ventas que suben, pedidos de madrugada
        ── bandas ──           se ve por franjas corridas, como señal
     04 Automatiza tu negocio. WhatsApp → pedido → stock → factura
        ── empuje ──           la escena nueva empuja a la anterior
     05 Cualquier negocio.     cortes secos entre rubros
        ── iris ──             se cierra en una linea y se abre
     06 Solo en Atlas.         la palabra "Atlas", grande, y "Hablemos"
        ── destello ──         doble destello invertido y vuelve a 01

   En cada titular la palabra clave va en blanco y el resto en gris. Solo
   blanco, negro y grises. Curvas expo/power, sin rebotes.

   Todo es una timeline de GSAP en bucle. Cada escena vuelve a su estado de
   partida mientras esta oculta, asi la vuelta al principio no se nota. La
   timeline se pausa fuera de pantalla (IntersectionObserver) y con el
   puntero encima, para poder leerla. Las medidas internas van en cqw
   (unidades del ancho de la tarjeta), asi escala sola con la ventana.
   Con prefers-reduced-motion no hay entrada y se queda quieta en la ultima
   escena.
   ===================================================================== */

import { useEffect, useRef, useId } from "react";
import { gsap } from "gsap";
import {
    BedDouble, ClipboardCheck, Coffee, Dumbbell, GraduationCap, MessageCircle, Package,
    Receipt, Scissors, ShoppingBag, Stethoscope, UtensilsCrossed, type LucideIcon,
} from "lucide-react";

/* ───────────── constantes ajustables ───────────── */

const FONDO = "#0c0c0d"; // tarjeta
const PANEL = "#161617"; // escenario de la derecha
const GRIS = "rgba(255,255,255,0.4)"; // lo que no es palabra clave

// Entrada: cuanto espera desde que la seccion esta a la vista y cuanto
// tarda en deslizarse desde el borde derecho.
const ENTRADA_ESPERA_S = 1.2;
const ENTRADA_S = 1.1;
const ENTRADA_UMBRAL = 0.45; // fraccion de la seccion visible para empezar a contar

const TITULO_CQW = 9.2; // tamaño del titular; se achica solo si una palabra no entra

// Las seis escenas: etiqueta, titular como [texto, es palabra clave],
// bajada y duracion en segundos. El ciclo total es la suma (15,2 s).
type Tramo = readonly [string, boolean];
const ESCENAS: { id: string; etiqueta: string; titulo: readonly Tramo[]; texto: string; dur: number }[] = [
    { id: "idea", etiqueta: "Idea", titulo: [["Tu", false], ["idea.", true]], texto: "Todo empieza con un boceto.", dur: 2.2 },
    { id: "real", etiqueta: "Diseño", titulo: [["Hecha", false], ["realidad.", true]], texto: "Diseño y desarrollo a medida.", dur: 2.2 },
    { id: "vende", etiqueta: "Ventas", titulo: [["Vende", true], ["24/7.", true]], texto: "Tu negocio no cierra nunca.", dur: 2.6 },
    { id: "auto", etiqueta: "Automatización", titulo: [["Automatiza", true], ["tu negocio.", false]], texto: "Procesos que corren solos.", dur: 2.6 },
    { id: "rubros", etiqueta: "Rubros", titulo: [["Cualquier", true], ["negocio.", false]], texto: "Creamos lo que sea, para todo tipo de negocio.", dur: 2.6 },
    { id: "atlas", etiqueta: "Atlas", titulo: [["Solo en", false], ["Atlas.", true]], texto: "Estudio digital · Lima, Perú.", dur: 3.0 },
];

// Que escenario ocupa cada escena (las dos primeras comparten la maqueta).
const ESCENARIO = ["maqueta", "maqueta", "vende", "auto", "rubros", "atlas"] as const;

const PERSIANA_TIRAS = 7;
// Corte "bandas": [momento respecto del cambio (s), franja visible, desplazamiento px]
const BANDAS: [number, string, number][] = [
    [-0.15, "inset(12% 0% 58% 0%)", 6],
    [-0.1, "inset(54% 0% 18% 0%)", -8],
    [-0.05, "inset(30% 0% 44% 0%)", 3],
    [0, "inset(66% 0% 6% 0%)", -5],
    [0.05, "inset(4% 0% 70% 0%)", 7],
    [0.1, "inset(0% 0% 0% 0%)", 0],
];

// Escena 03: pedidos de madrugada (las horas dicen "24/7" sin decirlo).
const PEDIDOS = [
    { hora: "02:14", texto: "Nuevo pedido" },
    { hora: "03:47", texto: "Pago recibido" },
    { hora: "05:02", texto: "Nuevo pedido" },
];
const VENTAS_FINAL = 2480; // a donde llega el contador (es una maqueta)

// Escena 04: el flujo que corre solo.
const FLUJO: [string, LucideIcon][] = [
    ["WhatsApp", MessageCircle],
    ["Pedido", ClipboardCheck],
    ["Stock", Package],
    ["Factura", Receipt],
];

// Escena 05: rubros que pasan en cortes secos.
const RUBROS: [string, LucideIcon][] = [
    ["Restaurantes", UtensilsCrossed],
    ["Hoteles", BedDouble],
    ["Clínicas", Stethoscope],
    ["Tiendas", ShoppingBag],
    ["Barberías", Scissors],
    ["Gimnasios", Dumbbell],
    ["Academias", GraduationCap],
    ["Cafeterías", Coffee],
];
const RUBRO_CORTE_S = 0.16; // cada cuanto salta al siguiente rubro

/* ───────────── maqueta de las escenas 01–02 (unidades del viewBox) ───────────── */

const VB_W = 120;
const VB_H = 104;
const BLOQUES = [
    { id: "nav", x: 0, y: 0, w: 120, h: 9, r: 3 },
    { id: "hero", x: 0, y: 15, w: 120, h: 44, r: 4 },
    { id: "l1", x: 0, y: 66, w: 78, h: 7, r: 2 },
    { id: "l2", x: 0, y: 78, w: 54, h: 5, r: 2 },
    { id: "btn", x: 0, y: 89, w: 40, h: 13, r: 6.5 },
] as const;

const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#·";
const dos = (n: number) => String(n).padStart(2, "0");
const soles = (n: number) => `S/ ${Math.round(n).toLocaleString("es-PE")}`;

/* Etiqueta que se "scramblea": letras al azar que se resuelven en la palabra. */
function scramble(el: HTMLElement, texto: string, previo: { t?: gsap.core.Tween }) {
    previo.t?.kill();
    const o = { p: 0 };
    previo.t = gsap.to(o, {
        p: 1,
        duration: 0.45,
        ease: "none",
        onUpdate() {
            const n = Math.floor(o.p * texto.length);
            el.textContent = texto
                .split("")
                .map((c, i) => (i < n || c === " " ? c : CARACTERES[Math.floor(Math.random() * CARACTERES.length)]))
                .join("");
        },
        onComplete() {
            el.textContent = texto;
        },
    });
}

/* Titular: cada letra sube desde la mascara de su palabra; la palabra clave
   en blanco y el resto en gris. Se arma a mano en el DOM para no
   re-renderizar React. Si la palabra mas larga no entra en la columna, el
   tamaño baja lo justo (pasa con "Automatiza"). */
function ponerTitulo(el: HTMLElement, tramos: readonly Tramo[], animar: boolean) {
    el.textContent = "";
    el.style.fontSize = `${TITULO_CQW}cqw`;
    const letras: HTMLElement[] = [];
    const palabras: HTMLElement[] = [];
    tramos.forEach(([tramo, clave]) => {
        tramo.split(" ").forEach((palabra) => {
            const w = document.createElement("span");
            w.style.cssText = "display:inline-block;white-space:nowrap;overflow:hidden;vertical-align:top;padding:0.08em 0 0.04em;margin:-0.08em 0 -0.04em";
            for (const c of palabra) {
                const s = document.createElement("span");
                s.textContent = c;
                s.style.display = "inline-block";
                if (!clave) s.style.color = GRIS;
                w.appendChild(s);
                letras.push(s);
            }
            el.appendChild(w);
            el.appendChild(document.createTextNode(" "));
            palabras.push(w);
        });
    });
    const ancho = Math.max(...palabras.map((w) => w.offsetWidth));
    if (ancho > el.clientWidth && el.clientWidth > 0) {
        el.style.fontSize = `${((TITULO_CQW * el.clientWidth) / ancho) * 0.98}cqw`;
    }
    if (animar) gsap.from(letras, { yPercent: 120, duration: 0.5, ease: "expo.out", stagger: 0.012 });
}

export function IdeaToProduct() {
    // El id de React puede traer ":" o "«»", que rompen los url(#...) del SVG.
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const raiz = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const r = raiz.current;
        if (!r) return;
        const seccion = r.closest("section") ?? r;
        const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const q = <T extends Element>(sel: string) => Array.from(r.querySelectorAll<T>(sel));
        const uno = <T extends Element>(sel: string) => r.querySelector<T>(sel)!;

        const ctx = gsap.context(() => {
            const card = uno<HTMLElement>("[data-tarjeta]");
            const cuerpo = uno<HTMLElement>("[data-cuerpo]");
            const contenido = uno<HTMLElement>("[data-contenido]");
            const etiqueta = uno<HTMLElement>("[data-etiqueta]");
            const titulo = uno<HTMLElement>("[data-titulo]");
            const bajada = uno<HTMLElement>("[data-bajada]");
            const odometro = uno<HTMLElement>("[data-odometro]");
            const tiras = q<HTMLElement>("[data-tira]");
            const linea = uno<HTMLElement>("[data-linea]");
            const segs = q<HTMLElement>("[data-seg]");
            const escenario = ESCENARIO.map((id) => uno<HTMLElement>(`[data-escena="${id}"]`));

            // Momento en que empieza cada escena.
            let acum = 0;
            const ini = ESCENAS.map((e) => {
                const s = acum;
                acum += e.dur;
                return s;
            });
            const TOTAL = acum;

            /* ── estado de partida de cada escena (se reaplica oculta) ── */

            // Maqueta: boceto torcido y sin dibujar.
            const grupos = q<SVGGElement>("[data-bloque]");
            const trazos = q<SVGRectElement>("[data-trazo]");
            const punteados = q<SVGRectElement>("[data-punteado]");
            const solidos = q<SVGRectElement>("[data-solido]");
            const grilla = uno<SVGGElement>("[data-grilla]");
            const recorteHero = uno<SVGRectElement>("[data-recorte-hero]");
            const rellNav = uno<SVGGElement>("[data-rell-nav]");
            const rellLineas = q<SVGRectElement>("[data-rell-linea]");
            const rellBtn = uno<SVGGElement>("[data-rell-btn]");
            const brilloHero = uno<SVGRectElement>("[data-brillo-hero]");
            const torcido = grupos.map(() => ({
                rotation: gsap.utils.random(-3, 3),
                x: gsap.utils.random(-3, 3),
                y: gsap.utils.random(-2, 2),
            }));
            const maquetaBoceto = () => {
                grupos.forEach((g, i) => gsap.set(g, { ...torcido[i], transformOrigin: "50% 50%" }));
                gsap.set(trazos, { strokeDashoffset: 1 });
                gsap.set(punteados, { opacity: 1 });
                gsap.set(solidos, { opacity: 0 });
                gsap.set(grilla, { opacity: 0 });
                gsap.set(recorteHero, { attr: { width: 0 } });
                gsap.set([rellNav, rellBtn], { opacity: 0 });
                gsap.set(rellLineas, { scaleX: 0, transformOrigin: "0% 50%" });
                gsap.set(brilloHero, { attr: { x: -40 } });
            };

            // Ventas.
            const numero = uno<HTMLElement>("[data-ventas-num]");
            const curva = uno<SVGPathElement>("[data-curva]");
            const area = uno<SVGPathElement>("[data-area]");
            const punto = uno<SVGCircleElement>("[data-punto]");
            const ticker = uno<HTMLElement>("[data-ticker]");
            const tickerCol = uno<HTMLElement>("[data-ticker-col]");
            const cuenta = { v: 0 };
            const ventasInicio = () => {
                cuenta.v = 0;
                numero.textContent = soles(0);
                gsap.set(curva, { strokeDashoffset: 1 });
                gsap.set(area, { opacity: 0 });
                gsap.set(punto, { scale: 0, transformOrigin: "50% 50%" });
                gsap.set(ticker, { autoAlpha: 0, y: 6 });
                gsap.set(tickerCol, { yPercent: 0 });
            };

            // Flujo.
            const nodos = q<HTMLElement>("[data-nodo]");
            const icoNodos = q<HTMLElement>("[data-nodo-ico]");
            const checks = q<HTMLElement>("[data-nodo-check]");
            const rielFill = uno<HTMLElement>("[data-riel]");
            const pulso = uno<HTMLElement>("[data-pulso]");
            const flujoInicio = () => {
                gsap.set(nodos, { autoAlpha: 0.4 });
                gsap.set(icoNodos, { backgroundColor: PANEL, color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.25)" });
                gsap.set(checks, { autoAlpha: 0, x: -4 });
                gsap.set(rielFill, { scaleY: 0, transformOrigin: "50% 0%" });
                gsap.set(pulso, { top: "0%", autoAlpha: 0 });
            };

            // Rubros: el primero ya esta puesto, porque entra con el empuje.
            const rubros = q<HTMLElement>("[data-rubro]");
            const grillaRubros = uno<HTMLElement>("[data-grilla-rubros]");
            const icoGrilla = q<HTMLElement>("[data-ico-grilla]");
            const masRubros = uno<HTMLElement>("[data-mas]");
            const rubrosInicio = () => {
                gsap.set(rubros, { autoAlpha: 0, scale: 1 });
                gsap.set(rubros[0], { autoAlpha: 1 });
                gsap.set(grillaRubros, { autoAlpha: 0 });
                gsap.set(icoGrilla, { autoAlpha: 0, y: 8 });
                gsap.set(masRubros, { autoAlpha: 0, y: 5 });
            };

            // Marca: solo la palabra.
            const letrasMarca = q<HTMLElement>("[data-letra-marca]");
            const subrayado = uno<HTMLElement>("[data-subrayado]");
            const hablemos = uno<HTMLElement>("[data-hablemos]");
            const barrido = uno<HTMLElement>("[data-barrido]");
            const marcaInicio = () => {
                gsap.set(letrasMarca, { yPercent: 115 });
                gsap.set(subrayado, { scaleX: 0, transformOrigin: "0% 50%" });
                gsap.set(hablemos, { autoAlpha: 0, y: 6 });
                gsap.set(barrido, { xPercent: -160 });
            };

            maquetaBoceto();
            ventasInicio();
            flujoInicio();
            rubrosInicio();
            marcaInicio();
            gsap.set(escenario.slice(2), { autoAlpha: 0 });
            gsap.set(tiras, { scaleY: 0 });
            gsap.set(linea, { scaleX: 0, autoAlpha: 0 });
            gsap.set(contenido, { clipPath: "inset(0% 0% 0% 0%)" });
            gsap.set(segs, { scaleX: 0, transformOrigin: "0% 50%" });
            ponerTitulo(titulo, ESCENAS[0].titulo, false);

            /* Cambio de rotulos: etiqueta scrambleada, titular que sube letra
               por letra, bajada que aparece despues y el contador 01–06 que
               rueda como un odometro. */
            const etq: { t?: gsap.core.Tween } = {};
            const cambiarTexto = (i: number) => {
                scramble(etiqueta, ESCENAS[i].etiqueta, etq);
                ponerTitulo(titulo, ESCENAS[i].titulo, true);
                bajada.textContent = ESCENAS[i].texto;
                gsap.fromTo(bajada, { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.45, delay: 0.18, ease: "power3.out" });
                gsap.to(odometro, { yPercent: (-100 / ESCENAS.length) * i, duration: 0.55, ease: "expo.inOut" });
            };

            const tl = gsap.timeline({ repeat: -1, paused: true });

            // Progreso: la escena actual se llena en blanco; las vistas quedan atenuadas.
            ESCENAS.forEach((e, i) => {
                tl.fromTo(segs[i], { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: e.dur, ease: "none", immediateRender: false }, ini[i]);
                if (i < ESCENAS.length - 1) tl.set(segs[i], { opacity: 0.4 }, ini[i] + e.dur - 0.01);
            });

            /* ── los cortes ── */

            // Cambia de escenario y de rotulos, de golpe, en el instante "en".
            const cambiar = (en: number, i: number) => {
                const sale = escenario[(i + ESCENAS.length - 1) % ESCENAS.length];
                const entra = escenario[i];
                if (sale !== entra) tl.set(sale, { autoAlpha: 0 }, en).set(entra, { autoAlpha: 1 }, en);
                tl.call(cambiarTexto, [i], en);
            };

            // Persiana: tiras blancas que bajan una tras otra, tapan, y se
            // recogen hacia abajo con la escena nueva detras.
            const persiana = (en: number, i: number) => {
                const baja = 0.16;
                const paso = 0.022;
                const tapa = baja + paso * (tiras.length - 1);
                tl.set(tiras, { transformOrigin: "50% 0%" }, en - tapa)
                    .to(tiras, { scaleY: 1, duration: baja, ease: "power2.in", stagger: paso }, en - tapa)
                    .set(tiras, { transformOrigin: "50% 100%" }, en + 0.03)
                    .to(tiras, { scaleY: 0, duration: baja + 0.04, ease: "power3.out", stagger: paso }, en + 0.03);
                cambiar(en, i);
            };

            // Bandas: por un instante solo se ve una franja del contenido,
            // corrida a un lado, como una señal que se corta.
            const bandas = (en: number, i: number) => {
                BANDAS.forEach(([dt, franja, x]) => tl.set(contenido, { clipPath: franja, x }, en + dt));
                cambiar(en, i);
            };

            // Empuje: la escena nueva entra desde la derecha y saca a la otra.
            const empuje = (en: number, i: number) => {
                const d = 0.5;
                const sale = escenario[i - 1];
                const entra = escenario[i];
                tl.set(entra, { autoAlpha: 1, xPercent: 100 }, en - d / 2)
                    .to(sale, { xPercent: -100, duration: d, ease: "expo.inOut" }, en - d / 2)
                    .to(entra, { xPercent: 0, duration: d, ease: "expo.inOut" }, en - d / 2)
                    .set(sale, { autoAlpha: 0, xPercent: 0 }, en + d / 2);
                tl.call(cambiarTexto, [i], en);
            };

            // Iris: todo se cierra en una linea horizontal y se vuelve a abrir.
            const iris = (en: number, i: number) => {
                tl.to(contenido, { clipPath: "inset(50% 0% 50% 0%)", duration: 0.22, ease: "power3.in" }, en - 0.22)
                    .set(linea, { autoAlpha: 1 }, en - 0.12)
                    .fromTo(linea, { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, en - 0.12)
                    .to(contenido, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.34, ease: "power3.out" }, en + 0.1)
                    .to(linea, { autoAlpha: 0, duration: 0.2 }, en + 0.14);
                cambiar(en, i);
            };

            // Destello: la tarjeta se invierte dos veces, muy rapido, y el
            // contenido nuevo entra con un golpe de escala.
            const destello = (en: number, i: number) => {
                tl.set(cuerpo, { filter: "invert(1)" }, en - 0.05)
                    .set(cuerpo, { filter: "none" }, en + 0.02)
                    .set(cuerpo, { filter: "invert(1)" }, en + 0.08)
                    .set(cuerpo, { filter: "none" }, en + 0.12)
                    .fromTo(contenido, { scale: 1.04 }, { scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, en);
                cambiar(en, i);
            };

            /* 01 · TU IDEA — entra con el destello (es la vuelta del bucle; en
               la primera pasada coincide con el final de la entrada). El
               boceto se dibuja solo, punteado y torcido. */
            const t1 = 0.06;
            tl.call(maquetaBoceto, [], t1 - 0.003);
            destello(t1, 0);
            tl.call(marcaInicio, [], t1 + 0.04);
            tl.to(trazos, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }, 0.25);

            /* 02 · HECHA REALIDAD — sin corte: la grilla aparece, los bloques
               se enderezan y se rellenan. */
            const t2 = ini[1];
            tl.call(cambiarTexto, [1], t2);
            tl.to(grilla, { opacity: 1, duration: 0.2 }, t2)
                .to(grupos, { rotation: 0, x: 0, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.04 }, t2 + 0.1)
                .to(solidos, { opacity: 1, duration: 0.3 }, t2 + 0.35)
                .to(punteados, { opacity: 0, duration: 0.3 }, t2 + 0.35)
                .to(grilla, { opacity: 0, duration: 0.4 }, t2 + 0.8)
                .to(recorteHero, { attr: { width: VB_W }, duration: 0.6, ease: "expo.inOut" }, t2 + 0.45)
                .to(rellNav, { opacity: 1, duration: 0.3 }, t2 + 0.6)
                .to(rellLineas, { scaleX: 1, duration: 0.45, ease: "expo.out", stagger: 0.1 }, t2 + 0.75)
                .to(rellBtn, { opacity: 1, duration: 0.3 }, t2 + 1.0)
                .to(brilloHero, { attr: { x: VB_W + 30 }, duration: 0.7, ease: "power2.inOut" }, t2 + 1.15);

            /* 03 · VENDE 24/7 — persiana. Sube el contador, se dibuja la curva
               y los pedidos de madrugada pasan en un ticker. */
            const t3 = ini[2];
            persiana(t3, 2);
            tl.to(cuenta, { v: VENTAS_FINAL, duration: 1.6, ease: "power2.out", onUpdate: () => void (numero.textContent = soles(cuenta.v)) }, t3 + 0.3)
                .to(curva, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, t3 + 0.3)
                .to(area, { opacity: 1, duration: 0.6 }, t3 + 0.9)
                .to(punto, { scale: 1, duration: 0.3, ease: "power3.out" }, t3 + 1.55)
                .to(ticker, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" }, t3 + 0.45)
                .to(tickerCol, { yPercent: -100 / 3, duration: 0.45, ease: "expo.inOut" }, t3 + 1.15)
                .to(tickerCol, { yPercent: -200 / 3, duration: 0.45, ease: "expo.inOut" }, t3 + 1.8);

            /* 04 · AUTOMATIZA — bandas. Un pulso baja por el riel y cada paso
               se activa solo: el circulo se vuelve blanco y aparece el check. */
            const t4 = ini[3];
            bandas(t4, 3);
            tl.call(ventasInicio, [], t4 + 0.2); // ya oculta: vuelve a cero
            tl.to(pulso, { autoAlpha: 1, duration: 0.15 }, t4 + 0.2)
                .to(rielFill, { scaleY: 1, duration: 1.5, ease: "none" }, t4 + 0.25)
                .to(pulso, { top: "100%", duration: 1.5, ease: "none" }, t4 + 0.25)
                .to(pulso, { autoAlpha: 0, duration: 0.2 }, t4 + 1.8);
            nodos.forEach((n, i) => {
                const en = t4 + 0.25 + i * (1.5 / (nodos.length - 1));
                tl.to(n, { autoAlpha: 1, duration: 0.2 }, en)
                    .to(icoNodos[i], { backgroundColor: "#ffffff", color: FONDO, borderColor: "#ffffff", duration: 0.2 }, en)
                    .to(checks[i], { autoAlpha: 1, x: 0, duration: 0.3, ease: "power3.out" }, en + 0.08);
            });

            /* 05 · CUALQUIER NEGOCIO — empuje. Cortes secos entre rubros,
               cada uno con un golpe de escala; despues, todos en una grilla. */
            const t5 = ini[4];
            empuje(t5, 4);
            tl.call(flujoInicio, [], t5 + 0.3);
            rubros.forEach((rb, i) => {
                if (i === 0) return;
                const en = t5 + 0.35 + (i - 1) * RUBRO_CORTE_S;
                tl.set(rubros[i - 1], { autoAlpha: 0 }, en)
                    .set(rb, { autoAlpha: 1, scale: 1.12 }, en)
                    .to(rb, { scale: 1, duration: RUBRO_CORTE_S, ease: "power3.out" }, en);
            });
            const finRubros = t5 + 0.35 + (rubros.length - 1) * RUBRO_CORTE_S;
            tl.set(rubros[rubros.length - 1], { autoAlpha: 0 }, finRubros)
                .set(grillaRubros, { autoAlpha: 1 }, finRubros)
                .to(icoGrilla, { autoAlpha: 1, y: 0, duration: 0.3, ease: "expo.out", stagger: 0.035 }, finRubros)
                .to(masRubros, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out" }, finRubros + 0.35);

            /* 06 · SOLO EN ATLAS — iris. La palabra sube letra por letra, se
               subraya, la cruza un brillo y aparece "Hablemos". */
            const t6 = ini[5];
            iris(t6, 5);
            tl.call(rubrosInicio, [], t6 + 0.1);
            tl.to(letrasMarca, { yPercent: 0, duration: 0.6, ease: "expo.out", stagger: 0.05 }, t6 + 0.3)
                .to(subrayado, { scaleX: 1, duration: 0.6, ease: "expo.inOut" }, t6 + 0.75)
                .to(barrido, { xPercent: 380, duration: 0.7, ease: "power2.inOut" }, t6 + 1.0)
                .to(hablemos, { autoAlpha: 1, y: 0, duration: 0.45, ease: "expo.out" }, t6 + 1.3);

            // Fin de la vuelta: la barra de progreso a cero.
            tl.set(segs, { scaleX: 0, opacity: 1 }, TOTAL - 0.005);

            if (reducido) {
                // Sin entrada y quieta en la ultima escena, completa.
                tl.seek(TOTAL - 0.05, false);
                etq.t?.kill();
                gsap.killTweensOf([bajada, odometro]);
                etiqueta.textContent = ESCENAS[5].etiqueta;
                ponerTitulo(titulo, ESCENAS[5].titulo, false);
                bajada.textContent = ESCENAS[5].texto;
                gsap.set(bajada, { autoAlpha: 1, y: 0 });
                gsap.set(odometro, { yPercent: (-100 / ESCENAS.length) * 5 });
                gsap.set(contenido, { clipPath: "inset(0% 0% 0% 0%)", x: 0, scale: 1 });
                gsap.set(cuerpo, { filter: "none" });
                gsap.set(tiras, { scaleY: 0 });
                gsap.set(linea, { autoAlpha: 0 });
                return;
            }

            /* Entrada: escondida fuera del borde derecho hasta que la seccion
               esta a la vista; ENTRADA_ESPERA_S despues se desliza a su sitio.
               El bucle arranca a mitad de la entrada, asi el destello de la
               escena 01 cae justo cuando la tarjeta llega. */
            const fuera = window.innerWidth - r.getBoundingClientRect().left + 40;
            gsap.set(r, { x: fuera, autoAlpha: 0 });
            let entro = false;
            let encima = false;
            let visible = false;
            const arrancar = () => {
                entro = true;
                if (visible && !encima) tl.resume();
            };
            const ioEntrada = new IntersectionObserver(
                ([e]) => {
                    if (!e.isIntersecting) return;
                    ioEntrada.disconnect();
                    gsap.to(r, { x: 0, autoAlpha: 1, duration: ENTRADA_S, ease: "expo.out", delay: ENTRADA_ESPERA_S });
                    gsap.delayedCall(ENTRADA_ESPERA_S + ENTRADA_S * 0.45, arrancar);
                },
                { threshold: ENTRADA_UMBRAL },
            );
            ioEntrada.observe(seccion);

            // Pausa con el puntero encima (para leerla) y fuera de pantalla.
            const alEntrar = () => {
                encima = true;
                tl.pause();
            };
            const alSalir = () => {
                encima = false;
                if (visible && entro) tl.resume();
            };
            card.addEventListener("pointerenter", alEntrar);
            card.addEventListener("pointerleave", alSalir);

            const latido = gsap.to("[data-latido]", { scale: 2.6, opacity: 0, duration: 1.4, ease: "power1.out", repeat: -1, paused: true });
            const io = new IntersectionObserver(([e]) => {
                visible = e.isIntersecting;
                if (visible) {
                    if (entro && !encima) tl.resume();
                    latido.resume();
                } else {
                    tl.pause();
                    latido.pause();
                }
            });
            io.observe(seccion);

            return () => {
                io.disconnect();
                ioEntrada.disconnect();
                card.removeEventListener("pointerenter", alEntrar);
                card.removeEventListener("pointerleave", alSalir);
                etq.t?.kill();
            };
        }, r);

        return () => ctx.revert();
    }, []);

    const id = (n: string) => `${uid}-${n}`;

    return (
        <div ref={raiz} aria-hidden="true" className="select-none">
            <div
                data-tarjeta
                className="relative overflow-hidden"
                style={{
                    width: "clamp(250px, 23vw, 400px)",
                    aspectRatio: "16 / 10",
                    containerType: "inline-size",
                    borderRadius: 16,
                    boxShadow: "0 24px 56px -22px rgba(0,0,0,0.85)",
                }}
            >
                <div data-cuerpo className="absolute inset-0 rounded-[inherit] text-white" style={{ background: FONDO, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div data-contenido className="absolute inset-0 flex flex-col p-[4.6cqw]">
                        {/* Cabecera: escena actual y contador */}
                        <div className="flex items-center justify-between font-space-mono text-[2.7cqw] uppercase leading-none tracking-[0.16em] text-white/55">
                            <span className="inline-flex items-center gap-[1.8cqw]">
                                <span className="relative inline-block h-[1.3cqw] w-[1.3cqw]">
                                    <i data-latido className="absolute inset-0 rounded-full bg-white" />
                                    <i className="absolute inset-0 rounded-full bg-white" />
                                </span>
                                <span data-etiqueta className="whitespace-nowrap">
                                    {ESCENAS[0].etiqueta}
                                </span>
                            </span>
                            <span className="inline-flex items-center whitespace-nowrap">
                                <span className="relative inline-block h-[1em] overflow-hidden text-white">
                                    <span data-odometro className="block">
                                        {ESCENAS.map((e, i) => (
                                            <span key={e.id} className="block h-[1em]">
                                                {dos(i + 1)}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                                &nbsp;/ {dos(ESCENAS.length)}
                            </span>
                        </div>

                        {/* Texto a la izquierda, escenario a la derecha */}
                        <div className="mt-[3.6cqw] flex min-h-0 flex-1 gap-[4cqw]">
                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <p data-titulo className="font-sans font-bold leading-[0.98] tracking-[-0.045em] text-white" style={{ fontSize: `${TITULO_CQW}cqw` }} />
                                <p data-bajada className="font-sans text-[3.2cqw] leading-[1.3] text-white/55">
                                    {ESCENAS[0].texto}
                                </p>
                            </div>

                            <div className="relative w-[39cqw] shrink-0 overflow-hidden rounded-[2.6cqw] border border-white/[0.07]" style={{ background: PANEL }}>
                                {/* 01–02 · maqueta */}
                                <div data-escena="maqueta" className="absolute inset-0 flex items-center p-[3cqw]">
                                    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full overflow-visible font-sans">
                                        <defs>
                                            <linearGradient id={id("hero")} x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#5a5a5e" />
                                                <stop offset="100%" stopColor="#1d1d1f" />
                                            </linearGradient>
                                            <linearGradient id={id("brillo")} x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                                                <stop offset="50%" stopColor="#fff" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                                            </linearGradient>
                                            <clipPath id={id("clip-hero")} clipPathUnits="userSpaceOnUse">
                                                <rect data-recorte-hero x="0" y="15" width="0" height="44" rx="4" />
                                            </clipPath>
                                            <clipPath id={id("clip-hero-forma")} clipPathUnits="userSpaceOnUse">
                                                <rect x="0" y="15" width={VB_W} height="44" rx="4" />
                                            </clipPath>
                                            {BLOQUES.map((b) => (
                                                <mask key={b.id} id={id(`m-${b.id}`)} maskUnits="userSpaceOnUse" x="-10" y="-10" width={VB_W + 20} height={VB_H + 20}>
                                                    <rect data-trazo x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} fill="none" stroke="#fff" strokeWidth="3" pathLength={1} strokeDasharray="1" />
                                                </mask>
                                            ))}
                                        </defs>

                                        <g data-grilla stroke="rgba(255,255,255,0.08)" strokeWidth="0.5">
                                            {Array.from({ length: 13 }, (_, i) => (
                                                <line key={`v${i}`} x1={i * 10} y1={-4} x2={i * 10} y2={VB_H + 4} />
                                            ))}
                                            {Array.from({ length: 11 }, (_, i) => (
                                                <line key={`h${i}`} x1={-4} y1={i * 10} x2={VB_W + 4} y2={i * 10} />
                                            ))}
                                        </g>

                                        {BLOQUES.map((b) => (
                                            <g key={b.id} data-bloque>
                                                {b.id === "nav" && (
                                                    <g data-rell-nav>
                                                        <rect x={0} y={0} width={120} height={9} rx={3} fill="#2a2a2c" />
                                                        <circle cx={5} cy={4.5} r={2} fill="#fff" />
                                                        <rect x={78} y={3.6} width={9} height={1.8} rx={0.9} fill="rgba(255,255,255,0.5)" />
                                                        <rect x={90} y={3.6} width={9} height={1.8} rx={0.9} fill="rgba(255,255,255,0.5)" />
                                                        <rect x={102} y={3.6} width={14} height={1.8} rx={0.9} fill="#fff" />
                                                    </g>
                                                )}
                                                {b.id === "hero" && (
                                                    <g clipPath={`url(#${id("clip-hero-forma")})`}>
                                                        <rect x={0} y={15} width={120} height={44} rx={4} fill={`url(#${id("hero")})`} clipPath={`url(#${id("clip-hero")})`} />
                                                        <rect data-brillo-hero x={-40} y={10} width={30} height={54} fill={`url(#${id("brillo")})`} transform="skewX(-18)" />
                                                    </g>
                                                )}
                                                {(b.id === "l1" || b.id === "l2") && (
                                                    <rect data-rell-linea x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} fill={b.id === "l1" ? "#fff" : "rgba(255,255,255,0.45)"} />
                                                )}
                                                {b.id === "btn" && (
                                                    <g data-rell-btn>
                                                        <rect x={0} y={89} width={40} height={13} rx={6.5} fill="#fff" />
                                                        <text x={20} y={97.6} textAnchor="middle" fill={FONDO} fontSize="5.4" fontWeight="600">
                                                            Comprar
                                                        </text>
                                                    </g>
                                                )}
                                                <rect data-punteado x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" strokeDasharray="1.5 2" mask={`url(#${id(`m-${b.id}`)})`} />
                                                <rect data-solido x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
                                            </g>
                                        ))}
                                    </svg>
                                </div>

                                {/* 03 · ventas 24/7 */}
                                <div data-escena="vende" className="absolute inset-0 flex flex-col p-[3cqw]">
                                    <span className="font-space-mono text-[2.3cqw] uppercase leading-none tracking-[0.14em] text-white/50">Ventas hoy</span>
                                    <span data-ventas-num className="mt-[1.2cqw] font-sans text-[7cqw] font-bold leading-none tracking-[-0.04em] tabular-nums">
                                        S/ 0
                                    </span>
                                    <svg viewBox="0 0 112 30" className="mt-[2cqw] w-full overflow-visible">
                                        <defs>
                                            <linearGradient id={id("area")} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
                                                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path data-area d="M0 26 L16 22 L30 24 L46 16 L62 18 L78 9 L94 11 L112 2 L112 30 L0 30 Z" fill={`url(#${id("area")})`} />
                                        <path data-curva d="M0 26 L16 22 L30 24 L46 16 L62 18 L78 9 L94 11 L112 2" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" />
                                        <circle data-punto cx="112" cy="2" r="2.4" fill="#fff" />
                                    </svg>
                                    <div data-ticker className="mt-auto flex items-center gap-[1.2cqw] rounded-full bg-white/[0.08] px-[1.6cqw] py-[1.3cqw]">
                                        <i className="block h-[1.2cqw] w-[1.2cqw] shrink-0 rounded-full bg-white" />
                                        <span className="relative block h-[1.25em] flex-1 overflow-hidden font-sans text-[2.4cqw] font-medium leading-[1.25]">
                                            <span data-ticker-col className="block">
                                                {PEDIDOS.map((p) => (
                                                    <span key={p.hora} className="flex h-[1.25em] justify-between gap-[1cqw]">
                                                        <span className="truncate">{p.texto}</span>
                                                        <span className="font-space-mono font-normal text-white/50">{p.hora}</span>
                                                    </span>
                                                ))}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* 04 · automatizacion */}
                                <div data-escena="auto" className="absolute inset-0 flex flex-col justify-center p-[3cqw]">
                                    <div className="relative flex flex-col gap-[1.8cqw]">
                                        {/* Riel vertical con el pulso que baja */}
                                        <span className="absolute bottom-[3.1cqw] left-[2.95cqw] top-[3.1cqw] w-[0.3cqw] bg-white/15">
                                            <i data-riel className="absolute inset-0 bg-white" />
                                            <i data-pulso className="absolute left-1/2 h-[1.7cqw] w-[1.7cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        </span>
                                        {FLUJO.map(([nombre, Icono]) => (
                                            <div key={nombre} data-nodo className="relative flex items-center gap-[2.4cqw]">
                                                <span data-nodo-ico className="grid h-[6.2cqw] w-[6.2cqw] shrink-0 place-items-center rounded-full border">
                                                    <Icono className="h-[3cqw] w-[3cqw]" strokeWidth={2} />
                                                </span>
                                                <span className="flex-1 font-sans text-[3.4cqw] font-semibold tracking-[-0.01em]">{nombre}</span>
                                                <span data-nodo-check className="font-sans text-[3cqw] text-white/75">
                                                    ✓
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 05 · rubros */}
                                <div data-escena="rubros" className="absolute inset-0">
                                    {RUBROS.map(([nombre, Icono], i) => (
                                        <div key={nombre} data-rubro className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="absolute right-[2.8cqw] top-[2.8cqw] font-space-mono text-[2.1cqw] leading-none tracking-[0.1em] text-white/45">
                                                {dos(i + 1)}/{dos(RUBROS.length)}
                                            </span>
                                            <span className="grid h-[15cqw] w-[15cqw] place-items-center rounded-full bg-white" style={{ color: FONDO }}>
                                                <Icono className="h-[7cqw] w-[7cqw]" strokeWidth={1.7} />
                                            </span>
                                            <span className="mt-[2.4cqw] font-sans text-[3.9cqw] font-semibold tracking-[-0.02em]">{nombre}</span>
                                        </div>
                                    ))}
                                    <div data-grilla-rubros className="absolute inset-0 flex flex-col items-center justify-center gap-[2.6cqw]">
                                        <div className="grid grid-cols-4 gap-[1.4cqw]">
                                            {RUBROS.map(([nombre, Icono], i) => (
                                                <span
                                                    key={nombre}
                                                    data-ico-grilla
                                                    className="grid h-[7cqw] w-[7cqw] place-items-center rounded-[1.7cqw]"
                                                    style={i % 3 === 0 ? { background: "#fff", color: FONDO } : { background: "rgba(255,255,255,0.09)", color: "#fff" }}
                                                >
                                                    <Icono className="h-[3.4cqw] w-[3.4cqw]" strokeWidth={1.8} />
                                                </span>
                                            ))}
                                        </div>
                                        <span data-mas className="font-space-mono text-[2.3cqw] uppercase leading-none tracking-[0.12em] text-white/60">
                                            …y lo que imagines
                                        </span>
                                    </div>
                                </div>

                                {/* 06 · marca: solo la palabra */}
                                <div data-escena="atlas" className="absolute inset-0 flex flex-col items-center justify-center gap-[3.4cqw]">
                                    <span className="relative flex flex-col items-center">
                                        <span className="relative inline-flex overflow-hidden pb-[0.06em] font-sans text-[11.5cqw] font-black leading-none tracking-[-0.055em]">
                                            {"Atlas".split("").map((c, i) => (
                                                <span key={i} data-letra-marca className="inline-block">
                                                    {c}
                                                </span>
                                            ))}
                                            <span data-letra-marca className="ml-[0.5cqw] mt-[0.6cqw] inline-block self-start text-[3cqw] tracking-normal">
                                                ®
                                            </span>
                                            {/* Brillo que cruza la palabra */}
                                            <span data-barrido className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-overlay" />
                                        </span>
                                        <span data-subrayado className="mt-[1.2cqw] block h-[0.35cqw] min-h-px w-full bg-white/70" />
                                    </span>
                                    <span data-hablemos className="inline-flex items-center gap-[1.4cqw] rounded-full bg-white py-[1.2cqw] pl-[2.8cqw] pr-[1.2cqw] font-sans text-[2.8cqw] font-semibold" style={{ color: FONDO }}>
                                        Hablemos
                                        <span className="grid h-[4cqw] w-[4cqw] place-items-center rounded-full text-white" style={{ background: FONDO }}>
                                            →
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progreso: un segmento por escena */}
                        <div className="mt-[3.6cqw] grid grid-cols-6 gap-[1.4cqw]">
                            {ESCENAS.map((e) => (
                                <span key={e.id} className="block h-[0.45cqw] min-h-[2px] overflow-hidden rounded-full bg-white/[0.12]">
                                    <i data-seg className="block h-full w-full rounded-full bg-white" />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Cortes que van por encima del contenido */}
                    <div className="pointer-events-none absolute inset-0 z-40 flex">
                        {Array.from({ length: PERSIANA_TIRAS }, (_, i) => (
                            // -1px: sin esto quedan rayas finas entre tira y tira.
                            <i key={i} data-tira className="block h-full flex-1 bg-[#f2f2f2]" style={{ marginRight: -1 }} />
                        ))}
                    </div>
                    <span data-linea className="pointer-events-none absolute inset-x-0 top-[calc(50%-0.5px)] z-40 h-px bg-white" />
                </div>
            </div>
        </div>
    );
}

export default IdeaToProduct;
