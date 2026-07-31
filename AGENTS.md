<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sekuz — reglas del proyecto

Papel crema, ilustración de trama de puntos, monoespaciada. El sistema de
diseño vive en `app/globals.css` y el copy entero en `lib/content.ts`: los
componentes no llevan texto escrito a mano.

`lib/content.ts` abre con un aviso de datos de muestra. **Las cifras, los casos y
los testimonios son inventados.** No los presentes como reales ni los uses como
base de nada; hay que reemplazarlos antes de publicar.

## Ilustración: cinco formas, y no se mezclan

Cada tipo de pieza tiene su componente. Confundirlas es el error que más veces
se ha repetido aquí.

Y una regla que ordena las cinco: **la trama orgánica es para dibujo, la trama
regular es para dato.** El stipple —colocación al azar, densidad variable— se
lee dibujado a mano y es lo que quiere un grabado. El halftone —rejilla
regular, punto de tamaño variable— se lee mecánico, que en una ilustración es
el defecto y en una tabla de cifras es la virtud, porque es lo único que
permite comparar dos celdas de un vistazo. Por eso `Diagram` siembra punto a
punto y `DensityMatrix` usa `<pattern>`. No los cruces.

**`Scene`** — paisajes a sangre, como fondo de sección. Van con `veil` desde el
lado donde vive el texto, y el texto se apoya en el cielo vacío de la lámina.
Necesitan sangre y aire; encajonadas no funcionan.
Hoy: `lab` (hero), `faro` (Qué hacemos), `puente` (Casos), `motana` (Inversión),
`acantilado` (cierre). `campo` está sin usar.

**`Diagram`** — dibujo técnico, para las casillas del grid donde una ilustración
no cabe. Tinta y papel: masas tramadas y el resto filete de un pelo. El trazo
vive en la mitad inferior de su caja, así que el índice y el nombre caen sobre
el vacío de arriba sin necesidad de velo — un degradado sobre trazo fino lo
borra en vez de apagarlo. Hoy: `radar`, `compuerta`, `torre` (las tres franjas
de Qué hacemos).

**No se dibujan en el componente.** La fuente es `scripts/generar-diagramas.mjs`
y los `.svg` de `public/img/` son producto: si tocas un diagrama, edita el
script y vuelve a correrlo.

### En un grabado el tono es la densidad

Es el error que costó rehacer esta familia entera. La primera versión trazaba
el SVG en el componente y rellenaba las masas con un `<pattern>` de puntos
iguales. Se veía a plástico, y el motivo es de oficio: en reprografía hay dos
familias opuestas — el **halftone** es rejilla regular con puntos de tamaño
variable, y el **stipple** es colocación orgánica con densidad variable. El
primero se lee mecánico; el segundo, dibujado a mano. Un patrón de puntos
idénticos no es ninguno de los dos: tiene la rigidez del halftone y no tiene el
tono de nadie.

Por eso las masas se siembran punto a punto contra un mapa de tono, con la
densidad **y** el calibre creciendo juntos hacia las sombras. Tres consecuencias
que conviene no deshacer:

### Las dos reglas de oficio del dibujo

Resuelta la trama, el dibujo seguía leyéndose de aficionado. Faltaban dos cosas
que el dibujo técnico da por sentadas:

1. **Jerarquía de línea 4:2:1** — silueta, borde y detalle en esa proporción.
   Que un remache y un contorno pesen igual es lo que aplanaba la lámina. En el
   script son `SILUETA`, `BORDE` y `DETALLE`; no metas un cuarto grosor.
2. **Las seis luces**: brillo, luz directa, sombra, **sombra núcleo**, luz
   reflejada y sombra proyectada. Un degradado de dos paradas que oscurece
   hasta el borde es el error de principiante. En un cilindro la banda más
   oscura va **metida** hacia dentro (al 68%) y más allá el canto vuelve a
   levantarse con luz reflejada — ese rebote es lo único que convierte un
   degradado en un volumen. Está en el ayudante `cilindro()`, y sus extremos
   van medidos: llevados al máximo, la envolvente se parte en un lado vacío y
   una franja densa que se lee como raya pintada.

Y dos correcciones que costaron una pasada cada una:

- **La sombra proyectada arranca en el pie del objeto**, no a su lado. Despegada
  se lee como una mancha aparte y el aparato flota.
- **Alimentador y haz tienen que salir de la normal real del plato.** El escorzo
  de la antena iba en negativo mientras el foco y los frentes de onda estaban
  calculados sobre la normal contraria: el cuenco miraba a un lado y su propio
  haz al otro. Si tocas el escorzo, recalcula las dos.

- **El volumen lo hace el degradado, no el contorno.** El fuste de la torre es
  un cilindro porque su tono cae de un lado al otro.
- **El jitter es obligatorio.** Sin desplazar cada punto dentro de su celda
  vuelve la rejilla mecánica por mucho que varíe el radio.
- **El negro sólido no se trama.** Un macizo pequeño —el pedestal del radar, el
  remate de la torre— va como forma rellena. Forzar la trama a colapsar exige
  un paso tan fino que dispara el peso por una masa de veinte píxeles.

Y una convención que separa dos cosas que la trama confundía: **el agua en
calma va en filetes horizontales y solo la que corre va tramada.** Como masa
punteada, el embalse y el caudal se leían igual.

Los tres SVG pesan 475 KB en crudo y **44 KB en brotli** — el marcado de
círculos repetidos comprime muy bien, así que no hay que optimizar el conteo de
puntos a ojo. Mide antes de tocarlo.

**`Swimlane`** — dos carriles y un salto, al pie de «Qué hacemos». La única
pieza que dibuja **un argumento y no un aparato**: la máquina trabaja hasta un
umbral explícito y cruzarlo baja al carril de la persona. Sale entera del copy
de `pillars.limite`; si cambia el número de pasos, se recompone sola.

Va ahí y no en la FAQ —que es donde vive la objeción que contesta— porque en la
FAQ está dentro de un `<details>` cerrado, así que solo lo ve quien ya
sospechaba. Su convención propia: **trazo continuo es automático, trazo cortado
es humano.** No la uses para otra cosa.

**`DensityMatrix`** — rejilla donde la cantidad de tinta ES la cifra, en
«Resultados». Cada celda un día, la trama el volumen, y filete alrededor de los
que pasaron el umbral. Es la única familia que **no se puede dibujar sin datos
detrás**, y por eso la nota al pie va entre `[[ ]]`: una serie dibujada parece
una medición, que afirma más que una cifra escrita. No quites ese marcado sin
sustituir los números de `results.serie`.

**`Plate`** — objetos recortados con canal alfa, en una casilla del grid. **Hoy
no hay ninguno montado**: el componente y su script (`scripts/procesar-laminas.mjs`)
siguen ahí porque la técnica está resuelta y documentada, pero las viñetas que
existieron se retiraron y `Diagram` ocupa su sitio. Si vuelves a montar una, lee
antes «Por qué se fueron las viñetas».

### Por qué se fueron las viñetas

**Por tamaño, no por gusto.** Llegaban del generador a 293-430px para servir
casillas de ~400px, o sea por debajo de 1x incluso sin pantalla Retina, y una
trama de puntos a esa escala se deshace en una mancha gris. No es un problema
que se arregle regenerando más grande sin más: el generador que produjo la serie
tiene su propio techo de resolución, y la plancha 2x2 salió además en 16:9 en
vez de 1:1, con lo que cada cuadrante recibió la mitad de píxeles que le tocaba.

El dibujo técnico no tiene ese techo — es geometría, se ve igual a cualquier
tamaño y pesa lo que ocupa su código. Por eso la salida no fue regenerar sino
cambiar de familia otra vez, que es el mismo movimiento que ya se había hecho
con la escalera de esclusas. **Si una imagen falla en su casilla, mira antes si
el problema es la familia que si es el sujeto.**

## La regla que decide si una imagen entra

**Toda ilustración tiene que estar emparejada con una pieza concreta de
contenido, y tener sitio para verse entera.** Si no hay pareja, o no hay
tamaño, la sección se queda en papel limpio. Un hueco al lado de un titular es
una razón para dejar aire, no para meter un grabado.

Emparejada quiere decir dos cosas a la vez:

1. **Semántica.** El objeto ES el mecanismo del que habla su texto. La compuerta
   de aliviadero ilustra «procesos que corren solos y saben cuándo parar» porque
   una compuerta es literalmente eso. Y cuando la metáfora no es evidente, se
   dice: los tres diagramas de Qué hacemos llevan pie con el nombre del aparato
   y su lectura (`object` y `reading` en `lib/content.ts`), que es lo que los
   separa de ser adorno. En un diagrama la exigencia sube: la geometría tiene
   que decir lo que dice el pie, así que si cambia el aparato hay que redibujar,
   no recolocar.
2. **Estructural.** La pieza comparte márgenes y reglas con el texto. Al ancho
   de la columna, con el pie colgando de una regla a ras de su borde. Nada
   posicionado en absoluto.
3. **Un lado libre.** `Scene` vela un solo lado, así que solo entra donde el
   texto vive de un lado y el otro queda despejado — titular a la izquierda y
   nada a la derecha. Es la condición que cumplen las cinco secciones que llevan
   lámina, y la que descalifica a las que no.

### Lo que ya se probó y no funciona

- **Objeto detrás del texto.** Obliga a velarlo tanto para que las líneas se
  lean que deja de verse qué es. Los paisajes aguantan texto encima porque
  tienen cielo vacío por diseño; un aparato aislado no.
- **Objeto suelto junto al texto, sin borde compartido.** Se lee como una
  pegatina, aunque tenga zona propia.
- **Posicionar en absoluto junto a un bloque `sticky`.** Al scrollear el texto
  sube y la ilustración se queda clavada, así que el bloque se descose a la
  vista. Fue el caso de Proceso.
- **Un paisaje denso en una casilla pequeña.** La escalera de esclusas era la
  metáfora exacta de las cuatro fases de Proceso, y aun así como paisaje no
  funcionaba: a 250px el recorte lo convertía en una mancha gris, y ni al ancho
  de la columna llegaba a leerse como lo que era. Los paisajes solo se leen a
  sangre.
- **Una `Scene` en una sección con las dos columnas cargadas.** Se probó el
  viaducto a sangre en Proceso, que es su metáfora exacta —un vano tras otro
  sosteniendo un recorrido— y con `zone="upper"`. En pantalla los arcos caen
  enteros sobre «Diagnóstico» y «Prototipo» y el texto deja de leerse; con
  `veil="top"` se vela la franja completa y el puente desaparece. **No es
  cuestión de encuadre: `Scene` protege un lado y Proceso no tiene lado libre**,
  porque el titular ocupa la izquierda y las cuatro fases la derecha de arriba
  abajo. Hoy Proceso va en papel limpio y su línea de tiempo vertical hace de
  gráfico.
- **Padding para separar columnas iguales.** La del medio lo lleva a los dos
  lados y las de los extremos a uno, así que mide menos y sus piezas arrancan a
  otra altura. Va con `gap` y el divisor en pseudo-elemento a media separación.
- **Cuatro bloques de texto por fila.** Es lo que impedía que cupiera la
  ilustración. Si hace falta sitio para una imagen, el recorte sale del copy,
  no del tamaño de la imagen.

En `Plate`, el contenedor va `relative` y la imagen en `absolute inset-0`. Con
la imagen en flujo y `h-full` hay dependencia circular y el `aspect-ratio` no
gobierna la altura, y el velo — que va en `inset-0` — se mide contra un ancestro
cualquiera. Las dos cosas fallan en silencio.

## Generar ilustración nueva

**Antes de generar nada, pregúntate si hace falta una imagen.** Las casillas
pequeñas se resuelven mejor con `Diagram`, que no tiene techo de resolución. Lo
que sí hay que generar son paisajes a sangre, y solo si hay una sección con un
lado libre esperándolos.

Guía completa, con prompts, costos y encuadres: **`assets-brief.md`**. Léela
antes de generar; el hallazgo que la sostiene es que **pasar una lámina de la
serie como imagen de referencia es lo que hace que el estilo coincida**. Sin
referencia el modelo interpreta «stipple» como plumilla o como halftone
gigante, y ninguna de las dos se parece a la serie. La carpeta `_ref/` ya no
existe, así que **la referencia se toma de `public/img/`**: `faro.webp` es la
lámina que fijó el estilo y `lab.webp` la de registro contemporáneo.

Las secciones de `assets-brief.md` sobre la plancha 2x2 y el recorte de papel
describen un flujo que hoy no se usa — no hay viñetas montadas. Siguen siendo
correctas en lo técnico si alguna vez se vuelve a él.

## Navegación

La barra no lleva regla inferior en ningún estado: es lo que la hacía leerse
como una pieza pegada encima. Arriba del todo va transparente sobre el papel del
hero, y al bajar entra un velo con desenfoque. Ese velo va en **una capa aparte
y con máscara**, no en el `<header>`: aplicado al header, el desenfoque termina
en un canto recto a los 64px, que es el mismo borde que se quería quitar.

## Movimiento y accesibilidad

Los reveals van con `IntersectionObserver`, nunca con `window.addEventListener
('scroll')`. Ojo al depurar: una captura de página completa sale con las
secciones sin revelar y parecen vacías — hay que hacer scroll y esperar.

`transform` en un ancestro rompe el `position: sticky` del hijo. Por eso la
columna del titular en `Proceso` no lleva `revelar`.

Contraste mínimo AA en todo texto: `--tinta-suave` está calibrado justo en
4.67:1 sobre el crema. No lo aclares.
