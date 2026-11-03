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

// lo que el cliente hace HOY y le da problemas: una tarjeta por tramo,
// debajo de los pasos (pedido de Harley). [CONFIRMAR copy con Harley]
const ANTES = [
    { antes: 'Cartas de papel que se manchan y se rompen', ahora: 'Tu carta, siempre limpia en el celular' },
    { antes: 'Reimprimir cada vez que sube un precio', ahora: 'Cambias el precio tú, en un minuto' },
    { antes: 'Catálogos en PDF que nadie abre', ahora: 'Tu tienda en un enlace' },
    { antes: 'Fotos y precios por chat, uno por uno', ahora: 'Eligen solos y te llega el pedido armado' },
];

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
                            <small>✕ Hoy</small>
                            <s>{a.antes}</s>
                            <span>{a.ahora}</span>
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
