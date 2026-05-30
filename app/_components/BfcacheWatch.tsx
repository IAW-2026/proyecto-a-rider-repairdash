"use client";

import { useEffect } from "react";

const CURRENT_BUILD_ID =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "dev";

/**
 * Detecta cuando la pestaña vuelve desde el bfcache (común en mobile)
 * y, si el deploy actual no coincide con el que tenía cargado, recarga
 * para evitar que el JS viejo hable con un server nuevo.
 */
export default function BfcacheWatch() {
  useEffect(() => {
    const onPageShow = async (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { buildId } = (await res.json()) as { buildId: string };
        if (buildId && buildId !== CURRENT_BUILD_ID) {
          window.location.reload();
        }
      } catch {
        // si la red falla, no hacemos nada
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
