import { useEffect } from "react";

const INTENTOS_MAX = 50; // 50 intentos x 100 ms = hasta 5 segundos
const ESPERA_MS = 100;

// Hace scroll suave hasta el elemento con ese id.
// La sección puede tardar en aparecer (la página nueva está cargando datos),
// así que se vuelve a intentar cada 100 ms. Al terminar, o al rendirse, avisa con onDone
// para que la misma búsqueda pueda repetirse después.
export const useScrollToSection = (sectionId: string | null, onDone: () => void) => {
  useEffect(() => {
    if (!sectionId) return;

    let intentos = 0;
    let timer: number | undefined;

    const buscar = () => {
      const elemento = document.getElementById(sectionId);

      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth", block: "start" });
        onDone();
        return;
      }

      intentos += 1;
      if (intentos >= INTENTOS_MAX) {
        onDone();
        return;
      }
      timer = window.setTimeout(buscar, ESPERA_MS);
    };

    timer = window.setTimeout(buscar, 0);

    return () => window.clearTimeout(timer);
  }, [sectionId, onDone]);
};
