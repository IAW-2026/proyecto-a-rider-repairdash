import FormularioNuevaUbicacion from "./_components/FormularioNuevaUbicacion";

export default async function SolicitudNuevaUbicacion({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;
  return (  
    <FormularioNuevaUbicacion id={id} />
  );
}
