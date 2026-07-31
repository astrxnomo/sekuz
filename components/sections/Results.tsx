import { results } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";
import { DensityMatrix } from "@/components/ui/DensityMatrix";

export function Results() {
  return (
    <section id="resultados" className="relative py-16 lg:py-20">
      {/* Banda de cifras, no una sección de argumentación.

          Antes llevaba además dos testimonios y el inventario de integraciones,
          y los dos se retiraron: eran datos inventados presentados como reales.
          Lo que queda son las tres métricas, así que el titular se ajustó — con
          el anterior («Lo que dicen quienes ya operan así») la sección prometía
          citas que ya no están.

          El respiro es más corto que en el resto de secciones a propósito: con
          tres cifras y nada más, el `py` largo del resto dejaba la banda
          flotando en medio de dos páginas de papel.

          Sin lámina, y sigue siendo decisión: no hay grabado que haga pareja
          con un titular de cifras. La estación meteorológica estuvo un rato
          junto a este titular y no hacía nada.

          Lo que sí entró es la matriz de densidad, y entra por la regla de
          siempre: la pieza gráfica ES el contenido del que habla la sección.
          No ilustra las cifras, las muestra — cada celda un día y la tinta el
          volumen. Es la única familia del sitio que no se puede dibujar sin
          datos detrás. */}
      <div className="wrap relative">
        <div className="reveal max-w-2xl">
          <p className="eyebrow-brand">{results.eyebrow}</p>
          <h2 className="display mt-7 text-[1.375rem] sm:text-[1.6875rem] lg:text-[2.125rem]">
            {results.title.map((linea, i) => (
              <span
                key={linea}
                className={`block ${i === results.title.length - 1 ? "tone" : ""}`}
              >
                {linea}
              </span>
            ))}
          </h2>
        </div>

        {/* Cifras sobre una regla continua, con marca de cota en el arranque.
            La cota va como pseudo-elemento (before:) y no como un <span>
            hermano: dentro de un <dl>, un <div> solo admite <dt> y <dd>, y
            colar otro elemento rompe la lista de definición. */}
        <dl className="reveal mt-16 grid gap-10 border-t border-line-strong sm:grid-cols-3 sm:gap-8">
          {results.stats.map((cifra) => (
            <div
              key={cifra.caption}
              className="relative pt-7 before:absolute before:left-0 before:top-0 before:h-3 before:w-px before:bg-ink before:content-['']"
            >
              <dt className="pixel text-2xl lg:text-3xl">
                <Sample>{cifra.value}</Sample>
              </dt>
              <dd className="mt-4">
                <p className="text-sm leading-snug text-ink">{cifra.caption}</p>
                <p className="eyebrow mt-2">
                  <Sample>{cifra.note}</Sample>
                </p>
              </dd>
            </div>
          ))}
        </dl>

        {/* La forma detrás de las cifras.

            Las tres métricas de arriba son el resumen; esto es la serie. Van
            juntas y en este orden porque el resumen se lee de un vistazo y la
            serie se mira después — al revés, la matriz obliga a descifrar
            antes de saber qué se está mirando.

            Ocupa cinco columnas y no las doce: a todo el ancho las celdas
            crecen tanto que la trama deja de leerse como tono y se ve el
            punto suelto, que es el mismo fallo que tenían las viñetas. */}
        {/* `figure` y no `div`: el pie es un `figcaption`, y un `figcaption`
            fuera de su `figure` es HTML inválido — el navegador lo acepta pero
            deja de asociarlo con la imagen para quien use lector de pantalla,
            que es justo lo que aporta. */}
        <figure className="reveal mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <DensityMatrix />
          </div>

          <figcaption className="lg:col-span-5 lg:col-start-7">
            <p className="eyebrow text-ink">{results.serie.label}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-mid">
              Cada celda es un día y la tinta, el volumen. Las semanas se leen
              de arriba abajo y el fin de semana cae solo, sin que nadie lo
              anote.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-mid">
              Los días encerrados pasaron de{" "}
              <span className="text-ink">{results.serie.umbral}</span>, que era
              la capacidad prevista. Son los que sirvieron para redimensionar.
            </p>
            <p className="eyebrow mt-6">
              <Sample>{results.serie.nota}</Sample>
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
