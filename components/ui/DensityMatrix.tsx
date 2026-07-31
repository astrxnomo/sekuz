import { results } from "@/lib/content";

/* Matriz de densidad — el dato como textura.

   La quinta familia gráfica. Una rejilla donde **la cantidad de tinta ES la
   cifra**: cada celda es un día y su trama se cierra con el volumen. Resuelve
   un problema que la página tenía de fondo — las métricas eran tres números
   sueltos y nada dejaba ver la forma de la operación detrás.

   POR QUÉ AQUÍ SÍ VA UN `<pattern>`

   `Diagram` lleva escrito que un `<pattern>` de puntos iguales se ve a plástico,
   y sigue siendo verdad **para un dibujo**. Aquí la familia es la contraria y a
   propósito:

     · Stipple  — colocación orgánica, densidad variable. Se lee dibujado a
                  mano. Es lo que quiere un grabado.
     · Halftone — rejilla REGULAR, punto de tamaño VARIABLE. Se lee mecánico.

   En una ilustración lo mecánico es el defecto; en una tabla de datos es la
   virtud, porque es lo que permite comparar dos celdas de un vistazo. Un
   sembrado orgánico haría cada celda distinta por el azar y no por el dato,
   que es justo lo que no se quiere medir. Así que aquí van diez tramas
   regulares de calibre creciente y el punto crece con la cifra.

   De paso pesa nada: diez `<pattern>` y una celda por día, en vez de miles de
   círculos. Se renderiza en el servidor y no necesita JavaScript.

   HONESTIDAD DEL DATO

   Una serie dibujada afirma más que una cifra escrita: parece una medición. La
   nota al pie va entre `[[ ]]` para que `Sample` la resalte mientras los
   valores sigan siendo de muestra. No quites ese marcado sin sustituir los
   números. */

/** Escalones de trama. Diez bastan para que la rampa se lea continua; con
    menos se ven los saltos y la matriz parece tener bandas que no están. */
const NIVELES = 10;
const TESELA = 8;

const CELDA = 56;
const HUECO = 10;
const COLS = 7;
const MARGEN_IZQ = 30;
const MARGEN_SUP = 26;

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

export function DensityMatrix({ className = "" }: { className?: string }) {
  const { dias, umbral } = results.serie;
  const filas = Math.ceil(dias.length / COLS);
  const max = Math.max(...dias);

  const W = MARGEN_IZQ + COLS * CELDA + (COLS - 1) * HUECO;
  const H = MARGEN_SUP + filas * CELDA + (filas - 1) * HUECO + 4;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${results.serie.label}: ${dias.length} días, de ${Math.min(
          ...dias,
        )} a ${max}. ${dias.filter((d) => d > umbral).length} superaron el umbral de ${umbral}.`}
        className="block h-auto w-full min-w-[22rem]"
      >
        <defs>
          {Array.from({ length: NIVELES }, (_, n) => (
            <pattern
              key={n}
              id={`trama-${n}`}
              width={TESELA}
              height={TESELA}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={TESELA / 2}
                cy={TESELA / 2}
                r={0.45 + (n / (NIVELES - 1)) * 3.35}
                fill="currentColor"
              />
            </pattern>
          ))}
        </defs>

        {/* Cabecera de días */}
        <g fill="currentColor" fillOpacity="0.62" fontSize="9" letterSpacing="1.4">
          {DIAS.map((d, i) => (
            <text key={d + i} x={MARGEN_IZQ + i * (CELDA + HUECO)} y="14">
              {d}
            </text>
          ))}
        </g>

        {dias.map((valor, i) => {
          const col = i % COLS;
          const fila = Math.floor(i / COLS);
          const cx = MARGEN_IZQ + col * (CELDA + HUECO);
          const cy = MARGEN_SUP + fila * (CELDA + HUECO);
          const nivel = Math.round((valor / max) * (NIVELES - 1));
          const marcado = valor > umbral;

          return (
            <g key={i}>
              <rect
                x={cx}
                y={cy}
                width={CELDA}
                height={CELDA}
                fill={`url(#trama-${nivel})`}
              />
              {/* El día que pasó del umbral se encierra. No cambia de color —
                  no hay color— ni de trama: lo que lo distingue es el filete,
                  que es lo único que no comparte con sus vecinos. */}
              {marcado && (
                <rect
                  x={cx - 3}
                  y={cy - 3}
                  width={CELDA + 6}
                  height={CELDA + 6}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              )}
            </g>
          );
        })}

        {/* Numeral de semana al margen, para que las filas se lean como
            semanas y no como una rejilla cualquiera. */}
        <g fill="currentColor" fillOpacity="0.6" fontSize="8.5" letterSpacing="1.2">
          {Array.from({ length: filas }, (_, f) => (
            <text key={f} x="0" y={MARGEN_SUP + f * (CELDA + HUECO) + CELDA / 2 + 3}>
              S{f + 1}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
