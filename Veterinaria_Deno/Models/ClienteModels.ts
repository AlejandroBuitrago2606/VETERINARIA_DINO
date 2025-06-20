//deno-lint-ignore-file
import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface ClienteData {

    idcliente: number | null;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    imagen: string | null;
}

export class Cliente {
    public _objCliente: ClienteData | null;
    public _idCliente: number | null;

    constructor(objClient: ClienteData | null = null, idCliente: number | null = null) {
        this._objCliente = objClient;
        this._idCliente = idCliente
    }

    // ModeloCliente.ts (solo el método corregido)
    public async SeleccionarCliente(): Promise<ClienteData[]> {
        const result = await conexion.query("SELECT * FROM clientes");
        console.log("Resultado de la consulta clientes:", result);
        // Retornamos el resultado directamente asumiendo que es un array de objetos
        return result as ClienteData[];
    }


    // Dentro de la clase Cliente

    public async obtenerClienteConMascotas(): Promise<{ cliente: Record<string, unknown>, mascotas: Record<string, unknown>[] } | null> {
        try {
            if (!this._idCliente) {
                throw new Error("No se proporcionó un ID de cliente.");
            }

            const [cliente] = await conexion.query("SELECT * FROM clientes WHERE idcliente = ?", [this._idCliente]);

            if (!cliente) {
                return null;
            }

            const mascotas = await conexion.query("SELECT * FROM mascotas WHERE idcliente = ?", [this._idCliente]);

            return {
                cliente,
                mascotas
            };
        } catch (error) {
            console.error("Error al obtener cliente con mascotas:", error);
            throw error;
        }
    }



    public async insertarCliente(): Promise<{ success: boolean; message: string; cliente?: Record<string, unknown> }> {

        try {

            if (!this._objCliente) {
                throw new Error("No se ha proporcionado un objeto cliente");

            }

            const { nombre, apellido, email, telefono, imagen } = this._objCliente;
            if (!nombre || !apellido || !email || !telefono) {
                throw new Error("Faltan datos del cliente");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute('INSERT INTO clientes (nombre, apellido, email, telefono, imagen) VALUES (?, ?, ?, ?, ?)', [
                nombre,
                apellido,
                email,
                telefono,
                imagen
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [cliente] = await conexion.query("SELECT * FROM clientes WHERE idcliente = LAST_INSERT_ID()");

                await conexion.execute("COMMIT");

                return { success: true, message: "Cliente insertado correctamente", cliente: cliente };
            } else {
                throw new Error('No fue posible registrar el cliente')
            }

        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "Error al servidor" }
            }


        }
    }

    public async actualizarCliente(): Promise<{ success: boolean; message: string; cliente?: Record<string, unknown> }> {
    try {
        if (!this._objCliente) {
            throw new Error("No se ha proporcionado un objeto cliente");
        }

        const { nombre, apellido, email, telefono, imagen } = this._objCliente;

        if (!nombre || !apellido || !email || !telefono || !imagen) {
            throw new Error("Faltan datos del cliente");
        }

        if (!this._idCliente) {
            throw new Error("No se envió ningún idCliente");
        }

        const idCliente = this._idCliente;

        await conexion.execute("START TRANSACTION");

        const result: any = await conexion.execute(
            'UPDATE clientes SET nombre = ?, apellido = ?, email = ?, imagen = ?, telefono = ? WHERE idcliente = ?',
            [nombre, apellido, email, imagen, telefono, idCliente] 
        );

        console.log("Se ejecutó la consulta de actualización");

        if (result && result.affectedRows && result.affectedRows > 0) {
            console.log("La actualización fue exitosa");

            const clienteResult: any[] = await conexion.query(
                'SELECT * FROM clientes WHERE idcliente = ?',
                [idCliente]
            );

            await conexion.execute("COMMIT");

            const cliente = clienteResult?.[0];

            console.log("Cliente actualizado:", cliente);

            return {
                success: true,
                message: "Cliente actualizado correctamente",
                cliente
            };
        } else {
            await conexion.execute("ROLLBACK");
            throw new Error(`No fue posible actualizar el cliente. Resultado: ${JSON.stringify(result)}`);
        }

    } catch (error: unknown) {
    await conexion.execute("ROLLBACK");

    if (error instanceof z.ZodError) {
        return { success: false, message: error.message };
    }

    if (error instanceof Error) {
        return { success: false, message: `Error interno del servidor: ${error.message}` };
    }

    // Si el error no es una instancia de Error ni ZodError
    return { success: false, message: "Error desconocido al actualizar el cliente." };
}
}

    public async eliminarCliente(): Promise<{ success: boolean; message: string; }> {

        try {

            const idCliente = this._idCliente;
            if (!this._idCliente) {

                throw new Error("No se envio ningun idCliente");

            }
            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute('DELETE FROM clientes WHERE idCliente=?', [idCliente]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                console.log("La eliminacion fue exitosa");

                return { success: true, message: `Cliente Eliminado Correctamente. IdAprendiz= ${idCliente}` };

            } else {
                throw new Error("No fue posible eliminar el cliente.");
            }


        } catch (error) {

            if (error instanceof z.ZodError) {
                return { success: false, message: error.message }
            }
            else {
                return { success: false, message: `Error interno del servidor: ${error}` };
            }


        }



    }


}
