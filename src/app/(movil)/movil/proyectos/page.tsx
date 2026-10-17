import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { Ceja } from '@/components/movil/Ceja';
import { Cintas } from '@/components/movil/Cintas';
import { Revelador } from '@/components/movil/Revelador';
import { Titular } from '@/components/movil/Titular';
import { Disenos } from '@/components/movil/proyectos/Disenos';
import { Indice } from '@/components/movil/proyectos/Indice';
import { Lista } from '@/components/movil/proyectos/Lista';
import { PieCompacto } from '@/components/movil/proyectos/PieCompacto';
import { MENU_PROYECTOS } from '@/components/movil/proyectos/proyectos';
import '@/components/movil/proyectos/proyectos.css';

/* /projects en celular y tablet (el proxy reescribe hasta aqui por debajo
   de 1024 px; el escritorio sigue con su pagina).

   La de escritorio, vista en el celular, era su version encogida: hero con
   parallax de fotos de la plantilla, contadores, un "archivo" de 26
   proyectos (la mayoria del autor de la plantilla) con buscador, filtros y
   vista de lista o grilla, y su cierre. Aqui queda la misma idea con el
   sistema de la home movil y solo el trabajo de Atlas:
     · hero tipografico con el indice de los cinco;
     · las cintas cruzando hacia una isla clara;
     · la lista, con filtro por servicio (el buscador sobra con cinco) y
       tarjetas con la captura en un navegador que pasa de gris a color;
     · sobre negro, el reel curvo de diseños de la galeria (Figma × Framer);
     · un pie propio, mas corto que el de la home. */

export const metadata: Metadata = {
    title: 'Proyectos',
    description: 'Webs, apps, software e IA hechos por Atlas: cinco proyectos reales en cinco rubros, por dentro.',
    alternates: { canonical: '/projects' },
};

export default function ProyectosMovil() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={MENU_PROYECTOS} />
            <main id="m-contenido" className="pry">
                <section className="pry-hero" data-tono="oscuro" aria-labelledby="pry-t">
                    <div className="m-wrap">
                        <Ceja>Proyectos</Ceja>
                        <Titular as="h1" id="pry-t" className="m-h1 pry-h1" texto="Nuestros proyectos, por dentro." destacar="dentro." />
                        <p className="m-p pry-intro" data-rv>
                            Cinco proyectos reales en cinco rubros: webs, apps, software e IA. Entra a cada uno y mira qué construimos, cómo y con qué.
                        </p>
                        <Indice />
                    </div>
                </section>

                <Cintas className="pry-cintas" />

                <Lista />

                <Disenos />
            </main>
            <PieCompacto />
            <Revelador />
        </>
    );
}
