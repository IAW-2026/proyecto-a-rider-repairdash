"use client";

import { Briefcase } from "lucide-react";
import { NavLink } from "@/app/components/ui";

export default function BotonViajes({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) {
  const href = `/user/${id}/travels`;
  return (
    <NavLink
      href={href}
      isActive={pathname === href}
      icon={<Briefcase size={16} strokeWidth={1.75} />}
    >
      Mis trabajos
    </NavLink>
  );
}
