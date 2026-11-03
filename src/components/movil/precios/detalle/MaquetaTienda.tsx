import type { CSSProperties } from 'react';
import { WhatsApp } from '../../iconos';
import './maqueta-tienda.css';

/* «Por dentro» de Tiendas online y menús digitales: los DOS casos del plan
   en una sola maqueta, uno despues del otro, para que se note en que se
   diferencian (pedido de Harley). Bucle de 20 s; arriba, el selector cambia
   solo de «Menú digital» a «Tienda online»:

   Menú digital (0–50 %), una cevicheria de ejemplo:
     escanean el QR de la mesa → la carta con fotos y precios → agregan dos
     platos → «Pedir por WhatsApp» → te llega «Mesa 6: …» con el total.
   Tienda online (50–100 %), una tienda de carteras y zapatillas de ejemplo:
     abren tu enlace → la vitrina → eligen un producto y su talla → al
     carrito, con delivery → «Pedir por WhatsApp» → te llega el pedido.

   Lo que cambia entre uno y otro es justo lo que el cliente quiere
   entender: la mesa y la cocina frente al envio a casa; platos frente a
   productos con talla. Al costado, los pasos del caso que corre y, debajo,
   lo que el cliente hace hoy y le da problemas (la carta de papel, el PDF),
   tachado, con lo que cambia. Fotos
   reales (CC0, WordPress Photo Directory: dil1324, shirishpoudel07,
   ChrisEdwardsCE, maharjan2, Vishnu Chandra, binitagothe, Alina
   Kakshapati); los negocios, precios y mensajes son de EJEMPLO y la
   pildora «Maqueta de ejemplo» lo dice. Solo CSS con un reloj comun
   (--ciclo); `run` lo pausa. Con movimiento reducido queda la carta. */

const F = '/assets/movil/precios/tienda/';

const PLATOS = [
    { n: 'Ceviche clásico', d: 'Pescado del día, leche de tigre', p: 32, f: 'ceviche' },
    { n: 'Hamburguesa de la casa', d: 'Carne 180 g, queso, papas', p: 38, f: 'hamburguesa' },
    { n: 'Ensalada César', d: 'Lechuga, pollo, parmesano', p: 24, f: 'ensalada' },
    { n: 'Chicharrón de pescado', d: 'Con salsa criolla', p: 34, f: 'pescado' },
];

const PRODUCTOS = [
    { n: 'Zapatillas Runner', p: 189, f: 'zapatillas' },
    { n: 'Cartera acolchada', p: 149, f: 'cartera-blanca' },
    { n: 'Cartera croco', p: 159, f: 'cartera-rosa' },
    { n: 'Bolso urbano', p: 129, f: 'bolso' },
];

// lo que el cliente hace HOY y le da problemas, contra lo que cambia: una
// tarjeta por tramo, debajo de los pasos (pedido de Harley). Se lee de un
// vistazo: icono + dos palabras, tachado en rojo → icono + dos palabras.
// [CONFIRMAR copy con Harley]
type Icono = 'papel' | 'impresora' | 'pdf' | 'drive' | 'qr' | 'lapiz' | 'enlace' | 'carrito';
const ANTES: { antes: string; ia: Icono; ahora: string; ib: Icono }[] = [
    { antes: 'Carta de papel', ia: 'papel', ahora: 'Carta con QR', ib: 'qr' },
    { antes: 'Reimprimir', ia: 'impresora', ahora: 'Editas tú', ib: 'lapiz' },
    { antes: 'Catálogo PDF', ia: 'pdf', ahora: 'Tu enlace', ib: 'enlace' },
    { antes: 'Fotos en Drive', ia: 'drive', ahora: 'Pedido armado', ib: 'carrito' },
];

function Ico({ i }: { i: Icono }) {
    const t = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
    switch (i) {
        case 'papel':
            // una hoja arrugada, con su mancha
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M6 3h9l3 3v15l-3-1.5L12 21l-3-1.5L6 21z" />
                    <path d="M9 8h6M9 11h6M9 14h3" />
                    <circle cx="15" cy="16" r="1.6" fill="currentColor" stroke="none" />
                </svg>
            );
        case 'impresora':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M7 9V3h10v6M7 17H4v-7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7h-3" />
                    <path d="M7 14h10v7H7z" />
                </svg>
            );
        case 'pdf':
            return (
                <svg viewBox="0 0 24 24">
                    <path d="M6 2h9l4 4v16H6z" fill="#f4f1ea" />
                    <path d="M15 2v4h4" fill="#d8d5cd" />
                    <rect x="3" y="11" width="13" height="7" rx="1.5" fill="#e11d3a" />
                    <text x="9.5" y="16.6" textAnchor="middle" fontSize="5.2" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
                        PDF
                    </text>
                </svg>
            );
        case 'drive':
            // el triangulo de tres colores de una carpeta en la nube
            return (
                <svg viewBox="0 0 24 24">
                    <path d="M8.5 3h7l7 12h-7z" fill="#f5c451" />
                    <path d="M8.5 3 1.5 15l3.5 6 7-12z" fill="#2fa86b" />
                    <path d="M5 21h14l3.5-6h-14z" fill="#3b7bf0" />
                </svg>
            );
        case 'qr':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
                    <path d="M14 14h2v2h-2zM18 14h2M14 18h2v2M18 18h2v2" />
                </svg>
            );
        case 'lapiz':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M15 4l5 5L9 20H4v-5z" />
                    <path d="M13 6l5 5" />
                </svg>
            );
        case 'enlace':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
                    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
                </svg>
            );
        case 'carrito':
            return (
                <svg viewBox="0 0 24 24" {...t}>
                    <path d="M3 4h2l2.5 11h10L20 7H7" />
                    <circle cx="9" cy="19" r="1.4" />
                    <circle cx="17" cy="19" r="1.4" />
                </svg>
            );
    }
}

const PASOS_MENU = ['Escanean el QR', 'Eligen con fotos', 'Piden por WhatsApp', 'Te llega a cocina'];
const PASOS_TIENDA = ['Abren tu enlace', 'Eligen y su talla', 'Carrito y entrega', 'Te llega el pedido'];

// un QR de mentira, pero con cara de QR: 21 × 21 modulos con sus tres
// esquinas de posicion; el resto sale de un hash fijo (siempre igual)
const QR = (() => {
    const N = 21;
    const esquina = (x: number, y: number) => {
        for (const [ox, oy] of [
            [0, 0],
            [14, 0],
            [0, 14],
        ]) {
            const dx = x - ox;
            const dy = y - oy;
            if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
                const borde = dx === 0 || dx === 6 || dy === 0 || dy === 6;
                const centro = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
                return borde || centro ? 1 : 0;
            }
            if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) return 0;
        }
        return -1;
    };
    let d = '';
    for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
            const e = esquina(x, y);
            const on = e === -1 ? ((x * 7 + y * 13 + x * y * 3) % 5) < 2 : e === 1;
            if (on) d += `M${x} ${y}h1v1h-1z`;
        }
    return d;
})();

export function MaquetaTienda({ run }: { run: boolean }) {
    return (
        <div className="pre-mt" data-run={run ? '' : undefined}>
            {/* el selector: cambia solo de un caso al otro */}
            <div className="pre-mt-modo">
                <span className="pre-mt-modo-ind" />
                <span className="pre-mt-modo-a">Menú digital</span>
                <span className="pre-mt-modo-b">Tienda online</span>
            </div>

            <div className="pre-mt-fila">
                <div className="pre-mt-tel">
                    <span className="pre-mt-isla" />
                    <div className="pre-mt-pantalla">
                        {/* ================= MENÚ DIGITAL ================= */}
                        <div className="pre-mt-menu">
                            <div className="pre-mt-carta">
                                <div className="pre-mt-carta-cab">
                                    <b>Mar &amp; Brasa</b>
                                    <span>Mesa 6 · Carta</span>
                                </div>
                                <div className="pre-mt-chips">
                                    <i data-on="">Para compartir</i>
                                    <i>Fondos</i>
                                    <i>Bebidas</i>
                                </div>
                                <ul className="pre-mt-platos">
                                    {PLATOS.map((p, k) => (
                                        <li key={p.n}>
                                            <img src={`${F}${p.f}.webp`} alt="" loading="lazy" decoding="async" />
                                            <span>
                                                <b>{p.n}</b>
                                                <small>{p.d}</small>
                                                <em>S/ {p.p}</em>
                                            </span>
                                            <i className={k < 2 ? `pre-mt-mas pre-mt-mas--${k}` : 'pre-mt-mas'}>
                                                <span>+</span>
                                                <span>1</span>
                                            </i>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pre-mt-barra">
                                    <span className="pre-mt-barra-n">
                                        <span>1 plato · S/ 32</span>
                                        <span>2 platos · S/ 70</span>
                                    </span>
                                    <b>
                                        <WhatsApp />
                                        Pedir
                                    </b>
                                </div>
                            </div>

                            {/* la camara con el QR de la mesa, encima al empezar */}
                            <div className="pre-mt-cam">
                                <img src="/assets/movil/negocios/restaurante.webp" alt="" loading="lazy" decoding="async" />
                                <div className="pre-mt-tarjeta">
                                    <small>Mar &amp; Brasa</small>
                                    <span className="pre-mt-qr">
                                        <svg viewBox="0 0 21 21" shapeRendering="crispEdges">
                                            <path d={QR} />
                                        </svg>
                                        <i />
                                    </span>
                                    <b>Mesa 6</b>
                                    <small>Escanea y pide</small>
                                </div>
                                <span className="pre-mt-abrir">Abrir carta ›</span>
                            </div>

                            <div className="pre-mt-listo">
                                <span>✓</span>
                                <b>Pedido enviado</b>
                                <small>Mesa 6 · lo preparan en cocina</small>
                            </div>
                        </div>

                        {/* ================= TIENDA ONLINE ================= */}
                        <div className="pre-mt-tienda">
                            <div className="pre-mt-url">nativa.pe</div>
                            <div className="pre-mt-tienda-cab">
                                <b>NATIVA</b>
                                <span className="pre-mt-bolsa">
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M3 5h10l-1 9H4z M6 5a2 2 0 0 1 4 0" />
                                    </svg>
                                    <i>1</i>
                                </span>
                            </div>
                            <div className="pre-mt-banner">
                                <small>Nueva colección</small>
                                <b>Envíos a todo Lima</b>
                            </div>
                            <div className="pre-mt-vitrina">
                                {PRODUCTOS.map((p, k) => (
                                    <div key={p.n} className="pre-mt-prod" style={{ '--k': k } as CSSProperties}>
                                        <img src={`${F}${p.f}.webp`} alt="" loading="lazy" decoding="async" />
                                        <b>{p.n}</b>
                                        <span>S/ {p.p}</span>
                                    </div>
                                ))}
                            </div>

                            {/* la ficha del producto */}
                            <div className="pre-mt-ficha">
                                <div className="pre-mt-ficha-img">
                                    <img src={`${F}zapatillas.webp`} alt="" loading="lazy" decoding="async" />
                                    <span className="pre-mt-ficha-atras">‹</span>
                                    <span className="pre-mt-bolsa pre-mt-bolsa--ficha">
                                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M3 5h10l-1 9H4z M6 5a2 2 0 0 1 4 0" />
                                        </svg>
                                        <i>1</i>
                                    </span>
                                </div>
                                <div className="pre-mt-ficha-in">
                                    <b>Zapatillas Runner</b>
                                    <span className="pre-mt-ficha-p">S/ 189</span>
                                    <small>Talla</small>
                                    <span className="pre-mt-tallas">
                                        <i>38</i>
                                        <i>39</i>
                                        <i className="pre-mt-talla-40">40</i>
                                        <i>41</i>
                                    </span>
                                    <span className="pre-mt-agregar">
                                        <span>Agregar al carrito</span>
                                        <span>✓ Agregado</span>
                                    </span>
                                </div>
                            </div>

                            {/* el carrito, que sube desde abajo */}
                            <div className="pre-mt-carrito">
                                <b>Tu carrito</b>
                                <div className="pre-mt-item">
                                    <img src={`${F}zapatillas.webp`} alt="" loading="lazy" decoding="async" />
                                    <span>
                                        <b>Zapatillas Runner</b>
                                        <small>Talla 40 · 1 par</small>
                                    </span>
                                    <em>S/ 189</em>
                                </div>
                                <div className="pre-mt-entrega">
                                    <span>Entrega</span>
                                    <b>Delivery · Surco</b>
                                </div>
                                <div className="pre-mt-total">
                                    <span>Total</span>
                                    <b>S/ 189</b>
                                </div>
                                <span className="pre-mt-pedir">
                                    <WhatsApp />
                                    Pedir por WhatsApp
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="pre-mt-dedo" />
                </div>

                <div className="pre-mt-lado">
                    <ol className="pre-mt-pasos pre-mt-pasos--a">
                        {PASOS_MENU.map((p, k) => (
                            <li key={p}>
                                <i>{String(k + 1).padStart(2, '0')}</i>
                                {p}
                            </li>
                        ))}
                    </ol>
                    <ol className="pre-mt-pasos pre-mt-pasos--b">
                        {PASOS_TIENDA.map((p, k) => (
                            <li key={p}>
                                <i>{String(k + 1).padStart(2, '0')}</i>
                                {p}
                            </li>
                        ))}
                    </ol>

                    {/* el problema de hoy, tachado, y lo que cambia */}
                    {ANTES.map((a, k) => (
                        <div key={a.antes} className={`pre-mt-antes pre-mt-antes--${k}`}>
                            <span className="pre-mt-vs is-no">
                                <span className="pre-mt-vs-ic">
                                    <Ico i={a.ia} />
                                    <i>✕</i>
                                </span>
                                <s>{a.antes}</s>
                            </span>
                            <span className="pre-mt-vs-flecha">↓</span>
                            <span className="pre-mt-vs is-si">
                                <span className="pre-mt-vs-ic">
                                    <Ico i={a.ib} />
                                    <i>✓</i>
                                </span>
                                <b>{a.ahora}</b>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* lo que te llega a ti, uno por caso */}
            <div className="pre-mt-wsp pre-mt-wsp--a">
                <span className="pre-mt-wsp-cab">
                    <WhatsApp />
                    Nuevo pedido · Mesa 6
                </span>
                <span className="pre-mt-wsp-msg">
                    1 Ceviche clásico
                    <br />1 Hamburguesa de la casa
                    <b>Total: S/ 70</b>
                </span>
            </div>
            <div className="pre-mt-wsp pre-mt-wsp--b">
                <span className="pre-mt-wsp-cab">
                    <WhatsApp />
                    Nuevo pedido · nativa.pe
                </span>
                <span className="pre-mt-wsp-msg">
                    Zapatillas Runner, talla 40
                    <br />
                    Delivery a Surco
                    <b>Total: S/ 189</b>
                </span>
            </div>
        </div>
    );
}
