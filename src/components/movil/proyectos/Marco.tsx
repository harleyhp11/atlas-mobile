import { imagen, type Proyecto } from './proyectos';

/* La captura de cada proyecto dentro de un navegador: barra con los tres
   puntos y la direccion. Asi se lee como lo que es, un sitio o una app, y
   no como una foto suelta. Solo los que estan en linea llevan candado y
   dominio de verdad; el resto, su nombre. */

export function Marco({ p, prioridad = false, className = '' }: { p: Proyecto; prioridad?: boolean; className?: string }) {
    return (
        <figure className={`pry-marco ${className}`}>
            <span className="pry-marco-barra" aria-hidden="true">
                <span className="pry-marco-puntos">
                    <i />
                    <i />
                    <i />
                </span>
                <span className="pry-marco-dir">
                    {p.url && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="11" width="14" height="10" rx="2" />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                    )}
                    {p.direccion}
                </span>
            </span>
            <span className="pry-marco-vista">
                <img
                    src={imagen(p)}
                    width={1040}
                    height={650}
                    alt={`Portada de ${p.titulo}`}
                    loading={prioridad ? 'eager' : 'lazy'}
                    fetchPriority={prioridad ? 'high' : undefined}
                    decoding="async"
                />
            </span>
        </figure>
    );
}
