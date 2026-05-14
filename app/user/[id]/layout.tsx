import MenuHamburguesa from "@/app/components/MenuHamburguesa";
import BottomNav from "@/app/components/BottomNav";
import Link from "next/link";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClienteClerkID } from "@/lib/actions/clientes";

export default async function Layout({ params, children }: { params: Promise<{ id: string }>; children: React.ReactNode;}) {
  const { id } = await params;

  // ─── VERIFICACIÓN DE SEGURIDAD ───────────────────────────────────────────────
  const { userId } = await auth();
  
  // Si no está logueado en Clerk, lo mandamos al inicio
  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const clerkId = user?.id;

  if (clerkId) {
    const dbUser = await getClienteClerkID(clerkId);
    
    // Si el usuario en la BD no existe, o si el ID de la URL no coincide con su ID real:
    if (!dbUser || dbUser.id_cliente.toString() !== id) {
      // Lo mandamos a /sync para que el sistema lo redirija forzosamente a SU propio panel
      redirect(`/user/${dbUser?.id_cliente}/menu`);
    }
  } else {
    // Si por alguna razón está logueado pero no tiene email
    redirect("/");
  }
  const nombre = user.firstName;
  const apellido = user?.lastName;
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Hamburguesa: solo en desktop */}
      <header className="fixed top-0 right-0 z-[110] p-2 hidden sm:block">
        <MenuHamburguesa id={id} nombre={nombre || ""} apellido={apellido || ""} />
      </header>

      <main className="pt-4 sm:pt-16 pb-24 sm:pb-0 flex-1 flex flex-col items-center">
        <div className="w-full max-w-screen-xl px-4 sm:pr-14 sm:pl-4 sm:px-8">
          {children}
        </div>
      </main>

      {/* Bottom nav: solo en mobile */}
      <BottomNav id={id} />
    </div>
  );
}