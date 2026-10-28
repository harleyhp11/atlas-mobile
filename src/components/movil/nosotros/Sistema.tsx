'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

/* La pieza propia de Benjamin en su ficha: «lo que no se ve». Una pantalla
   chica (la altura del diagrama de antes) que corta entre cinco escenas de
   su oficio, como un monitor que cambia de canal:
     · Flujo: la web y la app le piden a la API, y la API a los datos, la
       cache y la cola (paquetes rojos por los cables);
     · Deploy: una terminal sube los cambios, prueba y publica;
     · Datos: entra un pedido nuevo a la tabla y cambia de estado;
     · Monitoreo: la latencia se dibuja y los servidores laten;
     · Seguridad: un acceso pasa, dos se bloquean.
   Arriba, las pestañas con su barra de avance, como historias. El corte es
   un barrido con una linea roja.

   Es un dibujo de su area, no de herramientas concretas (no estan
   confirmadas): los nombres son genericos y las cifras son de muestra. Solo
   corre en pantalla; con movimiento reducido queda quieta en Flujo. */

const ESCENAS = ['Flujo', 'Deploy', 'Datos', 'Monitoreo', 'Seguridad'] as const;
const DURA = 3600; // ms por escena

const NODOS = [
    { t: 'Web', x: 6, y: 14, w: 66 },
    { t: 'App', x: 6, y: 80, w: 66 },
    { t: 'API', x: 116, y: 47, w: 70, rojo: true },
    { t: 'Datos', x: 233, y: 4, w: 72 },
    { t: 'Caché', x: 233, y: 47, w: 72 },
    { t: 'Cola', x: 233, y: 90, w: 72 },
];
const CAMINOS = [
    'M72 27 C96 27 96 60 116 60',
    'M72 93 C96 93 96 60 116 60',
    'M186 60 C210 60 210 17 233 17',
    'M186 60 H233',
    'M186 60 C210 60 210 103 233 103',
];

const DEPLOY = [
    ['$', 'git push origin main', ''],
    ['▸', 'build', '✓'],
    ['▸', 'tests', '✓ pasan'],
    ['▸', 'migraciones', '✓'],
    ['▸', 'deploy → producción', '✓'],
] as const;

const FILAS = [
    ['#1042', 'Mesa 4', 'pagado'],
    ['#1041', 'Delivery', 'en camino'],
    ['#1040', 'Mesa 2', 'pagado'],
] as const;

const ACCESOS = [
    { ok: true, t: 'admin · 2FA', e: '200' },
    { ok: false, t: 'token vencido', e: '401' },
    { ok: false, t: 'fuerza bruta', e: '429' },
] as const;

export function Sistema() {
    const caja = useRef<HTMLDivElement>(null);
    const [n, setN] = useState(0);

    // cambia de escena solo en pantalla y sin movimiento reducido
    useEffect(() => {
        const el = caja.current;
        if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let id = 0;
        const io = new IntersectionObserver(([e]) => {
            window.clearInterval(id);
            if (e.isIntersecting) id = window.setInterval(() => setN((v) => (v + 1) % ESCENAS.length), DURA);
        });
        io.observe(el);
        return () => {
            io.disconnect();
            window.clearInterval(id);
        };
    }, []);

    const on = (i: number) => `nos-sis-escena${n === i ? ' is-on' : ''}`;

    return (
        <div ref={caja} className="nos-sistema" data-in data-loop style={{ '--dura': `${DURA}ms` } as CSSProperties}>
            <div className="nos-pieza-cab">
                <span className="m-mono nos-pieza-t">Lo que no se ve</span>
                <span className="m-mono nos-sis-vivo" aria-hidden="true">
                    <i />
                    En vivo
                </span>
            </div>

            <p className="sr-only">
                Lo que hace Benjamín, en cinco escenas: conecta la web y la app con la API y los datos, publica los cambios, guarda los pedidos,
                vigila los servidores y bloquea los accesos indebidos.
            </p>

            {/* las pestañas, con su barra de avance */}
            <ol className="nos-sis-tabs m-mono" aria-hidden="true">
                {ESCENAS.map((e, i) => (
                    <li key={e} className={i === n ? 'is-on' : undefined}>
                        {e}
                        <i key={i === n ? `on-${n}` : 'off'} />
                    </li>
                ))}
            </ol>

            <div className="nos-sis-pantalla" aria-hidden="true">
                {/* 1 · flujo */}
                <div className={on(0)}>
                    <svg viewBox="0 0 311 120">
                        {CAMINOS.map((d, i) => (
                            <path key={`c${i}`} className="nos-cable" d={d} pathLength={100} />
                        ))}
                        {CAMINOS.map((d, i) => (
                            <path key={`p${i}`} className="nos-paquete" d={d} pathLength={100} style={{ '--i': i } as CSSProperties} />
                        ))}
                        {NODOS.map((nd) => (
                            <g key={nd.t} className={`nos-nodo${nd.rojo ? ' is-rojo' : ''}`}>
                                <rect x={nd.x} y={nd.y} width={nd.w} height={26} rx={13} />
                                <text x={nd.x + nd.w / 2} y={nd.y + 13} textAnchor="middle" dominantBaseline="central">
                                    {nd.t}
                                </text>
                            </g>
                        ))}
                    </svg>
                    <span className="nos-sis-ok m-mono">200 OK · 38 ms</span>
                </div>

                {/* 2 · deploy */}
                <div className={`${on(1)} nos-sis-term m-mono`}>
                    {DEPLOY.map(([p, t, ok], i) => (
                        <p key={t} style={{ '--i': i } as CSSProperties}>
                            <b>{p}</b>
                            <span>{t}</span>
                            <em>{ok}</em>
                        </p>
                    ))}
                    <span className="nos-sis-avance">
                        <i />
                    </span>
                </div>

                {/* 3 · datos */}
                <div className={`${on(2)} nos-sis-tabla m-mono`}>
                    <p className="nos-sis-tabla-t">pedidos</p>
                    <div className="nos-sis-fila is-nueva">
                        <span>#1043</span>
                        <span>Mesa 7</span>
                        <span className="nos-sis-estado">
                            <i>pendiente</i>
                            <i>pagado</i>
                        </span>
                    </div>
                    {FILAS.map(([id, c, e]) => (
                        <div key={id} className="nos-sis-fila">
                            <span>{id}</span>
                            <span>{c}</span>
                            <span>{e}</span>
                        </div>
                    ))}
                </div>

                {/* 4 · monitoreo */}
                <div className={`${on(3)} nos-sis-mon`}>
                    <svg viewBox="0 0 200 80" preserveAspectRatio="none">
                        <path className="nos-sis-area" d="M0 62 L20 56 L40 60 L60 36 L80 46 L100 26 L120 40 L140 30 L160 48 L180 20 L200 32 V80 H0 Z" />
                        <path className="nos-sis-linea" d="M0 62 L20 56 L40 60 L60 36 L80 46 L100 26 L120 40 L140 30 L160 48 L180 20 L200 32" pathLength={100} />
                    </svg>
                    <div className="nos-sis-mon-lado m-mono">
                        <span>Latencia</span>
                        <b>42 ms</b>
                        <span className="nos-sis-cpu">
                            {Array.from({ length: 6 }, (_, i) => (
                                <i key={i} style={{ '--i': i } as CSSProperties} />
                            ))}
                        </span>
                        <span>Servidores</span>
                    </div>
                </div>

                {/* 5 · seguridad */}
                <div className={`${on(4)} nos-sis-seg m-mono`}>
                    <span className="nos-sis-escudo">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </span>
                    <ul>
                        {ACCESOS.map((a, i) => (
                            <li key={a.t} className={a.ok ? 'is-ok' : 'is-no'} style={{ '--i': i } as CSSProperties}>
                                <b>{a.e}</b>
                                <span>{a.t}</span>
                                <em>{a.ok ? 'entra' : 'bloqueado'}</em>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* la linea roja del corte */}
                <i key={`corte-${n}`} className="nos-sis-corte" />
            </div>
        </div>
    );
}
