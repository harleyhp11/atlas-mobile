'use client';

import { useEffect, useRef } from 'react';

/* El reel de diseños: las piezas de la galeria de Atlas en una tira que
   corre y se curva como una pantalla concava (la referencia "Reel Flux").

   Como en el video de referencia:
     · quieta, la tira es un arco suave y simetrico: un poco mas baja al
       centro que a los lados;
     · en movimiento se inclina apenas hacia donde va y vuelve al arco al
       frenar;
     · se mueve sola, despacio; el scroll y el dedo la empujan, con
       inercia (el scroll, con mesura: Harley la queria mas lenta);
     · la curva se acentua un poco al llegar al centro de la pantalla.

   Se dibuja en la GPU (WebGL2): un shader calcula cada pixel sobre la curva
   y lee las piezas de un mosaico con mipmaps, asi la imagen sale nitida y
   el movimiento es continuo, sin el temblor de dibujarla por columnas. Sin
   WebGL2 queda un respaldo en canvas 2D. Solo corre en pantalla; con
   movimiento reducido no se mueve sola (se puede arrastrar igual). */

const PIEZAS = ['sitio-web', 'obra-02', 'app-golf', 'obra-05', 'obra-01', 'laboratorio', 'obra-04', 'obra-03', 'obra-06'];
const COLS = 3; // el mosaico es de 3 × 3
const CW = 900; // cada pieza, en px
const CH = 600;
const BASE = 26; // lo que corre sola, en px/s

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;      // CSS px
uniform float uDpr;
uniform float uOff;     // desplazamiento de la tira, px
uniform float uP;       // ancho de cada pieza, px
uniform float uG;       // separacion, px
uniform float uN;       // cuantas piezas
uniform float uH0;      // alto al centro, px
uniform float uCurva;   // cuanto crece hacia los lados
uniform float uLado;    // inclinacion por la velocidad (-1..1)
out vec4 o;
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  float d = (p.x - uRes.x * 0.5) / (uRes.x * 0.5);
  float h = uH0 * (1.0 + uCurva * d * d + uLado * d);
  float yc = uRes.y * 0.5 - uLado * d * uH0 * 0.12;
  float top = yc - h * 0.5;
  float v = (p.y - top) / h;
  float px = 1.0 / (h * uDpr);              // un pixel, en unidades de v
  float L = uN * (uP + uG);
  float w = mod(p.x + uOff, L);
  float k = floor(w / (uP + uG));
  float local = w - k * (uP + uG);
  float pu = 1.0 / (uP * uDpr);
  float u = local / uP;
  // borde suave de cada pieza (sin dientes)
  float dentro = smoothstep(-px, px, v) * (1.0 - smoothstep(1.0 - px, 1.0 + px, v))
               * smoothstep(-pu, pu, u) * (1.0 - smoothstep(1.0 - pu, 1.0 + pu, u));
  vec4 c = vec4(0.0);
  if (dentro > 0.0) {
    float col = mod(k, ${COLS}.0);
    float fil = floor(k / ${COLS}.0);
    vec2 uv = vec2((col + clamp(u, 0.002, 0.998)) / ${COLS}.0, (fil + clamp(v, 0.002, 0.998)) / ${COLS}.0);
    vec3 img = texture(uTex, uv).rgb;
    c = vec4(img * dentro, dentro);
  }
  // el filo: rojo arriba, blanco tenue abajo (solo sobre las piezas)
  float sobre = step(local, uP);
  float arriba = (1.0 - smoothstep(0.0, 1.6 * px, abs(v + 2.5 * px))) * sobre;
  float abajo = (1.0 - smoothstep(0.0, 1.2 * px, abs(v - 1.0 - 2.5 * px))) * sobre;
  c = mix(c, vec4(vec3(0.882, 0.114, 0.227) * 0.9, 0.9), arriba * 0.9);
  c = mix(c, vec4(vec3(0.3), 0.3), abajo);
  o = c;
}`;

export function Reel() {
    const caja = useRef<HTMLDivElement>(null);
    const lienzo = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const el = caja.current;
        const cv = lienzo.current;
        if (!el || !cv) return;
        const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ---- estado del movimiento (compartido por los dos dibujos)
        let W = 0;
        let H = 0;
        let dpr = 1;
        let desplazado = 0;
        let empuje = 0; // velocidad extra (scroll y dedo), px/s
        let vel = 0; // velocidad suavizada, para la inclinacion
        let curva = reducido ? 0.55 : 0.2;
        let lado = 0;
        let ultimo = performance.now();
        let raf = 0;
        let visible = false;
        let ultimoScroll = window.scrollY;

        const avanzar = (dt: number) => {
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const centro = 1 - Math.min(1, Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.8));
            const meta = reducido ? 0.55 : 0.18 + 0.42 * centro;
            curva += (meta - curva) * Math.min(1, dt * 3);
            const v = (reducido ? 0 : BASE) + empuje;
            desplazado += v * dt;
            empuje *= Math.pow(0.05, dt);
            vel += (v - vel) * Math.min(1, dt * 6);
            const metaLado = Math.max(-0.14, Math.min(0.14, (vel - (reducido ? 0 : BASE)) / 3200));
            lado += (metaLado - lado) * Math.min(1, dt * 5);
        };

        // ---- WebGL2
        const gl = cv.getContext('webgl2', { antialias: false, premultipliedAlpha: true, alpha: true });
        let dibujarGL: (() => void) | null = null;
        let liberar = () => {};
        if (gl) {
            const sh = (t: number, src: string) => {
                const s = gl.createShader(t)!;
                gl.shaderSource(s, src);
                gl.compileShader(s);
                return s;
            };
            const prog = gl.createProgram()!;
            gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
            gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
            gl.linkProgram(prog);
            if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                gl.useProgram(prog);
                const buf = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
                const a = gl.getAttribLocation(prog, 'a');
                gl.enableVertexAttribArray(a);
                gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
                const u = (n: string) => gl.getUniformLocation(prog, n);
                const U = { res: u('uRes'), dpr: u('uDpr'), off: u('uOff'), p: u('uP'), g: u('uG'), n: u('uN'), h0: u('uH0'), curva: u('uCurva'), lado: u('uLado') };
                const tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                // mientras bajan las piezas: el mosaico en gris
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([23, 24, 26, 255]));
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                // el mosaico 3 × 3, armado cuando estan todas
                const mosaico = document.createElement('canvas');
                mosaico.width = CW * COLS;
                mosaico.height = CH * COLS;
                const mx = mosaico.getContext('2d')!;
                let listas = 0;
                PIEZAS.forEach((p, i) => {
                    const im = new Image();
                    im.decoding = 'async';
                    im.onload = () => {
                        mx.drawImage(im, (i % COLS) * CW, Math.floor(i / COLS) * CH, CW, CH);
                        if (++listas === PIEZAS.length) {
                            gl.bindTexture(gl.TEXTURE_2D, tex);
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mosaico);
                            gl.generateMipmap(gl.TEXTURE_2D);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                            const an = gl.getExtension('EXT_texture_filter_anisotropic');
                            if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, 4);
                            pedir();
                        }
                    };
                    im.src = `/assets/movil/reel/${p}.webp`;
                });

                dibujarGL = () => {
                    gl.viewport(0, 0, cv.width, cv.height);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.uniform2f(U.res, W, H);
                    gl.uniform1f(U.dpr, dpr);
                    gl.uniform1f(U.off, desplazado);
                    gl.uniform1f(U.p, Math.round(W * 0.7));
                    gl.uniform1f(U.g, 8);
                    gl.uniform1f(U.n, PIEZAS.length);
                    gl.uniform1f(U.h0, H * 0.46);
                    gl.uniform1f(U.curva, curva);
                    gl.uniform1f(U.lado, lado);
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                };
                liberar = () => {
                    gl.deleteTexture(tex);
                    gl.deleteBuffer(buf);
                    gl.deleteProgram(prog);
                };
            }
        }

        // ---- respaldo 2D (sin WebGL2)
        const cx = dibujarGL ? null : cv.getContext('2d');
        const imgs2d = cx
            ? PIEZAS.map((p) => {
                  const im = new Image();
                  im.src = `/assets/movil/reel/${p}.webp`;
                  im.onload = () => pedir();
                  return im;
              })
            : [];
        const dibujar2D = () => {
            if (!cx) return;
            const P = Math.round(W * 0.7);
            const L = PIEZAS.length * (P + 8);
            const h0 = H * 0.46;
            cx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cx.clearRect(0, 0, W, H);
            for (let x = 0; x < W; x += 1) {
                const w = (((x + desplazado) % L) + L) % L;
                const k = Math.floor(w / (P + 8));
                const local = w - k * (P + 8);
                if (local >= P) continue;
                const d = (x + 0.5 - W / 2) / (W / 2);
                const h = h0 * (1 + curva * d * d + lado * d);
                const im = imgs2d[k];
                if (im?.complete && im.naturalWidth) cx.drawImage(im, (local / P) * im.naturalWidth, 0, im.naturalWidth / P, im.naturalHeight, x, (H - h) / 2, 1.4, h);
            }
        };

        const medir = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = el.clientWidth;
            H = el.clientHeight;
            cv.width = Math.round(W * dpr);
            cv.height = Math.round(H * dpr);
            pedir();
        };

        const cuadro = () => {
            const ahora = performance.now();
            const dt = Math.min(0.05, (ahora - ultimo) / 1000);
            ultimo = ahora;
            avanzar(dt);
            if (dibujarGL) dibujarGL();
            else dibujar2D();
            raf = visible ? requestAnimationFrame(cuadro) : 0;
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

        // el scroll empuja la tira
        const alScroll = () => {
            const dy = window.scrollY - ultimoScroll;
            ultimoScroll = window.scrollY;
            if (visible) empuje = Math.max(-520, Math.min(520, empuje + dy * 2.2));
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
            liberar();
        };
    }, []);

    return (
        <div ref={caja} className="pry-reel-tira" role="img" aria-label="Nueve piezas de la galería de diseños de Atlas, en una tira que corre sola">
            <canvas ref={lienzo} aria-hidden="true" />
        </div>
    );
}
