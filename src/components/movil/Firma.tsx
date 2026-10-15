/* La firma manuscrita roja (Alex Brush, rotada -6°) que se "escribe".

   Las frases miden de 17 a 25 letras, asi que el tamaño sale del largo:
   cuanto mas larga, mas chica, para que nunca se salga de la pantalla. En
   Alex Brush una letra minuscula ocupa unas 0,4 em de media. `ancho` es el
   ancho disponible en vw. */

type Props = {
    texto: string;
    ancho?: number;
    max?: number;
    className?: string;
};

export function Firma({ texto, ancho = 84, max = 56, className = '' }: Props) {
    const vw = Math.min(12, ancho / (texto.length * 0.4));
    return (
        <span className={`m-firma ${className}`} style={{ fontSize: `min(${vw.toFixed(2)}vw, ${max}px)` }}>
            <span>{texto}</span>
        </span>
    );
}
