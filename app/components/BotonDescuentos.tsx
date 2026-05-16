"use client";

import { Tag } from "lucide-react";
import { NavLink } from "@/app/components/ui";

export default function BotonDescuentos({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) {
  void id;
  const href = "/mocks/promotions";
  return (
    <NavLink
      href={href}
      isActive={pathname === href}
      icon={<Tag size={16} strokeWidth={1.75} />}
    >
      Promociones
    </NavLink>
  );
}
