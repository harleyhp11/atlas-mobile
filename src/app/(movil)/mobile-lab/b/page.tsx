import type { Metadata } from 'next';
import { Boton } from '@/components/movil/Boton';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Cintas } from '@/components/movil/Cintas';
import { PROMESAS, WHATSAPP } from '@/components/movil/datos';
import { Revelador } from '@/components/movil/Revelador';
import { Servicios } from '@/components/movil/Servicios';
import { Titular } from '@/components/movil/Titular';
import { HeroProducto } from '@/components/movil/lab/HeroProducto';
import { Cifra, LabPie } from '@/components/movil/lab/LabPie';
import { ENLACES_LAB } from '../enlaces';
import './b.css';

/* DIRECCION B · "Producto"
   Atlas como estudio de producto: capsula fija con "● Disponibles", selector
   de interfaz en el titular, bentos de tarjetas mixtas (foto B/N, tarjeta
   blanca, grafico con una sola barra roja, insignia 3D) y el resplandor rojo
   subiendo desde abajo. Los servicios son baldosas que se despliegan. */

export const metadata: Metadata = {
    title: 'Laboratorio móvil · B — Producto',
    robots: { index: false, follow: false },
};

const TONO_NUM = ['rojo', 'blanca', 'grafito', 'borde'];

export default function LabB() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={ENLACES_LAB} inicio="fija" estado />
            <main id="m-contenido" className="lab-b">
                <HeroProducto />

                <Cintas className="b-cintas" />

                <section id="promesa" className="b-promesa" data-tono="oscuro" aria-labelledby="promesa-t">
                    <div className="m-wrap">
                        <div className="b-cabeza">
                            <Ceja n="01">Por qué Atlas</Ceja>
                            <Titular id="promesa-t" className="m-h2 b-h2" texto="Rápido. Impecable. Puntual." destacar="Puntual." modo="marco" />
                            <div className="b-cabeza-lado" data-rv>
                                <p className="m-p">La fecha de lanzamiento queda fijada desde la primera reunión.</p>
                                <Boton href={WHATSAPP} variante="claro" chico externo>
                                    Cotizar
                                </Boton>
                            </div>
                        </div>
                        <ul className="b-numeros">
                            {PROMESAS.map((p, k) => (
                                <li key={p.unidad} className={`b-num b-num--${TONO_NUM[k]}`} data-rv style={{ '--d': `${k * 0.07}s` } as React.CSSProperties}>
                                    <span className="b-num-lbl m-mono">{p.cat}</span>
                                    <strong className="b-num-cifra">
                                        <Cifra antes={p.antes} cuenta={p.cuenta} despues={p.despues} />
                                        <small>{p.unidad}</small>
                                    </strong>
                                    <span className="b-num-txt">{p.texto}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section id="servicios" className="b-servicios" data-tono="oscuro" aria-labelledby="servicios-t">
                    <div className="m-wrap">
                        <Ceja n="02">Servicios</Ceja>
                        <Titular id="servicios-t" className="m-h2 b-h2" texto="Lo que construimos." destacar="construimos." />
                        <p className="m-p b-intro" data-rv>
                            Toca una tarjeta para verla funcionar.
                        </p>
                        <Servicios variante="mosaico" tema="oscuro" />
                    </div>
                </section>

                <LabPie actual="b" />
            </main>
            <Revelador />
        </>
    );
}
