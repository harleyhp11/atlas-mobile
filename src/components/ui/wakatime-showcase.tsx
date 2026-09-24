"use client";

/* PLAN 04 — A MEDIDA. El premium: único con el acento lima de Atlas,
   halo desde abajo a la derecha. */

import React from "react";
import { PlanCard } from "./plan-bits";

export const WakaTimeShowcase = () => (
    <PlanCard
        id="plan-04"
        index="04"
        title="Software"
        thumb="/assets/plan-thumbs/plan-04.webp"
        titleMuted="hecho para ti."
        description="Cuando ninguna plantilla se adapta a cómo trabajas. Partimos de tu proceso real y construimos la herramienta alrededor de él."
        price="A medida"
        priceNote="Propuesta cerrada tras la primera llamada."
        delivery="Desde 4 semanas"
        features={[
            "Diagnóstico inicial y alcance por escrito",
            "Entregas por etapas, con avances revisables",
            "Conexión con las herramientas que ya usas",
            "Acompañamiento durante el primer mes",
        ]}
        cta="Empezar mi proyecto"
        accent
        aura="radial-gradient(58% 95% at 96% 100%, rgba(218,255,107,0.11) 0%, transparent 62%)"
    />
);

export default WakaTimeShowcase;
