import { Boton } from '../Boton';
import { Ceja } from '../Ceja';
import { Titular } from '../Titular';
import { ComparadorDiferido } from './negocios/ComparadorDiferido';
import './negocios.css';

/* (07) Tu negocio — antes y despues, rubro por rubro.

   La seccion "Case studies" de Reachwise pasada a Atlas: pildoras de
   rubros, una tarjeta con foto real que compara el antes (en gris, con el
   chat sin contestar) y el despues (a color, con la cifra, la grafica y el
   aviso del sistema), y debajo que construimos y cuanto cuesta. Pero sin
   casos inventados: son EJEMPLOS por rubro y asi lo dicen la tarjeta y la
   nota del pie (ver negocios/escenarios.ts). Lo real esta a un toque, en
   "Ver proyectos reales". */

export function Negocios() {
    return (
        <section id="negocios" className="h-neg" data-tono="oscuro" aria-labelledby="negocios-t">
            <div className="m-wrap">
                <Ceja n="07">Tu negocio</Ceja>
                <Titular id="negocios-t" className="m-h2 h-neg-h2" texto="Tu negocio, después de Atlas." destacar="después" />
                <p className="m-p h-neg-intro" data-rv>
                    Elige un rubro y desliza la línea: a la izquierda, cómo se trabaja hoy; a la derecha, con lo que construimos.
                </p>
                <div className="h-neg-ver" data-rv>
                    <Boton href="/projects" variante="fantasma">
                        Ver proyectos reales
                    </Boton>
                </div>
            </div>

            <ComparadorDiferido />

            <div className="m-wrap">
                <p className="h-neg-nota">Ejemplos ilustrativos de lo que construimos: no son resultados de clientes.</p>
            </div>
        </section>
    );
}
