"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Show, UserButton } from '@clerk/nextjs';
import BotonIrAlMenu from "./botonIrAlMenu";
import { useUser } from "@clerk/nextjs";
import BotonIrAlMenuAdmin from "./BotonIrAlMenuAdmin";

export default function BotonLogIn() {  

  const router = useRouter();
  const {user, isLoaded} = useUser();
  const metadata = user?.publicMetadata;
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Le damos 2.5s a lazyProvisioning para que cree el usuario y haga user.reload()
    if (isLoaded && user && !metadata?.rol) {
      const timer = setTimeout(() => setShowFallback(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, user, metadata?.rol]);
  

  return (
    <div>
    <Show when="signed-out">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
          <button onClick={() => router.push("/sing-in")} className="bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-white rounded-full font-bold text-lg sm:text-xl h-14 sm:h-16 w-48 sm:w-56 shadow-[0_0_20px_#F500F150] transition-transform hover:scale-105 active:scale-95">
            Sign In
          </button>
        <button onClick={() => router.push("/sing-up")} className="bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-white rounded-full font-bold text-lg sm:text-xl h-14 sm:h-16 w-48 sm:w-56 shadow-[0_0_20px_#F500F150] transition-transform hover:scale-105 active:scale-95">
          Sign Up
        </button>
      </div>
    </Show>
    <Show when="signed-in">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 flex items-center justify-center overflow-hidden transition-transform hover:scale-110">
          <div className="scale-[2.5] origin-center flex items-center justify-center w-full h-full">
            <UserButton />
          </div>
        </div>
        {!isLoaded ? null
          : metadata?.rol === "admin-rider" ? (
            <BotonIrAlMenuAdmin />
          ) : metadata?.rol === "rider" ? (
            <BotonIrAlMenu />
          ) : (!metadata?.rol && !showFallback) ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-[var(--color-brand-lavender)] border-t-transparent animate-spin" />
              <span className="text-xs text-[var(--color-brand-muted)] font-medium tracking-wide">Cargando...</span>
            </div>
          ) : (
            <p className="font-[family-name:var(--font-main)] text-sm sm:text-base font-medium text-[var(--color-brand-lavender)] text-center tracking-wide leading-relaxed px-4 drop-shadow-[0_0_8px_#C392DD80]">
              Para iniciar sesión, creá una nueva cuenta como Rider
            </p>
          )
        }
       
      </div>
    </Show>
    </div>
  );
}