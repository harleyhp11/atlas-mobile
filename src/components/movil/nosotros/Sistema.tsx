import type { CSSProperties } from 'react';

/* La pieza propia de Benjamin en su ficha: «lo que no se ve». Un diagrama
   vivo de lo que sostiene una web —tu web habla con la API, y la API con los
   datos y el servidor— con paquetes rojos que viajan por las lineas. Es un
   dibujo de su area, no de herramientas concretas (no estan confirmadas).

   Solo CSS: al entrar (data-in) los nodos aparecen y las lineas se trazan;
   los paquetes son un bucle que se pausa fuera de pantalla (data-loop). */

const NODOS = [
    { t: 'Tu web', x: 10, y: 62, w: 74 },
    { t: 'API', x: 124, y: 62, w: 54, rojo: true },
    { t: 'Datos', x: 227, y: 18, w: 74 },
    { t: 'Servidor', x: 219, y: 106, w: 82 },
];

const CAMINOS = ['M84 75 H124', 'M178 75 C200 75 205 31 227 31', 'M178 75 C200 75 205 119 219 119'];

export function Sistema() {
    return (
        <div className="nos-sistema" data-in data-loop>
            <div className="nos-pieza-cab">
                <span className="m-mono nos-pieza-t">Lo que no se ve</span>
            </div>
            <svg className="nos-sistema-svg" viewBox="0 0 311 150" aria-hidden="true">
                {CAMINOS.map((d, i) => (
                    <path key={`l${i}`} className="nos-cable" d={d} pathLength={100} />
                ))}
                {CAMINOS.map((d, i) => (
                    <path key={`p${i}`} className="nos-paquete" d={d} pathLength={100} style={{ '--i': i } as CSSProperties} />
                ))}
                {NODOS.map((n, i) => (
                    <g key={n.t} className={`nos-nodo${n.rojo ? ' is-rojo' : ''}`} style={{ '--i': i } as CSSProperties}>
                        <rect x={n.x} y={n.y} width={n.w} height={26} rx={13} />
                        <text x={n.x + n.w / 2} y={n.y + 13} textAnchor="middle" dominantBaseline="central">
                            {n.t}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
