"use client";

/* ─────────────────────────────────────────────────────────────────────────────
   EL ANILLO: UN CILINDRO 3D DE VERDAD, NO UN CARRUSEL PLANO

   37 tarjetas sobre un cilindro cuya CÁMARA ESTÁ EN EL CENTRO. Esa es toda la
   diferencia: cada tarjeta queda tangente a la superficie y mira exactamente a
   la cámara. Lo que se ve —lados verticales con el canto superior inclinado— es
   PERSPECTIVA, no rotación.

   Geometría, literal del spec:
     R = 891 · n = 37 · paso = 360/37 = 9.7297° · corte 42° · giro 1.9°/s
     tarjeta 130x300 · plano de tarjeta y=616 · horizonte y=918

   Por tarjeta, con una fase que corre (arranca en -2):
     a = ((i·paso + fase) % 360 + 540) % 360 - 180
     si |a| > 42 → oculta (si no, la mitad de atrás se amontona en el punto de
     fuga al dar la vuelta)
     transform = translate3d(R·sin a, 0, R·(1-cos a)) rotateY(-a)
     filter    = brightness(0.84 + 0.5·(1/cos a − 1))

   El bucle escribe transforms DIRECTAMENTE en el DOM: 37 nodos re-renderizando
   por React a 60fps sería absurdo.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";

/* RADIO Y LIENZO — AJUSTADOS SOBRE LA REFERENCIA, NO A OJO.

   Me equivoqué al bajar R a 700 "para apiñarlas": en la referencia las
   tarjetas NO se solapan, van separadas. Detecté los cantos de cinco
   tarjetas seguidas en la captura (1738px de ancho) y resolví
   x(a) = X0 + R·tan(a) con el paso del spec:

       centros medidos   606.5  833.0  1056.0  1291.5  1553.5
       ajuste            R = 1311px · fuga x = 872 · error rms 0.28px

   Con el ancho de tarjeta desmagnificado (w·cos a ≈ 196px) sale
   R/ancho = 6.69; sobre nuestra tarjeta de 130 da R ≈ 870. El spec dice
   891 (ratio 6.85). Coinciden dentro del error de medir cantos
   redondeados, así que VUELVE EL 891 del spec.

   OJO, lo que no entendí antes: la inclinación NO depende de R. Como
   `perspective` vale exactamente R, la magnificación sale 1/cos a y el giro
   es −a — las dos independientes de R. R solo abre o cierra el reparto
   horizontal. Bajarlo no curvó nada: solo pegó las tarjetas. */
const R = 891;

/* EL LIENZO DEL SPEC, 1172 — no el 1130 que puse antes.

   1130 era el ancho del anillo medido en un instante, y ese ancho OSCILA:
   según la fase, la tarjeta más externa visible va entre 32.3° y 42°, con lo
   que el conjunto respira entre ~1038 y ~1435. Escalar contra una foto fija
   de algo que respira descuadra la escala todo el rato.

   1172 es fijo y reproduce la referencia: 1738/1172 = 1.483 predice tarjetas
   de 193px (medí 196) y R de 1321 (ajusté 1311). Las tarjetas del canto se
   salen de pantalla, igual que ahí. */
const ANCHO_ANILLO = 1172;
const MEDIO = ANCHO_ANILLO / 2;

/* HOLGURA ARRIBA — EL "LÍMITE INVISIBLE" QUE CORTABA LAS TARJETAS.

   El canto superior de una tarjeta se proyecta en 452 − 452/cos a, o sea SUBE
   según se aleja del centro. Con el lienzo empezando en 0 y `overflow:hidden`,
   todo lo que subía por encima se rebanaba, y como se rebanaba a la misma
   altura en todas, salía una línea recta: el límite invisible.

       ángulo    sube    ¿se veía?
         0°        0      entera
        19°       32      -32px
        31°       75      -75px
      36.8°      112     -112px  ← la última que llega a pintarse
        42°      156     -156px   (ya salió por el lado, nunca se ve)

   No hace falta cubrir hasta el corte de 42°: pasados 36.8° la tarjeta ya se
   fue por el canto del lienzo y no pinta nada, así que reservarle sitio solo
   dejaría aire muerto bajo el CTA. 118 cubre hasta 37.3°, con holgura de 2°.

   Se baja TODO 118 —tarjetas y horizonte—, con lo que la proyección se
   desplaza 118 exactos: la forma no cambia, solo deja de salirse por arriba. */
const HOLGURA = 118;
const ALTO_LIENZO = 422;   // 118 de holgura + 300 de tarjeta + 4 de margen

const N = 37;
const PASO = 360 / N;
const CORTE = 42;
const VELOCIDAD = 1.9;

const BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

type Shot = { url: string; v: string; t?: string };

const SHOTS: Shot[] = [
    { url: BASE + "hf_20260912_110422_0fc34393-7417-41b0-a200-43fd2b08a37f.png", v: "pay" },
    { url: BASE + "hf_20260912_110423_ba46182e-43bc-43a8-9007-a8234acf442d.png", v: "launch" },
    { url: BASE + "hf_20260912_110423_06cfbb84-6f96-48f6-be45-e03516510e48.png", v: "shop" },
    { url: BASE + "hf_20260912_110422_634bf390-f171-4f5d-9151-0d2c86c26e7b.png", v: "brand" },
    { url: BASE + "hf_20260912_110423_0cfe058d-db0e-4ee6-9708-7a297cc11a7a.png", v: "frete" },
    { url: BASE + "hf_20260912_110422_a90a35d7-ae20-4ce3-86d7-e3f6f658a6bc.png", v: "plain", t: "RITUAL REGIME" },
    { url: BASE + "hf_20260912_110422_de267714-7647-4d9a-a0a9-55325683b2a2.png", v: "power" },
    { url: BASE + "hf_20260912_110504_80eda275-e380-4ccb-b51f-332f25337079.png", v: "plain", t: "JUST ARRIVED" },
    { url: BASE + "hf_20260912_110422_d6ba08f5-4ff8-4f09-8abe-93ee6bb0e34e.png", v: "off" },
    { url: BASE + "hf_20260912_110423_87ec2115-3157-47ef-ac98-973f8ad6532d.png", v: "plain", t: "STREETWEAR" },
];

/* Si una imagen falla, la tarjeta se marca y el degradado de reserva de .ph
   queda a la vista en vez del icono de imagen rota. */
const alFallar = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.closest(".gp-card")?.classList.add("broken");
};

function Im({ src }: { src: string }) {
    return <img alt="" src={src} onError={alFallar} draggable={false} />;
}

function Creativa({ d }: { d: Shot }) {
    const im = <Im src={d.url} />;

    switch (d.v) {
        case "pay":
            return (
                <>
                    <div className="fill" style={{ background: "#efedea" }} />
                    <div className="ph" style={{ top: 112, bottom: 0 }}>{im}</div>
                    <svg className="ph" style={{ top: 118, bottom: 0 }} viewBox="0 0 130 182" preserveAspectRatio="none">
                        <g stroke="#e5202f" strokeWidth="8" fill="none" opacity=".92" strokeLinecap="square">
                            <path d="M2 42h30M14 30v96M4 100l26-16" />
                            <path d="M96 34v58M120 34v58M96 92q12 15 24 0" />
                            <path d="M92 108l14 34M126 108l-12 34" />
                        </g>
                    </svg>
                    <div className="cv" style={{ top: 20, textAlign: "right", fontSize: 3.4, letterSpacing: ".15em", color: "#8d9298" }}>
                        METHOD OF CHECKOUTS
                    </div>
                    <div className="cv t-big" style={{ top: 32, fontSize: 14, color: "#16171b" }}>Checkouts</div>
                    <div className="cv t-big" style={{ top: 47, fontSize: 14, color: "#e5202f" }}>Quick n simple</div>
                    <div className="cv" style={{ top: 76, fontSize: 5.2, fontWeight: 700, color: "#16171b", lineHeight: 1.7 }}>
                        <div><b className="dot" />SPEND VIA <b>ACH</b></div>
                        <div style={{ marginTop: 8 }}>
                            <b className="dot sq" />OR AT MAX <b>12X</b><br />
                            <span style={{ marginLeft: 11 }}>ON CREDIT</span>
                        </div>
                    </div>
                </>
            );

        case "launch":
            return (
                <>
                    <div className="fill" style={{ background: "linear-gradient(168deg,#f9d9e5,#f3bdd2 55%,#e8a3c0)" }} />
                    <div className="ph" style={{ top: 100, bottom: 0 }}>
                        {im}
                        <div className="fill" style={{ background: "linear-gradient(180deg,rgba(249,217,229,.97),rgba(249,217,229,0) 30%)" }} />
                    </div>
                    <div className="cv t-serif" style={{ top: 36, fontSize: 17, color: "#b03a63" }}>COLLECTION</div>
                    <div className="cv t-serif" style={{ top: 55, fontSize: 17, color: "#b03a63" }}>EXCLUSIVE!</div>
                </>
            );

        case "shop":
            return (
                <>
                    <div className="fill" style={{ background: "#fff" }} />
                    <div className="ph" style={{ top: 0, height: 148 }}>{im}</div>
                    <div className="cv" style={{ top: 158, fontSize: 5.4, fontWeight: 700, letterSpacing: ".09em", color: "#16171b" }}>
                        REGIME AT DAWNS
                    </div>
                    <div className="cv" style={{ top: 168, fontSize: 4.2, color: "#7b8087" }}>Cleanse · Serum · Moisturize</div>
                    <div style={{ position: "absolute", left: 10, top: 180, padding: "4px 11px", borderRadius: 20, background: "#16171b", fontSize: 4.6, fontWeight: 600, color: "#fff", letterSpacing: ".05em" }}>
                        Acquire today
                    </div>
                </>
            );

        case "brand":
            return (
                <>
                    <div className="fill" style={{ background: "linear-gradient(180deg,#0a2a4a,#0d3a63 50%,#08192b)" }} />
                    <div className="ph" style={{ top: 92, bottom: 0 }}>
                        {im}
                        <div className="fill" style={{ background: "linear-gradient(180deg,rgba(10,42,74,.98),rgba(10,42,74,0) 36%)" }} />
                    </div>
                    <div className="cv" style={{ top: 16, fontSize: 4.2, lineHeight: 1.7, color: "rgba(255,255,255,.82)", width: 74 }}>
                        Formulas light, assessed hypoallergenically n designed with a new ritual — revealing since a starting moment.
                    </div>
                    <div style={{ position: "absolute", right: 10, top: 16, fontSize: 5.4, fontWeight: 600, color: "#fff", opacity: .92 }}>✳ Vertex</div>
                </>
            );

        case "frete":
            return (
                <>
                    <div className="fill" style={{ background: "linear-gradient(158deg,#4a0c80 0%,#7a16a6 40%,#a81fc6 66%,#5c0e90 100%)" }} />
                    <div className="ph" style={{ top: 140, bottom: 0, opacity: .45, mixBlendMode: "screen" }}>{im}</div>
                    <div className="fill" style={{ background: "radial-gradient(44% 16% at 50% 62%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%)" }} />
                    <div style={{ position: "absolute", left: -6, right: -6, top: 44, height: 13, background: "#ff2d8a", transform: "rotate(-2.6deg)", boxShadow: "0 4px 12px rgba(255,45,138,.5)" }} />
                    <div style={{ position: "absolute", left: 0, right: 0, top: 45.5, transform: "rotate(-2.6deg)", textAlign: "center", fontSize: 5.6, fontWeight: 700, letterSpacing: ".05em", color: "#fff" }}>
                        OBTAIN AT HOME AND
                    </div>
                    <div className="cv t-big" style={{ top: 64, fontSize: 24, color: "#fff", textShadow: "0 3px 0 rgba(84,9,124,.6)" }}>Ships</div>
                    <div className="cv t-big" style={{ top: 87, fontSize: 24, color: "#fff", textShadow: "0 3px 0 rgba(84,9,124,.6)" }}>Gratis</div>
                    <div className="cv t-big" style={{ top: 113, fontSize: 19, color: "#fff" }}>+</div>
                </>
            );

        case "power":
            return (
                <>
                    <div className="ph phf">{im}</div>
                    <div className="fill" style={{ background: "linear-gradient(180deg,rgba(6,5,10,0) 34%,rgba(6,5,10,.55) 52%,rgba(6,5,10,.92) 72%)" }} />
                    <div className="cv t-serif" style={{ top: 132, fontSize: 16, color: "#fff" }}>A POWER</div>
                    <div className="cv t-serif" style={{ top: 150, fontSize: 16, color: "#fff" }}>FEMININE</div>
                    <div className="cv" style={{ top: 171, fontSize: 4.4, letterSpacing: ".07em", color: "rgba(255,255,255,.85)" }}>
                        is echoing in all we acquire
                    </div>
                </>
            );

        case "off":
            return (
                <>
                    <div className="ph phf">{im}</div>
                    <div className="fill" style={{ background: "linear-gradient(180deg,rgba(3,9,20,0) 30%,rgba(3,9,20,.6) 48%,rgba(3,9,20,.95) 70%)" }} />
                    <div className="cv t-big" style={{ top: 126, fontSize: 10, color: "#fff", opacity: .9 }}>On sale · til</div>
                    <div className="cv t-big" style={{ top: 139, fontSize: 22, color: "#3fe3ff", textShadow: "0 0 16px rgba(63,227,255,.5)" }}>50% off</div>
                </>
            );

        default:
            return (
                <>
                    <div className="ph phf">{im}</div>
                    <div className="fill" style={{ background: "linear-gradient(180deg,rgba(4,8,16,0) 38%,rgba(4,8,16,.85) 68%)" }} />
                    <div className="cv" style={{ top: 150, fontSize: 5.4, fontWeight: 600, letterSpacing: ".2em", color: "#fff" }}>{d.t}</div>
                </>
            );
    }
}

export default function Anillo() {
    const tarjetas = useRef<(HTMLDivElement | null)[]>([]);
    const caja = useRef<HTMLDivElement>(null);
    const [k, setK] = useState(1);

    /* UNA SOLA ESCALA PARA TODO EL ESCENARIO, como hace el spec con su lienzo.
       La geometría queda fija —y con ella el solape— y el conjunto crece o
       encoge para llenar el ancho disponible sin desbordar. */
    useEffect(() => {
        const nodo = caja.current;
        if (!nodo) return;
        const medir = () => setK(nodo.clientWidth / ANCHO_ANILLO);
        medir();
        const ro = new ResizeObserver(medir);
        ro.observe(nodo);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
        let fase = -2;
        let ultimo = 0;
        let raf = 0;
        let vivo = true;

        const colocar = () => {
            for (let i = 0; i < N; i++) {
                const el = tarjetas.current[i];
                if (!el) continue;
                const a = ((((i * PASO + fase) % 360) + 540) % 360) - 180;
                if (Math.abs(a) > CORTE) {
                    el.style.visibility = "hidden";
                    continue;
                }
                el.style.visibility = "visible";
                const r = (a * Math.PI) / 180;
                const c = Math.cos(r);
                el.style.transform = `translate3d(${R * Math.sin(r)}px, 0, ${R * (1 - c)}px) rotateY(${-a}deg)`;
                el.style.filter = `brightness(${0.84 + 0.5 * (1 / c - 1)})`;
            }
        };

        const tic = (t: number) => {
            if (!vivo) return;
            raf = requestAnimationFrame(tic);
            const dt = ultimo ? Math.min((t - ultimo) / 1000, 0.1) : 0;
            ultimo = t;
            /* Con movimiento reducido se sigue pintando, simplemente no gira. */
            if (!quieto.matches) fase -= VELOCIDAD * dt;
            colocar();
        };

        /* Al volver de una pestaña de fondo se descarta el reloj viejo: si no,
           el dt acumulado haría saltar el anillo de golpe. */
        const alVolver = () => { ultimo = 0; };
        document.addEventListener("visibilitychange", alVolver);

        colocar();
        raf = requestAnimationFrame(tic);

        return () => {
            vivo = false;
            cancelAnimationFrame(raf);
            document.removeEventListener("visibilitychange", alVolver);
        };
    }, []);

    return (
        <div
            ref={caja}
            className="gp-anillo relative w-full overflow-hidden"
            style={{ height: Math.round(ALTO_LIENZO * k) }}
        >
            <style>{`
                .gp-anillo .gp-card{position:absolute;left:586px;top:268px;width:130px;height:300px;
                  margin:-150px 0 0 -65px;border-radius:12px;overflow:hidden;background:#0d1117;
                  box-shadow:0 24px 46px rgba(0,0,0,.6),0 3px 8px rgba(0,0,0,.5);
                  backface-visibility:hidden;will-change:transform}
                .gp-anillo .gp-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
                .gp-anillo .gp-card.broken img{display:none}
                .gp-anillo .edge{position:absolute;inset:0;border-radius:12px;
                  box-shadow:inset 0 0 0 1px rgba(255,255,255,.15),inset 0 16px 30px rgba(255,255,255,.05)}
                .gp-anillo .cv{position:absolute;left:0;right:0;padding:0 10px}
                .gp-anillo .fill{position:absolute;inset:0}
                .gp-anillo .ph{position:absolute;left:0;right:0;overflow:hidden;
                  background:linear-gradient(155deg,#2b3b50,#131c28 60%,#1d1526)}
                .gp-anillo .phf{top:0;bottom:0}
                .gp-anillo .dot{display:inline-block;width:4.5px;height:4.5px;background:#e5202f;
                  margin-right:4px;transform:rotate(45deg) translateY(-1px)}
                .gp-anillo .dot.sq{transform:none;width:6.5px;height:4.5px;border-radius:1px}
                .gp-anillo .t-big{font-family:var(--font-sans),Poppins,sans-serif;font-weight:900;
                  text-transform:uppercase;line-height:.96;letter-spacing:-.015em;white-space:nowrap;
                  transform:scaleX(.875);transform-origin:left center}
                .gp-anillo .t-serif{font-family:var(--font-playfair),"Playfair Display",serif;
                  line-height:1.02;letter-spacing:.01em;white-space:nowrap}
            `}</style>

            <div
                className="absolute left-1/2 top-0"
                style={{
                    width: ANCHO_ANILLO,
                    height: ALTO_LIENZO,
                    transform: `translateX(-50%) scale(${k})`,
                    transformOrigin: "50% 0",
                    /* La cámara va 302px por DEBAJO del centro de las tarjetas,
                       igual que el spec (plano 616, horizonte 918). Es lo que
                       inclina el canto de arriba y hace que el anillo se lea
                       visto desde abajo. */
                    perspective: `${R}px`,
                    perspectiveOrigin: `${MEDIO}px ${452 + HOLGURA}px`,
                    transformStyle: "preserve-3d",
                    pointerEvents: "none",
                }}
            >
                {Array.from({ length: N }, (_, i) => {
                    const d = SHOTS[i % SHOTS.length];
                    return (
                        <div
                            key={i}
                            className="gp-card"
                            ref={(nodo) => { tarjetas.current[i] = nodo; }}
                        >
                            <Creativa d={d} />
                            <div className="edge" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
