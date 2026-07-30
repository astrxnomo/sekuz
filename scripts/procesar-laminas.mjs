/* ---------------------------------------------------------------
   Procesado de láminas — de `_nuevo/` a `_nuevo/procesado/`

   Uso:  node scripts/procesar-laminas.mjs

   Dos familias, dos tratamientos distintos. Ver `assets-brief.md`.

   ESCENAS — solo recompresión a webp. Van a sangre como fondo de sección, así
   que su crema *es* el fondo de la página y no hay borde que disolver.

   VIÑETAS — hay que quitarles el papel. Una viñeta recortada tal cual del
   generador se ve como un cuadrado incrustado, y no es cuestión de opacidad:
   trae su propio papel, que el generador saca casi en blanco mientras el crema
   del sitio está en 239. Bajarle la opacidad no lo arregla — apaga la tinta y
   el rectángulo sigue ahí. Lo que se hace es usar la luminancia invertida como
   canal alfa: donde había papel queda transparente y donde había punto negro
   queda tinta, en `--ink` y no en negro puro, para que los puntos sean del tono
   del texto de la página.
   --------------------------------------------------------------- */

import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const ENTRADA = "_nuevo";
const SALIDA = "_nuevo/procesado";

const UMBRAL = 228; // a partir de aquí, todo es papel
const TINTA = "#14120f"; // var(--ink)

/* La plancha llega como una rejilla 2x2. El recorte NO es por cuadrantes
   geométricos: se localiza la caja de tinta de cada objeto y se recorta sobre
   ella, por tres razones.

   Los márgenes que devuelve el generador no son parejos ni predecibles, así que
   un recorte fijo deja unos objetos descentrados y otros cortados. Los objetos
   ocupan una fracción pequeña de su cuadrante, así que recortar el cuadrante
   entero desperdicia la mitad de la resolución. Y la marca de agua que Gemini
   estampa en una esquina cae fuera de toda caja de tinta, de modo que ceñirse
   a la tinta la elimina sin tener que ir a buscarla. */
const CUADRANTES = [
  { nombre: "estacion", col: 0, fila: 0 },
  { nombre: "senal", col: 1, fila: 0 },
  { nombre: "esclusa", col: 0, fila: 1 },
  { nombre: "caseta", col: 1, fila: 1 },
];

/* Viñetas que no salen de la plancha, porque su casilla pide otra proporción y
   no caben en un cuadrante. Se buscan por nombre en cualquier subcarpeta de
   entrada; da igual dónde se hayan dejado. */
const SUELTAS = [{ nombre: "esclusas", ratio: 5 / 4 }];

/** Proporción de destino de las viñetas de plancha. Es la de su casilla. */
const RATIO_VINETA = 4 / 5;

/* Aire alrededor del objeto, en fracción de su lado mayor.

   No es holgura estética: es lo que mantiene al aparato fuera del fundido de
   `Plate`. Aquel funde un 8% por cada borde, así que con un 16% de aire el
   objeto vive entre el 16% y el 84% de la lámina y el degradado solo cae sobre
   margen transparente. Si se toca el fundido de `Plate`, hay que tocar esto. */
const AIRE = 0.16;

/** Caja de tinta dentro de una región: el rectángulo mínimo que la contiene. */
function cajaDeTinta(datos, W, x0, y0, x1, y1) {
  let ax = Infinity, ay = Infinity, bx = -1, by = -1;

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (datos[y * W + x] < UMBRAL) {
        if (x < ax) ax = x;
        if (x > bx) bx = x;
        if (y < ay) ay = y;
        if (y > by) by = y;
      }
    }
  }

  if (bx < 0) return null;
  return { x: ax, y: ay, ancho: bx - ax + 1, alto: by - ay + 1 };
}

/* El papel a alfa. El umbral se aplica por una rampa lineal y no por un corte
   duro: un corte deja los bordes del trama dentados, porque los puntos del
   halftone tienen antialiasing y sus píxeles intermedios caerían todos a un
   lado. Con rampa, esos intermedios quedan semitransparentes y el punto
   conserva su forma redonda. */
async function quitarPapel(entrada, ancho, alto) {
  const escala = 255 / UMBRAL;

  const alfa = await sharp(entrada)
    .greyscale()
    .negate()
    .linear(escala, -(255 - UMBRAL) * escala)
    .raw()
    .toBuffer();

  return sharp({
    create: { width: ancho, height: alto, channels: 3, background: TINTA },
  })
    .joinChannel(alfa, { raw: { width: ancho, height: alto, channels: 1 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
}

/* Recorta ceñido a la tinta y añade el aire después por `extend`, no ampliando
   el recorte. Si se ampliara, en una plancha el recorte podría invadir el
   cuadrante vecino y meter medio objeto ajeno; extendiendo, el margen es
   siempre papel limpio, y como el papel acaba en transparente da igual de qué
   color se rellene mientras esté por encima del umbral. */
async function componerVineta(origen, caja, ratio) {
  const aire = Math.round(Math.max(caja.ancho, caja.alto) * AIRE);
  let ancho = caja.ancho + aire * 2;
  let alto = caja.alto + aire * 2;

  // Ajuste a la proporción de la casilla, siempre creciendo
  if (ancho / alto > ratio) alto = Math.round(ancho / ratio);
  else ancho = Math.round(alto * ratio);

  const izq = Math.round((ancho - caja.ancho) / 2);
  const arr = Math.round((alto - caja.alto) / 2);

  const recorte = await sharp(origen)
    .extract({ left: caja.x, top: caja.y, width: caja.ancho, height: caja.alto })
    .extend({
      left: izq,
      top: arr,
      right: ancho - caja.ancho - izq,
      bottom: alto - caja.alto - arr,
      background: "#ffffff",
    })
    .png()
    .toBuffer();

  return { buffer: await quitarPapel(recorte, ancho, alto), ancho, alto };
}

/** Busca un archivo por nombre base en cualquier subcarpeta de entrada. */
async function localizar(nombre) {
  for (const sub of ["escenas", "planchas"]) {
    const dir = path.join(ENTRADA, sub);
    const hallado = (await readdir(dir)).find(
      (f) => path.parse(f).name.toLowerCase() === nombre && /\.(png|jpe?g|webp)$/i.test(f),
    );
    if (hallado) return path.join(dir, hallado);
  }
  return null;
}

async function procesarEscenas() {
  const dir = path.join(ENTRADA, "escenas");
  const sueltas = new Set(SUELTAS.map((s) => s.nombre));
  const archivos = (await readdir(dir)).filter(
    (f) => /\.(png|jpe?g|webp)$/i.test(f) && !sueltas.has(path.parse(f).name.toLowerCase()),
  );

  for (const archivo of archivos) {
    const nombre = path.parse(archivo).name;
    const destino = path.join(SALIDA, `${nombre}.webp`);
    const { width, height } = await sharp(path.join(dir, archivo)).metadata();

    await sharp(path.join(dir, archivo)).webp({ quality: 90 }).toFile(destino);

    console.log(`escena   ${nombre.padEnd(14)} ${width}x${height}`);
  }
}

async function procesarPlancha() {
  const dir = path.join(ENTRADA, "planchas");
  const archivos = await readdir(dir);
  const plancha = archivos.find((f) => /plancha/i.test(f) && /\.(png|jpe?g|webp)$/i.test(f));

  if (!plancha) {
    console.log("plancha  — no encontrada, se salta");
    return;
  }

  const origen = path.join(dir, plancha);
  const { data, info } = await sharp(origen).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const qw = Math.floor(W / 2);
  const qh = Math.floor(H / 2);

  for (const { nombre, col, fila } of CUADRANTES) {
    const caja = cajaDeTinta(data, W, col * qw, fila * qh, (col + 1) * qw, (fila + 1) * qh);
    if (!caja) {
      console.log(`viñeta   ${nombre.padEnd(14)} — cuadrante vacío, se salta`);
      continue;
    }

    const { buffer, ancho, alto } = await componerVineta(origen, caja, RATIO_VINETA);
    await sharp(buffer).toFile(path.join(SALIDA, `${nombre}.webp`));

    console.log(
      `viñeta   ${nombre.padEnd(14)} tinta ${caja.ancho}x${caja.alto} → lámina ${ancho}x${alto}`,
    );
  }
}

async function procesarSueltas() {
  for (const { nombre, ratio } of SUELTAS) {
    const origen = await localizar(nombre);
    if (!origen) {
      console.log(`suelta   ${nombre.padEnd(14)} — no encontrada, se salta`);
      continue;
    }

    const { data, info } = await sharp(origen)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const caja = cajaDeTinta(data, info.width, 0, 0, info.width, info.height);
    if (!caja) {
      console.log(`suelta   ${nombre.padEnd(14)} — sin tinta, se salta`);
      continue;
    }

    const { buffer, ancho, alto } = await componerVineta(origen, caja, ratio);
    await sharp(buffer).toFile(path.join(SALIDA, `${nombre}.webp`));

    console.log(
      `suelta   ${nombre.padEnd(14)} tinta ${caja.ancho}x${caja.alto} → lámina ${ancho}x${alto}`,
    );
  }
}

await mkdir(SALIDA, { recursive: true });
await procesarEscenas();
await procesarPlancha();
await procesarSueltas();
console.log(`\nlisto → ${SALIDA}`);
