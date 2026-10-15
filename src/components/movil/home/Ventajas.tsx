import type { CSSProperties } from 'react';
import { Ceja } from '../Ceja';
import { Estrella } from '../iconos';
import { Titular } from '../Titular';
import './ventajas.css';

/* (02) Por que Atlas — el bento de la direccion "Producto": la foto del
   monolito, el precio desde S/ 400, la entrega en semanas con una sola
   barra roja y la respuesta en menos de 24 h con la insignia 3D. Encima, el
   titular con el marco de Figma midiendo "Puntual". El resplandor rojo
   sube desde abajo hacia las cintas. */

export function Ventajas() {
    return (
        <section id="ventajas" className="h-ventajas" data-tono="oscuro" aria-labelledby="ventajas-t">
            <div className="m-wrap">
                <Ceja n="02">Por qué Atlas</Ceja>
                <Titular id="ventajas-t" className="m-h2 h-ventajas-h2" texto="Rápido. Impecable. Puntual." destacar="Puntual." modo="marco" />
            </div>

            <div className="m-wrap h-bento">
                <figure className="h-bt h-bt--foto" data-rv="img">
                    <img
                        src="/assets/movil/monolito-alto.webp"
                        width={600}
                        height={800}
                        alt="Teléfono con la marca Atlas sobre una roca, bajo focos de luz"
                        loading="lazy"
                        decoding="async"
                    />
                    <figcaption className="h-bt-chip">
                        <i className="m-ping" aria-hidden="true" />
                        Estudio digital · Lima
                    </figcaption>
                </figure>

                <div className="h-bt h-bt--blanca" data-rv style={{ '--d': '0.1s' } as CSSProperties}>
                    <span className="h-bt-lbl">Desde</span>
                    <strong>
                        S/ <span data-cuenta="400">400</span>
                    </strong>
                    <span className="h-bt-txt">Precio cerrado por escrito antes de empezar.</span>
                </div>

                <div className="h-bt h-bt--barras" data-rv style={{ '--d': '0.18s' } as CSSProperties}>
                    <span className="h-bt-lbl">Entrega</span>
                    <strong>2–4 sem.</strong>
                    <span className="h-barras" aria-hidden="true">
                        {[34, 52, 70, 100].map((h, k) => (
                            <i key={k} style={{ '--h': `${h}%`, '--k': k } as CSSProperties} />
                        ))}
                    </span>
                    <span className="h-barras-pie" aria-hidden="true">
                        <span>Brief</span>
                        <span>Web en vivo</span>
                    </span>
                </div>

                <div className="h-bt h-bt--insignia" data-rv style={{ '--d': '0.24s' } as CSSProperties}>
                    <span className="h-insignia" aria-hidden="true">
                        <Estrella />
                    </span>
                    <span>
                        <strong>Respuesta en menos de 24 h</strong>
                        <span className="h-bt-txt">Hablas directo con quien diseña y programa.</span>
                    </span>
                </div>
            </div>
        </section>
    );
}
