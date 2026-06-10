"use client";

import { Home } from "lucide-react";
import { NavLink } from "@/app/components/ui";

export default function BotonMenu({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) {
  const href = `/user/${id}/menu`;
  return (
    <NavLink
      href={href}
      isActive={pathname === href}
      icon={<Home size={16} strokeWidth={1.75} />}
    >
      Inicio
    </NavLink>
  );
}
