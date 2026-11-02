/* La cinta «PLANES / Y PRECIOS» al pie de la entrada, donde antes iba la
   flecha (pedido de Harley): aparece cuando termina la animacion, cada linea
   entrando desde un lado de la pantalla, y se queda quieta, centrada. Toda
   ella es el enlace a #planes. Con movimiento reducido aparece quieta. */

export function CintaPlanes() {
    return (
        <a className="pre-cinta" href="#planes" aria-label="Ver planes y precios">
            <span className="pre-cinta-l1" aria-hidden="true">
                <span>Planes</span>
            </span>
            <span className="pre-cinta-l2" aria-hidden="true">
                <span>
                    <em>y</em> precios
                </span>
            </span>
        </a>
    );
}
