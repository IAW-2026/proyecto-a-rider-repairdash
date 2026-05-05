import { createPago } from "../lib/queries";
import { redirect } from "next/navigation";


export default async function nuevoPago(formData: FormData, id_viaje: number){
    const monto = formData.get("monto") as string;
    const newPago = await createPago({
        id_viaje: id_viaje,
        monto: parseInt(monto),
    });
    //creo un pago para mi y mantener el monto y el estado, una vez agarrado el driver se efectua el pago con los datos ya creados 
    //de ser aceptado el pago, se actualiza el driver en la bd del viaje y el pago queado como aceptado, de ser cancelado
    //se borra el viaje y el pago creado
}