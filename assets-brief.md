# Assets — estilo stipple

Guía para generar más ilustraciones que encajen con la serie sin volver a calibrar el estilo desde cero.

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

## Escenas que aún faltarían

Si más adelante se agregan secciones, estas mantienen la metáfora sin caer en robots ni circuitos:

- Faro de niebla en un promontorio rocoso *(alternativa al hero)*
- Torres de tendido eléctrico cruzando un llano abierto
- Presa o acueducto de piedra *(flujo, canalización)*
- Estación meteorológica solitaria en una cumbre nevada

## Peso de los assets

Las láminas se sirven en `.webp` a 2400px y las referencias de `_ref/` en
`.webp` a tamaño original. Venían en PNG de 8–13 MB cada una: 117 MB en total,
que es inaceptable en un repositorio. Recomprimidas son 16 MB sin pérdida
apreciable — la ilustración es monocroma, así que webp la lleva bien.

Si añades una lámina nueva, pásala por el mismo tratamiento antes de commitear.
