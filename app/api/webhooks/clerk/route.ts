import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { getClienteByClerkID, updateClienteByClerkID } from "@/app/lib/queries/clientes"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  // Obtener las cabeceras para validar la firma de seguridad
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // Obtener el body crudo para validar la firma correctamente
  const body = await req.text();

  // Crear un nuevo webhook de svix y verificarlo
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 })
  }

  // ¡Aquí manejamos el evento!
  const eventType = evt.type;


  // Actualizar datos del usuario cuando los cambia en Clerk
  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const cliente = await getClienteByClerkID(id);

    if (cliente) {
      await updateClienteByClerkID(id, {
        mail: email_addresses[0]?.email_address,
        nombre: first_name || "",
        apellido: last_name || "",
      });

      console.log(`[Webhook] Usuario actualizado en BD: ${id}`);
    }

    return new Response('', { status: 200 });
  }

  // Fallback para cualquier otro evento suscripto
  return new Response('', { status: 200 });
}

