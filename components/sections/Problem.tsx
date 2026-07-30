import { problem } from "@/lib/content";
import { Plate } from "@/components/ui/Plate";

export function Problem() {
  return (
    <section id="problema" className="relative py-20 lg:py-24">
      {/* Sección de respiro entre dos láminas: solo textura isométrica */}

      {/* Tres columnas de cuatro y no dos de siete y cinco.

          Con dos columnas la sección era un balancín: la de párrafos y la de
          síntomas ya acababan a la misma altura —409 y 437 medidos en el
          navegador— así que la lámina, en cualquiera de las dos, dejaba 380px
          de hueco en la otra. No había sitio porque no había desequilibrio que
          aprovechar.

          Con la lámina en columna propia el problema desaparece: las tres
          piezas se reparten el ancho y se equilibran solas, el texto se estrecha
          y por tanto crece a lo height, y la ilustración deja de robarle altura a
          nadie. De paso queda donde corresponde, entre el problema y la lista
          de sus síntomas, con contenido a los dos lados. */}
      <div className="wrap relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="reveal lg:col-span-4">
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

          {/* La lámina, en columna propia y a media sección.

              Una estación meteorológica sola en una cresta pelada, sostenida por
              cuatro vientos tensados a mano, es el cuadro que describen el texto
              de la izquierda y los síntomas de la derecha: algo que funciona
              porque alguien lo mantiene tenso, y que cae el día que suelta.

              Formato height (4:5) porque en una columna estrecha es lo que iguala
              la altura de las otras dos; y `self-stretch` con `h-full` para que
              el marco llegue al fondo de la fila y las tres columnas cierren a
              la misma línea. */}
          <Plate
            src="/img/estacion.webp"
            width={720}
            height={720}
            className="reveal hidden h-full min-h-[26rem] w-full lg:col-span-4 lg:block"
            imageClass="object-[50%_86%]"
          />

          {/* Síntomas: lista sobre reglas finas, sin tarjeta. */}
          <div className="reveal lg:col-span-4">
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
