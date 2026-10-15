import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Cintas } from '@/components/movil/Cintas';
import { PROMESAS } from '@/components/movil/datos';
import { Revelador } from '@/components/movil/Revelador';
import { Servicios } from '@/components/movil/Servicios';
import { Titular } from '@/components/movil/Titular';
import { HeroCartel } from '@/components/movil/lab/HeroCartel';
import { Cifra, LabPie } from '@/components/movil/lab/LabPie';
import { ENLACES_LAB } from '../enlaces';
import './a.css';

/* DIRECCION A · "Manifiesto"
   La tipografia es la imagen. Negro puro, la palabra a todo el ancho dentro
   del marco de Figma que se mide en vivo, reglas y medidas de plano, y el
   rojo usado como tinta: la firma, la caja que barre y una sola fila llena. */

export const metadata: Metadata = {
    title: 'Laboratorio móvil · A — Manifiesto',
    robots: { index: false, follow: false },
};

export default function LabA() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={ENLACES_LAB} />
            <main id="m-contenido" className="lab-a">
                <HeroCartel />

                <Cintas className="a-cintas" />

                <section id="promesa" className="a-promesa" data-tono="oscuro" aria-labelledby="promesa-t">
                    <div className="m-wrap">
                        <Ceja sistema="pildoras" n="01">
                            Por qué Atlas
                        </Ceja>
                        <Titular id="promesa-t" className="m-h2 a-h2" texto="Rápido. Impecable. Puntual." destacar="Puntual." />
                        <ol className="a-spec">
                            {PROMESAS.map((p, k) => (
                                <li key={p.unidad} className={`a-spec-fila${k === 3 ? ' is-roja' : ''}`} data-rv>
                                    <span className="a-spec-n m-mono">{String(k + 1).padStart(2, '0')}</span>
                                    <p className="a-spec-cifra">
                                        <Cifra antes={p.antes} cuenta={p.cuenta} despues={p.despues} />
                                        <small>{p.unidad}</small>
                                    </p>
                                    <p className="a-spec-txt">{p.texto}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section id="servicios" className="a-servicios" data-tono="oscuro" aria-labelledby="servicios-t">
                    <div className="m-wrap">
                        <Ceja sistema="pildoras" n="02">
                            Servicios
                        </Ceja>
                        <Titular id="servicios-t" className="m-h2 a-h2" texto="Lo que construimos." destacar="construimos." />
                        <p className="m-p a-intro" data-rv>
                            Toca un servicio para verlo funcionar.
                        </p>
                        <Servicios variante="indice" tema="oscuro" />
                    </div>
                </section>

                <LabPie actual="a" />
            </main>
            <Revelador />
        </>
    );
}
