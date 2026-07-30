import Image from "next/image";

/* Ilustración compuesta con el texto, no colocada a su lado.

   `Scene` resuelve las láminas que hacen de fondo de una sección entera.
   `Plate` hace lo mismo a escala de una fila o una columna: se ancla al
   borde de su wrap, se sale por él, y el texto se apoya encima.

   Dos decisiones que conviene no deshacer:

   1. La disolución va por máscara y no por velos de color. El degradado hacia
      `crema` solo cuadra si detrás hay exactamente crema, y estas caen sobre
      la retícula de columnas y el grano del fondo. La máscara recorta el alfa,
      así que el papel sigue viéndose por debajo y no queda halo.

   2. El veil sí va en color, y solo desde el lado donde vive el texto. Es la
      misma regla que sostiene toda la serie: el sujeto queda nítido en un
      extremo y el otro extremo se apaga hasta que las líneas se leen. Un veil
      uniforme sobre toda la ilustración apaga también el sujeto y entonces no
      aporta nada. */

/* Fundido corto (8%), y ahora sí puede serlo.

   Estuvo en 24% durante toda la serie 1, y con razón: aquellas viñetas traían
   una retícula de puntos tenues que el generador dibujaba en el fondo del panel
   y que ningún umbral de luminancia separaba del dibujo, porque era igual de
   oscura que sus texturas claras. Sobrevivía al recorte de papel, terminaba en
   un canto recto y volvía a leerse un cuadrado. El fundido ancho existía para
   deshacer esa retícula, no para nada más.

   La serie 2 pide el fondo liso desde el prompt y llega sin retícula: medido,
   el papel del panel está en L 238-247, entero por encima del umbral de 228. Ya
   no hay nada que disolver — y un fundido del 24% sin retícula que comerse se
   come el objeto, que es lo que le lava la base a la torre y el remate a la
   antena. Con el 8% el margen transparente de la lámina absorbe el fundido y el
   aparato llega entero.

   Las láminas se generan con un 16% de aire alrededor de la tinta
   (`scripts/procesar-laminas.mjs`), así que el objeto vive entre el 16% y el
   84% y el fundido no lo toca. Si se sube este valor por encima de 16 hay que
   subir ese aire en la misma medida. */
function mask(desde: string) {
  return `linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent), linear-gradient(to ${desde}, transparent, #000 8%, #000 92%, transparent)`;
}

const VEILS = {
  left:
    "linear-gradient(to right, var(--cream) 0%, color-mix(in srgb, var(--cream) 82%, transparent) 46%, transparent 82%)",
  top:
    "linear-gradient(to bottom, var(--cream) 0%, color-mix(in srgb, var(--cream) 78%, transparent) 42%, transparent 80%)",
  none: null,
} as const;

export function Plate({
  src,
  width,
  height,
  veil = "none",
  className = "",
  imageClass = "",
}: {
  src: string;
  width: number;
  height: number;
  /** Lado desde el que se apaga la ilustración: el lado del texto. */
  veil?: keyof typeof VEILS;
  /** Colocación y tamaño del bloque. Aquí van los `absolute` y los anclajes. */
  className?: string;
  /** Ajustes sobre la imagen misma, como `object-position`. */
  imageClass?: string;
}) {
  const tint = VEILS[veil];

  return (
    /* `relative` y la imagen en absoluto, no en flujo. Dos cosas dependen de
       esto y las dos fallaban en silencio: el `aspect-ratio` que llega por
       `className` solo gobierna la altura si el hijo no la impone — con la
       imagen en flujo y `h-full` queda una dependencia circular y el navegador
       cae al alto del contenido — y el veil, que va en `inset-0`, se estaba
       midiendo contra un ancestro cualquiera en vez de contra la lámina. */
    <div
      aria-hidden="true"
      className={`pointer-events-none relative select-none overflow-hidden ${className}`}
      style={{
        maskImage: mask("right"),
        maskComposite: "intersect",
        WebkitMaskImage: mask("right"),
        WebkitMaskComposite: "source-in",
      }}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        sizes={`${width}px`}
        className={`absolute inset-0 h-full w-full object-cover ${imageClass}`}
      />

      {tint && (
        <div className="absolute inset-0" style={{ backgroundImage: tint }} />
      )}
    </div>
  );
}
