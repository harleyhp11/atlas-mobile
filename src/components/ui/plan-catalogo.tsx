"use client";

/* PLAN 01 — CATÁLOGO. La puerta de entrada: halo cálido desde la izquierda. */

import React from "react";
import { PlanCard } from "./plan-bits";

export const PlanCatalogo = () => (
    <PlanCard
        id="plan-01"
        index="01"
        title="Tiendas online"
        thumb="/assets/plan-thumbs/plan-01.webp"
        titleMuted="y menús digitales."
        description="Deja de mandar fotos sueltas y listas de precios por chat. Tus clientes ven todo en un enlace y te escriben con el pedido ya armado."
        price="S/ 400 – 1,200"
        priceNote="Depende del número de productos."
        // TODO: falta el plazo real de entrega de este plan.
        delivery="A coordinar"
        features={[
            "Hasta 40 productos con foto, precio y descripción",
            "Botón de pedido directo a tu WhatsApp",
            "Código QR listo para mesas, vitrina o empaques",
            "Capacitación para que edites precios tú mismo",
        ]}
        cta="Empezar mi catálogo"
        aura="radial-gradient(62% 100% at 0% 45%, rgba(255,255,255,0.055) 0%, transparent 58%)"
    />
);

export default PlanCatalogo;
