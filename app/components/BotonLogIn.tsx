"use client"
import { useRouter } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function BotonLogIn() {
  const router = useRouter();
  return (
    <div>
    <Show when="signed-out">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
        <SignInButton forceRedirectUrl="/sync">
          <button className="bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-white rounded-full font-bold text-lg sm:text-xl h-14 sm:h-16 w-48 sm:w-56 shadow-[0_0_20px_#F500F150] transition-transform hover:scale-105 active:scale-95">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton forceRedirectUrl="/sync">
          <button className="bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-white rounded-full font-bold text-lg sm:text-xl h-14 sm:h-16 w-48 sm:w-56 shadow-[0_0_20px_#F500F150] transition-transform hover:scale-105 active:scale-95">
            Sign Up
          </button>
        </SignUpButton>
        
      </div>
    </Show>
    <Show when="signed-in">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-brand-accent shadow-[0_0_15px_#F500F160] flex items-center justify-center overflow-hidden transition-transform hover:scale-110">
          <div className="scale-[2.5] origin-center flex items-center justify-center w-full h-full">
            <UserButton />
          </div>
        </div>
        <button
          onClick={() => router.push("/sync")}
          className="bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-white rounded-full font-bold text-xl h-16 px-12 shadow-[0_0_20px_#F500F160] transition-transform hover:scale-105 active:scale-95"
        >
          Ir al menu
        </button>
      </div>
    </Show>
    </div>
  );
}