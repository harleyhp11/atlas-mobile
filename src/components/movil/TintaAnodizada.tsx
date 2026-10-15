'use client';

import { useEffect, useRef } from 'react';

/* Fondo de "tinta anodizada" para los botones principales: tinta roja
   suspendida en negro, iluminada como metal anodizado. Es el shader de
   "Anodized Ink" (21st.dev) casi tal cual —campo de tinta, relieve, brillo y
   pelicula de oxido—, recortado para una pildora:
     · sin puntero ni gotas: la luz deriva sola, el boton es un enlace;
     · la escala va por la altura del boton, asi entran unas pocas vetas;
     · la tinta es el rojo de Atlas.

   Mientras no hay WebGL (y antes de que arranque) se ve el respaldo en CSS
   del boton: la misma tinta, quieta. Arranca cuando el navegador queda
   libre, para no competir con el pintado del hero, y solo anima en
   pantalla. Con movimiento reducido pinta un solo fotograma. */

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uDeep;
uniform vec3 uInk;
uniform vec3 uSheen;
uniform float uScale;
out vec4 outColor;
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = rot * p; a *= 0.5; }
  return v;
}
float inkField(vec2 p, float t) {
  vec2 q = p + 0.45 * vec2(fbm(p * 0.9 + vec2(t * 0.07, 0.0)), fbm(p * 0.9 + vec2(3.1, -t * 0.05)));
  float s = 0.5;
  for (float i = 1.0; i < 5.0; i++) {
    q.x += s * sin(q.y * i + t * 0.5);
    q.y += s * cos(q.x * i + t * 0.5);
    s *= 0.6;
  }
  return sin(q.x * 2.0 + q.y * 2.0);
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;
  vec2 m = uMouse;
  vec2 p = uv - m * 0.05;
  vec2 q = p * 2.4 * uScale + vec2(0.9, 0.5);
  float e = 0.01;
  float h = inkField(q, t);
  float hx = inkField(q + vec2(e, 0.0), t);
  float hy = inkField(q + vec2(0.0, e), t);
  vec3 n = normalize(vec3((h - hx) / e * 0.11, (h - hy) / e * 0.11, 1.0));
  float pattern = smoothstep(0.3, 0.7, h);
  vec3 col = mix(uDeep, uInk, pattern);
  col *= 0.6 + 0.6 * smoothstep(0.5, 1.0, h);
  vec3 L = normalize(vec3((m - uv) * 1.4, 0.0) + vec3(-0.35, 0.5, 0.8));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), 56.0);
  float fres = pow(1.0 - n.z, 1.5);
  vec3 film = 0.5 + 0.5 * cos(6.28318 * (fres * 1.3 + h * 0.18 + vec3(0.0, 0.33, 0.67)));
  vec3 sheenCol = mix(uSheen, uSheen * film * 1.5, 0.3 * pattern);
  col += sheenCol * spec * (0.12 + 0.88 * pattern);
  col += mix(uInk, film * uInk.r + uInk * 0.5, 0.4) * fres * 0.5 * pattern;
  float dist = length(uv - m);
  col += uInk * (0.1 / (dist + 0.1)) * 0.22 * 0.45;
  float g = hash21(gl_FragCoord.xy + fract(t * 7.13) * vec2(97.3, 41.7));
  col += (g - 0.5) * 0.05;
  col += (hash21(gl_FragCoord.yx + 13.7) - 0.5) / 255.0;
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

/* Negro, el rojo de Atlas y el brillo del preset "crimson". */
const DEEP = [0.024, 0.0, 0.004];
const INK = [0.882, 0.114, 0.227];
const SHEEN = [0.79, 0.79, 0.79];

function compilar(gl: WebGL2RenderingContext) {
    const programa = gl.createProgram();
    if (!programa) return null;
    for (const [tipo, fuente] of [
        [gl.VERTEX_SHADER, VERT],
        [gl.FRAGMENT_SHADER, FRAG],
    ] as const) {
        const sh = gl.createShader(tipo);
        if (!sh) return null;
        gl.shaderSource(sh, fuente);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
        gl.attachShader(programa, sh);
        gl.deleteShader(sh);
    }
    gl.linkProgram(programa);
    return gl.getProgramParameter(programa, gl.LINK_STATUS) ? programa : null;
}

export function TintaAnodizada() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let limpiar = () => {};
        let cancelado = false;

        const arrancar = () => {
            if (cancelado) return;
            const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false });
            if (!gl) return;
            const programa = compilar(gl);
            if (!programa) return;
            const vao = gl.createVertexArray();
            const u = (n: string) => gl.getUniformLocation(programa, n);
            const loc = { res: u('uRes'), time: u('uTime'), mouse: u('uMouse'), deep: u('uDeep'), ink: u('uInk'), sheen: u('uSheen'), scale: u('uScale') };
            // cada boton arranca en otro momento del flujo
            let tiempo = reducido ? 14 : 4 + Math.random() * 20;
            let reloj = Math.random() * 30;
            let ultimo = 0;
            let raf = 0;
            let visible = true;
            let pintado = false;

            const medir = () => {
                const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
                const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
                const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w;
                    canvas.height = h;
                }
            };
            const dibujar = (ahora: number) => {
                raf = 0;
                const dt = ultimo ? Math.min((ahora - ultimo) / 1000, 0.05) : 0.016;
                ultimo = ahora;
                medir();
                if (!reducido) {
                    reloj += dt;
                    tiempo += dt * 0.8;
                }
                const aspecto = canvas.width / canvas.height;
                // la luz recorre la pildora sola, de punta a punta
                const mx = Math.sin(reloj * 0.35) * 0.42 * aspecto;
                const my = Math.sin(reloj * 0.27 + 1.3) * 0.3;
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.useProgram(programa);
                gl.bindVertexArray(vao);
                gl.uniform2f(loc.res, canvas.width, canvas.height);
                gl.uniform1f(loc.time, tiempo);
                gl.uniform2f(loc.mouse, mx, my);
                gl.uniform3fv(loc.deep, DEEP);
                gl.uniform3fv(loc.ink, INK);
                gl.uniform3fv(loc.sheen, SHEEN);
                // unas cuantas vetas a lo ancho de un boton de 56 px
                gl.uniform1f(loc.scale, 0.7);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                gl.bindVertexArray(null);
                if (!pintado) {
                    pintado = true;
                    canvas.dataset.listo = '1';
                }
                if (!reducido && visible) raf = requestAnimationFrame(dibujar);
            };
            const empujar = () => {
                if (!raf) raf = requestAnimationFrame(dibujar);
            };
            const ro = new ResizeObserver(empujar);
            ro.observe(canvas);
            const io = new IntersectionObserver(([e]) => {
                visible = e.isIntersecting;
                if (visible) {
                    ultimo = 0;
                    empujar();
                }
            });
            io.observe(canvas);
            limpiar = () => {
                cancelAnimationFrame(raf);
                ro.disconnect();
                io.disconnect();
                gl.deleteProgram(programa);
                gl.deleteVertexArray(vao);
            };
        };

        // despues del pintado y con el navegador libre
        // (Safari no tiene requestIdleCallback: ahi espera un poco y listo)
        const ocioso = 'requestIdleCallback' in window;
        let espera = 0;
        const agendar = () => {
            espera = ocioso ? window.requestIdleCallback(arrancar, { timeout: 2500 }) : window.setTimeout(arrancar, 1200);
        };
        if (document.readyState === 'complete') agendar();
        else window.addEventListener('load', agendar, { once: true });

        return () => {
            cancelado = true;
            window.removeEventListener('load', agendar);
            if (ocioso) window.cancelIdleCallback(espera);
            else window.clearTimeout(espera);
            limpiar();
        };
    }, []);

    return <canvas ref={ref} className="m-btn-tinta" aria-hidden="true" />;
}
