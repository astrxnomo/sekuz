"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/content";

/* Barra de navegación.

   Es el único componente de cliente del sitio, y lo es por dos razones que
   no se pueden resolver en CSS:

   1. Menú móvil. Antes los enlaces desaparecían por completo bajo 768px, lo
      que dejaba a un visitante en móvil sin forma de llegar a Cases ni a
      Results — las dos secciones donde se decide. El CTA va dentro del
      panel, no escondido tras el icono.
   2. Indicador de sección activa, con IntersectionObserver. Marca la posición
      con dos señales (color de texto y una regla inferior), porque el color
      por sí solo no basta para quien no lo distingue. */

function Marca() {
  return (
    <span
      className="grid h-5 w-5 shrink-0 grid-cols-2 grid-rows-2 gap-[2px]"
      aria-hidden="true"
    >
      <span className="bg-ink" />
      <span className="bg-ink opacity-25" />
      <span className="bg-ink opacity-55" />
      <span className="bg-ink" />
    </span>
  );
}

export function Nav() {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState<string>("");
  const [bajado, setBajado] = useState(false);
  const centinela = useRef<HTMLDivElement>(null);

  // Arriba de todo la barra es transparente y se apoya en el papel del hero,
  // sin regla ni superficie propia. Solo cuando el contenido empieza a pasar
  // por detrás aparece el velo, que es cuando hace falta para leerla.
  //
  // El disparo va con un centinela observado y no con un listener de scroll:
  // un listener recalcula en cada cuadro y en móvil se paga en reflows.
  useEffect(() => {
    const marca = centinela.current;
    if (!marca) return;

    const observador = new IntersectionObserver(
      ([entrada]) => setBajado(!entrada.isIntersecting),
      { threshold: 0 }
    );

    observador.observe(marca);
    return () => observador.disconnect();
  }, []);

  // Sección visible durante el scroll
  useEffect(() => {
    const ids = nav.links.map((e) => e.href.slice(1));
    const objetivos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (objetivos.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        // La que cruza más cerca de la parte alta del viewport gana
        const visibles = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles[0]) setActiva(visibles[0].target.id);
      },
      // El margen recorta el viewport a una banda superior: así la sección
      // activa cambia cuando su encabezado llega arriba, no cuando asoma.
      { rootMargin: "-72px 0px -65% 0px", threshold: 0 }
    );

    objetivos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  // Con el panel abierto se bloquea el scroll del fondo
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  // Escape cierra el panel
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto]);

  return (
    <>
      {/* Centinela de un píxel: mientras se ve, la barra va limpia. */}
      <div ref={centinela} aria-hidden="true" className="absolute top-0 h-px w-px" />

      {/* Sin regla inferior en ningún estado: una línea de separación es
          exactamente lo que hace que la barra se lea como una pieza pegada
          encima de la página. Arriba del todo no hay superficie ninguna y la
          barra se apoya en el papel del hero.

          Al bajar entra un velo, pero va en una capa propia por detrás del
          contenido y con máscara: si el desenfoque se aplicara al <header>,
          terminaría en un canto recto a los 64px, que es el mismo borde que
          se quería quitar. Enmascarado, el velo se deshace hacia abajo. */}
      <header className="sticky top-0 z-50">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 -bottom-8 top-0 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            bajado ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundColor: "color-mix(in srgb, var(--cream) 68%, transparent)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            maskImage: "linear-gradient(to bottom, #000 62%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent)",
          }}
        />

        <div className="frame relative">
        <div className="wrap flex h-16 items-center justify-between gap-8">
          <a
            href="#"
            className="display flex items-center gap-2.5 text-base leading-none"
            aria-label={`${nav.brand} — inicio`}
          >
            <Marca />
            {nav.brand}
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
            {nav.links.map((enlace) => {
              const esActiva = activa === enlace.href.slice(1);
              return (
                <a
                  key={enlace.href}
                  href={enlace.href}
                  aria-current={esActiva ? "true" : undefined}
                  className={`border-b py-1 text-sm transition-colors ${
                    esActiva
                      ? "border-ink text-ink"
                      : "border-transparent text-ink-mid hover:text-ink"
                  }`}
                >
                  {enlace.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a href={nav.cta.href} className="btn-primary hidden sm:inline-flex">
              {nav.cta.label}
            </a>

            {/* Disparador del menú móvil */}
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              className="flex h-10 w-10 items-center justify-center border border-line-strong text-ink md:hidden"
            >
              {abierto ? (
                <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Panel a pantalla completa. Se monta siempre y se oculta con hidden
          para que el foco no quede atrapado en un panel invisible. */}
      <div
        id="menu-movil"
        hidden={!abierto}
        className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-line bg-cream md:hidden"
      >
        <nav className="wrap py-4" aria-label="Principal móvil">
          <ul>
            {nav.links.map((enlace, i) => (
              <li key={enlace.href}>
                <a
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                  className="flex items-baseline gap-4 border-b border-line py-5 text-lg text-ink"
                >
                  <span className="pixel text-xs text-ink-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {enlace.label}
                </a>
              </li>
            ))}
          </ul>

          {/* El CTA vive dentro del panel: es la acción de más intención y no
              puede quedar detrás de un icono. */}
          <a
            href={nav.cta.href}
            onClick={() => setAbierto(false)}
            className="btn-primary mt-8 w-full"
          >
            {nav.cta.label}
          </a>
        </nav>
      </div>
    </>
  );
}
