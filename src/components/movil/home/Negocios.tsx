import { Boton } from '../Boton';
import { Ceja } from '../Ceja';
import { Titular } from '../Titular';
import { ComparadorDiferido } from './negocios/ComparadorDiferido';
import './negocios.css';

/* (07) Tu negocio — antes y despues, rubro por rubro.

   La seccion "Case studies" de Reachwise pasada a Atlas: pildoras de
   rubros, una tarjeta con foto real que compara el antes (en gris) y el
   despues (a color, con la cifra y la grafica), cada uno con una escena
   propia del rubro, y debajo que construimos y cuanto cuesta. Pero sin
   casos inventados: son EJEMPLOS por rubro y la pildora de la tarjeta lo
   dice ("Tu restaurante · ejemplo"; ver negocios/escenarios.ts). La nota
   del pie que lo repetia la quito Harley. Lo real esta a un toque, en
   "Ver proyectos reales". */

export function Negocios() {
    return (
        <section id="negocios" className="h-neg" data-tono="oscuro" aria-labelledby="negocios-t">
            <div className="m-wrap">
                <Ceja n="07">Tu negocio</Ceja>
                <Titular id="negocios-t" className="m-h2 h-neg-h2" texto="Tu negocio, después de Atlas." destacar="después" />
                <p className="m-p h-neg-intro" data-rv>
                    Atlas es para cualquier rubro de negocio. Así podemos mejorar tus procesos, con tecnología que se adapta a ti.
                </p>
                <div className="h-neg-ver" data-rv>
                    <Boton href="/projects" variante="fantasma">
                        Ver proyectos reales
                    </Boton>
                </div>
            </div>

            <ComparadorDiferido />
        </section>
    );
}
