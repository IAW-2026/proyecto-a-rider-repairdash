"use server"

export async function obtenerTrabajos(){

    const apiKey = process.env.NEXT_PUBLIC_DRIVER_KEY

    if(!apiKey){
        throw new Error("La API Key no está definida")
    }

    const res = await fetch(`https://driver-repairdash.vercel.app/api/tipos-servicios`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "x-api-key": apiKey
        },
        cache: "no-store",
    })

    if(!res.ok){
        throw new Error(`Error al obtener los trabajos (status ${res.status})`)
    }

    const contentType = res.headers.get("content-type") ?? ""
    if(!contentType.includes("application/json")){
        const body = await res.text()
        throw new Error(
            `La API de trabajos no devolvió JSON (content-type: ${contentType}). Body: ${body.slice(0, 120)}`
        )
    }

    const data = (await res.json()).data

    return data


}
