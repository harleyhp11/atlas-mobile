'use client';

import { useEffect, useRef, useState } from 'react';
import './precios.css';

/* La entrada de /servicios en el celular: «Nuestros / Precios».

   Es el hero «Vante» que paso Harley, llevado al celular. Todo sale de un
   solo numero, el avance del scroll `p` (0 → 1, suavizado), dentro de una
   pista alta con un escenario sticky:
     · las dos lineas del titular cruzan la pantalla en sentidos opuestos;
     · una cinta de tarjetas viaja por un riel fijo en 3D: entra chica por
       abajo, pasa cerca en un arco suave, rodea el borde y se va por arriba;
     · al dejar el riel, cada tarjeta vuela a su lugar en una grilla de
       2 × 3 y una linea fina se dibuja entre las filas.
   Volver a subir lo rebobina igual.

   Cambios para el celular: la camara mantiene fijo el ancho visible (como
   el original bajo 16:9), pero en una pantalla alta eso deja la cinta como
   una franja delgada, asi que el riel se abre en vertical (ys) y las
   tarjetas crecen (k). La grilla es de 2 columnas. Sin hover (es tactil).

   Las tarjetas son piezas de la galeria de Atlas (imagenes), no los videos
   del original: esos eran trabajos de otro estudio. Las seis primeras
   quedan en la grilla; las dos ultimas solo pasan por la cinta.

   three.js entra con import() recien en esta pagina. Con movimiento
   reducido, o sin WebGL, queda el titular quieto. */

const PIEZAS = ['obra-03', 'obra-05', 'obra-01', 'obra-06', 'obra-02', 'laboratorio', 'app-golf', 'obra-04'];

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

export function IntroPrecios() {
    const pista = useRef<HTMLDivElement>(null);
    const lienzo = useRef<HTMLCanvasElement>(null);
    const [quieto, setQuieto] = useState(false);

    useEffect(() => {
        const track = pista.current;
        const canvas = lienzo.current;
        if (!track || !canvas) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setQuieto(true);
            return;
        }

        const $ = <T extends HTMLElement>(sel: string) => track.querySelector<T>(sel)!;
        const l1 = $('.pre-l1');
        const l2 = $('.pre-l2');
        const cap = $('.pre-cap');
        const intro = [$('.pre-glow'), $('.pre-cross')];
        const reglas = [...track.querySelectorAll<HTMLElement>('.pre-regla')];

        let vivo = true;
        let raf = 0;
        let limpiar = () => {};

        import('three').then((THREE) => {
            if (!vivo) return;

            let renderer: InstanceType<typeof THREE.WebGLRenderer>;
            try {
                renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            } catch {
                setQuieto(true);
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

            /* ---------- las tarjetas */
            const NX = 28;
            const NY = 3;
            const loader = new THREE.TextureLoader();
            const cards = PIEZAS.map((id, i) => {
                const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
                const mat = new THREE.ShaderMaterial({
                    vertexShader: VS,
                    fragmentShader: FS,
                    transparent: true,
                    side: THREE.DoubleSide,
                    uniforms: {
                        map: { value: null },
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
                const c = { i, geo, mat, mesh, va: 1.5 };
                loader.load(`/assets/movil/reel/${id}.webp`, (tex) => {
                    if (!vivo) return tex.dispose();
                    tex.colorSpace = THREE.NoColorSpace;
                    tex.anisotropy = 4;
                    mat.uniforms.map.value = tex;
                    c.va = tex.image.width / tex.image.height;
                    ajustarCover(c);
                    mat.uniforms.ready.value = 1;
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
                W = innerWidth;
                H = innerHeight;
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

            /* ---------- scroll */
            let target = 0;
            let p = 0;
            const leer = () => {
                const r = track.getBoundingClientRect();
                target = clamp(-r.top / (track.offsetHeight - innerHeight));
            };
            leer();
            p = target;

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
                intro.forEach((el) => (el.style.opacity = a));
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

            /* ---------- bucle: solo mientras la pista esta en pantalla */
            let enPantalla = true;
            let ultimo = performance.now();
            const loop = () => {
                raf = 0;
                const ahora = performance.now();
                const dt = Math.min(0.1, (ahora - ultimo) / 1000);
                ultimo = ahora;
                // el .09 por cuadro del original, a 60 fps, sin importar los Hz
                p += (target - p) * (1 - Math.pow(1 - 0.09, dt * 60));
                if (Math.abs(target - p) < 0.00005) p = target;
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
                pedir();
            });
            io.observe(track);
            const alScroll = () => {
                leer();
                pedir();
            };
            const alResize = () => {
                resize();
                leer();
                pedir();
            };
            addEventListener('scroll', alScroll, { passive: true });
            addEventListener('resize', alResize);
            pedir();

            limpiar = () => {
                cancelAnimationFrame(raf);
                io.disconnect();
                removeEventListener('scroll', alScroll);
                removeEventListener('resize', alResize);
                for (const c of cards) {
                    c.geo.dispose();
                    c.mat.uniforms.map.value?.dispose();
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
        <div ref={pista} className={`pre-pista${quieto ? ' is-quieto' : ''}`}>
            <div className="pre-escena" data-tono="oscuro">
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
                    <span className="pre-bot-r" aria-hidden="true">
                        Desliza
                    </span>
                </div>
            </div>
        </div>
    );
}
