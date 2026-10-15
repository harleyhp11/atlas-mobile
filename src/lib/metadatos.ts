import type { Metadata } from 'next';

/* Lo que comparten los dos layouts raiz, (sitio) y (movil): titulo,
   descripcion, iconos y la imagen para compartir el enlace.

   El dominio sigue siendo un marcador: tiene que apuntar al dominio real de
   Atlas antes de publicar, porque de el cuelgan las URLs absolutas de las
   imagenes al compartir en WhatsApp. */

export const TITULO = 'Atlas — Estudio digital en Lima';
export const DESCRIPCION =
    'Diseñamos y desarrollamos webs, apps, software a medida y automatizaciones con IA para negocios que quieren crecer.';
// TODO: cambiar por el dominio real de Atlas antes de publicar.
export const DOMINIO = 'https://atlas-estudio.com';

export const ICONOS: Metadata['icons'] = {
    icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/brand/atlas-icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/brand/atlas-apple-touch.png',
};

export const IMAGEN_OG = {
    url: '/brand/og-atlas.png',
    width: 1200,
    height: 630,
    alt: 'Atlas — webs, apps, software e IA para negocios que quieren crecer',
};
