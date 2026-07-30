import { process } from "@/lib/content";
import { Plate } from "@/components/ui/Plate";

export function Process() {
  return (
    <section id="proceso" className="relative py-20 lg:py-24">
      <div className="wrap relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Ya puede llevar `reveal`: el aviso de antes valía porque el
              titular iba en `sticky` y un transform en el ancestro lo rompe.
              Sin sticky, la restricción desapareció. */}
          <div className="reveal lg:col-span-5">
            <p className="eyebrow-brand">{process.eyebrow}</p>
            <h2 className="display mt-7 text-[1.375rem] sm:text-[1.6875rem] lg:text-[2rem]">
              {process.title.map((linea, i) => (
                <span
                  key={linea}
                  className={`block ${i === process.title.length - 1 ? "tone" : ""}`}
                >
                  {linea}
                </span>
              ))}
            </h2>
            <p className="mt-8 leading-relaxed text-ink-mid">{process.intro}</p>

            {/* Escalera de esclusas al pie del titular: el agua baja por etapas
                y cada compuerta no abre hasta que la anterior cerró, que es
                literalmente lo que dicen las cuatro fases de al lado.

                Esta columna acababa 334px antes que la de fases, y ese hueco es
                el sitio. El ancho es lo que decide si funciona: al ancho de la
                columna son 427px y la escalera se lee entera. Metida antes en
                una franja de 254px, el crop la dejaba en una mancha gris —
                es un paisaje denso, no un objeto aislado, y necesita tamaño.

                Encuadre al pie para que se vean las compuertas escalonadas, que
                son lo que hay que reconocer; el cielo de arriba no aporta. */}
            <Plate
              src="/img/esclusas.webp"
              width={1200}
              height={1407}
              className="mt-12 hidden aspect-[5/4] w-full lg:block"
              imageClass="object-[52%_100%]"
            />
          </div>

          {/* Las cuatro fases sobre una línea de tiempo vertical */}
          <ol className="reveal relative lg:col-span-7">
            <span
              className="absolute bottom-8 left-[3px] top-3 w-px bg-line-strong"
              aria-hidden="true"
            />

            {process.steps.map((paso) => (
              <li key={paso.index} className="relative pb-12 pl-10 last:pb-0">
                <span
                  className="absolute left-0 top-2 h-[7px] w-[7px] bg-ink"
                  aria-hidden="true"
                />

                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="pixel text-xs text-ink-soft">{paso.index}</span>
                    <h3 className="display text-[1rem] leading-none lg:text-[1.125rem]">
                      {paso.name}
                    </h3>
                  </div>
                  <p className="eyebrow">{paso.duration}</p>
                </div>

                <p className="mt-4 max-w-prose text-sm leading-relaxed">
                  {paso.description}
                </p>

                <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="eyebrow">Entregable</span>
                  <span className="text-sm text-ink">{paso.deliverable}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
