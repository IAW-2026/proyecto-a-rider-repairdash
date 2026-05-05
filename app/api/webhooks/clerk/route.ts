/*import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createCliente } from "@/app/lib/queries"

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

  // Obtener el body
  const payload = await req.json()
  const body = JSON.stringify(payload);

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

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    // Guardar en tu base de datos
    await createCliente({
      mail: email_addresses[0]?.email_address,
      calificacion: 0,
      nombre: first_name,
      apellido: last_name,
      id_clerk: id,
    });
    
    console.log(`Usuario creado en la BD: ${id}`);
  }

  return new Response('', { status: 200 })
}
  
Descomentar e implementar cuando el repositorio este publico
API para crear usuario que se registran por primera vez en clerk y dejar de usar sync*/
