"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

import BotonMenu from "./BotonMenu"
import BotonProfile from "./BotonProfile"
import BotonTravel from "./BotonTravel"
import BotonDescuentos from "./BotonDescuentos"
import { Show, UserButton } from "@clerk/nextjs"


export default function MenuHamburguesa({ id, nombre, apellido }: { id: string, nombre?: string, apellido?: string }) {

  
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200 hover:scale-110 active:scale-95 bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-brand-text shadow-[0_0_14px_#F500F160]"
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-[100] w-80 transform transition-transform duration-300 ease-in-out flex flex-col bg-[linear-gradient(180deg,var(--color-brand-surface)_0%,var(--color-brand-bg)_100%)] border-l border-brand-purple/40 shadow-[-4px_0_40px_#27103380] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="self-start w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 bg-brand-purple/30 text-brand-text"
            aria-label="Cerrar menú"
          >
            ✖
          </button>

          <div className="mt-4 pb-6 mb-6 text-center border-b border-brand-purple/40 flex flex-col items-center">
            <Show when="signed-in">
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
                <div className="scale-[3] origin-center flex items-center justify-center w-full h-full">
                  <UserButton />
                </div>
              </div>
            </Show>
            <h2 className="text-xl font-bold text-brand-text mt-4">{nombre} {apellido}</h2>
          </div>

          {/* Nav links */}
          <nav className="flex-1">
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              <li><BotonProfile id={id} pathname={pathname} /></li>
              <li><BotonTravel id={id} pathname={pathname} /></li>
              <li><BotonMenu id={id} pathname={pathname} /></li>
              <li><BotonDescuentos id={id} pathname={pathname} /></li>
              
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-brand-purple/40">
            <p className="text-sm text-center text-brand-purple">RepairDash v1.0.1</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] backdrop-blur-sm bg-brand-bg/60"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}