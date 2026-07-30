/* Textura del papel, en dos capas fijas al viewport.

   La idea que sostiene todo esto: las láminas son puntillismo, puntos de
   tinta sobre papel. Si la página entera lleva su propia trama de puntos con
   una densidad parecida, el degradado con el que muere la ilustración deja de
   caer sobre un color plano y el ojo ya no encuentra el borde.

   Por eso la trama va POR ENCIMA del contenido, no detrás. Si fuera solo un
   fondo, el degradado de la lámina —que termina en crema opaco— la taparía
   justo en la zona de transición, que es precisamente donde hace falta. Al
   pasar por arriba en `multiply`, la misma trama cae sobre la ilustración y
   sobre el papel, y ambos se leen como una sola superficie.

   La opacidad es deliberadamente baja: suficiente para unificar, no tanto
   como para ensuciar el texto que queda debajo. */

const GRANO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
       <filter id="n">
         <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
         <feColorMatrix type="saturate" values="0"/>
       </filter>
       <rect width="200" height="200" filter="url(#n)" opacity="0.55"/>
     </svg>`
  );

/* El paso de 5.4px no es arbitrario: es el del propio stipple de las láminas,
   medido por autocorrelación sobre el cielo de una de ellas ya renderizada
   (picos en 5, 11 y 16 px — fundamental y armónicos). Acoplar la trama del
   papel a esa misma frecuencia es lo que hace que el borde desaparezca.

   Está calibrado para el ancho de escritorio, donde la lámina se muestra a
   ~1200px. En anchos muy distintos la imagen se reescala y el acople es
   aproximado, pero el efecto se sostiene porque la diferencia es gradual.

   La segunda rejilla va desfasada media celda y mucho más tenue: rompe la
   regularidad para que el patrón se lea como tinta impresa, no como grid. */
const PUNTOS = {
  backgroundImage: `
    radial-gradient(circle at 1px 1px, rgba(20,18,15,0.15) 1px, transparent 0),
    radial-gradient(circle at 1px 1px, rgba(20,18,15,0.05) 1px, transparent 0)
  `,
  backgroundSize: "5.4px 5.4px, 5.4px 5.4px",
  backgroundPosition: "0 0, 2.7px 2.7px",
};

export function Backdrop() {
  return (
    <>
      {/* Capa de fondo: rejilla de columnas, detrás del contenido */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="frame h-full">
          <div className="relative mx-auto h-full max-w-[76rem]">
            {[0, 25, 50, 75, 100].map((pct) => (
              <span
                key={pct}
                className="absolute inset-y-0 w-px bg-ink/[0.05]"
                style={{ left: `${pct}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Capa de unificación: puntos y grano por encima de todo */}
      <div
        className="pointer-events-none fixed inset-0 z-40 mix-blend-multiply"
        aria-hidden="true"
      >
        <div className="absolute inset-0 opacity-70" style={PUNTOS} />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{ backgroundImage: `url("${GRANO}")`, backgroundRepeat: "repeat" }}
        />
      </div>
    </>
  );
}
