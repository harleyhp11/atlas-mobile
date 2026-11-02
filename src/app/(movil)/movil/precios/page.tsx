import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { Revelador } from '@/components/movil/Revelador';
import { IntroPrecios } from '@/components/movil/precios/IntroPrecios';
import { Planes } from '@/components/movil/precios/ListaPlanes';
import { DETALLES, MENU_PRECIOS, rango, soles } from '@/components/movil/precios/planes';
import { PieCompacto } from '@/components/movil/proyectos/PieCompacto';
// estilos .pry-pie del PieCompacto (igual que /projects y /nosotros)
import '@/components/movil/proyectos/proyectos.css';

/* /servicios en celular y tablet: la pagina de precios (el proxy reescribe
   hasta aqui por debajo de 1024 px; el escritorio sigue con la suya).

   Se llama Servicios (pedido de Harley): Nosotros · Servicios · Proyectos.
   Primero la entrada «Nuestros / Servicios» (la cinta en 3D que termina en
   grilla, con la flecha que baja a #planes). Debajo, los planes (Planes):
   que necesita tu negocio y los 4 planes en una pantalla, lo que incluye
   cada uno, que pasa si escribes hoy y la ayuda para elegir. Cada plan
   tiene su detalle en /servicios/[slug].

   Revelador hace correr los data-rv/data-in y los contadores del precio;
   sin el, todo apareceria de golpe a los 4 s (el respaldo de m-js). */

const desde = rango(DETALLES[0].plan);

export const metadata: Metadata = {
    title: 'Servicios',
    description: `Servicios y precios de Atlas en soles: tiendas online y menús digitales${desde ? ` desde ${soles(desde.desde)}` : ''}, landing pages, webs corporativas y software a medida. Precio cerrado por escrito.`,
    alternates: { canonical: '/servicios' },
};

export default function PreciosMovil() {
    return (
        <>
            <a className="m-salto" href="#m-contenido">
                Saltar al contenido
            </a>
            <Cabecera enlaces={MENU_PRECIOS} />
            <main id="m-contenido" className="pre">
                <IntroPrecios />
                <Planes />
            </main>
            <PieCompacto soloNav />
            <Revelador />
        </>
    );
}
