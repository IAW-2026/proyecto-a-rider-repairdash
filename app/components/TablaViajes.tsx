export default async function TablaViajes({ id }: { id: string }) {
  const columnas = ["Servicio", "Fecha", "Costo", "Trabajador", "Estado"];

  const filas = [ //estas failas se completaran con el fectch a la base de datos
    {
      servicio: "Servicio 1",
      fecha: "Fecha 1",
      costo: "Costo 1",
      trabajador: "Trabajador 1",
      estado: "Estado 1",
    },
    {
      servicio: "Servicio 2",
      fecha: "Fecha 2",
      costo: "Costo 2",
      trabajador: "Trabajador 2",
      estado: "Estado 2",
    },
    {
      servicio: "Servicio 3",
      fecha: "Fecha 3",
      costo: "Costo 3",
      trabajador: "Trabajador 3",
      estado: "Estado 3",
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-5">
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
                {fila.servicio}
              </td>
              <td className="px-6 py-7 text-brand-lavender text-base">
                {fila.fecha}
              </td>
              <td className="px-6 py-7 text-brand-lavender text-base">
                {fila.costo}
              </td>
              <td className="px-6 py-7 text-brand-lavender text-base">
                {fila.trabajador}
              </td>
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