import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { IntroPrecios } from '@/components/movil/precios/IntroPrecios';
import { MENU_PROYECTOS } from '@/components/movil/proyectos/proyectos';

/* /servicios en celular y tablet: la pagina de precios (el proxy reescribe
   hasta aqui por debajo de 1024 px; el escritorio sigue con la suya).

   Primero la entrada «Nuestros / Precios» (la cinta en 3D que termina en
   grilla). Debajo iran las tarjetas de precios: por construir, Harley aun
   esta definiendo su diseño. */

export const metadata: Metadata = {
    title: 'Precios',
    alternates: { canonical: '/servicios' },
};

export default function PreciosMovil() {
    return (
        <>
            <Cabecera enlaces={MENU_PROYECTOS} />
            <main id="m-contenido" className="pre">
                <IntroPrecios />
                {/* aqui van las tarjetas de precios (pendiente) */}
                <section id="planes" className="pre-planes" aria-label="Planes" />
            </main>
        </>
    );
}
