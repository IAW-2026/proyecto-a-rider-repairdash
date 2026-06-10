"use server"

export async function mandarPromocionUsada(usuarioId: string, promocionId: number, trabajoId: number, valorOriginal: number, valorPagado: number){
    const apiKey = process.env.NEXT_PUBLIC_PROMOTIONS_KEY

    if(!apiKey){
        throw new Error("La API Key no está definida")
    }

    if(!usuarioId){
        throw new Error("Falta el usuarioId para mandar la promocion usada")
    }

    if(!promocionId){
        throw new Error("Falta el promocionId para mandar la promocion usada")
    }

    const url = `https://proyecto-a-promotions-repairdash.vercel.app/api/historial`

    console.log("[mandarPromocionUsada] POST →", url, { usuarioId, promocionId, trabajoId, valorOriginal, valorPagado })

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({
            usuarioId,
            promocionId,
            trabajoId,
            valorOriginal,
            valorPagado,
        }),
        cache: "no-store",
    })

    console.log("[mandarPromocionUsada] status:", res.status)

    if(!res.ok){
        const body = await res.text()
        console.log("[mandarPromocionUsada] error body:", body)
        throw new Error(`Error al mandar la promocion usada (status ${res.status})`)
    }

    const contentType = res.headers.get("content-type") ?? ""
    if(!contentType.includes("application/json")){
        const body = await res.text()
        throw new Error(
            `La API de promociones no devolvió JSON (content-type: ${contentType}). Body: ${body.slice(0, 120)}`
        )
    }

    const json = await res.json()
    console.log("[mandarPromocionUsada] response:", json)

    return json.data
}