"use client";

/* ─────────────────────────────────────────────────────────────────────────────
   EL MOCK DEL NAVEGADOR

   Va DELANTE del anillo, solapando su tercio inferior y sangrando por el canto
   de abajo. Ese solape es el punto de la composición: el z-order real —mock
   z:100 sobre anillo z:5— es lo que da la sensación de profundidad.

   Es un escaparate de DEMOSTRACIÓN. La tienda, los productos y los precios que
   salen aquí son los del spec: contenido ficticio de ejemplo, no un cliente de
   Atlas ni un proyecto entregado. Si algún día esto se publica, conviene que
   quede claro en el copy de alrededor.
   ───────────────────────────────────────────────────────────────────────────── */

const BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

const BANNER = BASE + "hf_20260912_110504_0316394c-37bd-432b-a1f2-ee46a461c22b.png";

const PRODUCTOS = [
    {
        img: BASE + "hf_20260912_110423_3b5dcf24-cc07-4f3b-8423-b597fffcdbfb.png",
        alt: "Vitamin C serum in amber glass",
        tag: "-24%",
        nombre: "Serum Radiance C",
        detalle: "Brightens · 30ml",
        precio: "$ 129.90",
        antes: "$ 169.90",
    },
    {
        img: BASE + "hf_20260912_110504_50ec81be-8341-447f-a0c2-a5673a465447.png",
        alt: "Nourishing lotion jar on soft linen",
        nombre: "Nourishing Lotion",
        detalle: "Arid skin · 50g",
        precio: "$ 89.90",
    },
    {
        img: BASE + "hf_20260912_110504_fd208d72-9112-4cde-b509-8d273b470c6f.png",
        alt: "Three-piece Sunset Renewal skincare kit",
        tag: "SET",
        nombre: "Kit Sunset Renewal",
        detalle: "3 products",
        precio: "$ 219.90",
        antes: "$ 289.90",
    },
    {
        img: BASE + "hf_20260912_110504_9731544c-a83b-48c4-bacb-e31e4d4b9f42.png",
        alt: "Lightweight facial sunscreen beside clear water",
        tag: "JUST",
        nombre: "Defender SPF 60",
        detalle: "Light feel · 40g",
        precio: "$ 74.90",
    },
];

const TIRA = [
    "Ships gratis north of $ 199",
    "Pay 12x nil rates",
    "Swaps in 30 days",
    "Hypoallergenically checked",
];

export default function Navegador() {
    return (
        <div className="gp-browser">
            <style>{`
                .gp-browser{position:absolute;left:50%;transform:translateX(-50%);bottom:0;
                  width:min(842px,92%);height:430px;border-radius:28px 28px 0 0;overflow:hidden;
                  z-index:100;box-shadow:0 -14px 44px rgba(0,0,0,.55)}
                .gp-browser::before{content:"";position:absolute;left:0;right:0;top:42px;bottom:0;
                  background:rgba(20,20,26,.82);z-index:0}
                .gp-browser .bar{position:absolute;left:0;top:0;width:100%;height:42px;
                  background:linear-gradient(180deg,rgba(20,24,48,.48),rgba(15,19,38,.58));
                  -webkit-backdrop-filter:blur(6px) saturate(112%);backdrop-filter:blur(6px) saturate(112%)}
                .gp-browser .dots{position:absolute;left:27px;top:16px;display:flex;gap:2.6px}
                .gp-browser .dots i{width:7.6px;height:7.6px;border-radius:50%}
                .gp-browser .omni{position:absolute;left:50%;transform:translateX(-50%);top:7px;
                  width:336px;max-width:46%;height:26px;border-radius:5px;background:rgba(9,13,26,.93);
                  box-shadow:inset 0 0 0 1px rgba(255,255,255,.045);display:flex;align-items:center;
                  justify-content:center;gap:6px}
                .gp-browser .omni svg{width:9px;height:9px;opacity:.72}
                .gp-browser .omni span{font-size:9.5px;color:rgba(255,255,255,.72);letter-spacing:.005em}
                .gp-browser .tools{position:absolute;right:27px;top:14px;display:flex;align-items:center;
                  gap:4px;opacity:.9}
                .gp-browser .tools svg{width:11px;height:12px}
                .gp-browser .page{position:absolute;left:7px;right:6px;top:42px;bottom:0;background:#fff;
                  color:#111;overflow:hidden;border-radius:10px 10px 0 0;z-index:1}
                .gp-browser .ann{position:absolute;left:0;top:0;width:100%;height:16px;background:#101210;
                  display:grid;place-items:center;border-radius:10px 10px 0 0}
                .gp-browser .ann span{font-size:5px;letter-spacing:.06em;color:#cfcfcf}
                .gp-browser .ann u{position:absolute;font-size:6px;color:#9a9a9a;text-decoration:none}
                .gp-browser .shoplogo{position:absolute;left:50%;transform:translateX(-50%);top:24px;
                  text-align:center}
                .gp-browser .shoplogo em{font-family:var(--font-playfair),"Playfair Display",serif;
                  font-style:normal;font-weight:600;font-size:15px;letter-spacing:.14em;line-height:1;display:block}
                .gp-browser .shoplogo i{font-style:normal;font-size:5px;letter-spacing:.3em;color:#3a3a3a;
                  margin-top:3px;display:block}
                .gp-browser .shopicons{position:absolute;right:100px;top:33px;display:flex;gap:5px;opacity:.85}
                .gp-browser .shopicons svg{width:7px;height:7px}
                .gp-browser .pagebody{position:absolute;left:0;right:0;top:62px;bottom:0;background:#fff;
                  overflow:hidden}
                .gp-browser .pghero{position:relative;margin:0 26px;height:158px;border-radius:7px;
                  overflow:hidden;background:linear-gradient(120deg,#e8dcd4,#cbb6a8)}
                .gp-browser .pghero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
                .gp-browser .pghero .scrim{position:absolute;inset:0;
                  background:linear-gradient(90deg,rgba(28,20,16,.62) 0%,rgba(28,20,16,.30) 46%,rgba(28,20,16,0) 72%)}
                .gp-browser .pghero .copy{position:absolute;left:22px;top:50%;transform:translateY(-50%);color:#fff}
                .gp-browser .pghero .copy u{font-size:4.6px;letter-spacing:.26em;text-transform:uppercase;
                  opacity:.9;display:block;text-decoration:none}
                .gp-browser .pghero .copy em{font-family:var(--font-playfair),"Playfair Display",serif;
                  font-style:normal;font-weight:600;font-size:15px;line-height:1.12;margin-top:6px;display:block}
                .gp-browser .pghero .copy i{display:inline-block;font-style:normal;margin-top:10px;
                  padding:5px 13px;border-radius:20px;background:#fff;color:#17181c;font-size:5.2px;
                  font-weight:600;letter-spacing:.06em}
                .gp-browser .pgsec{display:flex;align-items:baseline;justify-content:space-between;
                  margin:16px 26px 9px}
                .gp-browser .pgsec b{font-family:var(--font-playfair),"Playfair Display",serif;
                  font-weight:600;font-size:9px;color:#17181c}
                .gp-browser .pgsec u{font-size:4.6px;letter-spacing:.14em;color:#8a8a8a;
                  text-transform:uppercase;text-decoration:none}
                .gp-browser .pggrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:0 26px}
                .gp-browser .pgcard .ph{position:relative;height:0;padding-bottom:104%;border-radius:6px;
                  overflow:hidden;background:linear-gradient(150deg,#efe7e1,#ddcfc6)}
                .gp-browser .pgcard .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
                .gp-browser .pgcard .tag{position:absolute;left:6px;top:6px;padding:2px 5px;border-radius:3px;
                  background:#17181c;color:#fff;font-size:3.8px;font-weight:600;letter-spacing:.1em}
                .gp-browser .pgcard b{display:block;margin-top:6px;font-size:5.4px;font-weight:600;
                  color:#17181c;letter-spacing:.01em}
                .gp-browser .pgcard i{display:block;font-style:normal;margin-top:2px;font-size:4.6px;color:#8a8a8a}
                .gp-browser .pgcard s{display:block;margin-top:3px;font-size:5.6px;font-weight:700;
                  color:#17181c;text-decoration:none}
                .gp-browser .pgcard s span{font-weight:400;color:#a08f86;text-decoration:line-through;
                  margin-left:4px;font-size:4.6px}
                .gp-browser .pgstrip{display:flex;justify-content:space-between;margin:16px 26px 0;
                  padding:9px 0;border-top:1px solid #eee6e0;border-bottom:1px solid #eee6e0}
                .gp-browser .pgstrip span{font-size:4.4px;letter-spacing:.12em;color:#7d7169;
                  text-transform:uppercase}
            `}</style>

            <div className="bar">
                <div className="dots">
                    <i style={{ background: "#ee5c62" }} />
                    <i style={{ background: "#f6b719" }} />
                    <i style={{ background: "#12c02f" }} />
                </div>
                <div className="omni">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.4" />
                        <path d="M20 20l-3.8-3.8" stroke="#fff" strokeWidth="2.4" />
                    </svg>
                    <span>Shop Focused - Skin Care</span>
                </div>
                <div className="tools" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M12 16V4m0 0L8 8m4-4 4 4" /><path d="M4 15v5h16v-5" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M12 3 3 8l9 5 9-5-9-5Z" fill="#fff" opacity=".95" stroke="none" />
                        <path d="M3 13l9 5 9-5" opacity=".55" />
                    </svg>
                </div>
            </div>

            <div className="page">
                <div className="ann">
                    <u style={{ left: 20 }}>&#8249;</u>
                    <span>Moisturized daily at home</span>
                    <u style={{ right: 20 }}>&#8250;</u>
                </div>
                <div className="shoplogo"><em>GLOW</em><i>SKIN CARE</i></div>
                <div className="shopicons" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.8-3.8" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" /><path d="M4.5 21c0-4.2 3.4-6.6 7.5-6.6s7.5 2.4 7.5 6.6" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                        <path d="M5.5 8h13l-1.2 12H6.7L5.5 8Z" /><path d="M9 8V6.2A3 3 0 0 1 15 6.2V8" />
                    </svg>
                </div>

                <div className="pagebody">
                    <div className="pghero">
                        <img src={BANNER} alt="Warm amber and ivory skincare collection in golden morning light" />
                        <div className="scrim" />
                        <div className="copy">
                            <u>Just added</u>
                            <em>Let your beauty<br />be sacred.</em>
                            <i>EXPLORE TODAY</i>
                        </div>
                    </div>

                    <div className="pgsec"><b>Best reviewed</b><u>see more</u></div>

                    <div className="pggrid">
                        {PRODUCTOS.map((p) => (
                            <div className="pgcard" key={p.nombre}>
                                <div className="ph">
                                    <img src={p.img} alt={p.alt} />
                                    {p.tag ? <div className="tag">{p.tag}</div> : null}
                                </div>
                                <b>{p.nombre}</b>
                                <i>{p.detalle}</i>
                                <s>{p.precio}{p.antes ? <span>{p.antes}</span> : null}</s>
                            </div>
                        ))}
                    </div>

                    <div className="pgstrip">
                        {TIRA.map((t) => <span key={t}>{t}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
