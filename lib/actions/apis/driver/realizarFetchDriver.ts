

export default async function realizarFetchDriver (
  id: string,
  categoria: string,
  id_trabajo: string,
    direccion: string,
    urlsFotos: string[],
    descripcion: string
) {
  const apiKey = process.env.NEXT_PUBLIC_DRIVER_KEY;
    if (!apiKey) throw new Error('Missing API key NEXT_PUBLIC_DRIVER_KEY');

    const res = await fetch('https://proyecto-a-driver-repairdash.vercel.app/api/webhooks/nuevo-trabajo', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': apiKey
        },
        body: JSON.stringify({ riderId: id, id_trabajo, tipoServicioId : categoria, direccion : direccion,fotos : urlsFotos, descripcion : descripcion })
    });

    if (!res.ok) {
        const errBody = await res.text();
        console.error(`[Driver] API ${res.status} response body:`, errBody);
        throw new Error(`Driver API error: ${res.status} — ${errBody}`);
    }
}