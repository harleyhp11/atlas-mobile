import { Boton } from '../Boton';
import { RelojLima } from '../Cabecera';
import { Firma } from '../Firma';
import { Titular } from '../Titular';
import { BENJAMIN, HARLEY, WSP_NOSOTROS } from './equipo';

/* El cierre, en isla roja: los dos avatares y un tercer asiento libre —el
   tuyo, con un «Tú» escrito a mano en blanco—, «¿Hacemos equipo?» y el CTA
   principal de WhatsApp con la tinta anodizada. Detras, una foto de trabajo
   en B/N multiplicada sobre el rojo (solo oscurece: el blanco nunca baja de
   4,6:1). */

export function Cierre() {
    return (
        <section className="nos-cierre" data-tono="oscuro" data-in data-loop aria-labelledby="cierre-t">
            <img className="nos-cierre-foto" src="/assets/movil/nosotros/trabajo.webp" width={1200} height={800} alt="" loading="lazy" decoding="async" />
            <div className="m-wrap">
                <div className="nos-trio" aria-hidden="true">
                    <img src={HARLEY.mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                    <img src={BENJAMIN.mini} width={240} height={240} alt="" loading="lazy" decoding="async" />
                    <span className="nos-tu">
                        <Firma texto="Tú" ancho={10} max={40} />
                    </span>
                </div>
                <Titular id="cierre-t" className="nos-cierre-t" texto="¿Hacemos equipo?" destacar="equipo?" />
                <p className="nos-cierre-bajada">Cuéntanos tu idea. Respondemos en menos de 24 h.</p>
                <div className="nos-cierre-cta" data-rv style={{ '--d': '.2s' } as React.CSSProperties}>
                    <Boton href={WSP_NOSOTROS} externo tinta className="nos-cierre-btn">
                        Escríbenos por WhatsApp
                    </Boton>
                </div>
                <p className="m-mono nos-cierre-hora">
                    <i className="m-ping" aria-hidden="true" />
                    <span>
                        Lima, Perú · <RelojLima />
                    </span>
                </p>
            </div>
        </section>
    );
}
