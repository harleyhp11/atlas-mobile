import type { Metadata, Viewport } from 'next';
import { Alex_Brush, Funnel_Display, Funnel_Sans, Geist_Mono } from 'next/font/google';
import { DESCRIPCION, DOMINIO, ICONOS, IMAGEN_OG, TITULO } from '@/lib/metadatos';
import { scriptVista } from '@/lib/vista';

import './movil.css';

/* Layout raiz de la home de celular y tablet (< 1024 px).

   Es un layout RAIZ aparte, no uno anidado en el del escritorio: asi aqui no
   llega nada de alla —ni sus siete fuentes, ni Tailwind, ni Lenis, ni el
   preloader, ni ClickSpark, ni el chatbot—. Cuatro familias y punto:
     · Funnel Display — titulares;
     · Funnel Sans — texto;
     · Geist Mono — etiquetas, chips y contadores;
     · Alex Brush — solo la firma roja. */

const display = Funnel_Display({ subsets: ['latin'], variable: '--font-funnel-display', display: 'swap' });
const sans = Funnel_Sans({ subsets: ['latin'], variable: '--font-funnel-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const firma = Alex_Brush({ weight: '400', subsets: ['latin'], variable: '--font-alex-brush', display: 'swap' });

export const metadata: Metadata = {
    title: {
        default: TITULO,
        template: '%s | Atlas',
    },
    description: DESCRIPCION,
    metadataBase: new URL(DOMINIO),
    openGraph: {
        type: 'website',
        locale: 'es_PE',
        url: DOMINIO,
        title: TITULO,
        description: DESCRIPCION,
        siteName: 'Atlas',
        images: [IMAGEN_OG],
    },
    twitter: {
        card: 'summary_large_image',
        title: TITULO,
        description: DESCRIPCION,
        images: [IMAGEN_OG.url],
    },
    icons: ICONOS,
};

export const viewport: Viewport = {
    themeColor: '#000000',
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1,
};

/* `m-js` activa los estados iniciales de las animaciones de entrada. Lo pone
   este script antes de pintar; si en 4 s el JS de la pagina no arranco
   (red caida, error), lo quita y todo queda visible y quieto. */
const SCRIPT_JS = `(function(){var d=document.documentElement;d.classList.add('m-js');setTimeout(function(){if(!window.__mListo)d.classList.remove('m-js')},4000)})();`;

export default function MovilLayout({ children }: { children: React.ReactNode }) {
    return (
        // Las variables de fuente van en <html>, no en <body>: movil.css arma
        // --f-display y compañia en :root a partir de ellas, y una var() que
        // apunta a algo que en :root no existe invalida la propiedad entera.
        <html
            lang="es"
            data-scroll-behavior="smooth"
            className={`${display.variable} ${sans.variable} ${mono.variable} ${firma.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: scriptVista('movil') + SCRIPT_JS }} />
            </head>
            <body>{children}</body>
        </html>
    );
}
