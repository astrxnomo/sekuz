import { pricing } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";
import { Scene } from "@/components/ui/Scene";
import { CheckIcon } from "@/components/icons/check";

/* Bandas de inversión.

   La banda recomendada se destaca con superficie y borde, no haciéndola más
   alta: las tres columnas arrancan sus listas a la misma altura para que se
   puedan comparar de un barrido. */

export function Pricing() {
  return (
    <section id="precios" className="relative overflow-hidden py-20 lg:py-24">
      {/* La lámina se acota a la franja del titular. Si bajara hasta las
          bandas, las tres tarjetas — que son opacas — quedarían como recortes
          pegados encima de la ilustración. */}
      <Scene src="/img/montanas.webp" position="72% 84%" veil="left" zone="upper" />

      <div className="wrap relative">
        <div className="reveal max-w-2xl">
          <p className="eyebrow-brand">{pricing.eyebrow}</p>
          <h2 className="display mt-7 text-[1.375rem] sm:text-[1.6875rem] lg:text-[2.125rem]">
            {pricing.title.map((linea, i) => (
              <span
                key={linea}
                className={`block ${i === pricing.title.length - 1 ? "tone" : ""}`}
              >
                {linea}
              </span>
            ))}
          </h2>
          <p className="mt-7 leading-relaxed text-ink-mid">{pricing.intro}</p>
        </div>

        <div className="reveal mt-14 grid gap-px border border-line bg-line lg:grid-cols-3">
          {pricing.tiers.map((banda) => (
            <article
              key={banda.name}
              className={`flex flex-col p-7 lg:p-8 ${
                banda.featured ? "bg-cream-high" : "bg-cream"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="eyebrow text-ink">{banda.name}</h3>
                {banda.featured && (
                  <span className="eyebrow border border-ink px-2 py-0.5 text-[0.625rem] text-ink">
                    Más frecuente
                  </span>
                )}
              </div>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="pixel text-2xl lg:text-[1.75rem]">
                  <Sample>{banda.from}</Sample>
                </span>
                <span className="eyebrow">{banda.unit}</span>
              </p>

              <p className="mt-5 text-sm leading-relaxed">{banda.description}</p>

              <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                {banda.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    {/* El trazo del check se dibuja al pasar el cursor */}
                    <CheckIcon
                      size={15}
                      className="mt-1 shrink-0 text-ink"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-soft">{pricing.note}</p>
      </div>
    </section>
  );
}
