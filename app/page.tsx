import { Backdrop } from "@/components/layout/Backdrop";
import { Motion } from "@/components/layout/Motion";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { Logos } from "@/components/sections/Logos";
import { Problem } from "@/components/sections/Problem";
import { Pillars } from "@/components/sections/Pillars";
import { Process } from "@/components/sections/Process";
import { Cases } from "@/components/sections/Cases";
import { Results } from "@/components/sections/Results";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <Motion>
      {/* Salto al contenido: necesario para navegación por teclado */}
      <a
        href="#contenido"
        className="btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Saltar al contenido
      </a>

      {/* Retícula de columnas y grano, fijos detrás de todo */}
      <Backdrop />

      <Nav />

      {/* Todo el sitio vive dentro del marco: las láminas se recortan a este
          ancho y queda papel visible a los lados. Las secciones con lámina
          alternan con las de papel limpio, y los fundidos hacen la unión —
          nunca hay dos ilustraciones seguidas. */}
      <div className="frame relative z-10 flex-1">
        <main id="contenido">
          <Hero />
          <Logos />
          <Problem />
          <Pillars />
          <Process />
          <Cases />
          <Results />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>

        <Footer />
      </div>
    </Motion>
  );
}
