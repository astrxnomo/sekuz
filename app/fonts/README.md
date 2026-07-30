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

**El pixel es monoespaciado y muy ancho.** Al mismo cuerpo ocupa bastante más ancho que una serif o una sans, así que la escala de titulares va deliberadamente contenida (`~1.375rem` a `~2.6875rem`). Si subes esos valores, los titulares empiezan a romper en demasiadas líneas. No usar Geist Pixel en párrafos: a tamaño de lectura es agotador.

**El cuerpo también es monoespaciado.** Es una decisión estética que refuerza el aire técnico del sitio, pero ocupa más sitio que una proporcional al mismo cuerpo, y por eso el bloque tiende a verse grande y suelto. La calibración que lo corrige vive entera en `globals.css` y son cuatro valores que se sostienen entre sí:

| Valor | Dónde | Qué hace |
|---|---|---|
| `font-size: 0.9375rem` | `body` | 15px. Es el suelo: por debajo la rejilla fija empieza a pedir zoom. |
| `letter-spacing: -0.012em` | `body` | Cierra el renglón sin encoger la letra. Por debajo de `-0.02em` los remates solapan. |
| `line-height: 1.62` | `body` | Sigue siendo alto a propósito: compensa la rigidez de la rejilla en párrafos largos. |
| `max-width: 60ch` | `p`, `li`, `dd`, `blockquote` | En mono, `ch` es el ancho exacto de un carácter: son 60 caracteres por línea clavados. |

De las cuatro, **la medida es la que más se nota** y la que menos cuesta: acorta el renglón sin tocar el tamaño. Si los bloques de texto vuelven a sentirse pesados, la salida es acortar el copy antes que agrandar la caja.

**Dos excepciones a la interletra negativa**, ambas deliberadas: `.terminal` la devuelve a `normal`, porque ahí la rejilla fija es el efecto que se busca; y `.eyebrow` / `.eyebrow-brand` van en `+0.12em`, bajado desde `0.16em` — en proporcional ese es un valor de manual, pero sobre mono se suma a un avance que ya es ancho.

## Acentos

El copy está en español y Geist cubre bien los diacríticos, pero conviene revisar en pantalla los titulares largos:

> **Automatización · Qué hacemos · Cómo trabajamos · Reducción · Términos · Diagnóstico**
