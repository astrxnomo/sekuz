import { results } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";

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

          Sin lámina, y es decisión: no hay pieza a la que emparejar una
          ilustración. La estación meteorológica estuvo un rato junto a este
          titular y no hacía nada; vive en «El punto de partida», donde sí. */}
      <div className="wrap relative">
        <div className="reveal max-w-2xl">
          <p className="eyebrow-brand">{results.eyebrow}</p>
          <h2 className="display mt-7 text-[1.5rem] sm:text-[1.875rem] lg:text-[2.375rem]">
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

      </div>
    </section>
  );
}
