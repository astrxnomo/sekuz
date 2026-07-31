/* ---------------------------------------------------------------
   Diagramas de mecanismo — generador de trama

   Uso:  node scripts/generar-diagramas.mjs
   Salida: public/img/diagrama-{radar,compuerta,torre}.svg

   POR QUÉ ESTE SCRIPT EXISTE

   La primera versión rellenaba las masas con un `<pattern>` de SVG: rejilla
   regular de puntos, todos del mismo radio. Se veía a plástico, y el motivo
   tiene nombre. En reprografía hay dos familias, y son opuestas:

     · Halftone — rejilla REGULAR, puntos de tamaño VARIABLE.
     · Stipple  — colocación ORGÁNICA, densidad VARIABLE.

   El halftone se lee mecánico; el stipple, dibujado a mano. Un patrón de
   puntos idénticos no es ninguno de los dos: tiene la rigidez del primero y
   el tono de ninguno. **En un grabado el tono ES la densidad**, y un
   `<pattern>` no puede variarla.

   CÓMO SE HACE AQUÍ

   Cada diagrama se declara dos veces:

     · `masas`  — un SVG en grises que NO se publica. Es un mapa de tono:
                  blanco = tinta máxima, negro = papel.
     · `lineas` — el trazo, que se copia tal cual al SVG final. Un filete es
                  un filete y no se trama nunca.

   El mapa se rasteriza y se siembra sobre una rejilla con jitter: cada celda
   propone un punto desplazado al azar dentro de sí misma, se lee el tono ahí
   y el punto se acepta con probabilidad proporcional; el radio también sale
   del tono. Densidad y calibre crecen juntos hacia las sombras. El jitter es
   obligatorio: sin él vuelve la rejilla mecánica por mucho que varíe el radio.

   La semilla es fija, así que el mismo comando da siempre el mismo dibujo y
   el diff se mantiene legible.

   LAS DOS REGLAS DE OFICIO QUE SOSTIENEN EL DIBUJO

   1. **Jerarquía de línea 4:2:1.** Silueta, borde y detalle en esa proporción
      —la convención del dibujo técnico— y no un trazo indiferenciado. Es lo
      que separa un plano de un esquema: el contorno pesa, el detalle susurra.

   2. **Las seis luces.** Brillo, luz directa, sombra, SOMBRA NÚCLEO, luz
      reflejada y sombra proyectada. Un degradado de dos paradas que oscurece
      hasta el borde es el error de principiante: en un cilindro real la banda
      más oscura va METIDA hacia dentro, y más allá el borde vuelve a
      levantarse con la luz que rebota del entorno. Ese rebote es lo único que
      convierte un degradado en un volumen. Ver `cilindro()`.

   Luz única desde arriba a la izquierda, en los tres. Las sombras proyectadas
   caen a la derecha y anclan el aparato al suelo — sin ellas el dibujo flota.
   --------------------------------------------------------------- */

import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const ANCHO = 320;
const ALTO = 400;

/** Sobremuestreo del mapa de tono. A 1x el gris se escalona en los bordes de
    los degradados y el canto se ve en la trama. */
const ESCALA = 3;

/** Paso de la rejilla de candidatos y calibre del punto, en unidades del
    viewBox. Van atados: el grano tiene que parecerse al de los paisajes, que
    es fino. Con paso 1.8 y radio hasta 0.85 la masa se leía granulada, como
    suciedad y no como sombra.

    Lo que NO se hace con estos números es cerrar un macizo. Una superficie que
    debe ser negra sólida va como forma rellena en `lineas`: forzar la trama a
    colapsar exige un paso tan fino que dispara el peso por una masa de veinte
    píxeles. La trama es para el tono; el negro es negro. */
const PASO = 1.25;
const R_MIN = 0.2;
const R_MAX = 0.58;

/** Gamma sobre la probabilidad de aceptar. Por debajo de 1 abre los medios
    tonos, que sin corregir salen cerrados y comen el dibujo. */
const GAMMA = 0.85;

const TINTA = "#14120f";

/* Jerarquía de línea, en proporción 4:2:1.

   `SILUETA` es el contorno que separa el aparato del papel. `BORDE` son los
   cambios de plano y las aristas interiores. `DETALLE` es todo lo demás —
   texturas, barandillas, líneas de construcción, guías. Que un remache y una
   silueta pesen lo mismo es lo que hacía que el dibujo se leyera plano. */
const SILUETA = 1.6;
const BORDE = 0.8;
const DETALLE = 0.4;

/* PRNG determinista (mulberry32). Si cada pasada moviera los puntos, el
   archivo cambiaría en cada build. */
function prng(semilla) {
  return function () {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --- Vocabulario de sombreado ----------------------------------------- */

/** Degradado de cilindro con las seis luces, de izquierda a derecha.

    El orden no es negociable y es lo que distingue esto de una rampa: el tono
    sube hasta la sombra núcleo en el 68% —no en el borde— y luego BAJA, porque
    el canto recoge luz reflejada. Invertir esos dos últimos tramos devuelve el
    tubo plano de la versión anterior.

    Los extremos van medidos, no al máximo. Con el brillo casi en papel limpio y
    el núcleo casi en negro, la envolvente se partía en dos: medio fuste vacío y
    una franja densa al lado, que se leía como una raya pintada y no como un
    tubo. El rango comprimido reparte la vuelta. */
function cilindro(id, x1, x2) {
  return `
    <linearGradient id="${id}" x1="${x1}" y1="0" x2="${x2}" y2="0"
                    gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#6e6e6e"/>
      <stop offset="0.10" stop-color="#3a3a3a"/>
      <stop offset="0.36" stop-color="#8e8e8e"/>
      <stop offset="0.68" stop-color="#e4e4e4"/>
      <stop offset="0.86" stop-color="#a6a6a6"/>
      <stop offset="1" stop-color="#c8c8c8"/>
    </linearGradient>`;
}

/** Sombra proyectada: densa al pie del objeto y deshecha hacia fuera. */
function proyectada(id, x1, x2) {
  return `
    <linearGradient id="${id}" x1="${x1}" y1="0" x2="${x2}" y2="0"
                    gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#d8d8d8"/>
      <stop offset="0.45" stop-color="#6a6a6a"/>
      <stop offset="1" stop-color="#080808"/>
    </linearGradient>`;
}

const traza = (w, op = 1) =>
  `fill="none" stroke="${TINTA}" stroke-width="${w}" stroke-opacity="${op}"`;

/* --- Los tres diagramas -------------------------------------------------

   Suelo común en y=366. Todo el trazo por debajo de y≈196, que es donde
   termina el bloque de índice, nombre y tagline del pilar. */

const SUELO = 366;

/* Radar de vigilancia — barre, distingue y avisa.

   La versión anterior resolvía la antena con un rectángulo inclinado, y ese
   era el delator: ningún radar se parece a eso. Aquí es un plato parabólico
   escorzado, con nervios radiales, aros de refuerzo y el alimentador sobre su
   trípode en el foco. El escorzo se hace con una elipse girada, no con
   perspectiva: es la convención del alzado técnico y basta para que se lea.

   El barrido sale como sector anular y no macizo desde el centro, para que
   no pise el plato: el haz se despega de la antena, que además es lo que
   ocurre. */
const RADAR = () => {
  const cx = 176;
  const cy = 294;
  const rimX = 54;
  const rimY = 32;
  /* Escorzo POSITIVO. Con el signo cambiado el plato mira arriba-izquierda
     mientras el alimentador y los frentes de onda siguen calculados sobre la
     normal de arriba-derecha, así que las tres piezas apuntaban a sitios
     distintos: el cuenco a un lado y su propio haz al otro. La normal del
     plato queda en 68°, que es sobre lo que se centran los frentes. */
  const ESCORZO = 22;

  const nervios = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    nervios.push(
      `<path d="M ${cx} ${cy} L ${(cx + Math.cos(a) * rimX).toFixed(1)} ${(
        cy +
        Math.sin(a) * rimY
      ).toFixed(1)}" ${traza(DETALLE, 0.8)}/>`,
    );
  }

  /* El haz, como frentes de onda y no como cuña rellena.

     La cuña gris era una mancha despegada de la antena y encima competía en
     tono con el plato. Tres arcos concéntricos sobre el eje de puntería dicen
     lo mismo —esto barre hacia allá— con trazo en vez de masa, que es el
     registro del resto de la lámina. Van centrados en 68°, que es la normal
     del plato con su escorzo: el haz sale por donde apunta el cuenco. */
  const frentes = [70, 82, 94]
    .map((r, i) => {
      const p = (t) => [
        (cx + r * Math.cos((t * Math.PI) / 180)).toFixed(1),
        (cy - r * Math.sin((t * Math.PI) / 180)).toFixed(1),
      ];
      const [x1, y1] = p(48);
      const [x2, y2] = p(88);
      return `<path d="M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}" ${traza(
        BORDE,
        0.5 - i * 0.13,
      )}/>`;
    })
    .join("");

  return {
    nombre: "radar",
    masas: `
      <defs>
        <!-- El cuenco es cóncavo: la luz entra por arriba-izquierda, el fondo
             se cierra hacia abajo-derecha y el canto inferior recoge rebote.
             Mismo esquema que un cilindro, tumbado con la elipse. Tope en
             #d0d0d0 y no en blanco: por encima de ahí la masa se traga los
             nervios, que son justo lo que dice que esto es un plato. -->
        <linearGradient id="cuenco" x1="128" y1="258" x2="228" y2="330"
                        gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#242424"/>
          <stop offset="0.32" stop-color="#6e6e6e"/>
          <stop offset="0.70" stop-color="#d0d0d0"/>
          <stop offset="0.89" stop-color="#7a7a7a"/>
          <stop offset="1" stop-color="#9c9c9c"/>
        </linearGradient>
        ${cilindro("mastil", 154, 176)}
        ${proyectada("sombraR", 172, 258)}
      </defs>

      <!-- La sombra arranca EN el pie, no al lado: despegada, el aparato
           flotaba y la mancha se leía como un objeto más. -->
      <ellipse cx="204" cy="${SUELO + 1}" rx="50" ry="5.5" fill="url(#sombraR)"/>

      <ellipse cx="${cx}" cy="${cy}" rx="${rimX}" ry="${rimY}"
               transform="rotate(${ESCORZO} ${cx} ${cy})" fill="url(#cuenco)"/>

      <path d="M 152 ${SUELO} L 157 318 L 173 318 L 178 ${SUELO} Z" fill="url(#mastil)"/>
    `,
    lineas: `
      ${frentes}

      <g transform="rotate(${ESCORZO} ${cx} ${cy})">
        ${nervios.join("")}
        <ellipse cx="${cx}" cy="${cy}" rx="${rimX * 0.66}" ry="${rimY * 0.66}" ${traza(DETALLE, 0.8)}/>
        <ellipse cx="${cx}" cy="${cy}" rx="${rimX * 0.34}" ry="${rimY * 0.34}" ${traza(DETALLE, 0.8)}/>
        <ellipse cx="${cx}" cy="${cy}" rx="${rimX}" ry="${rimY}" ${traza(SILUETA)}/>
      </g>

      <!-- Alimentador en el foco, sobre su trípode. Las tres patas mueren en
           el borde del plato, no en el aire: antes una se salía de la elipse y
           se leía como un trazo suelto. -->
      <path d="M 193.2 251.4 L 133.1 264.9" ${traza(DETALLE, 0.75)}/>
      <path d="M 193.2 251.4 L 164.0 323.7" ${traza(DETALLE, 0.75)}/>
      <path d="M 193.2 251.4 L 227.2 302.9" ${traza(DETALLE, 0.75)}/>
      <rect x="188" y="245" width="11" height="9" fill="${TINTA}"/>

      <!-- Mástil, cuna y pie -->
      <path d="M 152 ${SUELO} L 157 318 L 173 318 L 178 ${SUELO} Z" ${traza(SILUETA)}/>
      <path d="M 157 318 L 166 302" ${traza(BORDE)}/>
      <path d="M 173 318 L 181 306" ${traza(BORDE)}/>
      <circle cx="${cx}" cy="${cy}" r="3.4" fill="${TINTA}"/>
      <path d="M 153.6 346 L 176.4 346" ${traza(DETALLE, 0.5)}/>
      <path d="M 155.2 332 L 174.8 332" ${traza(DETALLE, 0.5)}/>
      <rect x="146" y="${SUELO - 8}" width="38" height="8" fill="${TINTA}"/>

      <!-- Contactos. Solo el que cayó dentro del barrido lleva marca: eso es
           el «distingue y avisa» del pie. -->
      <circle cx="96" cy="286" r="2.2" fill="${TINTA}" fill-opacity="0.26"/>
      <circle cx="70" cy="326" r="2.2" fill="${TINTA}" fill-opacity="0.26"/>
      <circle cx="268" cy="330" r="2.2" fill="${TINTA}" fill-opacity="0.26"/>
      <circle cx="118" cy="238" r="2.2" fill="${TINTA}" fill-opacity="0.26"/>
      <circle cx="217" cy="216" r="3.2" fill="${TINTA}"/>
      <rect x="208" y="207" width="18" height="18" ${traza(BORDE)}/>

      <path d="M 20 ${SUELO} L 300 ${SUELO}" ${traza(BORDE, 0.55)}/>
    `,
  };
};

/* Compuerta de aliviadero — el caudal corre y para donde toca.

   Lo que faltaba no era tono sino aparato: una compuerta radial de verdad
   lleva tablero de maniobra sobre las pilas, barandilla, cables de izado que
   bajan al labio y un gorrón con su corona de tornillos. Ese detalle es el que
   hace que se lea como una obra y no como un icono.

   Dos aguas distintas y a propósito: la retenida va en filetes horizontales
   —la convención del grabado para lámina en calma— y solo la que corre va
   tramada. Como masa punteada las dos se leían igual. */
const COMPUERTA = () => ({
  nombre: "compuerta",
  masas: `
    <defs>
      ${cilindro("pilaI", 46, 78)}
      ${cilindro("pilaD", 242, 274)}
      <!-- El tablero es una chapa curva: la sombra núcleo cae metida hacia la
           derecha y el labio recoge el rebote del agua. -->
      <linearGradient id="tablero" x1="78" y1="0" x2="242" y2="0"
                      gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#6a6a6a"/>
        <stop offset="0.16" stop-color="#242424"/>
        <stop offset="0.46" stop-color="#8e8e8e"/>
        <stop offset="0.76" stop-color="#f8f8f8"/>
        <stop offset="0.93" stop-color="#8c8c8c"/>
        <stop offset="1" stop-color="#bcbcbc"/>
      </linearGradient>
      <!-- El caudal se concentra bajo la compuerta y se deshace hacia las
           pilas. Un rectángulo de tono plano se leía como un bloque de ruido
           con dos cantos rectos. -->
      <linearGradient id="caudal" x1="78" y1="0" x2="242" y2="0"
                      gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#141414"/>
        <stop offset="0.22" stop-color="#c4c4c4"/>
        <stop offset="0.55" stop-color="#f0f0f0"/>
        <stop offset="0.85" stop-color="#9a9a9a"/>
        <stop offset="1" stop-color="#181818"/>
      </linearGradient>
    </defs>

    <rect x="78" y="336" width="164" height="30" fill="url(#caudal)"/>
    <!-- Sombra del tablero sobre el agua que pasa -->
    <path d="M 92.8 279 A 82 82 0 0 0 227.2 279 L 227.2 292 A 82 82 0 0 1 92.8 292 Z"
          fill="#ffffff" fill-opacity="0.5"/>
    <path d="M 78.1 289.4 A 100 100 0 0 0 241.9 289.4 L 227.2 279.0
             A 82 82 0 0 1 92.8 279.0 Z" fill="url(#tablero)"/>
    <rect x="46" y="240" width="32" height="126" fill="url(#pilaI)"/>
    <rect x="242" y="240" width="32" height="126" fill="url(#pilaD)"/>
  `,
  lineas: `
    <!-- Tablero de maniobra sobre las pilas, con su barandilla -->
    <rect x="40" y="232" width="240" height="8" fill="${TINTA}"/>
    <path d="M 40 220 L 280 220" ${traza(BORDE)}/>
    <path d="M 40 226 L 280 226" ${traza(DETALLE, 0.55)}/>
    ${Array.from({ length: 13 }, (_, i) => {
      const x = 46 + i * 19;
      return `<path d="M ${x} 220 L ${x} 232" ${traza(DETALLE, 0.55)}/>`;
    }).join("")}

    <!-- Agua retenida: filetes horizontales, no trama -->
    <path d="M 26 250 L 294 250" ${traza(BORDE, 0.6)}/>
    <path d="M 92 257 L 232 257" ${traza(DETALLE, 0.4)}/>
    <path d="M 80 263 L 244 263" ${traza(DETALLE, 0.32)}/>
    <path d="M 100 269 L 220 269" ${traza(DETALLE, 0.24)}/>

    <!-- Cables de izado, del tablero al labio -->
    <path d="M 62 240 L 80.5 287" ${traza(DETALLE, 0.7)}/>
    <path d="M 258 240 L 239.5 287" ${traza(DETALLE, 0.7)}/>

    <!-- Carrera: dónde queda la hoja cuando cierra -->
    <path d="M 78.1 289.4 A 100 100 0 0 0 241.9 289.4"
          stroke="${TINTA}" stroke-opacity="0.16" stroke-width="${DETALLE}"
          stroke-dasharray="3 5" fill="none" transform="rotate(17 160 232)"/>

    <!-- Brazos y gorrón con su corona de tornillos -->
    <path d="M 160 240 L 78.1 289.4" ${traza(BORDE, 0.7)}/>
    <path d="M 160 240 L 241.9 289.4" ${traza(BORDE, 0.7)}/>
    <circle cx="160" cy="240" r="8" ${traza(BORDE)}/>
    ${Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return `<circle cx="${(160 + Math.cos(a) * 5.4).toFixed(1)}" cy="${(
        240 +
        Math.sin(a) * 5.4
      ).toFixed(1)}" r="0.9" fill="${TINTA}"/>`;
    }).join("")}
    <circle cx="160" cy="240" r="2.4" fill="${TINTA}"/>

    <path d="M 78.1 289.4 A 100 100 0 0 0 241.9 289.4 L 227.2 279.0
             A 82 82 0 0 1 92.8 279.0 Z" ${traza(SILUETA)}/>
    <!-- Nervios del tablero -->
    ${[0.25, 0.5, 0.75]
      .map((t) => {
        const a = Math.PI * (1 + t);
        const x = 160 + Math.cos(a) * 91;
        const y = 240 + Math.sin(a) * -91;
        return `<path d="M 160 240 L ${x.toFixed(1)} ${y.toFixed(1)}" ${traza(DETALLE, 0.35)}/>`;
      })
      .join("")}

    <rect x="46" y="240" width="32" height="126" ${traza(SILUETA)}/>
    <rect x="242" y="240" width="32" height="126" ${traza(SILUETA)}/>

    <!-- El caudal, corriendo aguas afuera -->
    <path d="M 274 344 L 306 344" ${traza(DETALLE, 0.4)}/>
    <path d="M 274 353 L 298 353" ${traza(DETALLE, 0.4)}/>
    <path d="M 274 361 L 310 361" ${traza(DETALLE, 0.4)}/>
    <path d="M 14 344 L 46 344" ${traza(DETALLE, 0.4)}/>
    <path d="M 22 353 L 46 353" ${traza(DETALLE, 0.4)}/>

    <path d="M 12 ${SUELO} L 308 ${SUELO}" ${traza(BORDE, 0.55)}/>
  `,
});

/* Torre de control — un puesto para ver y accionar todo.

   El fuste es donde más se nota la regla de las seis luces: con una rampa que
   oscurecía hasta el canto derecho era un trapecio pintado; con la sombra
   núcleo metida al 74% y el rebote en el borde es un cilindro. Ningún contorno
   hace ese trabajo.

   El acristalado va oscuro —el vidrio en grabado se lee oscuro, no claro— con
   una banda de reflejo abajo, que es lo que lo distingue de un hueco. */
const TORRE = () => ({
  nombre: "torre",
  masas: `
    <defs>
      ${cilindro("fuste", 143, 177)}
      ${cilindro("basa", 132, 188)}
      <!-- Vidrio: oscuro arriba, con el reflejo del cielo entrando abajo -->
      <linearGradient id="vidrio" x1="0" y1="236" x2="0" y2="266"
                      gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fafafa"/>
        <stop offset="0.62" stop-color="#c8c8c8"/>
        <stop offset="0.85" stop-color="#3a3a3a"/>
        <stop offset="1" stop-color="#6e6e6e"/>
      </linearGradient>
      ${proyectada("sombraT", 166, 254)}
    </defs>

    <!-- Arranca EN la basa, no al lado -->
    <ellipse cx="198" cy="${SUELO + 1}" rx="54" ry="6" fill="url(#sombraT)"/>
    <path d="M 143 356 L 149 266 L 171 266 L 177 356 Z" fill="url(#fuste)"/>
    <path d="M 132 356 L 136 344 L 184 344 L 188 356 Z" fill="url(#basa)"/>
    <path d="M 132 266 L 124 238 L 196 238 L 188 266 Z" fill="url(#vidrio)"/>
  `,
  lineas: `
    <!-- Visuales: lo que la torre vigila -->
    <path d="M 160 252 L 16 266" stroke="${TINTA}" stroke-opacity="0.2"
          stroke-width="${DETALLE}" stroke-dasharray="5 4" fill="none"/>
    <path d="M 160 252 L 20 322" stroke="${TINTA}" stroke-opacity="0.2"
          stroke-width="${DETALLE}" stroke-dasharray="5 4" fill="none"/>
    <path d="M 160 252 L 304 266" stroke="${TINTA}" stroke-opacity="0.2"
          stroke-width="${DETALLE}" stroke-dasharray="5 4" fill="none"/>
    <path d="M 160 252 L 300 322" stroke="${TINTA}" stroke-opacity="0.2"
          stroke-width="${DETALLE}" stroke-dasharray="5 4" fill="none"/>
    <rect x="13.5" y="263.5" width="5" height="5" fill="${TINTA}" fill-opacity="0.4"/>
    <rect x="17.5" y="319.5" width="5" height="5" fill="${TINTA}" fill-opacity="0.4"/>
    <rect x="301.5" y="263.5" width="5" height="5" fill="${TINTA}" fill-opacity="0.4"/>
    <rect x="297.5" y="319.5" width="5" height="5" fill="${TINTA}" fill-opacity="0.4"/>

    <!-- Fuste, con las plantas marcadas -->
    <path d="M 143 356 L 149 266 L 171 266 L 177 356 Z" ${traza(SILUETA)}/>
    <path d="M 145.9 313 L 174.1 313" ${traza(DETALLE, 0.45)}/>
    <path d="M 147.4 290 L 172.6 290" ${traza(DETALLE, 0.45)}/>
    <path d="M 152 356 L 152 336 L 168 336 L 168 356" ${traza(BORDE, 0.8)}/>

    <!-- Basa -->
    <path d="M 132 356 L 136 344 L 184 344 L 188 356 Z" ${traza(SILUETA)}/>

    <!-- Cabina acristalada, volada -->
    <path d="M 132 266 L 124 238 L 196 238 L 188 266 Z" ${traza(SILUETA)}/>
    ${[0.2, 0.4, 0.6, 0.8]
      .map((t) => {
        const xa = 124 + t * 72;
        const xb = 132 + t * 56;
        return `<path d="M ${xb.toFixed(1)} 266 L ${xa.toFixed(1)} 238" ${traza(DETALLE, 0.5)}/>`;
      })
      .join("")}
    <path d="M 129 256 L 191 256" ${traza(DETALLE, 0.4)}/>

    <!-- Galería y barandilla del techo -->
    <rect x="118" y="230" width="84" height="8" fill="${TINTA}"/>
    <path d="M 122 216 L 198 216" ${traza(BORDE, 0.9)}/>
    <path d="M 122 223 L 198 223" ${traza(DETALLE, 0.55)}/>
    ${Array.from({ length: 9 }, (_, i) => {
      const x = 124 + i * 9.5;
      return `<path d="M ${x} 216 L ${x} 230" ${traza(DETALLE, 0.5)}/>`;
    }).join("")}

    <!-- Mástil y anemómetro -->
    <path d="M 160 216 L 160 196" ${traza(BORDE)}/>
    <path d="M 152 200 L 168 200" ${traza(DETALLE, 0.7)}/>
    <circle cx="160" cy="194" r="2.6" fill="${TINTA}"/>

    <path d="M 20 ${SUELO} L 300 ${SUELO}" ${traza(BORDE, 0.55)}/>
  `,
});

const DIAGRAMAS = [RADAR(), COMPUERTA(), TORRE()];

/** Rasteriza el mapa de tono y devuelve un buffer de grises. */
async function mapaDeTono(masas) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO * ESCALA}" height="${
    ALTO * ESCALA
  }" viewBox="0 0 ${ANCHO} ${ALTO}"><rect width="${ANCHO}" height="${ALTO}" fill="#000"/>${masas}</svg>`;

  return sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
}

/** Siembra los puntos sobre el mapa de tono. */
function sembrar({ data, info }, semilla) {
  const azar = prng(semilla);
  const puntos = [];

  for (let y = PASO / 2; y < ALTO; y += PASO) {
    for (let x = PASO / 2; x < ANCHO; x += PASO) {
      const px = x + (azar() - 0.5) * PASO;
      const py = y + (azar() - 0.5) * PASO;
      if (px < 0 || py < 0 || px >= ANCHO || py >= ALTO) continue;

      const sx = Math.min(info.width - 1, Math.floor(px * ESCALA));
      const sy = Math.min(info.height - 1, Math.floor(py * ESCALA));
      const tono = data[sy * info.width + sx] / 255;
      if (tono <= 0.02) continue;
      if (azar() > Math.pow(tono, GAMMA)) continue;

      puntos.push([px.toFixed(1), py.toFixed(1), (R_MIN + (R_MAX - R_MIN) * tono).toFixed(2)]);
    }
  }

  return puntos;
}

let total = 0;

for (const [i, { nombre, masas, lineas }] of DIAGRAMAS.entries()) {
  const puntos = sembrar(await mapaDeTono(masas), 0x5e * (i + 1) + 17);
  const circulos = puntos.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" role="presentation">` +
    `<g fill="${TINTA}">${circulos}</g>` +
    lineas.replace(/\s+/g, " ").trim() +
    `</svg>\n`;

  await writeFile(`public/img/diagrama-${nombre}.svg`, svg);
  total += puntos.length;

  console.log(
    `${nombre.padEnd(11)} ${String(puntos.length).padStart(5)} puntos   ${(svg.length / 1024).toFixed(0)} KB`,
  );
}

console.log(`\nlisto — ${total} puntos en ${DIAGRAMAS.length} láminas`);
