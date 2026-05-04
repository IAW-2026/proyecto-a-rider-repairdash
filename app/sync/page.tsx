import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClienteByClerkID, createCliente } from "@/app/lib/queries";
export const dynamic = "force-dynamic";

export default async function SyncUser() {
  const { userId } = await auth();

  // Si no hay token de sesión local, volvemos a inicio
  if (!userId) {
    redirect("/");
  }

  // Ahora pedimos los datos extendidos a la API de Clerk
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const clerkId = user?.id;
  const nombre = user?.firstName || undefined ;
  const apellido = user?.lastName || undefined;

  if (clerkId && email) {
    let existingUser = await getClienteByClerkID(clerkId);
    
    // Si el usuario no existe en la base de datos, intentamos crearlo
    if (!existingUser) {
      try {
        existingUser = await createCliente({
          mail: email,
          calificacion: 0,
          nombre: nombre,
          apellido: apellido,
          id_clerk: clerkId,
        });
      } catch (error) {
        // En caso de choque por registrarse de nuevo, lo buscamos
        existingUser = await getClienteByClerkID(clerkId);
      }
    }

    if (existingUser) {
      // Redirigir al usuario a su menu
      redirect(`/user/${existingUser.id_cliente}/menu`);
    }
  }

  // Si falló algo (ej. no tiene email), devolvemos al inicio
  redirect("/");
}