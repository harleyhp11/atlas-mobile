"use client";

/* PLAN 02 — PRESENCIA. El más ligero: halo frío desde abajo a la izquierda. */

import React from "react";
import { PlanCard } from "./plan-bits";

export const GitHubShowcase = () => (
    <PlanCard
        id="plan-02"
        index="02"
        title="Landing page"
        thumb="/assets/plan-thumbs/plan-02.webp"
        titleMuted="que convierte."
        description="Un solo mensaje, sin distracciones ni menús que desvíen. El visitante llega, entiende tu oferta y da el siguiente paso."
        price="S/ 600 – 1,500"
        priceNote="Depende del largo y del nivel de animación."
        delivery="7 – 10 días"
        features={[
            "Diseño y redacción de la página completa",
            "Formulario de contacto conectado a tu correo",
            "Optimizada para anuncios de Meta y Google",
            "Panel de visitas y clics para medir resultados",
        ]}
        cta="Empezar mi landing"
        aura="radial-gradient(55% 75% at 4% 100%, rgba(255,255,255,0.07) 0%, transparent 62%)"
    />
);

export default GitHubShowcase;
