
export default function TablaViajes({ filas }: { filas: any[] }) {

  const columnas = ["Servicio", "Fecha", "Costo", "Trabajador", "Estado"];

  return (
    <div className="w-full max-w-full overflow-x-auto pb-4">
      <table className="w-full min-w-[700px] border-separate border-spacing-y-2 sm:border-spacing-y-5">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th
                key={col}
                className="px-6 py-5 text-left text-brand-purple text-sm font-bold uppercase tracking-widest"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr
              key={i}
              className="border-t border-brand-purple/20 hover:bg-white/5 transition-colors duration-200"
            >
              <td className="px-6 py-7 text-brand-text text-base font-semibold">
                {fila.tipo_de_trabajo}
              </td>
              <td className="px-6 py-7 text-brand-lavender text-base">
                {fila.fecha?.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="px-6 py-7 text-brand-lavender text-base">
                {fila.pagos[0].monto.toString() }
              </td>
              <td className="px-6 py-7 text-brand-lavender text-base">
                Juan Pérez
              </td>
              {/* hacer get con el id del driver para recuperar el nmbre del driver*/}
              <td className="px-6 py-7 text-brand-lavender text-base">
                {fila.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filas.length === 0 && (
        <div className="py-12 text-center text-brand-purple text-sm">
          No hay trabajos registrados aún.
        </div>
      )}
    </div>
  );
}