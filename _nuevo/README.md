# `_nuevo/` — buzón de la serie 2

Aquí se dejan las imágenes **tal como salen del generador**, sin tocar. Nada de
esta carpeta se sirve al sitio: es el paso previo. Lo que se publica sale de
aquí procesado y va a `public/img/`.

Los prompts están en **`PROMPTS.md`**, en esta misma carpeta. El plan completo
—repertorio, reglas y por qué cada sujeto— está en `assets-brief.md`, en la raíz.

## Dónde va cada cosa

```
_nuevo/
  escenas/     ← las 5 escenas, una por archivo, en 3:2
  planchas/    ← la plancha 2x2 de objetos, y la escalera de esclusas aparte
  procesado/   ← salida de los scripts. De aquí se copia a public/img/
```

Nombra los archivos **con el nombre final que tendrán en `public/img/`**, sea
cual sea el formato en que te los dé el generador:

| Deja en | Con el nombre |
|---|---|
| `escenas/` | `observatorio` · `hero` · `puente` · `montanas` · `cta` |
| `planchas/` | `plancha-objetos` · `esclusas` |

Los nombres se conservan aunque el sujeto cambie por completo. Renombrarlos
obligaría a tocar seis componentes y no aporta nada; la correspondencia entre
archivo y sujeto nuevo está en la tabla de `assets-brief.md`.

## El orden importa, y no es negociable

**Genera primero `observatorio` y sola.** Cuando esa te convenza, *esa* imagen
pasa a ser la referencia de estilo de las nueve restantes.

La serie actual coincide porque se pasó siempre la misma imagen de referencia;
sin referencia, el modelo interpreta «stipple» como plumilla fina o como
halftone de puntos gigantes, y ninguna de las dos se parece a la serie. Si
lanzas las diez contra la referencia vieja vas a obtener diez estilos parecidos
pero distintos, y eso se nota en cuanto dos caen en la misma pantalla.

1. `observatorio`, con `_ref/45.webp` de referencia. → aprobar
2. Las otras cuatro escenas, con `observatorio` de referencia.
3. La plancha de objetos y la escalera, con `observatorio` de referencia **más**
   el bloque de trama gruesa, que es lo que sube el calibre del punto.

## Qué pasa después

Las **escenas** solo necesitan recompresión: `.webp` a 2400px. La serie anterior
llegó en PNG de 8–13 MB cada una, 117 MB en total, que es inaceptable en un
repositorio; recomprimidas fueron 16 MB sin pérdida apreciable, porque la
ilustración es monocroma y webp la lleva bien.

Las **viñetas** necesitan además que se les quite el papel: se recorta la
plancha en cuatro y se convierte la luminancia invertida en canal alfa, de modo
que donde había papel queda transparente y donde había punto negro queda tinta.
Es lo que las hace indistinguibles de las grandes: la tinta cae directa sobre el
crema del sitio y no hay rectángulo que ver. El procedimiento está en
`assets-brief.md`.

**Avisa cuando dejes algo aquí y monto el procesado.** No lo dejo escrito de
antemano porque los números del recorte —dónde empieza cada cuadrante— dependen
de los márgenes que devuelva esta plancha concreta, y adivinarlos no sirve.
