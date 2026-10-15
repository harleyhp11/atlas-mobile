import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/* La home tiene dos arboles en la misma URL:
     · (sitio)/page.tsx — el escritorio de siempre, desde 1024 px.
     · (movil)/movil/page.tsx — la home de celular y tablet, por debajo.

   Aqui se decide cual responde "/" sin que el navegador vea otra URL (es un
   rewrite, no un redirect). Manda la cookie `atlas-vista`, que escribe el
   script del <head> de los dos layouts con el ancho REAL de la ventana. En
   la primera visita no hay cookie y se adivina por Client Hints y
   user-agent; si la apuesta falla —un iPad que se anuncia como Mac, una
   ventana de escritorio estrecha—, ese script corrige la cookie y recarga
   una sola vez (ver src/lib/vista.ts).

   Antes este archivo mandaba a TODO visitante de celular, en cualquier ruta,
   a la web del autor de la plantilla (arfazrllworkspace.vercel.app). */

const UA_MOVIL = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export function proxy(request: NextRequest) {
    const vista = request.cookies.get('atlas-vista')?.value;
    const esMovil = vista
        ? vista === 'movil'
        : request.headers.get('sec-ch-ua-mobile') === '?1' ||
          UA_MOVIL.test(request.headers.get('user-agent') || '');

    if (esMovil) {
        return NextResponse.rewrite(new URL('/movil', request.url));
    }
    return NextResponse.next();
}

// Solo la home tiene dos versiones; el resto de rutas ni pasa por aqui.
export const config = {
    matcher: '/',
};
