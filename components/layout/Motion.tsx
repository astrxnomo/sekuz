"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/* Configuración global de movimiento.

   Los iconos de lucide-animated no comprueban la preferencia del sistema por
   su cuenta. `reducedMotion="user"` lo resuelve de raíz: cuando el visitante
   tiene activado "reducir movimiento", motion desactiva las animaciones de
   transform y deja solo las de opacidad, sin que haya que tocar cada icono.

   Es la contrapartida en JS de la media query que ya cubre el CSS. */

export function Motion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
