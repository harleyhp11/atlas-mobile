"use client";

import { cn } from "@/lib/utils";

/* Etiqueta de seccion: una hilera de cunas y el rotulo entre corchetes.
   Cada cuna es media pastilla (canto recto a la izquierda, semicirculo a la
   derecha) y van perdiendo ancho y opacidad hacia la derecha, que es lo que
   las lee como una flecha y no como cinco manchas sueltas.

   Vive en su propio archivo porque la usan dos sitios que no se conocen
   entre si: el panel del stack y las tres fichas de servicio. Si se queda
   dentro de uno de los dos, el otro acaba con una copia y se separan al
   primer retoque. */

const CUNAS = [15, 12, 10, 8, 6];

export function EtiquetaSeccion({
    codigo,
    texto,
    sobreClaro = false,
}: {
    codigo: string;
    texto?: string;
    /* Para secciones con fondo claro FIJO, como Testimonios (#E4E4E4), que no
       cambia con el tema. Sin esto la etiqueta usa el token `foreground`, que
       en tema oscuro es blanco, y el rotulo desaparece sobre el gris claro. */
    sobreClaro?: boolean;
}) {
    return (
        <div className="flex items-center gap-3.5">
            <div aria-hidden="true" className="flex items-center gap-[3px]">
                {CUNAS.map((ancho, i) => (
                    <span
                        key={i}
                        style={{
                            width: ancho,
                            height: 13,
                            borderRadius: "1px 999px 999px 1px",
                            background: "#E11D3A",
                            opacity: 1 - i * 0.13,
                        }}
                    />
                ))}
            </div>
            {/* El texto secundario es opcional: sin el la etiqueta queda como
                en la referencia, solo el codigo entre corchetes. */}
            <p
                className={cn(
                    "font-sans text-[11px] uppercase leading-none tracking-[0.08em] lg:text-[12px]",
                    sobreClaro ? "text-black/35" : "text-foreground/30"
                )}
            >
                [
                <span className={cn("font-semibold", sobreClaro ? "text-black/75" : "text-foreground/80")}>
                    {codigo}
                </span>
                {texto ? ` / ${texto}` : ""}]
            </p>
        </div>
    );
}

export default EtiquetaSeccion;
