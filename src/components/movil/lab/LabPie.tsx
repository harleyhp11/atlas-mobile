import './lab.css';

/* Pie del laboratorio: dice que es un prototipo y salta entre direcciones.
   Desaparece con /mobile-lab cuando Harley elija. */

const DIRECCIONES = [
    { k: 'a', n: 'Manifiesto', d: 'La palabra es la imagen' },
    { k: 'b', n: 'Producto', d: 'Bento y piezas de interfaz' },
    { k: 'c', n: 'Cine', d: 'Video B/N e islas claras' },
];

export function LabPie({ actual }: { actual?: 'a' | 'b' | 'c' }) {
    return (
        <footer className="lab-pie" data-tono="oscuro">
            <div className="m-wrap">
                <p className="m-mono lab-pie-t">Laboratorio móvil · hero + promesa + servicios</p>
                <nav aria-label="Direcciones del laboratorio">
                    <ul className="lab-pie-lista">
                        {DIRECCIONES.map((d) => (
                            <li key={d.k}>
                                <a href={`/mobile-lab/${d.k}`} aria-current={d.k === actual ? 'page' : undefined}>
                                    <small className="m-mono">{d.k.toUpperCase()}</small>
                                    <b>{d.n}</b>
                                    <span>{d.d}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    );
}

export function Cifra({ antes, cuenta, despues }: { antes?: string; cuenta: number; despues?: string }) {
    return (
        <span className="m-cifra">
            {antes}
            {cuenta >= 10 ? (
                <span data-cuenta={cuenta} style={{ minWidth: `${String(cuenta).length * 0.56}em`, display: 'inline-block' }}>
                    {cuenta}
                </span>
            ) : (
                cuenta
            )}
            {despues}
        </span>
    );
}
