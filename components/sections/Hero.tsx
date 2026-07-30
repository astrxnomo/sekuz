import { hero } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";
import { Scene } from "@/components/ui/Scene";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Las antenas quedan abajo a la derecha; el titular ocupa el cielo */}
      <Scene src="/img/observatorio.webp" position="70% 78%" veil="left" priority />

      <div className="wrap relative py-20 lg:py-24">
        <div className="reveal max-w-2xl">
          <p className="eyebrow-brand">{hero.eyebrow}</p>

          {/* El pixel es monoespaciado: al mismo cuerpo ocupa mucho más width
              que una sans, así que la escala va deliberadamente contenida. */}
          <h1 className="display mt-7 text-[1.5625rem] sm:text-[2.125rem] lg:text-[2.6875rem]">
            {hero.title.map((linea, i) => (
              <span
                key={linea}
                className={`block ${i === hero.title.length - 1 ? "tone" : ""}`}
              >
                {linea}
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-lg leading-relaxed text-ink-mid">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href={hero.ctaPrimary.href} className="btn-primary">
              {hero.ctaPrimary.label}
            </a>
            <a href={hero.ctaSecondary.href} className="btn-secondary">
              {hero.ctaSecondary.label}
            </a>
          </div>

          {/* Cifras sobre reglas finas: sin caja, apoyadas en el papel */}
          <dl className="mt-16 grid max-w-lg grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-3">
            {hero.stats.map((cifra, i) => (
              <div key={cifra.caption} className="border-t border-line-strong pt-4">
                {/* El índice va dentro del <dt>: dentro de un <dl>, un <div>
                    solo admite <dt> y <dd>, nada más. */}
                <dt className="pixel text-xl lg:text-2xl">
                  <span className="eyebrow mb-2 block text-[0.625rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Sample>{cifra.value}</Sample>
                </dt>
                <dd className="mt-2 text-xs leading-snug text-ink-soft">
                  {cifra.caption}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
