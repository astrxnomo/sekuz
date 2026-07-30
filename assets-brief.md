# Assets — estilo stipple

Guía para generar más ilustraciones que encajen con la serie sin volver a calibrar el estilo desde cero.

> **La serie 1 está en reemplazo.** Todo lo que describe la primera mitad de
> este documento sigue en producción y sigue siendo cierto en lo técnico, pero
> los sujetos cambian: se pasa de aparatos decimonónicos a **infraestructura
> contemporánea**. El plan está en «Serie 2» al final, y las secciones de
> técnica (recorte de papel, trama gruesa, costos) valen igual para las dos.

## Qué hay hoy

| Archivo en `public/img/` | Origen | Escena | Uso |
|---|---|---|---|
| `observatorio.webp` | generado, 4k | Observatorio con antenas parabólicas en meseta | **Hero** |
| `hero.webp` | preexistente (`_ref/45.webp`) | Faro en acantilado costero | Qué hacemos |
| `puente.webp` | generado, 4k | Viaducto de piedra sobre valle boscoso | Cómo trabajamos |
| `campos.webp` | preexistente (`_ref/46.webp`) | Campos de trigo con casa rural | *sin usar — disponible* |
| `cta.webp` | preexistente (`_ref/48.webp`) | Cordillera con bosque de coníferas | Cierre / contacto |
| `montanas.webp` | preexistente (`_ref/49.webp`) | Costa de acantilados con pinos | Inversión |

El nombre `hero.webp` es histórico: hoy ilustra la sección "Qué hacemos", no el hero. No lo renombré para no romper referencias, pero si haces limpieza, ese es el candidato.

Los originales de referencia quedaron en `_ref/`. No se sirven al sitio; están ahí para usarlos como imagen de referencia de estilo en generaciones futuras.

## Cómo se montan en la página

Todas pasan por `components/ui/Scene.tsx`, que resuelve tres cosas de una vez:

1. **La lámina va a sangre**, como fondo de sección, nunca dentro de un recuadro.
2. **Se disuelve por los cuatro bordes** con degradados hacia el crema. Sin eso la ilustración corta en seco contra el borde de la ventana y se lee como una estampa pegada encima.
3. **El velo cae desde el lado donde vive el texto** (`left` o `top`), no sobre toda la imagen. Así el sujeto queda nítido y el texto legible.

El encuadre de cada una se ajusta con la prop `position` (formato de `object-position`). Los valores actuales están calibrados para que el sujeto — antenas, faro, arcos — quede en el tercio derecho y no lo coma el degradado lateral.

## Viñetas de objeto

Aparte de los paisajes hay una segunda familia: **objetos técnicos antiguos**,
uno por viñeta, cuadrados, para las casillas del grid. Hoy son cuatro y salieron
todos de **una sola generación**: una plancha 2x2 recortada en cuatro. Cuatro
generaciones sueltas habrían costado 12 créditos; la plancha costó 3.

| Archivo | Sujeto | Uso |
|---|---|---|
| `senal.webp` | Semáforo óptico de telégrafo | Qué hacemos · 01 |
| `esclusa.webp` | Esclusa de canal con compuertas | Qué hacemos · 02 |
| `caseta.webp` | Caseta de señales de vía | Qué hacemos · 03 |
| `estacion.webp` | Estación meteorológica en cumbre | El punto de partida |

Los sujetos no son decorativos: cada uno es el mecanismo del que habla su
columna. La caseta de señales es un puesto de mando, la esclusa es un flujo que
para donde toca, el semáforo decide y comunica. Si se agregan más, mantén ese
criterio — aparatos que hacen el trabajo del que habla la sección, nunca robots
ni circuitos.

### Hay que quitarles el papel antes de montarlas

**Una viñeta recortada tal cual del generador se ve como un cuadrado
incrustado, y no es cuestión de opacidad.** Las láminas grandes de la serie van
a sangre, así que su crema *es* el fondo de la página y no hay ningún borde que
ver. Una viñeta es un panel recortado: trae su propio papel, que el generador
saca casi en blanco (L≈250) mientras el crema del sitio está en 239. Un
rectángulo más claro sobre el crema.

Bajarle la opacidad no lo arregla — apaga la tinta y el rectángulo sigue ahí. Lo
que hay que quitar es el papel: se usa la luminancia invertida como canal alfa,
de modo que donde había papel queda transparente y donde había punto negro queda
tinta. El relleno va en `--ink` (`#14120f`), no en negro puro, para que los
puntos sean del tono del texto de la página.

```js
const UMBRAL = 228;               // a partir de aquí, todo es papel
const escala = 255 / UMBRAL;

const alfa = await sharp(entrada).greyscale().negate()
  .linear(escala, -(255 - UMBRAL) * escala).raw().toBuffer();

await sharp({ create: { width, height, channels: 3, background: "#14120f" } })
  .joinChannel(alfa, { raw: { width, height, channels: 1 } })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(salida);
```

**Lo que este proceso no quita** es la retícula de puntos tenues que el generador
dibuja en el fondo del panel: es igual de oscura que las texturas claras del
dibujo, así que ningún umbral las separa. Se resuelve en CSS, con el fundido
ancho de `Plate` (24%): la retícula se deshace hacia el papel y pasa por una
mancha del mismo grano que el fondo del sitio, que es lo que tienen las láminas
grandes. Con un fundido corto vuelve a leerse el cuadrado.

Para una tanda futura, **pide fondo crema liso y sin retícula de puntos en las
zonas vacías** y el recorte sale limpio de una. Los originales con papel están
respaldados por si hay que reprocesar con otro umbral.

### El prompt del trama grueso

El bloque de estilo de los paisajes **no sirve tal cual para las viñetas**. Con
él, el modelo devuelve grabado de plumilla fino: bonito, pero no pega con el
faro. Hay que pedir el trama de forma explícita y decir además qué no se quiere:

```
CRITICAL — match the reference image technique exactly: a COARSE HALFTONE DOT
SCREEN. The whole image is built from clearly visible individual round black
dots on a regular grid, dot pitch large enough that each dot reads separately.
Dark masses are dense clusters of dots collapsing into solid black. Midtones
are open dot grids. A faint regular dot grid covers the ENTIRE cream background
including all the empty sky, exactly like the reference. High contrast, flat and
graphic, black ink only.

NOT fine pen hatching. NOT delicate stippling. NOT engraving line work. NOT
smooth airbrushed gradients. Coarse mechanical dot screen only, like a
newspaper halftone enlarged.
```

Envuelto en la plancha: cuatro viñetas en rejilla 2x2 estricta sobre papel
crema, márgenes amplios y parejos, sin marcos ni texto ni números, y cada sujeto
centrado y pequeño con cielo punteado alrededor. Con `--aspect_ratio 1:1
--resolution 2k --quality medium`, los cuatro paneles salen alineados en
cuadrantes limpios y el recorte es puramente geométrico: 870px desde la esquina
de cada cuadrante (`left` 70 / 1029, `top` 62 / 1024). El script está en el
scratchpad de la sesión; son diez líneas de `sharp`.

## El hallazgo que importa

**Pasar `_ref/45.webp` como imagen de referencia es lo que hace que el estilo coincida.** Sin referencia, el modelo interpreta "stipple" como plumilla de líneas o como halftone de puntos gigantes — ninguna de las dos se parece a la serie. Con referencia, acierta en el primer intento.

Modelo: **GPT Image 2** (`gpt_image_2`). Requiere plan de pago en Higgsfield; el plan gratuito lo rechaza.

## Comando

```bash
higgsfield generate create gpt_image_2 \
  --prompt "<PROMPT>" \
  --image ./_ref/45.webp \
  --aspect_ratio 3:2 \
  --resolution 2k \
  --quality medium \
  --wait
```

## Plantilla de prompt

Mantén el bloque de estilo palabra por palabra y cambia solo la frase del sujeto:

```
Halftone stipple dot-screen landscape illustration in exactly the same
technique as the reference image: built entirely from fine black dots and
delicate crosshatch dot texture on warm cream ivory paper, black ink only,
no lines, no outlines. Subject: <SUJETO, posicionado en el tercio derecho
del cuadro, con el detalle en las masas oscuras>. Vast empty sky fills the
upper-left two thirds of the frame carrying only a faint even dot grid.
Antique letterpress engraving feel, extremely fine grain, flat and graphic,
no text, no border, no vignette.
```

Reglas de composición de la serie, que conviene no romper:

- Sujeto pesando a la **derecha** y hacia abajo.
- **Dos tercios superiores izquierdos vacíos** — es el espacio donde entra el texto de la página.
- Nubes o niebla entrando por la **esquina superior derecha**.
- Sin marco, sin viñeta, sin texto.

## Costos verificados

Precios por imagen en `gpt_image_2`, relación 3:2 (julio 2026):

| | low | medium | high |
|---|---|---|---|
| 1k | 0.5 | 2 | 4 |
| 2k | 0.75 | 3 | **7** |
| 4k | 1 | **6** | **12** |

Los assets actuales se generaron a **2k / medium (3 créditos)**, que es el punto donde la calidad ya es suficiente para web. 4k solo vale la pena si la imagen va a ocupar la pantalla completa en pantallas Retina grandes.

## Peso de los assets

Las láminas se sirven en `.webp` a 2400px y las referencias de `_ref/` en
`.webp` a tamaño original. Venían en PNG de 8–13 MB cada una: 117 MB en total,
que es inaceptable en un repositorio. Recomprimidas son 16 MB sin pérdida
apreciable — la ilustración es monocroma, así que webp la lleva bien.

Si añades una lámina nueva, pásala por el mismo tratamiento antes de commitear.

---

# Serie 2 — infraestructura contemporánea

## El territorio

**Grabado de infraestructura contemporánea.** Técnica del siglo XIX, sujetos del
siglo XXI, atmósfera sublime.

La tesis de la que sale todo lo demás: **la IA de Sekuz no es una novedad
brillante, es infraestructura.** Se instala, aguanta a la intemperie y trabaja
sola donde no hay nadie mirando. Por eso el sujeto es siempre un aparato en
servicio, solo, en un paisaje enorme; y por eso la técnica es un grabado de
catálogo antiguo, que es como se dibuja lo que se da por hecho que seguirá ahí.

## La regla de época

A las dos reglas de `AGENTS.md` — emparejamiento semántico y estructural — se
suma la que ejecuta el cambio de registro:

> **El sujeto tiene que ser un aparato que siga en servicio hoy.**
> Nada de vapor, telégrafo ni piedra tallada. Y en el otro extremo: nada de
> robots, pantallas, circuitos, hologramas ni cerebros — ese es el cliché de IA
> que este sitio existe para no parecer. Hormigón, acero y antena.

De ahí sale la escala y la soledad sin caer en la ruina: el drama lo pone el
paisaje, no la decadencia. **Todo lo que se dibuja está funcionando.**

## El repertorio

**Escenas** — a sangre, fondo de sección, vía `Scene`:

| Sección | Archivo | Sujeto | Por qué ese |
|---|---|---|---|
| Hero | `observatorio` | Antena de espacio profundo en meseta alta con niebla baja | Extraer señal utilizable de un ruido lejanísimo |
| Qué hacemos | `hero` | Campo de antenas alineadas de un interferómetro en llano seco | Varios aparatos apuntando coordinados |
| Casos | `puente` | Grúas pórtico de puerto de contenedores | Volumen real movido; carga que se soporta |
| Inversión | `montanas` | Parque eólico en una cresta | Se compra por unidades y produce con el tiempo |
| Cierre | `cta` | Estación terrena de satélite al amanecer, con pista de acceso | El cierre es un camino hacia algo |

**Viñetas** — objeto suelto en casilla del grid, vía `Plate`:

| Sección | Archivo | Sujeto | Pie de plancha |
|---|---|---|---|
| El punto de partida | `estacion` | Estación de medición automática con anemómetro | *Mide lo que nadie está mirando* |
| Qué hacemos · 01 | `senal` | Radar de vigilancia rotativo | *Barre, distingue y avisa* |
| Qué hacemos · 02 | `esclusa` | Compuerta de aliviadero de presa | *El caudal corre y para donde toca* |
| Qué hacemos · 03 | `caseta` | Torre de control | *Un puesto para ver y accionar todo* |
| Cómo trabajamos | `esclusas` | Escalera de esclusas **como objeto aislado** | *Ninguna abre hasta que la anterior cerró* |

Los nombres de archivo se conservan aunque el sujeto cambie: renombrar obliga a
tocar seis componentes y no aporta nada. Los pies de `senal`, `esclusa` y
`caseta` viven en `lib/content.ts` (`object` y `reading`) y **hay que
actualizarlos con el sujeto nuevo**, o el pie dejará de describir el dibujo.

`campos.webp` sale de la serie: lleva sin usarse desde el principio y no tiene
sitio en el repertorio nuevo.

### La de «Cómo trabajamos» no cambia de metáfora, cambia de familia

`AGENTS.md` ya dejó escrito que la escalera de esclusas *es* la metáfora exacta
de las cuatro fases y que aun así fallaba, porque «los paisajes solo se leen a
sangre». Hoy está metida en una casilla de 427px como si fuera una viñeta, y por
eso se lee como una imagen pegada. **El defecto no es el sujeto, es la familia**:
se regenera como objeto aislado a la altura del ojo, no como paisaje.

## Los prompts

### Bloque de estilo — escenas

Palabra por palabra; solo cambia la frase de `Subject:`.

```
Halftone stipple dot-screen landscape illustration in exactly the same
technique as the reference image: built entirely from fine black dots and
delicate crosshatch dot texture on warm cream ivory paper, black ink only,
no lines, no outlines. Subject: <SUJETO>. The structure is modern and in
active service, built of steel and concrete, intact and maintained — not
ruined, not abandoned, not overgrown. Vast empty sky fills the upper-left
two thirds of the frame carrying only a faint even dot grid. Thin fog enters
from the top right corner. Antique letterpress engraving feel, extremely fine
grain, flat and graphic, no text, no border, no vignette, no people,
no vehicles.
```

La frase de «modern and in active service … not ruined» es nueva y no es
opcional. Sin ella, «antique letterpress engraving» arrastra al modelo hacia
estructuras decimonónicas o hacia ruina romántica, que es justo el registro que
se descartó.

Las cinco frases de sujeto:

| Archivo | `Subject:` |
|---|---|
| `observatorio` | `a single enormous parabolic deep-space communication antenna, its steel lattice dish tilted toward the sky, standing alone on a high desert plateau with low fog pooling around its base` |
| `hero` | `a long row of identical parabolic radio antennas of an interferometer array receding across a dry open plain, every dish tilted at the same angle, the nearest one large and the rest diminishing toward the horizon` |
| `puente` | `three towering ship-to-shore gantry cranes at a container terminal, booms raised, rows of stacked shipping containers below them, seen against open sky` |
| `montanas` | `a line of modern three-blade wind turbines along a bare mountain ridge, the nearest turbine tall and sharp, the rest fading into haze along the ridgeline` |
| `cta` | `a satellite ground station of parabolic dishes behind a low fence on an empty plain at dawn, an access road entering from the bottom edge of the frame and leading toward the dishes` |

### Bloque de estilo — viñetas

El bloque de las escenas **no sirve** aquí: devuelve grabado de plumilla fino,
bonito pero incompatible con las láminas grandes. Hay que exigir el trama grueso
y decir además qué no se quiere.

```
CRITICAL — match the reference image technique exactly: a COARSE HALFTONE DOT
SCREEN. The whole image is built from clearly visible individual round black
dots on a regular grid, dot pitch large enough that each dot reads separately.
Dark masses are dense clusters of dots collapsing into solid black. Midtones
are open dot grids. High contrast, flat and graphic, black ink only.

CRITICAL — the background must be COMPLETELY FLAT, PLAIN and UNIFORM cream.
Absolutely no dots, no grain, no texture and no halftone screen anywhere in
the empty areas around the subject. The dot screen exists ONLY inside the
object itself. The empty space is bare paper.

Subject: <SUJETO>, a single isolated object seen at eye level, centred, small
in the frame, modern and in active service, intact and maintained. No ground
line, no landscape, no horizon, no sky, no background scenery.

NOT fine pen hatching. NOT delicate stippling. NOT engraving line work. NOT
smooth airbrushed gradients. Coarse mechanical dot screen only, like a
newspaper halftone enlarged. No text, no numbers, no frame, no border,
no caption, no people.
```

**El segundo bloque CRITICAL es el arreglo entero de las viñetas** y es la
diferencia con la serie 1. Ver «Hay que quitarles el papel» más arriba: la
retícula tenue que el generador dibuja en el fondo del panel es tan oscura como
las texturas claras del dibujo, así que ningún umbral la separa; sobrevive al
recorte y es el rectángulo que se ve en pantalla. Pedir el fondo liso desde el
prompt es lo único que lo resuelve de raíz.

Las cinco frases de sujeto:

| Archivo | `Subject:` |
|---|---|
| `estacion` | `a small automatic weather station — a slim lattice mast carrying a cup anemometer, a wind vane and a cylindrical radiation shield` |
| `senal` | `a rotating air surveillance radar — a curved rectangular mesh antenna mounted on a squat rotating pedestal` |
| `esclusa` | `a concrete dam spillway radial gate — one curved steel gate between two piers, partly raised, water passing beneath it` |
| `caseta` | `an airport control tower — a slender concrete shaft with a glazed polygonal cab and a railed gallery on top` |
| `esclusas` | `a flight of canal locks — three stepped chambers with steel mitre gates, one behind another` |

## Producción

### Fijar el patrón antes de producir en serie

**No generar las diez a la vez.** La serie 1 coincide porque se pasó
`_ref/45.webp` como imagen de referencia; sin referencia el modelo interpreta
«stipple» como plumilla o como halftone gigante. Al cambiar el repertorio hay
que fijar un patrón nuevo o salen diez estilos parecidos pero distintos:

1. Generar **la antena de espacio profundo del hero** con `_ref/45.webp` como
   referencia. Es la más difícil, la más visible y la que define el registro.
2. Aprobarla.
3. Usar **esa** como imagen de referencia de las cuatro escenas restantes.
4. Para las viñetas, referencia doble: la escena aprobada, más el bloque de
   trama gruesa, que es lo que sube el calibre del punto.

### Encuadre y proporción

Reglas de composición de la serie, que conviene no romper:

- Sujeto pesando a la **derecha** y hacia abajo.
- **Dos tercios superiores izquierdos vacíos** — ahí entra el texto de la página.
- Nubes o niebla entrando por la **esquina superior derecha**.
- Sin marco, sin viñeta, sin texto.

| Familia | Proporción | Motivo |
|---|---|---|
| Escenas | 3:2 | Lo que ya consumen los `Scene` en producción |
| Plancha de viñetas | 1:1 | Cuadrantes limpios, recorte puramente geométrico |
| Escalera de esclusas | 5:4 | Es el `aspect` que pide su `Plate` en `Process.tsx` |

Las cuatro viñetas verticales acaban recortadas a `aspect-[4/5]` por el `Plate`
de `Pillars`, así que **el objeto tiene que caber en un vertical**: nada de
sujetos anchos ahí. La escalera de esclusas va aparte justamente por eso.

### La plancha

Para las cuatro viñetas verticales, **una plancha 2x2 y recortarla**, no cuatro
generaciones. Cuatro sueltas costaron 12 créditos en la serie 1; la plancha
costó 3. Se envuelve el bloque de trama gruesa en: cuatro viñetas en rejilla 2x2
estricta sobre papel crema, márgenes amplios y parejos, sin marcos ni texto ni
números, cada sujeto centrado y pequeño.

La escalera de esclusas va en su propia generación, por proporción.

### Si se genera en Gemini

**Gemini no puede generar canal alfa.** Sus modelos de imagen sacan RGB plano,
sin transparencia: no existe el atajo de pedirle «PNG con fondo transparente».
El pipeline de las viñetas es entonces el de siempre —

1. Generar con fondo crema liso y sin trama en las zonas vacías.
2. Pasarlas por el script de `sharp` de más arriba (luminancia invertida → alfa,
   relleno en `--ink`).

— y si aun así queda retícula, hay un plan B exacto: **generar el mismo sujeto
dos veces, una sobre fondo blanco y otra sobre fondo negro, y recuperar el alfa
por diferencia entre las dos.** Gemini reproduce el sujeto de forma consistente
entre pasadas, así que la diferencia da el canal real. Sale a dos generaciones
por viñeta.

Gemini admite imagen de referencia y transferencia de estilo, así que el
hallazgo de la serie 1 se traslada tal cual: **la referencia es lo que hace que
el estilo coincida.**

### Antes de commitear

Todas pasan por `.webp` a 2400px. La serie 1 venía en PNG de 8–13 MB cada una
—117 MB— e inaceptable en el repositorio; recomprimidas son 16 MB sin pérdida
apreciable, porque la ilustración es monocroma y webp la lleva bien.
