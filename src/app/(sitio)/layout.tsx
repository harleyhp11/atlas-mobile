import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display, Alex_Brush, Bricolage_Grotesque, Anton, Space_Mono } from 'next/font/google';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider, I18nProvider, SmoothScrollProvider } from '@/providers';
import { DESCRIPCION, DOMINIO, ICONOS, IMAGEN_OG, TITULO } from '@/lib/metadatos';
import { scriptVista } from '@/lib/vista';

import '@/styles/globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

// Titulares de las cards de planes. Inter Black cumple, pero no tiene
// caracter; esta grotesca de display si, y contrasta con la Playfair
// italica de la segunda linea sin pelearse con ella.
const display = Bricolage_Grotesque({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
});

// Condensada pesada para el titular del puente al portafolio. Una sola
// weight (400, que ya pinta negra), asi que el coste de carga es minimo.
const condensed = Anton({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-condensed',
    display: 'swap',
});

// La italica va declarada porque se usa de verdad (la cita del fundador en
// la tarjeta de contacto). Sin este `style` el navegador la sintetiza
// inclinando la romana, y en una serif de alto contraste como esta el
// resultado se nota falso: los remates quedan torcidos y el eje del trazo no
// cambia, que es justo lo que distingue a una italica real.
const playfair = Playfair_Display({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-playfair',
    display: 'swap',
});

// Mono con caracter para el titular de la tarjeta del stack. No es la
// JetBrains que ya carga la pagina: esa es una mono de editor, pensada para
// leer codigo a 13px sin cansar, y en grande se queda sosa. Space Mono viene
// de la tradicion de la maquina de escribir —remates marcados, ojo abierto,
// formas raras en la 'a' y la 'g'— y es justo lo que aguanta a 48px sin
// adornos. Solo dos pesos, que son los unicos que se usan.
const spaceMono = Space_Mono({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-space-mono',
    display: 'swap',
});

const signature = Alex_Brush({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-signature',
    display: 'swap',
});

/* Esto es lo primero que ve Google y lo que sale al compartir el enlace en
   WhatsApp. Venia entero en ingles y con los datos de la plantilla, o sea
   que el sitio se anunciaba como el portfolio de otra persona. Titulo, descripcion, iconos e imagen para compartir viven
   en src/lib/metadatos.ts: los comparte con el layout de la home movil. */
export const metadata: Metadata = {
    title: {
        default: TITULO,
        template: '%s | Atlas',
    },
    description: DESCRIPCION,
    keywords: ['diseño web', 'desarrollo web', 'landing page', 'tienda online', 'software a medida', 'apps', 'inteligencia artificial', 'Lima', 'Perú'],
    authors: [{ name: 'Atlas' }],
    creator: 'Atlas',
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
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: ICONOS,
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    ],
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
};

import { ThemeAwareClickSpark } from '@/components/ui/ThemeAwareClickSpark';
import { ConditionalNavigation } from '@/components/layout/ConditionalNavigation';
import { ArcPreloaderWrapper } from '@/components/layout/ArcPreloaderWrapper';
import { ChatBot } from '@/components/layout/ChatBot';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                {/* Por debajo de 1024 px la home es otra (ver src/proxy.ts). */}
                <script dangerouslySetInnerHTML={{ __html: scriptVista('escritorio') }} />
            </head>
            <body className={`${inter.variable} ${jetbrainsMono.variable} ${display.variable} ${condensed.variable} ${playfair.variable} ${signature.variable} ${spaceMono.variable} font-sans relative`}>
                <ThemeProvider>
                    <I18nProvider locale={locale} messages={messages}>
                        <SmoothScrollProvider>
                            <ThemeAwareClickSpark>
                                <ArcPreloaderWrapper>
                                    <ConditionalNavigation>
                                        {children}
                                    </ConditionalNavigation>
                                </ArcPreloaderWrapper>
                                <ChatBot headless />
                            </ThemeAwareClickSpark>
                        </SmoothScrollProvider>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
