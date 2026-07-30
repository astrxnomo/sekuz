import { pillars } from "@/lib/content";
import { Scene } from "@/components/ui/Scene";
import { Plate } from "@/components/ui/Plate";

/* Una viñeta por capacidad, en el mismo grabado que las láminas grandes.
   Van por índice y no dentro de `lib/content.ts` porque son decoración: si
   mañana se reordenan los pilares, el texto manda y la imagen sigue. */
const plates: Record<string, string> = {
  "01": "/img/senal.webp", // semáforo de señales — decide y comunica estado
  "02": "/img/esclusa.webp", // compuertas — el flujo corre y para donde toca
  "03": "/img/caseta.webp", // puesto de mando — el panel a medida
};

export function Pillars() {
  return (
    <section id="pilares">
      {/* Cabecera sobre la lámina del faro, en su cielo vacío */}
      <div className="relative overflow-hidden">
        <Scene src="/img/hero.webp" position="72% 72%" veil="left" />

        <div className="wrap relative py-20 lg:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow-brand">{pillars.eyebrow}</p>
            <h2 className="display mt-7 text-[1.5rem] sm:text-[1.875rem] lg:text-[2.375rem]">
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

          La identidad de cada capacidad vive dentro de la lámina, apoyada en su
          cielo, igual que el titular del hero: índice, nombre y tagline sobre el
          vacío, y el aparato abajo. La explicación y el ejemplo van al otro
          lado, así que imagen y texto forman una sola fila y no dos bloques
          apilados. */}
      <div className="wrap pb-20 lg:pb-24">
        {pillars.items.map((pillar, i) => {
          /* Franjas impares con la lámina a la derecha.

             Se resuelve con `order` y no reordenando el JSX: en el DOM la
             lámina va siempre después del texto, así que quien navegue con
             lector de pantalla o tabulador recorre las tres franjas en el mismo
             orden y no va saltando de un lado al otro. */
          const plateRight = i % 2 === 1;

          return (
            <article
              key={pillar.index}
              /* `items-center` y no `items-start`: la lámina es más alta que su
                 texto por mucho que se recorte el copy, y alineados arriba
                 sobraba medio metro de papel justo debajo del terminal. Centrado
                 el aire se reparte arriba y abajo y se lee como margen. */
              className="reveal grid items-center gap-8 border-t border-line py-12 last:border-b lg:grid-cols-12 lg:gap-12 lg:py-16"
            >
              {plates[pillar.index] && (
                <figure
                  className={`relative lg:col-span-4 ${
                    plateRight ? "lg:order-2 lg:col-start-9" : "lg:col-start-1"
                  }`}
                >
                  <Plate
                    src={plates[pillar.index]}
                    width={720}
                    height={720}
                    veil="top"
                    className="aspect-[4/5] w-full"
                    imageClass="object-[50%_100%]"
                  />

                  {/* Sin padding lateral: el texto arranca en el mismo margen
                      que el pie, así que la lámina mantiene una sola línea de
                      composición. El tope de altura evita que un nombre de tres
                      líneas se meta dentro del aparato. */}
                  <div className="absolute inset-x-0 top-0 max-h-[52%] overflow-hidden pt-1">
                    <span className="pixel text-xs text-ink-soft">{pillar.index}</span>
                    <h3 className="display mt-3 text-[1.25rem] leading-tight lg:text-[1.5rem]">
                      {pillar.name}
                    </h3>
                    <p className="eyebrow mt-3 text-ink-mid">{pillar.tagline}</p>
                  </div>

                  {/* Pie de plancha: nombra el aparato y dice qué se lee en él.
                      Es lo que explica por qué una esclusa ilustra una
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
                  plateRight ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"
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
      </div>
    </section>
  );
}
