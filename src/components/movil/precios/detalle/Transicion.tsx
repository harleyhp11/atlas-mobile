/* Afina la transicion entre documentos (lista ↔ detalle, detalle ↔ detalle).

   El nombre de cada plan lleva view-transition-name (pre-plan-<slug>) en el
   h1 del detalle y en las tarjetas de «¿Buscabas otra cosa?», y la perilla
   del selector lleva pre-perilla. Si los dos extremos de un mismo nombre
   estan en pantalla, el nombre viaja de uno a otro: es lo que se busca.
   Pero si uno de los dos esta FUERA de pantalla (la tarjeta de abajo de la
   pagina nueva, el h1 de una pagina ya bajada), el navegador igual los une
   y la pieza cruza la pantalla volando de un extremo al otro.

   Este script, justo antes de la foto de salida (pageswap) y de la de
   llegada (pagereveal), apaga los nombres de lo que no se ve. Lo hace con
   una hoja adoptada (adoptedStyleSheets) y no tocando los elementos: React
   aun no hidrato cuando corre pagereveal y cambiarle un atributo daria un
   error de hidratacion.

   Al llegar con transicion marca <html> con .pre-vt: el h1 ya viaja desde
   la tarjeta y su entrada propia (sube y aparece) sobraria. <html> lleva
   suppressHydrationWarning en el layout, como con .m-js.

   Va en linea y al principio del <body>: pagereveal llega antes del primer
   pintado, mucho antes de que cargue el JS de React. Sin soporte (sin
   pageswap/pagereveal o sin hojas adoptadas) no hace nada. */

const SCRIPT = `(function(){try{var h=new CSSStyleSheet();document.adoptedStyleSheets=document.adoptedStyleSheets.concat(h);var f=function(e){if(!e.viewTransition)return;var a=innerHeight,s=[];document.querySelectorAll('[style*="view-transition-name"]').forEach(function(el){var r=el.getBoundingClientRect(),m=/view-transition-name:\\s*([\\w-]+)/.exec(el.getAttribute('style')||'');if(m&&(r.bottom<0||r.top>a))s.push('[style*="'+m[1]+'"]')});h.replaceSync(s.length?s.join(',')+'{view-transition-name:none!important}':'');if(e.type==='pagereveal')document.documentElement.classList.add('pre-vt')};addEventListener('pageswap',f);addEventListener('pagereveal',f)}catch(e){}})();`;

export function Transicion() {
    return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
