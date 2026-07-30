import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* Une clases de Tailwind resolviendo conflictos: la última gana.
   Lo requieren los componentes de icono de lucide-animated. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
