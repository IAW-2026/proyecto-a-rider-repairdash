import MenuHamburguesa from "@/app/components/MenuHamburguesa";
import BottomNav from "@/app/components/BottomNav";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClienteClerkID } from "@/lib/actions/clientes";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;

  // ─── VERIFICACIÓN DE SEGURIDAD ───────────────────────────────────────────────
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

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
  const nombre = user.firstName;
  const apellido = user?.lastName;
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex">
      {/* Sidebar fijo: solo desktop */}
      <aside className="hidden sm:flex w-[220px] shrink-0 border-l border-rd-border-2 bg-rd-bg-2 flex-col fixed inset-y-0 right-0 z-[100]">
        <MenuHamburguesa
          id={id}
          nombre={nombre || ""}
          apellido={apellido || ""}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 sm:mr-[220px]">
        <main className="pt-4 sm:pt-8 pb-24 sm:pb-10 flex-1 flex flex-col items-center">
          <div className="w-full max-w-screen-xl px-4 sm:px-8">{children}</div>
        </main>
      </div>

      {/* Bottom nav: solo en mobile */}
      <BottomNav id={id} />
    </div>
  );
}
