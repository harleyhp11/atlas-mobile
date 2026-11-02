'use client';

import { useEffect, useRef } from 'react';

/* Fondo de ondas para el cierre de Servicios («Te ayudamos a elegir»): el
   shader «Waves» del Shader Builder de 21st.dev que paso Harley, con la
   paleta de Atlas en vez de los azules del original: negro → vino → rojo
   Atlas → hueso. Un canvas WebGL que llena a su padre.

   Cambios respecto del original: sin seguimiento del cursor (venia apagado
   y en el celular no hay puntero), y con movimiento reducido pinta un solo
   cuadro quieto. Solo dibuja mientras se ve (IntersectionObserver) y con la
   pestaña visible; al desmontarse suelta el contexto WebGL. Decorativo. */

const VERT = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_vignette u_finish.y
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  float y = uv.y
    + sin(uv.x * (3.0 + u_intensity * 9.0) + t * 0.8) * 0.08
    + (fbm(p * 2.0 + t * 0.1) - 0.5) * u_intensity * 0.6;
  return palette(y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col = shade(uv, p, u_time);
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_grain > 0.0001)
    col += (grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

// [r, g, b] de 0 a 1. Abajo (y = 0) el negro de la pagina, para que el texto
// del cierre caiga sobre oscuro; arriba sube por vino y rojo Atlas hasta hueso.
const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const COLORES = ['#0a0a0b', '#3a0812', '#e11d3a', '#f4f1ea'].map(hex);

const U = {
    scale: 1.08,
    intensity: 0.62,
    paramA: 0.5,
    warp: 0.24,
    detail: 2.912,
    contrast: 1.12,
    brightness: 0,
    saturation: 1,
    hue: 0,
    vignette: 0.18,
    blur: 0,
    grain: 0.042,
    seed: 1,
    rotate: 4.0841,
    drift: 0,
    oklab: 1, // mezcla perceptual: el paso del rojo al hueso no se ensucia de gris
    timeScale: 0.86,
};

// soltar el contexto se difiere un tick: si el mismo canvas se vuelve a montar
// enseguida (StrictMode en desarrollo), se cancela y sigue vivo; si no, al
// pedir getContext otra vez devolveria el contexto ya perdido (pantalla rota)
const soltarPendiente = new WeakMap<HTMLCanvasElement, number>();

export function FondoOndas({ className }: { className?: string }) {
    const lienzo = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = lienzo.current;
        if (!canvas) return;
        const pendiente = soltarPendiente.get(canvas);
        if (pendiente !== undefined) clearTimeout(pendiente);
        soltarPendiente.delete(canvas);
        const gl = canvas.getContext('webgl', { antialias: false });
        if (!gl) return;

        const compilar = (tipo: number, src: string) => {
            const s = gl.createShader(tipo)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        const prog = gl.createProgram()!;
        const vs = compilar(gl.VERTEX_SHADER, VERT);
        const fs = compilar(gl.FRAGMENT_SHADER, FRAG);
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'a_position');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const u = (n: string) => gl.getUniformLocation(prog, n);
        const colores = [...COLORES, ...Array(8 - COLORES.length).fill(COLORES[COLORES.length - 1])];
        gl.uniform3fv(u('u_colors'), new Float32Array(colores.flat()));
        gl.uniform4f(u('u_shape'), U.scale, U.intensity, U.paramA, U.warp);
        gl.uniform4f(u('u_surface'), U.detail, U.contrast, U.brightness, U.saturation);
        gl.uniform4f(u('u_finish'), U.hue, U.vignette, U.blur, U.grain);
        gl.uniform4f(u('u_transform'), U.seed, U.rotate, U.drift, U.oklab);
        gl.uniform4f(u('u_space'), 0, 0, 0, 0);
        const uEscena = u('u_scene');

        const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        let visible = document.visibilityState === 'visible';
        let enVista = true;
        let fuera = false;
        const t0 = performance.now();

        const medir = () => {
            const r = canvas.getBoundingClientRect();
            const dpr = Math.min(devicePixelRatio || 1, 2);
            const w = Math.max(1, Math.round(r.width * dpr));
            const h = Math.max(1, Math.round(r.height * dpr));
            // tope de ~2 Mpx: en tablet no dibuja de mas
            const k = Math.min(1, Math.sqrt(2_000_000 / (w * h)));
            const W = Math.max(1, Math.round(w * k));
            const H = Math.max(1, Math.round(h * k));
            if (canvas.width !== W || canvas.height !== H) {
                canvas.width = W;
                canvas.height = H;
                gl.viewport(0, 0, W, H);
            }
        };
        const pintar = (ahora: number) => {
            raf = 0;
            if (fuera || !visible || !enVista) return;
            medir();
            const t = quieto ? 2 : ((ahora - t0) / 1000) * U.timeScale;
            gl.uniform4f(uEscena, canvas.width, canvas.height, t, COLORES.length);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (!quieto) pedir();
        };
        function pedir() {
            if (!fuera && visible && enVista && !raf) raf = requestAnimationFrame(pintar);
        }

        const ro = new ResizeObserver(pedir);
        ro.observe(canvas);
        const io = new IntersectionObserver(([e]) => {
            enVista = e?.isIntersecting ?? true;
            if (enVista) pedir();
            else if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        });
        io.observe(canvas);
        const alVer = () => {
            visible = document.visibilityState === 'visible';
            if (visible) pedir();
        };
        document.addEventListener('visibilitychange', alVer);
        pedir();

        return () => {
            fuera = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', alVer);
            gl.deleteBuffer(buf);
            gl.deleteProgram(prog);
            const id = window.setTimeout(() => {
                if (soltarPendiente.get(canvas) !== id) return;
                soltarPendiente.delete(canvas);
                gl.getExtension('WEBGL_lose_context')?.loseContext();
                canvas.width = 1;
                canvas.height = 1;
            }, 0);
            soltarPendiente.set(canvas, id);
        };
    }, []);

    return <canvas ref={lienzo} className={className} aria-hidden="true" />;
}
