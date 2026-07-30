import { cases } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";
import { Scene } from "@/components/ui/Scene";

export function Cases() {
  return (
    <section id="casos" className="relative overflow-hidden py-20 lg:py-24">
      {/* El viaducto: una obra construida, para la sección de lo construido.
          Acotado a la franja superior para no pasar por detrás de los
          expedientes, que son dos columnas de texto largo.

          El veil va desde la izquierda porque es ahí donde está el titular.
          Con `veil="top"` la franja entera quedaba velada, arcos incluidos,
          y el puente se perdía: la gracia del veil es apagar solo el lado del
          texto y dejar el sujeto nítido en el otro. El encuadre empuja los
          arcos al tercio derecho, ya fuera del alcance del degradado. */}
      <Scene src="/img/puente.webp" position="82% 84%" veil="left" zone="upper" />

      <div className="wrap relative">
        <div className="reveal max-w-2xl">
          <p className="eyebrow-brand">{cases.eyebrow}</p>
          <h2 className="display mt-7 text-[1.375rem] sm:text-[1.6875rem] lg:text-[2.125rem]">
            {cases.title.map((linea, i) => (
              <span
                key={linea}
                className={`block ${i === cases.title.length - 1 ? "tone" : ""}`}
              >
                {linea}
              </span>
            ))}
          </h2>
          <p className="mt-8 leading-relaxed text-ink-mid">{cases.intro}</p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {cases.items.map((caso, i) => (
            <article key={i} className="reveal flex flex-col border-t border-line-strong pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="flex items-baseline gap-2">
                  <span className="eyebrow text-ink">Caso</span>
                  <span className="pixel text-xs">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="eyebrow">
                  <Sample>{caso.sector}</Sample>
                  {" · "}
                  <Sample>{caso.tamano}</Sample>
                </span>
              </div>

              <h3 className="display mt-6 text-[1rem] leading-tight lg:text-[1.25rem]">
                <Sample>{caso.title}</Sample>
              </h3>

              <dl className="mt-7 space-y-5">
                <div>
                  <dt className="eyebrow">El problema</dt>
                  <dd className="mt-2 text-sm leading-relaxed">
                    <Sample>{caso.problema}</Sample>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Qué construimos</dt>
                  <dd className="mt-2 text-sm leading-relaxed">
                    <Sample>{caso.solucion}</Sample>
                  </dd>
                </div>
              </dl>

              {/* El resultado cierra con el peso de un dato: es lo único
                  que el lector va a recordar. */}
              <div className="mt-auto border-t border-line pt-6">
                <p className="eyebrow">Resultado</p>
                <p className="pixel mt-3 text-base leading-snug">
                  <Sample>{caso.resultado}</Sample>
                </p>
                <p className="eyebrow mt-4 text-ink-mid">{caso.pilar}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
