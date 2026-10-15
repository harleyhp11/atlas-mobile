import type { Metadata } from 'next';
import { LabPie } from '@/components/movil/lab/LabPie';
import { SimboloAtlas } from '@/components/movil/iconos';
import './indice.css';

/* Indice del laboratorio movil: las tres direcciones para elegir. Temporal,
   se borra junto con /mobile-lab cuando Harley escoja una. */

export const metadata: Metadata = {
    title: 'Laboratorio móvil',
    robots: { index: false, follow: false },
};

export default function LabIndice() {
    return (
        <main id="m-contenido" className="lab-indice">
            <div className="m-wrap">
                <SimboloAtlas className="lab-indice-logo" />
                <h1 className="m-h1">Tres direcciones para la home móvil.</h1>
                <p className="m-p">Mismo contenido, mismas reglas de marca. Cambia la idea. Ábrelas en el celular o a 390 px.</p>
            </div>
            <LabPie />
        </main>
    );
}
