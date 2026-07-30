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

/* Fundido width (24%), y hace falta que lo sea.

   Las viñetas ya vienen sin papel: el crema del panel se convirtió en alfa, así
   que la tinta cae directamente sobre el papel del sitio. Lo que sobrevive a
   ese proceso es la retícula de puntos tenues que el generador dibuja en el
   fondo del panel, y ningún umbral de luminancia la separa del dibujo porque es
   igual de oscura que sus texturas claras.

   Con el fundido corto de antes, esa retícula terminaba en un canto recto y
   volvía a leerse un cuadrado. Ancho, se deshace hacia el papel y pasa por lo
   que es: una mancha de textura del mismo grano que el fondo de la página, que
   es justo lo que tienen las láminas grandes de la serie. */
function mask(desde: string) {
  return `linear-gradient(to bottom, transparent, #000 24%, #000 76%, transparent), linear-gradient(to ${desde}, transparent, #000 24%, #000 76%, transparent)`;
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
