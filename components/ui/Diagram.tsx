/* Diagramas de mecanismo — la tercera familia gráfica del sitio.

   `Scene` resuelve los paisajes a sangre y `Plate` los objetos recortados.
   Esta no es ninguna de las dos: es dibujo técnico para las casillas donde una
   ilustración no cabe.

   POR QUÉ NO ES UNA IMAGEN GENERADA

   Aquí hubo viñetas de grabado y fallaron por tamaño: llegaban a 293-430px
   para casillas de ~400px, o sea por debajo de 1x, y una trama de puntos a esa
   escala se deshace en gris. El dibujo no tiene ese techo — es geometría, se ve
   igual a cualquier tamaño.

   POR QUÉ NO SE DIBUJA EN EL COMPONENTE

   La primera versión trazaba el SVG aquí mismo y rellenaba las masas con un
   `<pattern>`: rejilla regular de puntos, todos del mismo radio. Se veía a
   plástico. El motivo es de oficio, no de gusto: en reprografía el halftone es
   rejilla regular con puntos de tamaño variable y el stipple es colocación
   orgánica con densidad variable — el primero se lee mecánico y el segundo,
   dibujado a mano. Un patrón de puntos iguales no es ninguno de los dos: tiene
   la rigidez del halftone y no tiene el tono de nadie. **En un grabado el tono
   ES la densidad**, y un `<pattern>` no puede variarla.

   Así que las masas se siembran punto a punto, con la densidad y el calibre
   saliendo de un mapa de tono, en `scripts/generar-diagramas.mjs`. Es lo que da
   volumen: el fuste de la torre es un cilindro porque su tono cae de un lado al
   otro, no porque tenga el contorno redondeado. La salida son tres SVG en
   `public/img/`, con la tinta ya en `--ink` y sin fondo.

   Si tocas un diagrama, edítalo en el script y vuelve a correrlo. Los `.svg`
   son producto, no fuente.

   Composición: el trazo vive en la mitad inferior de la caja de 4:5, así que el
   índice y el nombre del pilar caen sobre el vacío de arriba sin necesidad de
   velo — un degradado sobre filete de un pelo lo borra en vez de apagarlo. */

type Kind = "radar" | "compuerta" | "torre";

export function Diagram({ kind, className = "" }: { kind: Kind; className?: string }) {
  return (
    /* `<img>` y no `next/image`: es un vector, así que no hay nada que
       redimensionar ni formato mejor al que convertirlo, y `next/image` exige
       `dangerouslyAllowSVG` para servirlo. Decorativo, con `alt` vacío — lo que
       significa lo dice el pie de la figura. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/img/diagrama-${kind}.svg`}
      alt=""
      width={320}
      height={400}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
