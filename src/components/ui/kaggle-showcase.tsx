"use client";

/* PLAN 03 — CRECIMIENTO. El más denso: halo centrado arriba. */

import React from "react";
import { PlanCard } from "./plan-bits";

export const KaggleShowcase = () => (
    <PlanCard
        id="plan-03"
        index="03"
        title="Web corporativa"
        thumb="/assets/plan-thumbs/plan-03.webp"
        titleMuted="completa."
        description="El sitio que un cliente revisa antes de decidir si confía en ti. Te encuentran en Google y encuentran respuestas sin tener que preguntarte."
        price="S/ 900 – 2,500"
        priceNote="Depende del número de páginas."
        delivery="2 – 3 semanas"
        features={[
            "Entre 5 y 7 páginas internas",
            "Blog que puedes actualizar sin programar",
            "Correo corporativo con tu dominio",
            "Google Analytics y Search Console configurados",
        ]}
        cta="Empezar mi web"
        aura="radial-gradient(48% 82% at 52% 0%, rgba(255,255,255,0.085) 0%, transparent 60%)"
    />
);

export default KaggleShowcase;
