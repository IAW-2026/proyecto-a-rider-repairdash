import { Suspense } from "react";
import MenuHamburguesa from "./_components/MenuHamburguesa";
import BarraInferior from "./_components/BarraInferior";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClienteClerkID } from "@/lib/actions/clientes";

async function UserSidebar({ id }: { id: string }) {
  const user = await currentUser();
  const clerkId = user?.id;

  if (clerkId) {
    const dbUser = await getClienteClerkID(clerkId);

    if (!dbUser || dbUser.id_cliente.toString() !== id) {
      redirect(`/user/${dbUser?.id_cliente}/menu`);
    }
  } else {
    redirect("/");
  }

  const nombre = user?.firstName || "";
  const apellido = user?.lastName || "";

  return <MenuHamburguesa id={id} nombre={nombre} apellido={apellido} />;
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;

  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar fijo: solo desktop */}
      <aside className="hidden sm:flex w-[220px] shrink-0 border-l border-rd-border-2 bg-rd-bg-2 flex-col fixed inset-y-0 right-0 z-[100]">
        <Suspense fallback={<div className="p-8 text-center text-sm text-rd-muted animate-pulse">Cargando menú...</div>}>
          <UserSidebar id={id} />
        </Suspense>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 sm:mr-[220px]">
        <main className="pt-4 sm:pt-8 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-10 flex-1 flex flex-col items-center px-safe-page sm:px-8">
          <div className="w-full max-w-screen-xl">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav: solo en mobile */}
      <BarraInferior id={id} />
    </div>
  );
}
