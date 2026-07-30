import { faq } from "@/lib/content";
import { PlusIcon } from "@/components/icons/plus";

/* Preguntas frecuentes.

   Va con <details>/<summary> nativo en lugar de un acordeón en JavaScript:
   funciona sin hidratar nada, es accesible por teclado de fábrica y el
   contenido sigue siendo texto indexable dentro del HTML.

   Las respuestas quedan cerradas por defecto para que la sección se pueda
   barrer; quien tenga la duda concreta la abre. */

export function Faq() {
  return (
    <section id="faq" className="relative py-20 lg:py-24">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-4">
            <p className="eyebrow-brand">{faq.eyebrow}</p>
            <h2 className="display mt-7 text-[1.5rem] sm:text-[1.875rem] lg:text-[2.25rem]">
              {faq.title.map((linea, i) => (
                <span
                  key={linea}
                  className={`block ${i === faq.title.length - 1 ? "tone" : ""}`}
                >
                  {linea}
                </span>
              ))}
            </h2>

            {/* Salida al pie del titular. Esta columna acababa 280px antes que
                la lista de preguntas y dejaba un hueco al pie.

                Se llena con contenido y no con una lámina, y es deliberado: no
                hay ningún grabado de la serie que haga pareja con «preguntas
                frecuentes», y meter uno por rellenar es exactamente lo que hace
                que una página se vea armada a trozos. Aquí lo que falta es otra
                cosa — quien llega al final de la sección y no encontró su duda
                se queda sin salida, y esta es la última oportunidad de la página
                antes del cierre. */}
            <div className="mt-10 border-t border-line pt-6">
              <p className="text-sm leading-relaxed text-ink-mid">
                {faq.exit.label}
              </p>
              <a
                href={faq.exit.cta.href}
                className="mt-5 inline-flex items-baseline gap-2 border-b border-ink pb-1 text-sm text-ink transition-colors hover:border-ink-soft hover:text-ink-mid"
              >
                {faq.exit.cta.label}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="reveal lg:col-span-8">
            {faq.items.map((item, i) => (
              <details
                key={item.question}
                className={`group border-line ${i === 0 ? "border-y" : "border-b"}`}
              >
                <summary className="flex cursor-pointer list-none items-baseline gap-4 py-5 text-ink [&::-webkit-details-marker]:hidden">
                  <span className="pixel shrink-0 text-xs text-ink-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{item.question}</span>
                  {/* Dos capas de movimiento que no se pisan: el icono gira
                      por su cuenta al pasar el cursor (lo hace motion sobre
                      el <svg>), y el wrap gira 45° cuando la respuesta
                      queda abierta, convirtiendo el "+" en una "×". */}
                  <PlusIcon
                    size={16}
                    className="mt-1 shrink-0 text-ink transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>

                <p className="pb-6 pl-10 pr-4 text-sm leading-relaxed text-ink-mid">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
