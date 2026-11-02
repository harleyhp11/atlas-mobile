'use client';

import { useEffect, useRef, useState } from 'react';
import './precios.css';

/* La entrada de /servicios en el celular: «Nuestros / Precios».

   Es el hero «Vante» que paso Harley, llevado al celular. Todo sale de un
   solo numero, el avance `p` (0 → 1, suavizado), que aqui NO lo mueve el
   scroll: corre solo con el tiempo al entrar (DURA) sobre una pantalla de
   alto completo:
     · las dos lineas del titular cruzan la pantalla en sentidos opuestos;
     · una cinta de tarjetas con video viaja por un riel fijo en 3D: entra
       chica por abajo, pasa cerca en un arco suave, rodea el borde y se va
       por arriba;
     · al dejar el riel, cada tarjeta vuela a su lugar en una grilla de
       2 × 3 y una linea fina se dibuja entre las filas.
   Mientras corre, el scroll queda bloqueado y abajo hay un «Saltar»; al
   terminar se suelta y el pie dice «Desliza»: el scroll es para bajar a
   los precios. Si se llega con la pagina ya bajada, va directo al final.

   Cambios para el celular: la camara mantiene fijo el ancho visible (como
   el original bajo 16:9), pero en una pantalla alta eso deja la cinta como
   una franja delgada, asi que el riel se abre en vertical (ys) y las
   tarjetas crecen (k). La grilla es de 2 columnas. Sin hover (es tactil).

   Los videos son los del codigo original (pedido de Harley), servidos desde
   su R2 con CORS abierto: si algun dia los bajan, la tarjeta queda en el
   gris oscuro de espera. Cada video solo corre mientras su tarjeta se ve.

   three.js entra con import() recien en esta pagina. Con movimiento
   reducido, o sin WebGL, queda el titular quieto y no se bloquea nada. */

const R2 = 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/';
const WORK = [
    ['Roadster 3D', 'designs/roadster-3d-car-landing.mp4'],
    ['Living Portrait', 'aaaf/living-portrait-hero.mp4'],
    ['Particle Self', 'aaaf/oraciteslArea.mp4'],
    ['Robot Jellyfish', 'aaaf/medusa-jellyfish-hero.mp4'],
    ['Ink Reveal', 'designs/ink-reveal-hover.mp4'],
    ['Space Voyage', 'designs/space-voyage-video.mp4'],
    ['Helion Dispatch', 'designs/helion-dispatch-landing.mp4'],
    ['Honey Bee', 'designs/honey-bee-melli-landing.mp4'],
] as const;

const DURA = 8500; // ms de la entrada completa (p de 0 a 1)
const LIBRE = 0.86; // desde aqui la grilla ya esta quieta: se suelta el scroll

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const out = (t: number) => 1 - (1 - t) ** 3;
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

const VS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FS = `uniform sampler2D map;uniform vec2 cover;uniform float aspect,ready,radius;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  vec3 c=mix(vec3(.075),texture2D(map,(uv-.5)*cover+.5).rgb,ready);
  float edge=smoothstep(-.012-px,-.012,d);
  gl_FragColor=vec4(mix(c,vec3(1.),edge*.1),a);
}`;

type Estado = 'corre' | 'listo' | 'quieto';

export function IntroPrecios() {
    const caja = useRef<HTMLDivElement>(null);
    const lienzo = useRef<HTMLCanvasElement>(null);
    const saltar = useRef<() => void>(() => {});
    const [estado, setEstado] = useState<Estado>('corre');

    useEffect(() => {
        const intro = caja.current;
        const canvas = lienzo.current;
        if (!intro || !canvas) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setEstado('quieto');
            return;
        }

        const $ = <T extends HTMLElement>(sel: string) => intro.querySelector<T>(sel)!;
        const l1 = $('.pre-l1');
        const l2 = $('.pre-l2');
        const cap = $('.pre-cap');
        const primeros = [$('.pre-glow'), $('.pre-cross')];
        const reglas = [...intro.querySelectorAll<HTMLElement>('.pre-regla')];

        // el scroll queda quieto mientras corre la entrada
        const html = document.documentElement;
        let bloqueado = false;
        const bloquear = (si: boolean) => {
            if (si === bloqueado) return;
            bloqueado = si;
            html.style.overflow = si ? 'hidden' : '';
            document.body.style.overflow = si ? 'hidden' : '';
        };

        let vivo = true;
        let raf = 0;
        let limpiar = () => bloquear(false);

        import('three').then((THREE) => {
            if (!vivo) return;

            let renderer: InstanceType<typeof THREE.WebGLRenderer>;
            try {
                renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            } catch {
                setEstado('quieto');
                return;
            }
            renderer.setClearColor(0, 0);
            renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
            const scene = new THREE.Scene();
            const FOV = 35;
            const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

            /* ---------- medidas que dependen de la pantalla */
            let W = 1;
            let H = 1;
            let asp = 1;
            let cols = 3;
            let rows = 2;
            let tanH = 0.3153;
            let ys = 1; // apertura vertical del riel
            let k = 1; // escala de las tarjetas
            let CARD_W = 2.1;
            let CARD_H = 1.32;
            let STEP = CARD_W + 0.03;

            /* ---------- el riel: fijo, la cinta solo se desliza por el */
            const SAMPLES = 1200;
            const pathP: InstanceType<typeof THREE.Vector3>[] = [];
            const pathT: InstanceType<typeof THREE.Vector3>[] = [];
            const PH0 = -1.5;
            const PH1 = Math.PI * 2 + 1.35;
            let PATH_L = 1;
            const buildPath = () => {
                const pts = [];
                for (let i = 0; i <= 160; i++) {
                    const t = i / 160;
                    const ph = mix(PH0, PH1, t);
                    const cs = Math.cos(ph);
                    const u = 2 * t - 1;
                    // un arco suave cerca de la camara y tramos largos lejos, detras
                    const depth = cs > 0 ? 7.6 + 16.4 * cs ** 0.9 : 7.6 + 2.2 * cs;
                    const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
                    pts.push(new THREE.Vector3(edge * Math.sin(ph) * depth * 0.561, 0.5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * 0.63 * ys, -depth));
                }
                const path = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
                path.arcLengthDivisions = 1500;
                PATH_L = path.getLength();
                pathP.length = pathT.length = 0;
                for (let i = 0; i <= SAMPLES; i++) {
                    const u = i / SAMPLES;
                    pathP.push(path.getPointAt(u));
                    pathT.push(path.getTangentAt(u));
                }
            };
            const at = (s: number, op: InstanceType<typeof THREE.Vector3>, ot: InstanceType<typeof THREE.Vector3>) => {
                const f = clamp(s / PATH_L) * SAMPLES;
                const i = Math.min(SAMPLES - 1, Math.floor(f));
                const r = f - i;
                op.lerpVectors(pathP[i], pathP[i + 1], r);
                ot.lerpVectors(pathT[i], pathT[i + 1], r).normalize();
            };

            /* ---------- las tarjetas, cada una con su video */
            const NX = 28;
            const NY = 3;
            let listos = 0; // videos con su primer cuadro ya cargado
            const cards = WORK.map(([title, src], i) => {
                const v = document.createElement('video');
                Object.assign(v, { crossOrigin: 'anonymous', muted: true, loop: true, playsInline: true, preload: 'auto', src: R2 + src });
                v.setAttribute('playsinline', '');
                v.setAttribute('muted', '');
                const tex = new THREE.VideoTexture(v);
                tex.colorSpace = THREE.NoColorSpace;
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.generateMipmaps = false;
                const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
                const mat = new THREE.ShaderMaterial({
                    vertexShader: VS,
                    fragmentShader: FS,
                    transparent: true,
                    side: THREE.DoubleSide,
                    uniforms: {
                        map: { value: tex },
                        cover: { value: new THREE.Vector2(1, 1) },
                        aspect: { value: CARD_W / CARD_H },
                        ready: { value: 0 },
                        radius: { value: 0.018 },
                    },
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.frustumCulled = false;
                mesh.visible = false;
                scene.add(mesh);
                const c = { i, title, v, tex, geo, mat, mesh, va: 16 / 9 };
                v.addEventListener('loadeddata', () => {
                    c.va = v.videoWidth / v.videoHeight;
                    ajustarCover(c);
                    mat.uniforms.ready.value = 1;
                    listos++;
                });
                return c;
            });
            const ajustarCover = (c: (typeof cards)[number]) => {
                const ca = CARD_W / CARD_H;
                c.mat.uniforms.aspect.value = ca;
                c.mat.uniforms.cover.value.set(c.va > ca ? ca / c.va : 1, c.va > ca ? 1 : c.va / ca);
            };

            /* ---------- la grilla */
            const GZ = 8;
            const grid = (i: number) => {
                const vh = 2 * GZ * tanH;
                const vw = vh * asp;
                const gw = vw * (cols === 3 ? 0.74 : 0.88);
                const gap = gw * (cols === 3 ? 0.017 : 0.03);
                const cw = (gw - gap * (cols - 1)) / cols;
                const ch = cw / (CARD_W / CARD_H);
                const gh = ch * rows + gap * 1.6 * (rows - 1);
                const c = i % cols;
                const r = Math.floor(i / cols);
                return { x: -gw / 2 + cw / 2 + c * (cw + gap), y: gh / 2 - ch / 2 - r * (ch + gap * 1.6), w: cw, h: ch, vw, vh, c, r, gap };
            };

            const resize = () => {
                W = intro.clientWidth;
                H = intro.clientHeight;
                asp = W / H;
                renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
                renderer.setSize(W, H, false);
                camera.aspect = asp;
                camera.fov = asp < 16 / 9 ? (Math.atan(0.561 / asp) * 360) / Math.PI : FOV;
                camera.updateProjectionMatrix();
                tanH = Math.tan((camera.fov * Math.PI) / 360);
                cols = asp < 0.9 ? 2 : 3;
                rows = asp < 0.9 ? 3 : 2;
                // en pantalla alta: el riel se abre en vertical y las tarjetas crecen
                ys = clamp((0.561 / asp / 0.3153) * 0.5, 1, 2.1);
                k = asp < 0.9 ? 1.4 : 1;
                CARD_W = 2.1 * k;
                CARD_H = 1.32 * k;
                STEP = CARD_W + 0.03 * k;
                cards.forEach(ajustarCover);
                buildPath();
                // las lineas entre filas, a la altura real de cada hueco
                const g0 = grid(0);
                reglas.forEach((el, j) => {
                    if (j >= rows - 1) return void (el.style.display = 'none');
                    el.style.display = '';
                    const yHueco = g0.y - g0.h / 2 - j * (g0.h + g0.gap * 1.6) - (g0.gap * 1.6) / 2;
                    el.style.top = `${(0.5 - yHueco / g0.vh) * 100}%`;
                });
            };
            resize();

            /* ---------- el reloj de la entrada (no el scroll). Arranca cuando
               los tres primeros videos tienen imagen (o a los 3 s), para que la
               cinta no pase con tarjetas negras en datos moviles; mientras
               tanto se ve el primer cuadro, el casi vacio. */
            let target = 0;
            let p = 0;
            const tInicio = performance.now();
            let t0 = tInicio;
            let arranco = false;
            let terminado = false;
            // si se llega con la pagina ya bajada (volver atras), directo al final
            if (scrollY > 40) {
                arranco = true;
                t0 -= DURA;
                target = p = 1;
            } else bloquear(true);
            const terminar = () => {
                if (terminado) return;
                terminado = true;
                bloquear(false);
                setEstado('listo');
            };
            saltar.current = () => {
                arranco = true;
                t0 = performance.now() - DURA;
            };

            /* ---------- poses */
            const op = new THREE.Vector3();
            const ot = new THREE.Vector3();
            const up = new THREE.Vector3();
            const Y = new THREE.Vector3(0, 1, 0);
            const vp = new THREE.Vector3();
            const poseRibbon = (c: (typeof cards)[number], head: number) => {
                const pos = c.geo.attributes.position;
                const centre = head - c.i * STEP;
                for (let iy = 0; iy <= NY; iy++)
                    for (let ix = 0; ix <= NX; ix++) {
                        const kk = iy * (NX + 1) + ix;
                        const lu = ix / NX - 0.5;
                        const lv = 0.5 - iy / NY;
                        at(centre + lu * CARD_W, op, ot);
                        // la hoja siempre derecha: el arriba es Y, perpendicular a la tangente
                        up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
                        vp.copy(op).addScaledVector(up, lv * CARD_H);
                        pos.setXYZ(kk, vp.x, vp.y, vp.z);
                    }
                pos.needsUpdate = true;
            };
            const poseGrid = (c: (typeof cards)[number], q: number) => {
                const g = grid(c.i);
                const pos = c.geo.attributes.position;
                // cada una llega desde su lado: la columna de afuera, de costado;
                // las filas de arriba desde arriba y la de abajo desde abajo
                const lado = (g.c - (cols - 1) / 2) * (cols === 3 ? 1.2 : 2);
                const dy = g.r < rows / 2 ? 1 : -1;
                const centro = cols === 3 && g.c === 1;
                const ox = lado * g.vw * (cols === 3 ? 0.62 : 0.4) * (1 - q);
                const oy = dy * g.vh * (centro ? 0.95 : 0.34) * (1 - q);
                const tilt = (1 - q) * 0.22 * (lado || 0.5) * dy;
                const cs = Math.cos(tilt);
                const sn = Math.sin(tilt);
                for (let iy = 0; iy <= NY; iy++)
                    for (let ix = 0; ix <= NX; ix++) {
                        const kk = iy * (NX + 1) + ix;
                        const x = (ix / NX - 0.5) * g.w;
                        const y = (0.5 - iy / NY) * g.h;
                        pos.setXYZ(kk, g.x + ox + x * cs - y * sn, g.y + oy + x * sn + y * cs, -GZ - (1 - q) * 0.6 * Math.sin((ix / NX) * Math.PI));
                    }
                pos.needsUpdate = true;
            };

            const RIB_A = 0.14;
            const RIB_B = 0.63;
            const render = () => {
                const pp = p;
                // el titular cruza la pagina, cada linea hacia su lado
                const rise = 1 - out(span(pp, 0, 0.12));
                // hasta 112vw y no 76: en el celular las palabras ocupan casi todo
                // el ancho y con 76 asomaban por los bordes sobre la grilla
                const run = mix(-50, 112, span(pp, 0, 0.58));
                l1.style.transform = `translate3d(${run}vw,${rise * 34}vh,0)`;
                l2.style.transform = `translate3d(${-run}vw,${rise * 34}vh,0)`;
                cap.style.opacity = String(1 - span(pp, 0.52, 0.57));
                cap.style.transform = `translate(-50%,calc(-50% + ${rise * 34}vh))`;
                const a = String(1 - span(pp, 0, 0.05));
                primeros.forEach((el) => (el.style.opacity = a));
                const regla = ease(span(pp, 0.72, 0.86));
                reglas.forEach((el) => (el.style.transform = `scaleX(${regla})`));
                // la cinta y despues la grilla
                const pr = span(pp, RIB_A, RIB_B);
                const total = PATH_L + cards.length * STEP;
                const head = mix(0, total, pr);
                for (const c of cards) {
                    const s = head - c.i * STEP;
                    const end = PATH_L - CARD_W;
                    if (s < end) {
                        c.mesh.visible = s > CARD_W;
                        if (c.mesh.visible) poseRibbon(c, head);
                    } else if (c.i < cols * rows) {
                        // cada tarjeta vuela a su lugar apenas deja el riel
                        const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / total);
                        const q = out(span(pp, st, st + 0.13));
                        c.mesh.visible = q > 0.001;
                        if (c.mesh.visible) poseGrid(c, q);
                    } else c.mesh.visible = false;
                }
                renderer.render(scene, camera);
            };

            /* ---------- bucle: mientras la entrada este en pantalla (los videos
               de la grilla siguen corriendo al terminar) */
            let enPantalla = true;
            let ultimo = performance.now();
            const loop = () => {
                raf = 0;
                const ahora = performance.now();
                const dt = Math.min(0.1, (ahora - ultimo) / 1000);
                ultimo = ahora;
                if (!arranco && (listos >= 3 || ahora - tInicio > 3000)) {
                    arranco = true;
                    t0 = ahora;
                }
                target = arranco ? clamp((ahora - t0) / DURA) : 0;
                // el .09 por cuadro del original, a 60 fps, sin importar los Hz
                p += (target - p) * (1 - Math.pow(1 - 0.09, dt * 60));
                if (Math.abs(target - p) < 0.00005) p = target;
                if (p >= LIBRE) terminar();
                for (const c of cards) {
                    if (c.mesh.visible && c.v.paused) c.v.play().catch(() => {});
                    else if (!c.mesh.visible && !c.v.paused) c.v.pause();
                }
                render();
                if (enPantalla) raf = requestAnimationFrame(loop);
            };
            const pedir = () => {
                if (!raf && enPantalla) {
                    ultimo = performance.now();
                    raf = requestAnimationFrame(loop);
                }
            };
            const io = new IntersectionObserver(([e]) => {
                enPantalla = e.isIntersecting;
                if (!enPantalla) cards.forEach((c) => c.v.pause());
                pedir();
            });
            io.observe(intro);
            const alResize = () => {
                resize();
                pedir();
            };
            addEventListener('resize', alResize);
            pedir();

            limpiar = () => {
                bloquear(false);
                cancelAnimationFrame(raf);
                io.disconnect();
                removeEventListener('resize', alResize);
                for (const c of cards) {
                    c.v.pause();
                    c.v.removeAttribute('src');
                    c.v.load();
                    c.tex.dispose();
                    c.geo.dispose();
                    c.mat.dispose();
                }
                renderer.dispose();
            };
        });

        return () => {
            vivo = false;
            limpiar();
        };
    }, []);

    return (
        <div ref={caja} className={`pre-intro is-${estado}`} data-tono="oscuro">
            <h1 className="pre-h1" aria-label="Nuestros precios">
                <span className="pre-hl pre-l1" aria-hidden="true">
                    <span>Nuestros</span>
                </span>
                <span className="pre-hl pre-l2" aria-hidden="true">
                    <span>Precios</span>
                </span>
            </h1>
            <p className="pre-cap">Lo que cuesta, claro desde el inicio.</p>
            <div className="pre-glow" aria-hidden="true" />
            <div className="pre-cross" aria-hidden="true">
                <i>+</i>
            </div>
            <div className="pre-regla" aria-hidden="true" />
            <div className="pre-regla" aria-hidden="true" />
            <canvas ref={lienzo} className="pre-gl" aria-hidden="true" />
            <div className="pre-bot">
                <p>Webs, apps, sistemas y automatizaciones, cada uno con su precio.</p>
                {estado === 'corre' ? (
                    <button type="button" className="pre-bot-r pre-saltar" onClick={() => saltar.current()}>
                        Saltar
                    </button>
                ) : (
                    <span className="pre-bot-r" aria-hidden="true">
                        Desliza
                    </span>
                )}
            </div>
        </div>
    );
}
