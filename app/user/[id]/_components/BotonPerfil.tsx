"use client";

import { User } from "lucide-react";
import { NavLink } from "@/app/components/ui";

export default function BotonPerfil({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) {
  const href = `/user/${id}/profile`;
  return (
    <NavLink
      href={href}
      isActive={pathname === href}
      icon={<User size={16} strokeWidth={1.75} />}
    >
      Mi perfil
    </NavLink>
  );
}
