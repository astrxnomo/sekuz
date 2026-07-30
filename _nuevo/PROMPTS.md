# Prompts — serie 2

Listos para pegar. **Siete generaciones cubren las diez imágenes**: cinco
escenas, una plancha 2x2 que da cuatro viñetas de una vez, y la escalera de
esclusas aparte.

Empieza por la 1 y apruébala antes de seguir; el porqué está en `README.md`.

Ajustes que van fuera del texto del prompt:

| | Referencia | Proporción |
|---|---|---|
| **1** `observatorio` | `_ref/45.webp` | 3:2 |
| **2–5** resto de escenas | `observatorio` ya aprobada | 3:2 |
| **6** plancha de objetos | `observatorio` ya aprobada | 1:1 |
| **7** escalera de esclusas | `observatorio` ya aprobada | 5:4 |

---

## Escenas

Las cinco comparten el bloque de estilo palabra por palabra: **solo cambia la
frase que va después de `Subject:`**. No lo reescribas ni lo resumas — está
calibrado y cada cláusula está pagando algo.

Dos que conviene no borrar aunque parezcan redundantes:

- **«modern and in active service … not ruined, not abandoned»** — sin ella,
  `antique letterpress engraving` arrastra al modelo hacia estructuras
  decimonónicas o hacia ruina romántica. La escala y la soledad tienen que venir
  del paisaje, no de la decadencia: todo lo que se dibuja está funcionando.
- **«Vast empty sky fills the upper-left two thirds»** — ese vacío no es
  estética, es donde vive el texto de la página. Sin él la sección no se puede
  montar.

### 1 · `observatorio` — Hero

```
Halftone stipple dot-screen landscape illustration in exactly the same
technique as the reference image: built entirely from fine black dots and
delicate crosshatch dot texture on warm cream ivory paper, black ink only, no
lines, no outlines. Subject: a single enormous parabolic deep-space
communication antenna, its steel lattice dish tilted toward the sky, standing
alone on a high desert plateau with low fog pooling around its base,
positioned in the right third of the frame and sitting low. The structure is
modern and in active service, built of steel and concrete, intact and
maintained — not ruined, not abandoned, not overgrown. Vast empty sky fills
the upper-left two thirds of the frame carrying only a faint even dot grid.
Thin fog enters from the top right corner. Antique letterpress engraving feel,
extremely fine grain, flat and graphic, no text, no border, no vignette, no
people, no vehicles.
```

### 2 · `hero` — Qué hacemos

```
Halftone stipple dot-screen landscape illustration in exactly the same
technique as the reference image: built entirely from fine black dots and
delicate crosshatch dot texture on warm cream ivory paper, black ink only, no
lines, no outlines. Subject: a long row of identical parabolic radio antennas
of an interferometer array receding across a dry open plain, every dish tilted
at the same angle, the nearest one large in the right third of the frame and
the rest diminishing toward the horizon. The structures are modern and in
active service, built of steel and concrete, intact and maintained — not
ruined, not abandoned, not overgrown. Vast empty sky fills the upper-left two
thirds of the frame carrying only a faint even dot grid. Thin fog enters from
the top right corner. Antique letterpress engraving feel, extremely fine
grain, flat and graphic, no text, no border, no vignette, no people, no
vehicles.
```

### 3 · `puente` — Casos

```
Halftone stipple dot-screen landscape illustration in exactly the same
technique as the reference image: built entirely from fine black dots and
delicate crosshatch dot texture on warm cream ivory paper, black ink only, no
lines, no outlines. Subject: three towering ship-to-shore gantry cranes at a
container terminal, booms raised, rows of stacked shipping containers below
them, the nearest crane in the right third of the frame and sitting low. The
structures are modern and in active service, built of steel and concrete,
intact and maintained — not ruined, not abandoned, not overgrown. Vast empty
sky fills the upper-left two thirds of the frame carrying only a faint even
dot grid. Thin fog enters from the top right corner. Antique letterpress
engraving feel, extremely fine grain, flat and graphic, no text, no border, no
vignette, no people, no vehicles.
```

### 4 · `montanas` — Inversión

```
Halftone stipple dot-screen landscape illustration in exactly the same
technique as the reference image: built entirely from fine black dots and
delicate crosshatch dot texture on warm cream ivory paper, black ink only, no
lines, no outlines. Subject: a line of modern three-blade wind turbines along
a bare mountain ridge, the nearest turbine tall and sharp in the right third
of the frame, the rest fading into haze along the ridgeline. The structures
are modern and in active service, built of steel and concrete, intact and
maintained — not ruined, not abandoned, not overgrown. Vast empty sky fills
the upper-left two thirds of the frame carrying only a faint even dot grid.
Thin fog enters from the top right corner. Antique letterpress engraving feel,
extremely fine grain, flat and graphic, no text, no border, no vignette, no
people, no vehicles.
```

### 5 · `cta` — Cierre

Única con el velo por arriba en vez de por el lado, así que **el sujeto puede
ir más centrado**; el vacío que hace falta aquí es el de la franja superior.

```
Halftone stipple dot-screen landscape illustration in exactly the same
technique as the reference image: built entirely from fine black dots and
delicate crosshatch dot texture on warm cream ivory paper, black ink only, no
lines, no outlines. Subject: a satellite ground station of parabolic dishes
behind a low fence on an empty plain at dawn, an access road entering from the
bottom edge of the frame and leading toward the dishes, everything low in the
lower half of the frame. The structures are modern and in active service,
built of steel and concrete, intact and maintained — not ruined, not
abandoned, not overgrown. Vast empty sky fills the entire upper half of the
frame carrying only a faint even dot grid. Thin fog enters from the top right
corner. Antique letterpress engraving feel, extremely fine grain, flat and
graphic, no text, no border, no vignette, no people, no vehicles.
```

---

## Viñetas

Aquí **el bloque de estilo de las escenas no sirve**: devuelve grabado de
plumilla fino, bonito, pero que no pega con las láminas grandes. Hay que exigir
el trama grueso de forma explícita y decir además qué no se quiere.

Y hay un segundo bloque `CRITICAL` que es **el arreglo de fondo de toda la
serie**. Lo que hace que las viñetas actuales se lean como cuadrados pegados no
es la opacidad ni el fundido: es una retícula de puntos tenues que el generador
dibuja en el fondo del panel, tan oscura como las texturas claras del dibujo.
Ningún umbral de luminancia la separa, así que sobrevive al recorte de papel y
es el rectángulo que se ve en pantalla. Pedir el fondo liso desde el prompt es
lo único que lo resuelve de raíz.

### 6 · Plancha 2x2 → `estacion`, `senal`, `esclusa`, `caseta`

Una generación en lugar de cuatro. En la serie anterior cuatro sueltas costaron
12 créditos y la plancha costó 3.

**Respeta el orden de los cuadrantes**: el recorte posterior asume esa posición.

```
A 2x2 grid of four separate technical illustrations on plain cream paper,
four equal quadrants, generous and even margins around each one, no frames,
no captions, no numbers, no dividing lines.

CRITICAL — match the reference image technique exactly: a COARSE HALFTONE DOT
SCREEN. The whole image is built from clearly visible individual round black
dots on a regular grid, dot pitch large enough that each dot reads separately.
Dark masses are dense clusters of dots collapsing into solid black. Midtones
are open dot grids. High contrast, flat and graphic, black ink only.

CRITICAL — the background must be COMPLETELY FLAT, PLAIN and UNIFORM cream.
Absolutely no dots, no grain, no texture and no halftone screen anywhere in
the empty areas around the objects. The dot screen exists ONLY inside the
objects themselves. The empty space is bare paper.

Each object is a single isolated machine seen at eye level, centred in its
quadrant, small, upright and taller than wide, modern and in active service,
intact and maintained. No ground line, no landscape, no horizon, no sky, no
background scenery, no shadows.

TOP LEFT: a small automatic weather station — a slim lattice mast carrying a
cup anemometer, a wind vane and a cylindrical radiation shield.
TOP RIGHT: a rotating air surveillance radar — a curved rectangular mesh
antenna mounted on a squat rotating pedestal.
BOTTOM LEFT: a concrete dam spillway radial gate — one curved steel gate
between two piers, partly raised, water passing beneath it.
BOTTOM RIGHT: an airport control tower — a slender concrete shaft with a
glazed polygonal cab and a railed gallery on top.

NOT fine pen hatching. NOT delicate stippling. NOT engraving line work. NOT
smooth airbrushed gradients. Coarse mechanical dot screen only, like a
newspaper halftone enlarged. No text, no numbers, no frame, no border, no
caption, no people.
```

**«upright and taller than wide» no es capricho.** Las cuatro acaban recortadas
a vertical `4/5` por su casilla en «Qué hacemos»; un sujeto ancho se queda sin
los lados.

### 7 · `esclusas` — Cómo trabajamos

Va aparte por proporción: su casilla es `5/4`, apaisada, y no cabe en la
plancha. Es la corrección que más importa de la serie — la escalera de esclusas
*es* la metáfora exacta de las cuatro fases, pero hoy está metida en una casilla
de 427px como paisaje denso, y por eso se lee como una imagen pegada. **Cambia
de familia, no de metáfora**: ahora es un objeto aislado, no un paisaje.

```
A single technical illustration on plain cream paper.

CRITICAL — match the reference image technique exactly: a COARSE HALFTONE DOT
SCREEN. The whole image is built from clearly visible individual round black
dots on a regular grid, dot pitch large enough that each dot reads separately.
Dark masses are dense clusters of dots collapsing into solid black. Midtones
are open dot grids. High contrast, flat and graphic, black ink only.

CRITICAL — the background must be COMPLETELY FLAT, PLAIN and UNIFORM cream.
Absolutely no dots, no grain, no texture and no halftone screen anywhere in
the empty area around the object. The dot screen exists ONLY inside the object
itself. The empty space is bare paper.

Subject: a flight of canal locks — three stepped rectangular chambers with
steel mitre gates, one behind another, descending from left to right, seen as
a single isolated object at eye level, centred, small in the frame, modern and
in active service, intact and maintained. No ground line, no landscape, no
horizon, no sky, no background scenery, no shadows.

NOT fine pen hatching. NOT delicate stippling. NOT engraving line work. NOT
smooth airbrushed gradients. Coarse mechanical dot screen only, like a
newspaper halftone enlarged. No text, no numbers, no frame, no border, no
caption, no people.
```

---

## Si la plancha no sale

Cuatro generaciones sueltas, en `1:1`. Toma el prompt 7 entero y sustituye solo
la frase de `Subject:`:

| Archivo | `Subject:` |
|---|---|
| `estacion` | `a small automatic weather station — a slim lattice mast carrying a cup anemometer, a wind vane and a cylindrical radiation shield` |
| `senal` | `a rotating air surveillance radar — a curved rectangular mesh antenna mounted on a squat rotating pedestal` |
| `esclusa` | `a concrete dam spillway radial gate — one curved steel gate between two piers, partly raised, water passing beneath it` |
| `caseta` | `an airport control tower — a slender concrete shaft with a glazed polygonal cab and a railed gallery on top` |

Añade a cada una `upright and taller than wide` después de `small in the frame`,
por el recorte vertical de su casilla.

## Si el fondo sigue trayendo trama

**Gemini no puede generar canal alfa**: sus modelos sacan RGB plano, así que no
existe el atajo de pedirle un PNG con fondo transparente. Si el bloque
`CRITICAL` del fondo no basta y queda retícula que el umbral no separa, hay una
salida exacta: **generar el mismo sujeto dos veces, una sobre fondo blanco puro
y otra sobre fondo negro puro**, y recuperar el alfa por diferencia entre las
dos. Gemini reproduce el sujeto de forma consistente entre pasadas, así que la
diferencia da el canal real en vez de una aproximación por umbral.

Cuesta el doble de generaciones. Es el plan B, no el plan.
