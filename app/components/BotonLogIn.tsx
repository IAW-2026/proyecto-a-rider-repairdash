"use client"
import { useRouter } from "next/navigation";
import { Show, UserButton } from '@clerk/nextjs';
import BotonIrAlMenu from "./botonIrAlMenu";
import { useUser } from "@clerk/nextjs";
import BotonIrAlMenuAdmin from "./BotonIrAlMenuAdmin";

export default function BotonLogIn() {  

  const router = useRouter();
  const {user, isLoaded} = useUser();
  const metadata = user?.publicMetadata;
  
 

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
        {metadata?.rol === "cliente" && isLoaded ? (
          <BotonIrAlMenu/>
        ):
        <BotonIrAlMenuAdmin/>
        }
       
      </div>
    </Show>
    </div>
  );
}