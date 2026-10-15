import { Boton } from '../Boton';
import { Ceja } from '../Ceja';
import { PROBLEMA, whatsapp } from '../datos';
import { Titular } from '../Titular';
import { CarruselPerdidas } from './CarruselPerdidas';
import './problema.css';

/* (01) Lo que pierdes sin web.

   Arriba, la foto del telon rojo del bloque "(El problema)" del escritorio
   con el titular encima y el "0 resultados" flotando junto al telefono.
   Debajo, el carrusel de las tres perdidas —clientes, plata, tiempo— con su
   mini-interfaz y solo el titulo: la animacion ya cuenta la historia. */

export function Problema() {
    return (
        <section id="problema" className="h-problema" data-tono="oscuro" aria-labelledby="problema-t">
            <div className="m-wrap">
                <Ceja n="01">{PROBLEMA.ceja}</Ceja>
                <div className="h-problema-escena">
                    <figure className="h-problema-foto" data-rv="img">
                        <img src="/assets/movil/problema-telon.webp" width={720} height={900} alt="" loading="lazy" decoding="async" />
                    </figure>
                    <span className="h-problema-chip" aria-hidden="true">
                        <i />0 resultados
                    </span>
                    <Titular id="problema-t" className="m-h2 h-problema-h2" texto={PROBLEMA.titular} destacar={PROBLEMA.destacar} />
                </div>
            </div>

            <div className="m-wrap h-problema-carrusel" data-rv>
                <CarruselPerdidas textos={false} />
            </div>

            <div className="m-wrap h-problema-cta" data-rv>
                <Boton href={whatsapp(PROBLEMA.whatsapp)} externo tinta>
                    {PROBLEMA.cta}
                </Boton>
            </div>
        </section>
    );
}
