import type { CSSProperties, HTMLAttributes, ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./glowing-card.module.css";

/* TARJETA CON PUNTO VIAJERO — adaptada del componente que se pego.

   Lo que se corrigio respecto al original:
     · usaba `class=` (HTML), que en JSX no compila: aqui es className;
     · tenia un useState que no se usaba: fuera, y con el sale "use client",
       porque ya no necesita nada del navegador;
     · solo traia la animacion, sin el CSS de la tarjeta: va completo en
       glowing-card.module.css;
     · el contenido estaba fijo ("750k / Views"): ahora es children.

   Todo lo de dentro son <span> y no <div> para que pueda ser un <button>: el
   HTML no permite bloques dentro de un boton. Las piezas decorativas llevan
   aria-hidden, asi un lector de pantalla solo lee el texto. */

type GlowingCardProps = {
    as?: "div" | "button";
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style" | "children">;

export function GlowingCard({ as = "div", children, className, ...rest }: GlowingCardProps) {
    const clases = cn(styles.outer, as === "button" && styles.boton, className);
    const contenido = (
        <>
            <span aria-hidden="true" className={styles.dot} />
            <span className={styles.card}>
                <span aria-hidden="true" className={styles.ray} />
                {children}
                <span aria-hidden="true" className={cn(styles.line, styles.topl)} />
                <span aria-hidden="true" className={cn(styles.line, styles.leftl)} />
                <span aria-hidden="true" className={cn(styles.line, styles.bottoml)} />
                <span aria-hidden="true" className={cn(styles.line, styles.rightl)} />
            </span>
        </>
    );

    if (as === "button") {
        return <button className={clases} {...rest}>{contenido}</button>;
    }
    /* Como <div>, los atributos propios de boton (type, disabled...) no
       aplican; el resto —style, id, aria-*, eventos— si se pasan. */
    const { type: _type, disabled: _disabled, form: _form, ...comunes } = rest;
    return <div className={clases} {...(comunes as HTMLAttributes<HTMLDivElement>)}>{contenido}</div>;
}

/* El texto grande con brillo (el "750k" del original). */
export function GlowingCardTitle({ children }: { children: ReactNode }) {
    return <span className={styles.text}>{children}</span>;
}

/* La linea pequeña de debajo (el "Views" del original). */
export function GlowingCardLabel({ children }: { children: ReactNode }) {
    return <span className={styles.label}>{children}</span>;
}

/* El ejemplo del original, tal cual, por si alguien importa `Component`. */
export const Component = () => (
    <GlowingCard>
        <GlowingCardTitle>750k</GlowingCardTitle>
        <GlowingCardLabel>Views</GlowingCardLabel>
    </GlowingCard>
);
