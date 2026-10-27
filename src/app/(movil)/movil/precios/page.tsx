import type { Metadata } from 'next';
import { Cabecera } from '@/components/movil/Cabecera';
import { MENU_PROYECTOS } from '@/components/movil/proyectos/proyectos';

/* /servicios en celular y tablet: la pagina de precios (el proxy reescribe
   hasta aqui por debajo de 1024 px; el escritorio sigue con la suya).

   Por construir: por ahora es solo la cabecera sobre negro, para que el
   "Precios" del menu ya lleve a su pagina. */

export const metadata: Metadata = {
    title: 'Precios',
    alternates: { canonical: '/servicios' },
};

export default function PreciosMovil() {
    return (
        <>
            <Cabecera enlaces={MENU_PROYECTOS} />
            <main id="m-contenido" style={{ minHeight: '100svh', background: 'var(--negro)' }}>
                <h1 className="sr-only">Precios</h1>
            </main>
        </>
    );
}
