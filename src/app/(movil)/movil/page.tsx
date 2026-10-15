import type { Metadata } from 'next';
import LabIndice from '../mobile-lab/page';

/* La home de celular y tablet. El proxy reescribe "/" hasta aqui cuando la
   ventana mide menos de 1024 px (ver src/proxy.ts).

   Mientras Harley elige direccion, muestra el indice del laboratorio. */

export const metadata: Metadata = {
    alternates: { canonical: '/' },
};

export default LabIndice;
