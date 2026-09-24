"use client";

import { useEffect, useRef } from "react";
import { FRAG, VERT, compile } from "@/components/ui/silk-shader";

/* ─── Disco de seda de la cinta de servicios ──────────────────────────────
   Mismo shader Silk que la card grande de Testimonios, otra receta: aqui la
   paleta lleva un quinto color rojo (#CB2020), el campo va mas lento y sin
   vineta ni desenfoque, y el grano sube a 0.04.

   Lo que NO es obvio: la cinta pinta 10 discos (cinco palabras, y el marquee
   duplica la lista para cerrar el bucle). Diez canvas WebGL serian diez
   contextos dibujando exactamente el mismo fotograma, y los navegadores
   rondan los 16 contextos simultaneos antes de empezar a matar los viejos.

   Asi que hay UNA sola fuente WebGL fuera del DOM y cada disco es un canvas
   2D que la copia con drawImage. Diez blits de 384px por fotograma no se
   notan, y el contexto WebGL es uno.                                      */

const COLORS = [
    [0.063, 0.063, 0.063],
    [0.961, 0.961, 0.961],
    [0.69, 0.69, 0.69],
    [0.227, 0.227, 0.227],
    [0.796, 0.125, 0.125],
];
const COLOR_COUNT = 5;
const TIME_SCALE = 0.61;

const SHAPE = [1.5, 0.55, 0.5, 0.0] as const;       // escala, intensidad, paramA, warp
const SURFACE = [2.4, 1.0, 0.0, 1.0] as const;      // detalle, contraste, brillo, saturacion
const FINISH = [0.0, 0.0, 0.0, 0.04] as const;      // hue, vineta, blur, grano
const TRANSFORM = [1.0, 0.0, 0.0, 0.0] as const;    // semilla, rotacion, deriva, OKLab
const OFFSET = [0.0, 0.0] as const;
const CURSOR = [0.0, 2.0, 1.0, 0.2] as const;       // presencia 0 = cursor apagado

/* El disco mide como mucho 192px y el dpr se capa a 2, asi que 384 es el
   tamano real maximo en pantalla: pedir mas seria pintar pixel que nadie ve. */
const LADO = 384;

type Espejo = { visible: boolean; pintar: () => void };

let fuente: HTMLCanvasElement | null = null;
let raf = 0;
let arranque = 0;
let dibujar: (() => void) | null = null;
const espejos = new Set<Espejo>();

function crearFuente() {
    const canvas = document.createElement("canvas");
    canvas.width = LADO;
    canvas.height = LADO;

    const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
    });
    if (!gl) return false;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    const prog = gl.createProgram();
    if (!prog) return false;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("[silk-disc] link:", gl.getProgramInfoLog(prog));
        return false;
    }
    gl.useProgram(prog);

    // Triangulo unico que cubre el clip space, igual que el shader grande.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uScene = u("u_scene");

    const flat = new Float32Array(24);
    COLORS.forEach((c, i) => flat.set(c, i * 3));
    gl.uniform3fv(u("u_colors[0]"), flat);
    gl.uniform4f(u("u_shape"), ...SHAPE);
    gl.uniform4f(u("u_surface"), ...SURFACE);
    gl.uniform4f(u("u_finish"), ...FINISH);
    gl.uniform4f(u("u_transform"), ...TRANSFORM);
    gl.uniform4f(u("u_space"), OFFSET[0], OFFSET[1], 0, 0);
    gl.uniform4f(u("u_cursor"), ...CURSOR);
    gl.viewport(0, 0, LADO, LADO);

    fuente = canvas;
    arranque = performance.now();
    dibujar = () => {
        const t = ((performance.now() - arranque) / 1000) * TIME_SCALE;
        gl.uniform4f(uScene, LADO, LADO, t, COLOR_COUNT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    return true;
}

function frame() {
    raf = requestAnimationFrame(frame);

    // Si ningun disco esta en pantalla no se dibuja NI la fuente: la cinta
    // vive dentro de un panel que pasa la mayor parte del scroll fuera de
    // vista, y sin esto el shader seguiria consumiendo GPU todo el rato.
    let hayVisible = false;
    espejos.forEach((e) => {
        if (e.visible) hayVisible = true;
    });
    if (!hayVisible || !dibujar) return;

    dibujar();
    espejos.forEach((e) => {
        if (e.visible) e.pintar();
    });
}

function arrancar() {
    if (raf || document.hidden) return;
    raf = requestAnimationFrame(frame);
}

function parar() {
    cancelAnimationFrame(raf);
    raf = 0;
}

function alCambiarPestana() {
    if (document.hidden) parar();
    else if (espejos.size) arrancar();
}

function registrar(e: Espejo) {
    if (!fuente && !crearFuente()) return;
    if (!espejos.size) document.addEventListener("visibilitychange", alCambiarPestana);
    espejos.add(e);
    arrancar();
}

function darDeBaja(e: Espejo) {
    espejos.delete(e);
    if (!espejos.size) {
        parar();
        document.removeEventListener("visibilitychange", alCambiarPestana);
    }
}

export function DiscoSeda({ className }: { className?: string }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = LADO;
        canvas.height = LADO;

        const yo: Espejo = {
            visible: false,
            pintar: () => {
                if (fuente) ctx.drawImage(fuente, 0, 0, LADO, LADO);
            },
        };

        const io = new IntersectionObserver(
            ([entrada]) => {
                yo.visible = entrada.isIntersecting;
            },
            /* Margen generoso: la cinta se desplaza, y un disco que entra por
               el borde debe llegar ya pintado y no aparecer en negro. */
            { rootMargin: "200px" }
        );
        io.observe(canvas);
        registrar(yo);

        return () => {
            io.disconnect();
            darDeBaja(yo);
        };
    }, []);

    return <canvas ref={ref} aria-hidden="true" className={className} />;
}

export default DiscoSeda;
