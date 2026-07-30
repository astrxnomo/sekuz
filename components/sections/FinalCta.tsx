import { finalCta } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";
import { Scene } from "@/components/ui/Scene";

export function FinalCta() {
  return (
    <section id="contacto" className="relative overflow-hidden">
      {/* La cordillera cierra la página desde abajo. El texto queda arriba,
          sobre papel limpio: la cumbre subía por detrás del subtítulo y lo
          volvía difícil de leer. */}
      <Scene src="/img/cta.webp" position="center 95%" veil="none" zone="lower" />

      {/* El padding inferior es generoso a propósito: separa los botones de
          la cumbre para que ni el texto ni el CTA compitan con la montaña. */}
      <div className="reveal wrap relative pb-56 pt-20 text-center lg:pb-72 lg:pt-24">
        <h2 className="display mx-auto max-w-3xl text-[1.5rem] sm:text-[2rem] lg:text-[2.75rem]">
          {finalCta.title.map((linea, i) => (
            <span
              key={linea}
              className={`block ${i === finalCta.title.length - 1 ? "tone" : ""}`}
            >
              {linea}
            </span>
          ))}
        </h2>

        <p className="mx-auto mt-8 max-w-xl leading-relaxed text-ink-mid">
          {finalCta.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href={finalCta.ctaPrimary.href} className="btn-primary">
            {finalCta.ctaPrimary.label}
          </a>
          <a href={finalCta.ctaSecondary.href} className="btn-secondary">
            <Sample>{finalCta.ctaSecondary.label}</Sample>
          </a>
        </div>
      </div>
    </section>
  );
}
