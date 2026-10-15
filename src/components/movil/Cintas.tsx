import { CINTA_SERVICIOS, CINTA_STACK } from './datos';

/* Las dos cintas diagonales cruzadas del CTA del escritorio, ahora como
   separador. La roja lleva los servicios; la negra, el stack en mono. Son
   decorativas (los servicios se listan mas abajo), asi que van ocultas para
   el lector de pantalla. */

function Cinta({ items, clase }: { items: string[]; clase: string }) {
    return (
        <div className={`m-cinta ${clase}`}>
            <div className="m-cinta-pista">
                {[0, 1].map((k) => (
                    <span key={k} className="m-cinta-grupo">
                        {items.map((t) => (
                            <span key={t} className="m-cinta-item">
                                {t}
                                <i />
                            </span>
                        ))}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function Cintas({ className = '' }: { className?: string }) {
    return (
        <div className={`m-cintas ${className}`} data-loop aria-hidden="true">
            <Cinta items={CINTA_STACK} clase="m-cinta--negra" />
            <Cinta items={CINTA_SERVICIOS} clase="m-cinta--roja" />
        </div>
    );
}
