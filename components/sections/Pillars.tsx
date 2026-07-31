import { pillars } from "@/lib/content";
import { Scene } from "@/components/ui/Scene";
import { Diagram } from "@/components/ui/Diagram";
import { Swimlane } from "@/components/ui/Swimlane";

/* Un diagrama por capacidad, dibujado en SVG y no recortado de una lámina.

   Aquí hubo viñetas de grabado y no funcionaron por una razón de tamaño, no
   de gusto: llegaban del generador a 293-430px para una casilla de ~400px, o
   sea por debajo de 1x, y una trama de puntos a esa escala se deshace en gris.
   El dibujo técnico no tiene ese techo — es geometría, se ve igual a cualquier
   tamaño. Ver `components/ui/Diagram.tsx`.

   Van por índice y no dentro de `lib/content.ts` porque el copy manda: si
   mañana se reordenan los pilares, el texto se mueve y el dibujo lo sigue. */
const diagrams: Record<string, "radar" | "compuerta" | "torre"> = {
  "01": "radar", // barrido que distingue y avisa
  "02": "compuerta", // el caudal corre y para donde toca
  "03": "torre", // un puesto para ver y accionar todo
};

export function Pillars() {
  return (
    <section id="pilares">
      {/* Cabecera sobre la lámina del faro, en su cielo vacío */}
      <div className="relative overflow-hidden">
        <Scene src="/img/faro.webp" position="72% 72%" veil="left" />

        <div className="wrap relative py-20 lg:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow-brand">{pillars.eyebrow}</p>
            <h2 className="display mt-7 text-[1.375rem] sm:text-[1.6875rem] lg:text-[2.125rem]">
              {pillars.title.map((line, i) => (
                <span key={line} className={`block ${i === 1 ? "tone" : ""}`}>
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-8 max-w-lg leading-relaxed text-ink-mid">
              {pillars.intro}
            </p>
          </div>
        </div>
      </div>

      {/* Las tres capacidades en franjas anchas, alternando el lado del
          grabado. No en tres columnas iguales, y por dos razones.

          La de forma: tres columnas iguales con una imagen encima es el patrón
          más visto que hay, y se lee como tres tarjetas de plantilla por bueno
          que sea el grabado. Alternando el lado, la lectura hace un zigzag y
          cada franja se compone distinto de la anterior.

          La de medida: a un tercio de ancho el texto caía en unos 40 caracteres
          por línea, por debajo del rango legible — y con monoespaciada se nota
          el doble. En franja tiene siete columnas de doce y respira.

          La identidad de cada capacidad vive dentro del diagrama, apoyada en su
          vacío, igual que el titular del hero: índice, nombre y tagline arriba,
          y el aparato abajo. La explicación y el ejemplo van al otro lado, así
          que dibujo y texto forman una sola fila y no dos bloques apilados. */}
      <div className="wrap pb-20 lg:pb-24">
        {pillars.items.map((pillar, i) => {
          /* Franjas impares con el diagrama a la derecha.

             Se resuelve con `order` y no reordenando el JSX: en el DOM el
             diagrama va siempre después del texto, así que quien navegue con
             lector de pantalla o tabulador recorre las tres franjas en el mismo
             orden y no va saltando de un lado al otro. */
          const diagramRight = i % 2 === 1;

          return (
            <article
              key={pillar.index}
              /* `items-center` y no `items-start`: la lámina es más alta que su
                 texto por mucho que se recorte el copy, y alineados arriba
                 sobraba medio metro de papel justo debajo del terminal. Centrado
                 el aire se reparte arriba y abajo y se lee como margen. */
              className="reveal grid items-center gap-8 border-t border-line py-12 last:border-b lg:grid-cols-12 lg:gap-12 lg:py-16"
            >
              {diagrams[pillar.index] && (
                <figure
                  className={`relative lg:col-span-4 ${
                    diagramRight ? "lg:order-2 lg:col-start-9" : "lg:col-start-1"
                  }`}
                >
                  {/* Sin velo, a diferencia de la lámina que había aquí. El
                      dibujo arranca pasado el 54% de su caja, así que el vacío
                      de arriba ya está limpio por geometría; un degradado sobre
                      trazo de un pelo lo habría borrado en vez de apagarlo. */}
                  <Diagram kind={diagrams[pillar.index]} className="block w-full" />

                  {/* Sin padding lateral: el texto arranca en el mismo margen
                      que el pie, así que el diagrama mantiene una sola línea de
                      composición. El tope de altura evita que un nombre de tres
                      líneas se meta dentro del aparato. */}
                  <div className="absolute inset-x-0 top-0 max-h-[52%] overflow-hidden pt-1">
                    <span className="pixel text-xs text-ink-soft">{pillar.index}</span>
                    <h3 className="display mt-3 text-[1.125rem] leading-tight lg:text-[1.375rem]">
                      {pillar.name}
                    </h3>
                    <p className="eyebrow mt-3 text-ink-mid">{pillar.tagline}</p>
                  </div>

                  {/* Pie de plancha: nombra el aparato y dice qué se lee en él.
                      Es lo que explica por qué una compuerta ilustra una
                      automatización; sin él son tres máquinas de adorno. */}
                  <figcaption className="border-t border-line pt-3">
                    <span className="eyebrow block text-ink">{pillar.object}</span>
                    <span className="mt-1 block text-xs leading-snug text-ink-soft">
                      {pillar.reading}
                    </span>
                  </figcaption>
                </figure>
              )}

              <div
                className={`lg:col-span-7 ${
                  diagramRight ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"
                }`}
              >
                <p className="leading-relaxed">{pillar.description}</p>

                {/* «Para quién» vuelve al lado del texto. Se había quitado para
                    que las tres capacidades cupieran en columnas estrechas, pero
                    en franja hay sitio de sobra, y es la línea que le dice al
                    visitante si esta de las tres es su caso. */}
                <div className="mt-7 border-t border-line pt-5">
                  <p className="eyebrow">Para quién</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-mid">
                    {pillar.audience}
                  </p>
                </div>

                {/* El ejemplo concreto como salida de terminal: la única
                    superficie oscura del sitio, y por eso destaca. */}
                <div className="terminal mt-7 max-w-xl rounded-[3px]">
                  <p className="terminal-bar">en la práctica</p>
                  <div className="terminal-body">
                    <p className="terminal-line max-w-none">{pillar.example}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* El límite, cerrando las tres.

            Va al pie y no dentro de una franja porque no pertenece a ninguna
            capacidad: es la regla que comparten. Y va a todo el ancho porque un
            diagrama de dos carriles no cabe en una columna de cuatro — el
            mismo motivo por el que los paisajes solo se leen a sangre.

            La última franja lleva `last:border-b`, así que aquí no hace falta
            regla superior: se apoya en la que ya cierra el bloque de arriba. */}
        <div className="reveal grid gap-10 pt-12 lg:grid-cols-12 lg:gap-12 lg:pt-16">
          <div className="lg:col-span-4">
            <p className="eyebrow-brand">{pillars.limite.eyebrow}</p>
            <h3 className="display mt-6 text-[1.125rem] leading-tight lg:text-[1.375rem]">
              {pillars.limite.title}
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-ink-mid">
              {pillars.limite.intro}
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Swimlane />
          </div>
        </div>
      </div>
    </section>
  );
}
