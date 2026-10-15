import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QuantumError } from '@/components/ui/QuantumError';
import { ICONOS } from '@/lib/metadatos';

import '@/styles/globals.css';

/* 404 de las URLs que no existen. Con dos layouts raiz —(sitio) y (movil)—
   no hay un layout comun donde componerlo, asi que esta pagina trae lo suyo:
   los estilos globales, la Inter y el tema oscuro fijo (no hay next-themes
   que lo ponga). Por fuera se ve igual que el 404 de dentro del sitio. */

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
    title: 'Página no encontrada | Atlas',
    description: 'La página que buscas no existe o cambió de dirección.',
    icons: ICONOS,
};

export default function GlobalNotFound() {
    return (
        <html lang="es" className="dark">
            <body className={`${inter.variable} font-sans`}>
                <QuantumError type="404" />
            </body>
        </html>
    );
}
