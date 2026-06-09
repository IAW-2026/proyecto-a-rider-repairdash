"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Show, UserButton, useUser } from "@clerk/nextjs";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui";
import { getClienteClerkID } from "@/lib/actions/clientes";

export default function IniciarSesion() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const metadata = user?.publicMetadata as { role?: string } | undefined;
  const [showFallback, setShowFallback] = useState(false);
  const [clienteEnDB, setClienteEnDB] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      setClienteEnDB(null);
      return;
    }
    let cancelled = false;
    getClienteClerkID(user.id).then((c) => {
      if (!cancelled) setClienteEnDB(!!c);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, user]);

  useEffect(() => {
    if (isLoaded && user && !metadata?.role) {
      const timer = setTimeout(() => setShowFallback(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, user, metadata?.role]);

  useEffect(() => {
    if (!isLoaded || !user || clienteEnDB !== true) return;
    if (metadata?.role === "admin-rider") {
      router.replace("/admin");
    } else if (metadata?.role === "rider") {
      router.replace(`/user/${user.id}/menu`);
    }
  }, [isLoaded, user, metadata?.role, clienteEnDB, router]);

  return (
    <div>
      <Show when="signed-out">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button onClick={() => router.push("/sign-in")} size="lg">
            <LogIn size={16} strokeWidth={1.75} />
            Ingresar
          </Button>
          <Button
            onClick={() => router.push("/sign-up")}
            variant="secondary"
            size="lg"
          >
            <UserPlus size={16} strokeWidth={1.75} />
            Crear cuenta
          </Button>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
            <div className="scale-[2] origin-center flex items-center justify-center w-full h-full">
              <UserButton />
            </div>
          </div>
          {!isLoaded ? null : !metadata?.role && showFallback ? (
            <p className="text-sm font-medium text-rd-text-2 text-center max-w-xs">
              Para iniciar sesión, creá una cuenta como Rider.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2
                size={20}
                strokeWidth={1.75}
                className="animate-spin text-rd-lavender"
              />
              <span className="text-xs text-rd-muted font-medium tracking-wide">
                Cargando…
              </span>
            </div>
          )}
        </div>
      </Show>
    </div>
  );
}
