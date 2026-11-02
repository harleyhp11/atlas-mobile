'use client';

import { useEffect, useState } from 'react';
import { WhatsApp } from '../../iconos';
import { precioLeido, wspPlan, type Detalle } from '../planes';
import { useExtras } from './Pedido';
import { Volver } from './Volver';

/* El dock flotante (refs 33 y 35): la accion siempre a mano en una pagina
   larga. Volver a la lista, que plan estas viendo (con el cuadrito de su
   material, el mismo de la tarjeta) y Cotizar por WhatsApp con el mismo
   mensaje que arma «¿Empezamos tu…?»; si ya marcaste extras, lo dice con
   una insignia «+n».

   El plan se reconoce por la miniatura redonda de la foto de su rubro (la
   misma de «Tu pedido»); antes era un cuadrito del material y, en Web
   (grafito), parecia una casilla para marcar.

   Aparece cuando el boton del resumen ya se fue por arriba (antes estaria
   repitiendo lo que se ve) y se esconde donde estorbaria: en el armador
   (#empezar, que tiene su propio boton) y en el pie. Escondido queda
   inert: ni foco ni lector.

   Va dentro de <main>: al abrir el menu, la cabecera lo vuelve inert junto
   con el resto de la pagina. */

export function Dock({ d }: { d: Detalle }) {
    const { plan } = d;
    const { extras } = useExtras();
    const [pasado, setPasado] = useState(false);
    const [tapado, setTapado] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const boton = document.querySelector('.pre-dt-res-btn');
        const tapas = [document.getElementById('empezar'), document.querySelector('.pry-pie')].filter(Boolean) as Element[];
        // El boton se mira contra una ventana estirada hacia abajo: "dentro"
        // es estar en pantalla o mas abajo, "fuera" es haberse ido por
        // arriba. Asi el cambio se nota aunque se salte de golpe (un ancla
        // del indice), sin pasar por la pantalla.
        const arriba = new IntersectionObserver(([e]) => setPasado(!e.isIntersecting), { rootMargin: '0px 0px 100000px 0px' });
        const encima = new IntersectionObserver((es) => {
            for (const e of es) {
                const clave = (e.target as HTMLElement).id || 'pie';
                setTapado((t) => (t[clave] === e.isIntersecting ? t : { ...t, [clave]: e.isIntersecting }));
            }
        });
        if (boton) arriba.observe(boton);
        tapas.forEach((t) => encima.observe(t));
        return () => {
            arriba.disconnect();
            encima.disconnect();
        };
    }, []);

    const visible = pasado && !Object.values(tapado).some(Boolean);
    const n = extras.length;

    return (
        <aside className="pre-dt-dock" aria-label="Cotizar este plan" data-visible={visible} inert={!visible} aria-hidden={!visible}>
            <Volver className="pre-dt-dock-volver" />
            <span className="pre-dt-dock-plan">
                <img src={d.foto.mini} width={112} height={112} alt="" loading="lazy" decoding="async" />
                <span>
                    <b>{plan.nombre}</b>
                    <small aria-hidden="true">{plan.precio}</small>
                    <span className="sr-only">{precioLeido(plan)}</span>
                </span>
            </span>
            <a className="pre-dt-dock-cta" href={wspPlan(d, extras)} target="_blank" rel="noopener noreferrer">
                <WhatsApp />
                Cotizar
                {n > 0 && (
                    <span key={n} className="pre-dt-dock-n" aria-hidden="true">
                        +{n}
                    </span>
                )}
                <span className="sr-only">{` ${d.titulo} por WhatsApp${n ? `, con ${n} ${n === 1 ? 'extra' : 'extras'}` : ''}`}</span>
            </a>
        </aside>
    );
}
