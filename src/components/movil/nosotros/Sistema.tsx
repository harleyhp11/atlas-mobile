'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/* La pieza propia de Benjamin en su ficha: «lo que no se ve». Un panel de
   backend en vivo, por capas, como lo dibujaria alguien del oficio:
     · arriba, quien pide: la web, la app y el panel del dueño;
     · al medio, la API, que pasa cada pedido por Auth y lo anota en Logs;
     · debajo, los servicios: pedidos, pagos y avisos;
     · al fondo, donde vive todo: la base de datos, la cache y la cola.

   Tres recorridos se turnan en un ciclo de 6 s, cada uno de ida (rojo) y
   vuelta (blanco): la web guarda un pedido en la base de datos; la app
   paga y la cache responde al toque; el panel manda un aviso que pasa por
   la cola y un worker lo despacha. Cada vez que un pedido toca la API se
   enciende Auth, y la base, la cache o la cola destellan al recibirlo.
   Debajo corre el registro de peticiones y tres medidores.

   Es un dibujo de su area, no de herramientas concretas (no estan
   confirmadas): por eso los nombres son genericos. Los paquetes son SMIL
   (animateMotion: van por la curva en cualquier navegador) y se pausan
   fuera de pantalla y con movimiento reducido; el resto es CSS, pausado por
   Revelador (data-loop → .is-off). */

const P = 6; // segundos del ciclo

type Nodo = { id: string; t: string; x: number; y: number; w: number; rojo?: boolean; chico?: boolean };

const NODOS: Nodo[] = [
    { id: 'web', t: 'Web', x: 10, y: 8, w: 78 },
    { id: 'app', t: 'App', x: 116, y: 8, w: 78 },
    { id: 'panel', t: 'Panel', x: 222, y: 8, w: 78 },
    { id: 'logs', t: 'Logs', x: 4, y: 74, w: 56, chico: true },
    { id: 'api', t: 'API', x: 94, y: 70, w: 122, rojo: true },
    { id: 'auth', t: 'Auth', x: 250, y: 74, w: 56, chico: true },
    { id: 'pedidos', t: 'Pedidos', x: 10, y: 136, w: 84 },
    { id: 'pagos', t: 'Pagos', x: 113, y: 136, w: 84 },
    { id: 'avisos', t: 'Avisos', x: 216, y: 136, w: 84 },
    { id: 'cache', t: 'Caché', x: 113, y: 204, w: 84 },
    { id: 'cola', t: 'Cola', x: 216, y: 204, w: 84 },
];

// los cables, con nombre para que los paquetes los sigan (mpath)
const CABLES: Record<string, string> = {
    'web-api': 'M49 34 C49 54 130 50 130 70',
    'app-api': 'M155 34 V70',
    'panel-api': 'M261 34 C261 54 180 50 180 70',
    'api-logs': 'M94 85 H60',
    'api-auth': 'M216 85 H250',
    'api-pedidos': 'M130 100 C130 120 52 116 52 136',
    'api-pagos': 'M155 100 V136',
    'api-avisos': 'M180 100 C180 120 258 116 258 136',
    'pedidos-db': 'M52 162 V196',
    'pagos-cache': 'M155 162 V204',
    'avisos-cola': 'M258 162 V204',
    // el worker: sale de la cola por la derecha y vuelve a avisos
    'cola-avisos': 'M300 217 C318 217 318 149 300 149',
};

/* Un tramo de un recorrido: por que cable, cuando (fraccion del ciclo) y si
   es ida (rojo) o vuelta (blanco, recorre el cable al reves). */
type Tramo = { c: string; a: number; b: number; vuelta?: boolean };

const TRAMOS: Tramo[] = [
    // 1 · la web guarda un pedido
    { c: 'web-api', a: 0.0, b: 0.06 },
    { c: 'api-pedidos', a: 0.06, b: 0.12 },
    { c: 'pedidos-db', a: 0.12, b: 0.17 },
    { c: 'pedidos-db', a: 0.2, b: 0.25, vuelta: true },
    { c: 'api-pedidos', a: 0.25, b: 0.31, vuelta: true },
    { c: 'web-api', a: 0.31, b: 0.37, vuelta: true },
    // 2 · la app paga; la cache responde al toque
    { c: 'app-api', a: 0.3, b: 0.35 },
    { c: 'api-pagos', a: 0.35, b: 0.4 },
    { c: 'pagos-cache', a: 0.4, b: 0.45 },
    { c: 'pagos-cache', a: 0.46, b: 0.5, vuelta: true },
    { c: 'api-pagos', a: 0.5, b: 0.55, vuelta: true },
    { c: 'app-api', a: 0.55, b: 0.6, vuelta: true },
    // 3 · el panel manda un aviso: cola, worker y vuelta
    { c: 'panel-api', a: 0.6, b: 0.66 },
    { c: 'api-avisos', a: 0.66, b: 0.72 },
    { c: 'avisos-cola', a: 0.72, b: 0.77 },
    { c: 'cola-avisos', a: 0.8, b: 0.88 },
    { c: 'api-avisos', a: 0.88, b: 0.93, vuelta: true },
    { c: 'panel-api', a: 0.93, b: 0.99, vuelta: true },
];

// cada vez que un pedido llega a la API: Auth lo revisa y Logs lo anota
const CONTROLES = [0.06, 0.35, 0.66];
// destellos al recibir: base de datos, cache y cola
const DESTELLOS: { id: string; t: number }[] = [
    { id: 'db', t: 0.17 },
    { id: 'cache', t: 0.45 },
    { id: 'cola', t: 0.77 },
];

const f = (n: number) => n.toFixed(3);

function Paquete({ t }: { t: Tramo }) {
    const pts = t.vuelta ? '1;1;0;0' : '0;0;1;1';
    return (
        <circle r={t.vuelta ? 2.6 : 3.2} className={t.vuelta ? 'nos-sis-vuelta' : 'nos-sis-ida'} opacity="0">
            <animateMotion
                dur={`${P}s`}
                repeatCount="indefinite"
                calcMode="linear"
                keyPoints={pts}
                keyTimes={`0;${f(t.a)};${f(t.b)};1`}
            >
                <mpath href={`#nos-c-${t.c}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${P}s`} repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes={`0;${f(t.a)};${f(t.b)}`} />
        </circle>
    );
}

// un destello que se enciende en t y se apaga enseguida
function Destello({ t, children }: { t: number; children: ReactNode }) {
    const fin = Math.min(0.999, t + 0.07);
    return (
        <g opacity="0">
            {children}
            <animate attributeName="opacity" dur={`${P}s`} repeatCount="indefinite" calcMode="linear" values="0;0;1;0;0" keyTimes={`0;${f(t)};${f(t + 0.01)};${f(fin)};1`} />
        </g>
    );
}

const LOG = [
    ['201', 'POST', '/pedidos', '38 ms'],
    ['200', 'GET', '/pagos', 'caché'],
    ['202', 'POST', '/avisos', 'en cola'],
    ['200', 'GET', '/menu', '12 ms'],
    ['401', 'POST', '/login', 'bloqueado'],
    ['200', 'GET', '/reservas', '21 ms'],
] as const;

export function Sistema() {
    const caja = useRef<HTMLDivElement>(null);
    const svg = useRef<SVGSVGElement>(null);

    // los paquetes (SMIL) solo corren en pantalla y sin movimiento reducido
    useEffect(() => {
        const el = caja.current;
        const s = svg.current;
        if (!el || !s) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            s.pauseAnimations();
            return;
        }
        s.pauseAnimations();
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? s.unpauseAnimations() : s.pauseAnimations()));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={caja} className="nos-sistema" data-in data-loop>
            <div className="nos-pieza-cab">
                <span className="m-mono nos-pieza-t">Lo que no se ve</span>
                <span className="m-mono nos-sis-vivo" aria-hidden="true">
                    <i />
                    En vivo
                </span>
            </div>

            <p className="sr-only">
                Diagrama de lo que sostiene una web: la web, la app y el panel le piden datos a la API; la API revisa cada pedido y lo anota; los
                servicios de pedidos, pagos y avisos guardan y leen en la base de datos, la caché y la cola.
            </p>

            <svg ref={svg} className="nos-sistema-svg" viewBox="0 0 311 236" aria-hidden="true">
                <defs>
                    {Object.entries(CABLES).map(([id, d]) => (
                        <path key={id} id={`nos-c-${id}`} d={d} />
                    ))}
                </defs>

                {/* los cables se trazan al entrar */}
                {Object.entries(CABLES).map(([id, d], i) => (
                    <path
                        key={id}
                        className={`nos-cable${id === 'cola-avisos' ? ' is-worker' : ''}${id === 'api-logs' || id === 'api-auth' ? ' is-lado' : ''}`}
                        d={d}
                        pathLength={100}
                        style={{ '--i': i } as CSSProperties}
                    />
                ))}

                {/* la base de datos: un cilindro, con sus filas */}
                <g className="nos-nodo nos-sis-db" style={{ '--i': 9 } as CSSProperties}>
                    <path d="M6 204 v22 a46 8 0 0 0 92 0 v-22" />
                    <ellipse cx="52" cy="204" rx="46" ry="8" />
                    <text x="52" y="224" textAnchor="middle" dominantBaseline="central">
                        Base de datos
                    </text>
                </g>

                {NODOS.map((n, i) => (
                    <g
                        key={n.id}
                        className={`nos-nodo${n.rojo ? ' is-rojo' : ''}${n.chico ? ' is-chico' : ''}`}
                        style={{ '--i': i } as CSSProperties}
                    >
                        <rect x={n.x} y={n.y} width={n.w} height={n.rojo ? 30 : 26} rx={n.rojo ? 15 : 13} />
                        <text x={n.x + n.w / 2} y={n.y + (n.rojo ? 15 : 13)} textAnchor="middle" dominantBaseline="central">
                            {n.t}
                        </text>
                    </g>
                ))}

                {/* Auth y Logs se encienden con cada pedido que entra */}
                {CONTROLES.map((t) => (
                    <g key={t}>
                        <Destello t={t}>
                            <rect className="nos-sis-luz" x={250} y={74} width={56} height={26} rx={13} />
                        </Destello>
                        <Destello t={t + 0.02}>
                            <rect className="nos-sis-luz is-blanca" x={4} y={74} width={56} height={26} rx={13} />
                        </Destello>
                    </g>
                ))}

                {/* destellos al guardar o leer */}
                {DESTELLOS.map((d) => (
                    <Destello key={d.id} t={d.t}>
                        {d.id === 'db' ? (
                            <ellipse className="nos-sis-luz" cx="52" cy="215" rx="48" ry="19" />
                        ) : (
                            <rect className="nos-sis-luz" x={d.id === 'cache' ? 113 : 216} y={204} width={84} height={26} rx={13} />
                        )}
                    </Destello>
                ))}

                {/* la etiqueta del worker */}
                <text className="nos-sis-nota" x="306" y="183" textAnchor="end">
                    worker
                </text>

                {/* los paquetes: ida en rojo, vuelta en blanco */}
                {TRAMOS.map((t, i) => (
                    <Paquete key={i} t={t} />
                ))}
            </svg>

            {/* el registro de peticiones, que corre solo */}
            <div className="nos-sis-log m-mono" aria-hidden="true">
                <ul>
                    {[0, 1].map((copia) =>
                        LOG.map(([cod, met, ruta, extra], i) => (
                            <li key={`${copia}-${i}`} className={cod.startsWith('4') ? 'is-error' : undefined}>
                                <b>{cod}</b>
                                <span>{met}</span>
                                <span>{ruta}</span>
                                <em>{extra}</em>
                            </li>
                        )),
                    )}
                </ul>
            </div>

            {/* tres medidores: trafico, servidor y seguridad */}
            <div className="nos-sis-medidores" aria-hidden="true">
                <div>
                    <span className="m-mono">Tráfico</span>
                    <span className="nos-sis-barras">
                        {Array.from({ length: 9 }, (_, i) => (
                            <i key={i} style={{ '--i': i } as CSSProperties} />
                        ))}
                    </span>
                </div>
                <div>
                    <span className="m-mono">Servidor</span>
                    <span className="nos-sis-cpu">
                        {Array.from({ length: 4 }, (_, i) => (
                            <i key={i} style={{ '--i': i } as CSSProperties} />
                        ))}
                    </span>
                </div>
                <div>
                    <span className="m-mono">Seguridad</span>
                    <span className="nos-sis-candado">
                        <svg viewBox="0 0 16 16">
                            <rect x="3" y="7" width="10" height="7" rx="1.5" />
                            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                        </svg>
                        Cifrado
                    </span>
                </div>
            </div>
        </div>
    );
}
