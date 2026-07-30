import { footer } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";

export function Footer() {
  return (
    <footer className="relative border-t border-line-strong">

      <div className="wrap relative py-16 lg:py-20">
        <div className="reveal grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="display flex items-center gap-2.5 text-lg leading-none">
              <span
                className="grid h-5 w-5 shrink-0 grid-cols-2 grid-rows-2 gap-[2px]"
                aria-hidden="true"
              >
                <span className="bg-ink" />
                <span className="bg-ink opacity-25" />
                <span className="bg-ink opacity-55" />
                <span className="bg-ink" />
              </span>
              {footer.brand}
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-mid">
              {footer.description}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4 lg:gap-8">
            {footer.columns.map((columna) => (
              <div key={columna.title}>
                <h3 className="eyebrow text-ink">{columna.title}</h3>
                <ul className="mt-5 space-y-3">
                  {columna.links.map((enlace, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm text-ink-mid transition-colors hover:text-ink"
                      >
                        <Sample>{enlace}</Sample>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-6">
          <p className="text-xs text-ink-soft">{footer.copyright}</p>

          <ul className="flex flex-wrap gap-6">
            {footer.legal.map((legal, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="text-xs text-ink-soft transition-colors hover:text-ink"
                >
                  <Sample>{legal}</Sample>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
