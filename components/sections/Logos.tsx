import { logos } from "@/lib/content";
import { Sample } from "@/components/ui/Sample";

/* Franja de credibilidad, inmediatamente bajo el hero.

   La posición no es casual: es donde la prueba social pesa más, porque valida
   la propuesta antes de que el visitante empiece a evaluar nada. Se resuelve
   con los nombres en texto y no con imágenes de logo, y eso es deliberado:
   los logotipos ajenos en color rompen la paleta monocroma, y además exigen
   material gráfico y permisos que aún no existen. */

export function Logos() {
  return (
    <section aria-label="Clientes" className="relative border-y border-line">
      <div className="reveal wrap py-9">
        <p className="eyebrow text-center">{logos.title}</p>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 lg:gap-x-14">
          {logos.brands.map((marca) => (
            <li
              key={marca}
              className="display text-sm text-ink-mid transition-colors hover:text-ink lg:text-base"
            >
              <Sample>{marca}</Sample>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
