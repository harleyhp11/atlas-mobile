'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Detalle } from '../planes';

/* El pedido que arma la persona en el detalle de un plan: los extras que
   marca en «¿Empezamos tu…?». Lo leen el armador (los interruptores y la
   tarjeta «Tu pedido») y el dock, que manda el mismo mensaje con los mismos
   extras desde cualquier punto de la pagina.

   Envuelve a TODA la pagina, componentes de servidor incluidos (van como
   children y siguen siendo de servidor). Sin persistencia a proposito: al
   cambiar de plan los extras cambian, y un pedido a medio armar guardado
   de otra visita confundiria mas de lo que ayuda.

   Los extras se guardan en el orden de d.extras, no en el de los toques:
   asi el mensaje sale siempre ordenado igual que la lista. */

type Pedido = {
    extras: string[];
    alternar: (nombre: string) => void;
    quitar: (nombre: string) => void;
};

const Contexto = createContext<Pedido | null>(null);

export function Pedido({ d, children }: { d: Detalle; children: ReactNode }) {
    const [extras, setExtras] = useState<string[]>([]);
    const orden = d.extras;

    const alternar = useCallback(
        (nombre: string) =>
            setExtras((prev) => (prev.includes(nombre) ? prev.filter((x) => x !== nombre) : orden.filter((x) => x === nombre || prev.includes(x)))),
        [orden]
    );
    const quitar = useCallback((nombre: string) => setExtras((prev) => prev.filter((x) => x !== nombre)), []);
    const valor = useMemo(() => ({ extras, alternar, quitar }), [extras, alternar, quitar]);

    return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useExtras(): Pedido {
    const c = useContext(Contexto);
    if (!c) throw new Error('useExtras: falta <Pedido> alrededor');
    return c;
}
