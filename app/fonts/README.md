# Fuentes

El sitio usa **dos fuentes, ambas de la familia Geist**, autoalojadas en esta carpeta. No hay peticiones a Google Fonts ni a ningún tercero.

| Rol | Fuente | Archivo |
|---|---|---|
| Titulares y marca | Geist Pixel Square | `GeistPixel-Square.woff2` |
| Cuerpo, etiquetas, cifras, citas | Geist Mono (variable 100–900) | `GeistMono-Variable.woff2` + `GeistMono-VariableItalic.woff2` |

Se registran en `app/layout.tsx` con `next/font/local` y se exponen como variables CSS (`--font-pixel`, `--font-mono`) que consume `app/globals.css`.

## Licencia

Toda la familia Geist es de Vercel y se distribuye bajo la **SIL Open Font License 1.1** — libre también para uso comercial. La licencia completa está en `GeistPixel-OFL.txt`. No hay nada que comprar ni trámite pendiente.

Origen: [github.com/vercel/geist-font](https://github.com/vercel/geist-font) (v1.7.2)

## Cómo se reparten los roles

Los roles viven en clases de `app/globals.css`, no repartidos por los componentes. Para cambiar la tipografía de todo el sitio se editan estas clases y nada más:

- `.display` — Geist Pixel. Titulares y marca.
- `.pixel` — Geist Pixel. Cifras grandes, índices, cotas.
- `.tono` — Geist Mono itálica ligera. El segundo tono dentro de un titular.
- `.cita` — Geist Mono itálica. Testimonios.
- `.eyebrow` / `.chip` — Geist Mono en mayúsculas con tracking abierto.
- `.dato` — Geist Mono con cifras tabulares.

## Dos cosas a tener en cuenta

**El pixel es monoespaciado y muy ancho.** Al mismo cuerpo ocupa bastante más ancho que una serif o una sans, así que la escala de titulares va deliberadamente contenida (`~1.6rem` a `~3.25rem`). Si subes esos valores, los titulares empiezan a romper en demasiadas líneas. No usar Geist Pixel en párrafos: a tamaño de lectura es agotador.

**El cuerpo también es monoespaciado.** Es una decisión estética que refuerza el aire técnico del sitio, pero un texto monoespaciado se lee algo más lento que una sans proporcional en párrafos largos. Está compensado con `line-height: 1.75` y un cuerpo de `0.9375rem` en `body`. Si en algún momento los bloques de texto se sienten pesados, la salida es acortar el copy antes que agrandar la caja.

## Acentos

El copy está en español y Geist cubre bien los diacríticos, pero conviene revisar en pantalla los titulares largos:

> **Automatización · Qué hacemos · Cómo trabajamos · Reducción · Términos · Diagnóstico**
