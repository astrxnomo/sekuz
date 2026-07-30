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

## Ilustración: dos formas, y no se mezclan

La serie tiene dos tipos de pieza y cada una tiene su componente. Confundirlas
es el error que más veces se ha repetido aquí.

**`Escena`** — paisajes a sangre, como fondo de sección. Van con `velo` desde el
lado donde vive el texto, y el texto se apoya en el cielo vacío de la lámina.
Necesitan sangre y aire; encajonadas no funcionan.
Hoy: `observatorio` (hero), `hero` (Qué hacemos), `puente` (Casos),
`montanas` (Inversión), `cta` (cierre). `campos` está sin usar.

**`Lamina`** — objetos sueltos, en una casilla del grid. **Al ancho completo de
su columna**, nunca un cuadrado suelto. La disolución de bordes va por máscara y
no por velos de color, porque estas caen sobre la retícula del fondo y un
degradado a `crema` solo cuadra si detrás hay exactamente crema.
Hoy: `senal`, `esclusa`, `caseta` (Qué hacemos), `estacion` (El punto de
partida), `esclusas` (Cómo trabajamos).

**Los archivos de `Lamina` van sin papel, con canal alfa.** Es lo que las hace
indistinguibles de las grandes: la tinta cae directa sobre el crema del sitio y
no hay rectángulo que ver. Un recorte con su papel se lee como imagen cuadrada
incrustada por más que se le baje la opacidad. El procedimiento, con el script,
está en `assets-brief.md`; si añades una viñeta nueva, pásala por ahí antes de
montarla.

## La regla que decide si una imagen entra

**Toda ilustración tiene que estar emparejada con una pieza concreta de
contenido, y tener sitio para verse entera.** Si no hay pareja, o no hay
tamaño, la sección se queda en papel limpio. Un hueco al lado de un titular es
una razón para dejar aire, no para meter un grabado.

Emparejada quiere decir dos cosas a la vez:

1. **Semántica.** El objeto ES el mecanismo del que habla su texto. La compuerta
   de aliviadero ilustra «procesos que corren solos y saben cuándo parar» porque
   una compuerta es literalmente eso. Y cuando la metáfora no es evidente, se
   dice: las tres
   láminas de Qué hacemos llevan pie con el nombre del aparato y su lectura, que
   es lo que las separa de ser adorno.
2. **Estructural.** La lámina comparte márgenes y reglas con el texto. Al ancho
   de la columna, con el pie colgando de una regla a ras de su borde. Nada
   posicionado en absoluto.

### Lo que ya se probó y no funciona

- **Objeto detrás del texto.** Obliga a velarlo tanto para que las líneas se
  lean que deja de verse qué es. Los paisajes aguantan texto encima porque
  tienen cielo vacío por diseño; un aparato aislado no.
- **Objeto suelto junto al texto, sin borde compartido.** Se lee como una
  pegatina, aunque tenga zona propia.
- **Posicionar en absoluto junto a un bloque `sticky`.** Al scrollear el texto
  sube y la ilustración se queda clavada, así que el bloque se descose a la
  vista. Fue el caso de Proceso.
- **Un paisaje denso en una casilla pequeña.** `esclusas.webp` es la metáfora
  exacta de las cuatro fases de Proceso, y aun así como paisaje no funcionaba: a
  250px el recorte lo convertía en una mancha gris, y ni al ancho de la columna
  llegaba a leerse como lo que era. Los paisajes solo se leen a sangre. La
  salida no fue cambiar de metáfora sino **de familia**: hoy es un objeto
  aislado, no un paisaje. Si una imagen falla en su casilla, mira antes si el
  problema es la familia que si es el sujeto.
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

Guía completa, con prompts, costos y encuadres: **`assets-brief.md`**. Léela
antes de generar; el hallazgo que la sostiene es que **pasar `_ref/45.webp` como
imagen de referencia es lo que hace que el estilo coincida**. Sin referencia el
modelo interpreta «stipple» como plumilla o como halftone gigante, y ninguna de
las dos se parece a la serie.

Para varias viñetas de objeto, genera **una plancha 2x2 y recórtala** en vez de
una imagen por viñeta: es una generación en lugar de cuatro. Y exige el trama
grueso de forma explícita — pedir «stipple» sin más devuelve plumilla fina, que
no pega con el faro.

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
