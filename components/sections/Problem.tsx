import { problem } from "@/lib/content";

export function Problem() {
  return (
    <section id="problema" className="relative py-20 lg:py-24">
      {/* Sección de respiro entre dos láminas, y ahora del todo: papel limpio.

          Aquí hubo una estación meteorológica en una tercera columna, y la
          tercera columna existía por ella. Sin viñeta, dos columnas vuelven a
          ser lo correcto y no el balancín que fueron antes: aquel desequilibrio
          —párrafos y síntomas acabando a la misma altura, 409 y 437 medidos en
          el navegador— solo era un problema cuando había que encajar una imagen
          en el hueco sobrante. Sin imagen que colocar, que las dos columnas
          cierren parejas es exactamente lo que se quiere.

          Y la sección no se queda sin gráfico: la lista de síntomas numerada
          sobre reglas finas ya lo es. */}
      <div className="wrap relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow-brand">{problem.eyebrow}</p>

            <h2 className="display mt-7 text-[1.375rem] sm:text-[1.6875rem] lg:text-[2.125rem]">
              {problem.title.map((linea, i) => (
                <span
                  key={linea}
                  className={`block ${i === problem.title.length - 1 ? "tone" : ""}`}
                >
                  {linea}
                </span>
              ))}
            </h2>

            <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink-mid">
              {problem.paragraphs.map((parrafo) => (
                <p key={parrafo.slice(0, 24)}>{parrafo}</p>
              ))}
            </div>
          </div>

          {/* Síntomas: lista sobre reglas finas, sin tarjeta. Arranca en la
              columna 7 para que quede una calle de separación con los párrafos
              y las dos piezas no se lean como un solo bloque de texto. */}
          <div className="reveal lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-ink">{problem.symptoms.title}</p>

            <ul className="mt-6">
              {problem.symptoms.items.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-5 border-t border-line py-4 text-sm leading-relaxed last:border-b last:border-line"
                >
                  <span className="pixel shrink-0 text-xs text-ink-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
