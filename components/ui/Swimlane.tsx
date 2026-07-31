import { pillars } from "@/lib/content";

/* Carril de decisión — dos carriles y un salto.

   La cuarta familia gráfica, y la única que dibuja un argumento en vez de un
   aparato. `Scene` pone paisaje, `Plate` objeto recortado y `Diagram` mecanismo;
   esta pone la regla de operación: la máquina trabaja hasta un umbral explícito
   y cruzarlo baja al carril de la persona.

   Por qué está aquí y no en la FAQ, que es donde vive la objeción que contesta:
   en la FAQ está dentro de un `<details>` cerrado por defecto, así que solo lo
   ve quien ya sospechaba. Al pie de las tres capacidades lo ve todo el mundo.

   El dibujo sale entero del copy de `pillars.limite`. No hay rótulos escritos a
   mano aquí, igual que en el resto de componentes: si cambia el número de pasos
   el diagrama se recompone solo.

   REGLAS DE TRAZO. Las mismas que `Diagram`, y por el mismo motivo — que un
   remache y un contorno pesen igual es lo que aplana un esquema:

     · silueta 1.6  · borde 0.8  · detalle 0.4      (proporción 4:2:1)

   Y una convención propia que hace el trabajo semántico: **continuo es
   automático, cortado es humano**. El salto al carril de abajo y la vuelta van
   discontinuos; todo lo que corre solo va de un trazo. El pie lo dice, pero el
   dibujo ya se entiende sin leerlo. */

const SILUETA = 1.6;
const BORDE = 0.8;
const DETALLE = 0.4;

/* Geometría del lienzo. El diagrama es ancho por naturaleza —son dos carriles
   paralelos— así que no se encoge por debajo de esto: en un móvil se desplaza
   dentro de su caja en vez de reducirse hasta que los rótulos no se leen. */
const W = 640;
const H = 270;

/* Opacidad mínima del rótulo.

   `AGENTS.md` pide AA en todo texto y `--tinta-suave` está calibrada justo en
   4.67:1 sobre el crema. Un `fill-opacity` bajo hace lo mismo que aclarar el
   token: al 0.55 la tinta efectiva cae a ~4.0:1 y suspende. Al 0.7 queda sobre
   6:1 y hay margen. Los rótulos son texto aunque estén dentro de un SVG — que
   el lector no pueda leerlos no es un matiz estético. */
const ROTULO = 0.7;
const PASO_ANCHO = 104;
const PASO_HUECO = 32;
const X0 = 86;

export function Swimlane({ className = "" }: { className?: string }) {
  const { lanes, pasos, persona, umbral, vuelta, cierre, pie } = pillars.limite;

  const x = (i: number) => X0 + i * (PASO_ANCHO + PASO_HUECO);
  const finUltimo = x(pasos.length - 1) + PASO_ANCHO;

  /* El salto cae del paso del medio, que es donde se decide, y vuelve al
     siguiente. Con un número par de pasos redondea hacia abajo. */
  const iSalto = Math.floor((pasos.length - 1) / 2);
  const bajaX = x(iSalto) + PASO_ANCHO / 2;
  const subeX = x(iSalto + 1) + 8;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${pasos.join(", ")} corren solos; al superar el umbral el caso baja a una persona que ${persona.toLowerCase()} y vuelve al carril automático.`}
        className="block h-auto w-full min-w-[34rem]"
      >
        {/* Rótulos de carril */}
        <g
          fill="currentColor"
          fillOpacity={ROTULO}
          fontSize="9.5"
          letterSpacing="1.6"
          className="uppercase"
        >
          <text x="0" y="60">
            {lanes.maquina}
          </text>
          <text x="0" y="204">
            {lanes.persona}
          </text>
        </g>

        {/* Las dos reglas que separan los carriles */}
        <g stroke="currentColor" strokeOpacity="0.28" strokeWidth={DETALLE}>
          <path d={`M0 88 H${W}`} />
          <path d={`M0 152 H${W}`} />
        </g>

        {/* Camino automático: continuo */}
        <g stroke="currentColor" strokeOpacity="0.5" strokeWidth={BORDE} fill="none">
          {pasos.slice(0, -1).map((_, i) => (
            <path key={i} d={`M${x(i) + PASO_ANCHO} 56 H${x(i + 1)}`} />
          ))}
          <path d={`M${finUltimo} 56 H${finUltimo + 78}`} />
        </g>
        <rect
          x={finUltimo + 75}
          y="53"
          width="6"
          height="6"
          fill="currentColor"
          fillOpacity="0.6"
        />

        {/* Pasos de la máquina */}
        {pasos.map((paso, i) => (
          <g key={paso}>
            <rect
              x={x(i)}
              y="36"
              width={PASO_ANCHO}
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth={SILUETA}
            />
            <text x={x(i) + 12} y="61" fill="currentColor" fontSize="10.5" letterSpacing="1.2">
              {paso.toUpperCase()}
            </text>
          </g>
        ))}

        {/* El salto, y la vuelta. Cortado = interviene una persona. */}
        <g
          stroke="currentColor"
          strokeWidth={SILUETA * 0.875}
          fill="none"
          strokeDasharray="5 4"
        >
          <path d={`M${bajaX} 76 V180`} />
          <path d={`M${subeX} 180 V76`} />
        </g>

        <rect
          x={bajaX}
          y="180"
          width={subeX - bajaX}
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth={SILUETA}
        />
        <text x={bajaX + 12} y="205" fill="currentColor" fontSize="10.5" letterSpacing="1.2">
          {persona.toUpperCase()}
        </text>

        {/* La marca del umbral: el punto exacto donde deja de decidir sola */}
        <circle
          cx={bajaX}
          cy="76"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth={BORDE}
        />

        <g fill="currentColor" fillOpacity={ROTULO} fontSize="8.5" letterSpacing="1">
          {/* Alineados a la derecha contra la línea de bajada. Colocados por
              su borde izquierdo, la línea más larga cruzaba el trazo cortado y
              se leía tachada. */}
          {umbral.map((linea, i) => (
            <text key={linea} x={bajaX - 10} y={112 + i * 14} textAnchor="end">
              {linea}
            </text>
          ))}
          <text x={subeX + 10} y="126">
            {vuelta}
          </text>
          <text x={finUltimo + 4} y="46">
            {cierre}
          </text>
        </g>

        <path d={`M0 240 H${W}`} stroke="currentColor" strokeOpacity="0.25" strokeWidth={DETALLE} />
        <text
          x="0"
          y="256"
          fill="currentColor"
          fillOpacity={ROTULO}
          fontSize="8.5"
          letterSpacing="1.2"
          className="uppercase"
        >
          {pie}
        </text>
      </svg>
    </div>
  );
}
