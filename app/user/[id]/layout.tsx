import MenuHamburguesa from "@/app/components/MenuHamburguesa";
import Link from "next/link";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClienteClerkID } from "@/app/lib/actions/clientes";

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
      redirect("/sync");
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
      <header className="fixed top-0 left-0 z-[110] p-3">
        <MenuHamburguesa id={id} nombre={nombre || ""} apellido={apellido || ""} />
      </header>
      <main className="pt-20 flex-1 flex flex-col items-center">
        <div className="w-full max-w-screen-xl px-8">
          {children}
        </div>
      </main>
      <footer className="w-full py-6 mt-12 border-t border-brand-purple/20 bg-brand-surface/30 flex flex-col sm:flex-row items-center justify-center gap-6 text-brand-muted text-sm font-medium tracking-wide">  
        <Link 
          href={`https://wa.me/${process.env.NEXT_PUBLIC_TELEFONO}`}
          className="hover:text-brand-accent hover:scale-105 transition-all duration-300"
        >
          Contactanos por Whatsapp
        </Link>
        <span className="hidden sm:inline-block text-brand-purple/50">|</span>
        <Link 
          href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
          className="hover:text-brand-accent hover:scale-105 transition-all duration-300"
        >
          Contactanos por Email
        </Link>
      </footer>
    </div>
  );
}