import type { ReactNode } from "react";

/* Resalta los fragmentos [[ ... ]] del contenido.

   El objetivo es que un placeholder sin reemplazar sea imposible de
   pasar por alto al revisar la página: se ve subrayado y en otro tono.
   Cuando reemplaces el texto en content.ts, el resaltado desaparece solo. */

// Con /g para dividir. El test usa una copia sin /g a propósito:
// una regex global arrastra lastIndex entre llamadas y daría falsos negativos.
const DIVISOR = /(\[\[[^\]]*\]\])/g;
const ES_PLACEHOLDER = /^\[\[[^\]]*\]\]$/;

export function Sample({ children }: { children: string }): ReactNode {
  return children.split(DIVISOR).map((parte, i) =>
    ES_PLACEHOLDER.test(parte) ? (
      <span
        key={i}
        className="rounded-[3px] bg-ink/[0.07] px-1 text-ink-soft underline decoration-ink-soft/50 decoration-dashed underline-offset-2"
        title="Sample: reemplazar en content.ts antes de publicar"
      >
        {parte.replace(/^\[\[\s*|\s*\]\]$/g, "")}
      </span>
    ) : (
      parte
    )
  );
}
