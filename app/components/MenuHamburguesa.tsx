"use client";

import { usePathname } from "next/navigation";
import { UserButton, Show } from "@clerk/nextjs";
import { Wrench } from "lucide-react";
import BotonMenu from "./BotonMenu";
import BotonProfile from "./BotonProfile";
import BotonTravel from "./BotonTravel";
import BotonDescuentos from "./BotonDescuentos";

export default function MenuHamburguesa({
  id,
  nombre,
  apellido,
}: {
  id: string;
  nombre?: string;
  apellido?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-full h-full flex flex-col p-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-rd-accent grid place-items-center text-white shrink-0">
          <Wrench size={17} strokeWidth={1.75} />
        </div>
        <div className="leading-tight min-w-0">
          <div className="text-[15px] font-bold tracking-tight">
            Repair<span className="text-rd-accent">Dash</span>
          </div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-rd-muted">
            Cliente
          </div>
        </div>
      </div>

      <div className="mt-5 pb-5 mb-4 text-center border-b border-rd-border-2 flex flex-col items-center">
        <Show when="signed-in">
          <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
            <div className="scale-[2.6] origin-center flex items-center justify-center w-full h-full">
              <UserButton />
            </div>
          </div>
        </Show>
        {(nombre || apellido) && (
          <h2 className="text-base font-bold text-rd-text mt-3 px-1 break-words">
            {nombre} {apellido}
          </h2>
        )}
      </div>

      <nav className="flex-1">
        <ul className="list-none flex flex-col gap-1">
          <li>
            <BotonMenu id={id} pathname={pathname} />
          </li>
          <li>
            <BotonTravel id={id} pathname={pathname} />
          </li>
          <li>
            <BotonProfile id={id} pathname={pathname} />
          </li>
          <li>
            <BotonDescuentos id={id} pathname={pathname} />
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-rd-border-2">
        <p className="text-xs text-center text-rd-muted">RepairDash v2.0.0</p>
      </div>
    </aside>
  );
}
