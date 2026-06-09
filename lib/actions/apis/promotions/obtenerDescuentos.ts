"use server"
export async function obtenerDescuentos(usuarioId: string) {

    const apiKey = process.env.NEXT_PUBLIC_PROMOTIONS_KEY

    if(!apiKey){
        throw new Error("La API Key no está definida")
    }

    if(!usuarioId){
        throw new Error("Falta el usuarioId para obtener los descuentos")
    }

    const url = `https://proyecto-a-promotions-repairdash.vercel.app/api/promociones?usuarioId=${encodeURIComponent(usuarioId)}`

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "x-api-key": apiKey
        },
        cache: "no-store",
    })

    if(!res.ok){
        throw new Error(`Error al obtener los descuentos (status ${res.status})`)
    }

    const contentType = res.headers.get("content-type") ?? ""
    if(!contentType.includes("application/json")){
        const body = await res.text()
        throw new Error(
            `La API de descuentos no devolvió JSON (content-type: ${contentType}). Body: ${body.slice(0, 120)}`
        )
    }

    const data = (await res.json()).data

    return data


}




