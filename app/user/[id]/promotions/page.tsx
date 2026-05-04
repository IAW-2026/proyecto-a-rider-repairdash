

export default async function Promotions({params}: {params: Promise<{id: string}>}) {
    const {id} = await params
    return (
        <div>
            <h1>Mis Promociones</h1>
        </div>
    )
}