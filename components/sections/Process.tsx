import { process } from "@/lib/content";

export function Process() {
  return (
    <section id="proceso" className="relative py-20 lg:py-24">
      {/* Papel limpio, y probado.

          Aquí se intentó meter el viaducto a sangre: un vano tras otro
          sosteniendo un recorrido es la metáfora de las cuatro fases, y heredaba
          el sitio de la escalera de esclusas. En pantalla no funciona, y el
          motivo es estructural, no de encuadre. `Scene` vela un solo lado, y
          esta es la única sección cuyo lado libre no existe: el titular ocupa la
          izquierda y las cuatro fases ocupan la derecha de arriba abajo. Con
          `veil="left"` los arcos caen enteros sobre «Diagnóstico» y
          «Prototipo», y el texto deja de leerse; con `veil="top"` se vela la
          franja completa y el puente desaparece.

          Las secciones que sí llevan lámina tienen todas un lado libre — el
          titular a la izquierda y nada a la derecha. Esta no, así que se queda
          en papel. La línea de tiempo vertical con sus cuatro hitos ya es el
          gráfico de la sección. */}
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
