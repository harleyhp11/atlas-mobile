"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ─── Titular tecnico ──────────────────────────────────────────────────────
   Las letras se dibujan llenas; la que queda bajo el cursor se cambia por su
   propio contorno a rayas, con un marco de seleccion, motas alrededor y una
   etiqueta con sus medidas. Y se pueden arrastrar: vuelven solas con un
   muelle.

   Lo que NO hace, y es la diferencia con el componente original: NO compone el
   texto. El original medía la frase con el canvas, la centraba y la reescalaba
   él mismo — eso aquí habría tirado por la borda el clamp() del tamaño, el
   leading de 0.86, el tracking negativo, la alineacion a la derecha y el (01)
   volado, o sea el diseño entero del titular.

   Aqui el <h2> se queda tal cual y sigue mandando en la maquetacion. Este
   componente solo LEE donde ha caido cada letra —un Range por caracter, que
   devuelve la caja exacta que ha usado el navegador— y pinta encima. El texto
   del DOM se vuelve transparente, pero solo DESPUES del primer fotograma: si
   el canvas no arranca (sin contexto 2D, o la fuente no carga), el titular se
   queda visible como siempre en vez de desaparecer.

   El texto sigue en el DOM, asi que el lector de pantalla y el buscador leen
   lo mismo que antes.                                                       */

/* El canvas se sale del bloque del titular: el marco, las motas y los
   contornos pintan por fuera de la mancha de texto y si no se recortarian
   contra el borde. Todas las coordenadas van desplazadas este margen. */
const MARGEN = 64;

const MUELLE = 320;
const AMORTIGUACION = 22;
const FUENTE_ETIQUETA = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const LARGO_RAYA = 4;
const HUECO_RAYA = 2;
const GROSOR = 1.5;
const MOTAS = 15;
const VELOCIDAD = 1;
/* Lo que se queda el cuadro sobre cada palabra antes de viajar a la
   siguiente. El viaje en si no dura esto: lo marca el deslizamiento de
   DESLIZ_FOCO, y ocurre dentro de la permanencia de la palabra destino. */
const PERMANENCIA = 2.2;
const DESLIZ_FOCO = 0.16;

/* Interpolacion por tiempo, no por fotograma: `segundos` es lo que tarda en
   recorrer el 63% de lo que le falta. Asi el gesto dura lo mismo a 60 que a
   120 Hz, al contrario que el clasico `actual += (destino - actual) * 0.1`. */
const acercar = (actual: number, destino: number, dt: number, segundos: number) =>
    actual + (destino - actual) * (1 - Math.exp(-dt / segundos));

/* Ruido determinista: la misma semilla da siempre la misma mota. Sin esto las
   motas parpadearian al azar en cada fotograma en vez de tener vida propia. */
const ruido = (...valores: number[]) => {
    let h = 2166136261;
    for (const valor of valores) {
        h = Math.imul(h ^ (valor | 0), 16777619);
        h ^= h >>> 13;
        h = Math.imul(h, 0x5bd1e995);
        h ^= h >>> 15;
    }
    return (h >>> 0) / 4294967296;
};

const conSigno = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0");

type Lamina = { imagen: HTMLCanvasElement; izq: number; arr: number };
type Foco = { indices: number[]; etiqueta: string };

type Glifo = {
    char: string;
    x: number;
    linea: number;
    caja: { x1: number; y1: number; x2: number; y2: number };
    desvio: { x: number; y: number };
    velocidad: { x: number; y: number };
    contorno: number;
    lleno: Lamina;
    rayas: Lamina;
};

export default function TituloTecnico({
    children,
    className,
    secuencia,
}: {
    children: ReactNode;
    className?: string;
    /* Trozos de texto que el cuadro va encerrando por turnos, en este orden.
       Sin esto cada letra es su propio foco, que es como venia el componente
       de react-bits; con esto el recuadro abraza la palabra entera y salta de
       una a otra, que es lo que pide este titular. */
    secuencia?: string[];
}) {
    const contRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const cont = contRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const borrador = document.createElement("canvas").getContext("2d");
        const texto = cont?.firstElementChild as HTMLElement | null;
        if (!cont || !canvas || !ctx || !borrador || !texto) return;

        const sinMovimiento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

        /* El color se lee ANTES de volver el texto transparente: asi la tinta
           del canvas es exactamente la que el diseño ya le habia dado, sea la
           que sea, en vez de un blanco a pelo escrito aqui. */
        const color = getComputedStyle(texto).color || "#ffffff";
        const colorEnLinea = texto.style.color;

        let ancho = 1;
        let alto = 1;
        let dpr = 1;
        let raf = 0;
        let ultimo = performance.now();
        let visible = true;
        let vivo = true;
        let clave = "";
        let pintadoAlgunaVez = false;
        let glifos: Glifo[] = [];
        let focos: Foco[] = [];
        let focoDe: number[] = [];
        let tamano = 16;
        let reloj = 0;
        let pulso = 0;
        let arrastrando = -1;
        const puntero = { x: 0, y: 0, dentro: false };
        const agarre = { x: 0, y: 0 };
        const marco = { x1: 0, y1: 0, x2: 0, y2: 0, alfa: 0, indice: -1 };

        const conAlfa = (alfa: number) => {
            const m = color.match(/[\d.]+/g);
            if (!m) return `rgba(255,255,255,${alfa})`;
            const [r, g, b, a = "1"] = m;
            return `rgba(${r}, ${g}, ${b}, ${alfa * parseFloat(a)})`;
        };

        const ponerFuente = (destino: CanvasRenderingContext2D, fuente: string) => {
            destino.font = fuente;
            destino.textAlign = "left";
            destino.textBaseline = "alphabetic";
        };

        /* Cada letra se cachea en su propio canvas. Repintar texto en cada
           fotograma es lo caro; copiar un mapa de bits ya hecho no lo es, y
           ademas es lo que permite moverlas y desvanecerlas por separado. */
        const lamina = (glifoX: number, base: number, char: string, fuente: string, rayada: boolean, cajaGlifo: Glifo["caja"]): Lamina => {
            const pad = Math.ceil(GROSOR * 2 + 4);
            const izq = cajaGlifo.x1 - pad;
            const arr = cajaGlifo.y1 - pad;
            const w = cajaGlifo.x2 - cajaGlifo.x1 + pad * 2;
            const h = cajaGlifo.y2 - cajaGlifo.y1 + pad * 2;
            const imagen = document.createElement("canvas");
            imagen.width = Math.max(1, Math.ceil(w * dpr));
            imagen.height = Math.max(1, Math.ceil(h * dpr));
            const c = imagen.getContext("2d");
            if (!c) return { imagen, izq, arr };
            c.setTransform(dpr, 0, 0, dpr, -izq * dpr, -arr * dpr);
            ponerFuente(c, fuente);
            if (rayada) {
                /* El contorno se traza al DOBLE de grosor y luego se le come
                   la mitad de dentro con destination-out. Un strokeText normal
                   reparte el grosor a los dos lados del perfil y engordaria la
                   letra; asi la raya queda justo por fuera y la forma del tipo
                   se respeta. */
                c.lineJoin = "round";
                c.lineCap = "butt";
                c.lineWidth = GROSOR * 2;
                c.strokeStyle = color;
                c.setLineDash([LARGO_RAYA, HUECO_RAYA]);
                c.strokeText(char, glifoX, base);
                c.setLineDash([]);
                c.globalCompositeOperation = "destination-out";
                c.fillStyle = "#000";
                c.fillText(char, glifoX, base);
                c.globalCompositeOperation = "source-over";
            } else {
                c.fillStyle = color;
                c.fillText(char, glifoX, base);
            }
            return { imagen, izq, arr };
        };

        const transformar = (char: string, modo: string) =>
            modo === "uppercase" ? char.toUpperCase() : modo === "lowercase" ? char.toLowerCase() : char;

        /* Aqui esta el nucleo del asunto: en vez de componer la frase, se le
           pregunta al navegador donde ha puesto cada letra. Un Range de un solo
           caracter devuelve su caja de avance real, o sea con el tracking, el
           clamp del tamaño y el salto de linea ya aplicados. */
        const medir = () => {
            const estilo = getComputedStyle(texto);
            const rc = cont.getBoundingClientRect();
            /* Si algun ancestro lleva un scale (esta seccion se anima), los
               rects vienen multiplicados por el. Se divide para volver al
               espacio sin transformar, que es en el que vive el canvas. */
            const escala = rc.width / Math.max(1, cont.offsetWidth) || 1;
            const fuente = `${estilo.fontStyle} ${estilo.fontWeight} ${estilo.fontSize} ${estilo.fontFamily}`;
            const modo = estilo.textTransform;
            tamano = parseFloat(estilo.fontSize) || 16;

            const nuevaClave = [fuente, modo, texto.textContent, ancho, alto, dpr].join("|");
            if (nuevaClave === clave && glifos.length) return;
            clave = nuevaClave;

            ponerFuente(borrador, fuente);
            const metricasFuente = borrador.measureText("Hg");
            const ascenso = metricasFuente.fontBoundingBoxAscent;

            const anteriores = glifos;
            const nuevos: Glifo[] = [];
            const lineas: number[] = [];

            const paseador = document.createTreeWalker(texto, NodeFilter.SHOW_TEXT, {
                acceptNode: (nodo) =>
                    nodo.parentElement?.closest("[data-tec-ignorar]")
                        ? NodeFilter.FILTER_REJECT
                        : NodeFilter.FILTER_ACCEPT,
            });

            let nodo: Node | null;
            while ((nodo = paseador.nextNode())) {
                const contenido = nodo.textContent ?? "";
                for (let i = 0; i < contenido.length; i++) {
                    if (!contenido[i].trim()) continue;
                    const rango = document.createRange();
                    rango.setStart(nodo, i);
                    rango.setEnd(nodo, i + 1);
                    const r = rango.getBoundingClientRect();
                    if (r.width < 0.01) continue;

                    const char = transformar(contenido[i], modo);
                    const x = (r.left - rc.left) / escala + MARGEN;
                    /* El rect de un Range es la caja de contenido del tipo
                       (ascenso + descenso), no la caja de linea, asi que la
                       base sale de sumarle el ascenso de la fuente. */
                    const base = (r.top - rc.top) / escala + MARGEN + ascenso;
                    const m = borrador.measureText(char);
                    const cajaGlifo = {
                        x1: x - m.actualBoundingBoxLeft,
                        y1: base - m.actualBoundingBoxAscent,
                        x2: x + m.actualBoundingBoxRight,
                        y2: base + m.actualBoundingBoxDescent,
                    };
                    const linea = Math.round(base);
                    if (!lineas.includes(linea)) lineas.push(linea);

                    const guardado = anteriores[nuevos.length];
                    nuevos.push({
                        char,
                        x,
                        linea: lineas.indexOf(linea),
                        caja: cajaGlifo,
                        desvio: guardado?.char === char ? guardado.desvio : { x: 0, y: 0 },
                        velocidad: { x: 0, y: 0 },
                        contorno: 0,
                        lleno: lamina(x, base, char, fuente, false, cajaGlifo),
                        rayas: lamina(x, base, char, fuente, true, cajaGlifo),
                    });
                }
            }

            glifos = nuevos;
            arrastrando = -1;
            marco.indice = -1;

            /* Los focos se buscan CONTRA LAS LETRAS YA MEDIDAS, no contra el
               texto fuente: asi la busqueda ve lo mismo que se ve en pantalla
               —mayusculas por text-transform incluidas— y los indices salen
               directamente alineados con los glifos que hay que iluminar. El
               cursor `desde` avanza para que una palabra repetida caiga en su
               turno y no siempre en la primera aparicion. */
            focos = [];
            focoDe = new Array(glifos.length).fill(-1);
            let desde = 0;
            for (const trozo of secuencia ?? []) {
                const letras = Array.from(trozo)
                    .filter((c) => c.trim())
                    .map((c) => c.toLocaleUpperCase());
                if (!letras.length) continue;
                let inicio = -1;
                for (let i = desde; i + letras.length <= glifos.length; i++) {
                    if (letras.every((l, k) => glifos[i + k].char.toLocaleUpperCase() === l)) {
                        inicio = i;
                        break;
                    }
                }
                if (inicio < 0) continue;
                const indices = letras.map((_, k) => inicio + k);
                indices.forEach((i) => (focoDe[i] = focos.length));
                focos.push({ indices, etiqueta: indices.map((i) => glifos[i].char).join("") });
                desde = inicio + letras.length;
            }
            /* Sin secuencia (o si no se encontro nada) se vuelve al
               comportamiento original: una letra, un foco. */
            if (!focos.length) {
                glifos.forEach((g, i) => {
                    focoDe[i] = i;
                    focos.push({ indices: [i], etiqueta: g.char });
                });
            }
        };

        /* Distancia a la CAJA, no al centro: con letras anchas el centro esta
           lejos aunque el cursor las este tocando. El umbral escala con el
           cuerpo porque este titular usa clamp() y cambia de tamaño. */
        const glifoEn = (x: number, y: number) => {
            let mejor = -1;
            let distancia = Infinity;
            glifos.forEach((g, i) => {
                const x1 = g.caja.x1 + g.desvio.x;
                const x2 = g.caja.x2 + g.desvio.x;
                const y1 = g.caja.y1 + g.desvio.y;
                const y2 = g.caja.y2 + g.desvio.y;
                const dx = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
                const dy = y < y1 ? y1 - y : y > y2 ? y - y2 : 0;
                const d = Math.hypot(dx, dy);
                if (d < distancia) {
                    distancia = d;
                    mejor = i;
                }
            });
            return distancia < Math.max(16, tamano * 0.28) ? mejor : -1;
        };

        const copiar = (destino: CanvasRenderingContext2D, arte: Lamina, dx: number, dy: number) => {
            destino.drawImage(arte.imagen, Math.round((arte.izq + dx) * dpr), Math.round((arte.arr + dy) * dpr));
        };

        const nitido = (v: number) => (Math.round(v * dpr) + 0.5) / dpr;

        const puntoPerimetro = (d0: number, w: number, h: number): [number, number, number, number] => {
            const p = 2 * (w + h);
            let d = ((d0 % p) + p) % p;
            if (d < w) return [marco.x1 + d, marco.y1, 0, -1];
            d -= w;
            if (d < h) return [marco.x2, marco.y1 + d, 1, 0];
            d -= h;
            if (d < w) return [marco.x2 - d, marco.y2, 0, 1];
            d -= w;
            return [marco.x1, marco.y2 - d, -1, 0];
        };

        const dibujarMotas = (a: number) => {
            const w = marco.x2 - marco.x1;
            const h = marco.y2 - marco.y1;
            if (w < 2 || h < 2) return;
            const perimetro = 2 * (w + h);
            const semilla = marco.indice + 1;
            const rejilla = 3;

            for (let k = 0; k < MOTAS; k++) {
                const periodo = 0.5 + ruido(semilla, k, 11) * 1.2;
                const t = pulso / periodo + ruido(semilla, k, 17);
                const ciclo = Math.floor(t);
                const vida = t - ciclo;
                if (vida > 0.7) continue;
                const [px, py, nx, ny] = puntoPerimetro(ruido(semilla, k, ciclo) * perimetro, w, h);
                const sorteo = ruido(semilla, k, ciclo, 2);
                const lado = sorteo < 0.46 ? 2 : sorteo < 0.7 ? 3 : sorteo < 0.84 ? 5 : sorteo < 0.94 ? 8 : 11;
                const grande = lado >= 8;
                const fuera = (grande ? 9 : 4) + Math.floor(ruido(semilla, k, ciclo, 1) * 5) * rejilla;
                const x = marco.x1 + Math.round((px + nx * fuera - marco.x1) / rejilla) * rejilla;
                const y = marco.y1 + Math.round((py + ny * fuera - marco.y1) / rejilla) * rejilla;
                const tono = ruido(semilla, k, ciclo, 3);
                const guino = vida < 0.06 || (vida > 0.32 && vida < 0.36) ? 0.35 : 1;
                const alfa = a * (grande ? 0.3 + 0.4 * tono : 0.3 + 0.6 * tono) * guino;
                const izq = Math.round(x - lado / 2);
                const arr = Math.round(y - lado / 2);
                if (tono < 0.26 || (grande && tono < 0.78)) {
                    ctx.strokeStyle = conAlfa(alfa);
                    ctx.strokeRect(izq + 0.5, arr + 0.5, lado, lado);
                    if (grande && tono > 0.5) {
                        ctx.fillStyle = conAlfa(alfa);
                        ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
                    }
                } else {
                    ctx.fillStyle = conAlfa(alfa);
                    ctx.fillRect(izq, arr, lado, lado);
                }
            }

            /* Dos cabezas recorriendo el marco, cada una con tres pixeles de
               estela detras: es lo que hace que el recuadro parezca vivo. */
            for (let j = 0; j < 2; j++) {
                const cabeza = (pulso * 0.42 * VELOCIDAD + j * 0.5) * perimetro;
                for (let i = 0; i < 4; i++) {
                    const [x, y] = puntoPerimetro(cabeza - i * 6, w, h);
                    const lado = i === 0 ? 3 : 2;
                    ctx.fillStyle = conAlfa(a * [0.95, 0.55, 0.32, 0.16][i]);
                    ctx.fillRect(Math.round(x - lado / 2), Math.round(y - lado / 2), lado, lado);
                }
            }
        };

        const dibujarMarco = () => {
            const enfocado = focos[marco.indice];
            const g = enfocado && glifos[enfocado.indices[0]];
            if (!g || marco.alfa < 0.01) return;
            const a = marco.alfa;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const movido = Math.hypot(g.desvio.x, g.desvio.y);
            if (movido > 1) {
                /* Al arrastrar, una linea de puntos une el sitio original con
                   el actual. Sin ella el gesto se lee como que la letra "se
                   cae"; con ella, como que se ha desplazado. */
                const hx = (g.caja.x1 + g.caja.x2) / 2;
                const hy = (g.caja.y1 + g.caja.y2) / 2;
                ctx.beginPath();
                ctx.moveTo(hx, hy);
                ctx.lineTo(hx + g.desvio.x, hy + g.desvio.y);
                ctx.setLineDash([3, 4]);
                ctx.lineWidth = 1;
                ctx.strokeStyle = conAlfa(0.45 * a);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
                ctx.fillStyle = conAlfa(0.7 * a);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.rect(nitido(marco.x1), nitido(marco.y1), marco.x2 - marco.x1, marco.y2 - marco.y1);
            ctx.lineWidth = 1;
            ctx.strokeStyle = conAlfa(0.5 * a);
            ctx.stroke();

            ctx.beginPath();
            for (const [cx, cy] of [
                [marco.x1, marco.y1],
                [marco.x2, marco.y1],
                [marco.x2, marco.y2],
                [marco.x1, marco.y2],
            ]) {
                ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
            }
            ctx.fillStyle = conAlfa(0.95 * a);
            ctx.fill();

            ctx.lineWidth = 1;
            dibujarMotas(a);

            ctx.font = FUENTE_ETIQUETA;
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = conAlfa(0.62 * a);
            ctx.fillText(
                movido > 1
                    ? `${conSigno(Math.round(g.desvio.x))}, ${conSigno(Math.round(-g.desvio.y))}`
                    : `${enfocado.etiqueta}  ${Math.round(marco.x2 - marco.x1)} × ${Math.round(marco.y2 - marco.y1)}`,
                Math.round(marco.x1),
                Math.round(marco.y1) - 7
            );
            ctx.textBaseline = "alphabetic";
        };

        const paso = (ahora: number) => {
            raf = 0;
            const dt = Math.min(0.05, Math.max(0.001, (ahora - ultimo) / 1000));
            ultimo = ahora;
            medir();
            if (!glifos.length) return;

            /* Sin cursor encima el foco va por turnos: se queda PERMANENCIA
               segundos en cada trozo de la secuencia y pasa al siguiente. El
               componente original paseaba un punto por la frase y encerraba la
               letra mas cercana; aqui interesa lo contrario, pararse en una
               palabra entera y luego viajar a la otra.
               El reloj solo corre cuando nadie toca: si el cursor entra, manda
               el cursor, y al salir se retoma el turno donde estaba. */
            const porTurnos = !sinMovimiento && !puntero.dentro && arrastrando < 0;
            if (porTurnos) reloj += dt * VELOCIDAD;
            pulso += dt;
            const activo = puntero.dentro || porTurnos || arrastrando >= 0;

            let moviendo = false;
            glifos.forEach((g, i) => {
                if (i === arrastrando) {
                    g.desvio.x = acercar(g.desvio.x, puntero.x - agarre.x, dt, 0.03);
                    g.desvio.y = acercar(g.desvio.y, puntero.y - agarre.y, dt, 0.03);
                    g.velocidad.x = 0;
                    g.velocidad.y = 0;
                    moviendo = true;
                    return;
                }
                const { desvio, velocidad } = g;
                if (Math.abs(desvio.x) < 0.05 && Math.abs(desvio.y) < 0.05 && Math.hypot(velocidad.x, velocidad.y) < 0.5) {
                    desvio.x = 0;
                    desvio.y = 0;
                    velocidad.x = 0;
                    velocidad.y = 0;
                    return;
                }
                velocidad.x += (-MUELLE * desvio.x - AMORTIGUACION * velocidad.x) * dt;
                velocidad.y += (-MUELLE * desvio.y - AMORTIGUACION * velocidad.y) * dt;
                desvio.x += velocidad.x * dt;
                desvio.y += velocidad.y * dt;
                moviendo = true;
            });

            let foco = -1;
            if (arrastrando >= 0) foco = focoDe[arrastrando];
            else if (puntero.dentro) {
                const tocado = glifoEn(puntero.x, puntero.y);
                foco = tocado >= 0 ? focoDe[tocado] : -1;
            } else if (porTurnos && focos.length) {
                foco = Math.floor(reloj / PERMANENCIA) % focos.length;
            }

            if (foco >= 0) {
                /* La caja es la union de las letras del foco, no la de una
                   sola: es lo que hace que el cuadro abrace la palabra. */
                const letras = focos[foco].indices.map((i) => glifos[i]);
                const bx1 = Math.min(...letras.map((g) => g.caja.x1 + g.desvio.x)) - 6;
                const by1 = Math.min(...letras.map((g) => g.caja.y1 + g.desvio.y)) - 6;
                const bx2 = Math.max(...letras.map((g) => g.caja.x2 + g.desvio.x)) + 6;
                const by2 = Math.max(...letras.map((g) => g.caja.y2 + g.desvio.y)) + 6;
                /* Si el marco venia apagado se coloca de golpe; si no, saltaria
                   desde la letra anterior cruzando medio titular. */
                if (marco.indice < 0 || marco.alfa < 0.02) {
                    marco.x1 = bx1;
                    marco.y1 = by1;
                    marco.x2 = bx2;
                    marco.y2 = by2;
                }
                const deslizar = arrastrando >= 0 ? 0.02 : DESLIZ_FOCO;
                marco.x1 = acercar(marco.x1, bx1, dt, deslizar);
                marco.y1 = acercar(marco.y1, by1, dt, deslizar);
                marco.x2 = acercar(marco.x2, bx2, dt, deslizar);
                marco.y2 = acercar(marco.y2, by2, dt, deslizar);
                marco.indice = foco;
            }
            marco.alfa = acercar(marco.alfa, foco >= 0 ? 1 : 0, dt, 0.1);

            glifos.forEach((g, i) => {
                const destino = focoDe[i] === foco && i !== arrastrando ? 1 : 0;
                g.contorno = acercar(g.contorno, destino, dt, 0.09);
                if (Math.abs(g.contorno - destino) > 0.002) moviendo = true;
                else g.contorno = destino;
            });

            cont.style.cursor = arrastrando >= 0 ? "grabbing" : foco >= 0 && puntero.dentro ? "grab" : "";

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            /* Fantasma en el sitio original mientras la letra esta fuera. */
            for (const g of glifos) {
                const movido = Math.hypot(g.desvio.x, g.desvio.y);
                if (movido > 1) {
                    ctx.globalAlpha = Math.min(1, movido / 24) * 0.55;
                    copiar(ctx, g.rayas, 0, 0);
                    ctx.globalAlpha = 1;
                }
            }
            for (const g of glifos) {
                if (g.contorno < 0.999) {
                    ctx.globalAlpha = 1 - g.contorno;
                    copiar(ctx, g.lleno, g.desvio.x, g.desvio.y);
                }
                if (g.contorno > 0.001) {
                    ctx.globalAlpha = g.contorno;
                    copiar(ctx, g.rayas, g.desvio.x, g.desvio.y);
                }
                ctx.globalAlpha = 1;
            }
            dibujarMarco();

            if (!pintadoAlgunaVez) {
                pintadoAlgunaVez = true;
                texto.style.color = "transparent";
            }

            const asentando = moviendo || (marco.alfa > 0.01 && marco.alfa < 0.99);
            if ((activo || asentando) && visible && vivo) raf = requestAnimationFrame(paso);
        };

        const despertar = () => {
            if (raf || !visible || !vivo) return;
            ultimo = performance.now();
            raf = requestAnimationFrame(paso);
        };

        const redimensionar = () => {
            ancho = Math.max(1, cont.offsetWidth) + MARGEN * 2;
            alto = Math.max(1, cont.offsetHeight) + MARGEN * 2;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.style.left = `${-MARGEN}px`;
            canvas.style.top = `${-MARGEN}px`;
            canvas.style.width = `${ancho}px`;
            canvas.style.height = `${alto}px`;
            canvas.width = Math.round(ancho * dpr);
            canvas.height = Math.round(alto * dpr);
            clave = "";
            despertar();
        };

        const situar = (e: PointerEvent) => {
            const r = cont.getBoundingClientRect();
            const escala = r.width / Math.max(1, cont.offsetWidth) || 1;
            puntero.x = (e.clientX - r.left) / escala + MARGEN;
            puntero.y = (e.clientY - r.top) / escala + MARGEN;
        };
        const alMover = (e: PointerEvent) => {
            situar(e);
            puntero.dentro = true;
            despertar();
        };
        const alSalir = () => {
            if (arrastrando >= 0) return;
            puntero.dentro = false;
            despertar();
        };
        const alPulsar = (e: PointerEvent) => {
            situar(e);
            puntero.dentro = true;
            if (e.pointerType !== "mouse" || e.button === 0) {
                const i = glifoEn(puntero.x, puntero.y);
                if (i >= 0) {
                    arrastrando = i;
                    agarre.x = puntero.x - glifos[i].desvio.x;
                    agarre.y = puntero.y - glifos[i].desvio.y;
                    cont.setPointerCapture?.(e.pointerId);
                }
            }
            despertar();
        };
        const alSoltar = (e: PointerEvent) => {
            if (arrastrando >= 0) {
                arrastrando = -1;
                cont.releasePointerCapture?.(e.pointerId);
                const r = cont.getBoundingClientRect();
                puntero.dentro =
                    e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            }
            despertar();
        };

        cont.addEventListener("pointermove", alMover, { passive: true });
        cont.addEventListener("pointerenter", alMover, { passive: true });
        cont.addEventListener("pointerdown", alPulsar, { passive: true });
        cont.addEventListener("pointerup", alSoltar, { passive: true });
        cont.addEventListener("pointercancel", alSoltar, { passive: true });
        cont.addEventListener("pointerleave", alSalir, { passive: true });

        const obsTamano = new ResizeObserver(redimensionar);
        obsTamano.observe(cont);
        /* Fuera de pantalla no se pinta: este titular pasa la mayor parte del
           scroll sin verse y el paseo automatico seguiria comiendo fotogramas. */
        const obsVista = new IntersectionObserver(([entrada]) => {
            visible = entrada.isIntersecting;
            despertar();
        });
        obsVista.observe(cont);

        const refrescar = () => {
            clave = "";
            despertar();
        };
        document.fonts?.ready.then(refrescar, refrescar);

        redimensionar();

        return () => {
            vivo = false;
            cancelAnimationFrame(raf);
            obsTamano.disconnect();
            obsVista.disconnect();
            cont.removeEventListener("pointermove", alMover);
            cont.removeEventListener("pointerenter", alMover);
            cont.removeEventListener("pointerdown", alPulsar);
            cont.removeEventListener("pointerup", alSoltar);
            cont.removeEventListener("pointercancel", alSoltar);
            cont.removeEventListener("pointerleave", alSalir);
            texto.style.color = colorEnLinea;
            cont.style.cursor = "";
        };
    }, []);

    return (
        <div
            ref={contRef}
            className={`relative select-none [touch-action:pan-y] ${className ?? ""}`.trim()}
        >
            {children}
            <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute" />
        </div>
    );
}
