"use client"
import { useRouter } from "next/navigation";

export default function BotonIrAlMenuAdmin() {
  const router = useRouter();
  return (
    <button className="bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-white rounded-full font-bold text-lg sm:text-xl h-14 sm:h-16 w-48 sm:w-56 shadow-[0_0_20px_#F500F150] transition-transform hover:scale-105 active:scale-95"
      onClick={() => router.push("/admin")}>
      Ir al panel de administración
    </button>
  );
}