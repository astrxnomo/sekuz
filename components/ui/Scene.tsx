import Image from "next/image";

/* Lámina stipple como fondo de una sección, a sangre.

   Toda la serie comparte la misma composición: el sujeto pesa a la derecha
   y hacia abajo, y el cielo — vacío — ocupa los dos tercios superiores
   izquierdos. Ese vacío es donde va el texto, y por eso el veil se aplica
   en degradado desde el lado del texto en vez de sobre toda la imagen.

   La lámina se disuelve por los cuatro bordes. Sin eso la ilustración
   termina en un corte recto contra el borde de la ventana, que es lo que
   hacía que se leyera como un recuadro pegado encima del papel. */

export function Scene({
  src,
  position = "center",
  veil = "left",
  priority = false,
  zone = "full",
}: {
  src: string;
  /** Encuadre de la lámina, en el formato de object-position. */
  position?: string;
  veil?: "left" | "top" | "none";
  priority?: boolean;
  /** En secciones largas la lámina se acota a una franja. Si cubre toda la
      sección, acaba pasando por detrás de párrafos y los vuelve ilegibles.
      `superior` para secciones cuyo texto va debajo; `inferior` para las que
      abren con el texto arriba y cierran con el paisaje. */
  zone?: "full" | "upper" | "lower";
}) {
  const crop =
    zone === "upper"
      ? "inset-x-0 top-0 h-[24rem]"
      : zone === "lower"
        ? "inset-x-0 bottom-0 h-[26rem]"
        : "inset-0";

  return (
    <div className={`pointer-events-none absolute overflow-hidden ${crop}`}>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />

      {/* Disolución por los cuatro bordes. Los verticales son largos para
          encadenar secciones; los laterales, cortos, solo matan el corte.
          En una franja superior el fundido de abajo ocupa más de la mitad:
          la lámina tiene que haber desaparecido antes de que empiece el
          texto que viene debajo. */}
      <div
        className={`absolute inset-x-0 top-0 bg-gradient-to-b from-cream via-cream/85 to-transparent ${
          zone === "lower" ? "h-72" : "h-40"
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-cream via-cream/75 to-transparent ${
          zone === "upper" ? "h-56" : "h-40"
        }`}
      />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream to-transparent lg:w-40" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cream to-transparent lg:w-40" />

      {/* El veil se sostiene opaco hasta pasada la columna de texto y solo
          entonces se abre. Si se degrada antes, las últimas líneas caen sobre
          el punteado del terreno y dejan de leerse. */}
      {veil === "left" && (
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 via-42% to-transparent to-78%" />
      )}

      {veil === "top" && (
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/70 via-38% to-transparent to-75%" />
      )}
    </div>
  );
}
