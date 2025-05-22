import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface MascotaData {

    idmascota: number | null;
    nombre: string;
    especie: string;
    raza: string;
    edad: number | null;
    idcliente: number | null;
}

export class Mascota {
    public _objMascota: MascotaData | null;
    public _idMascota: number | null;

    constructor(objMascot: MascotaData | null = null, idMascota: number | null = null) {
        this._objMascota = objMascot;
        this._idMascota = idMascota
    }

    // ModeloCliente.ts (solo el método corregido)
    public async SeleccionarMascota(): Promise<MascotaData[]> {
        const result = await conexion.query("SELECT * FROM mascotas");
        console.log("Resultado de la consulta mascotas:", result);
        // Retornamos el resultado directamente asumiendo que es un array de objetos
        return result as MascotaData[];
    }


    public async insertarMascotas(): Promise<{ success: boolean; message: string; mascota?: Record<string, unknown> }> {

        try {

            if (!this._objMascota) {
                throw new Error("No se ha proporcionado un objeto mascota");

            }

            const { nombre, especie, raza, edad, idcliente } = this._objMascota;
            if (!nombre || !especie || !raza || !edad || !idcliente) {
                throw new Error("Faltan datos de la mascota");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute('INSERT INTO mascotas (nombre, especie, raza, edad, idcliente) VALUES (?, ?, ?, ?, ?)', [
                nombre,
                especie,
                raza,
                edad,
                idcliente
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [mascota] = await conexion.query("SELECT * FROM mascotas WHERE idmascota = LAST_INSERT_ID()");

                await conexion.execute("COMMIT");

                return { success: true, message: "Mascota insertado correctamente", mascota: mascota };
            } else {
                throw new Error('No fue posible registrar el mascota')
            }

        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "Error al servidor" }
            }


        }
    }

    public async actualizarMascotas(): Promise<{ success: boolean; message: string; mascota?: Record<string, unknown> }> {
        try {
            if (!this._objMascota) {
                throw new Error("No se ha proporcionado un objeto mascota");
            }

            const { nombre, especie, raza, edad, idcliente } = this._objMascota;
            if (!nombre || !especie || !raza || !edad || !idcliente) {
                throw new Error("Faltan datos de la mascota");
            }

            if (!this._idMascota) {
                throw new Error("No se envio ningun idMascota");
            }
            const idMascota = this._idMascota;

            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute('UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, edad = ?, idcliente = ? WHERE idmascota = ?', [
                nombre,
                especie,
                raza,
                edad,
                idcliente, // ← este te faltaba
                idMascota
            ]
            );


            console.log("Se ejecuto la consulta");

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {

                console.log("La actualizacion fue exitosa");

                const [mascota] = await conexion.query('SELECT * FROM mascotas WHERE idmascota = ?', [idMascota]);
                await conexion.execute("COMMIT");
                console.log("Obteniendo la mascota  actualizada" + mascota);

                return { success: true, message: "Mascota actualizada correctamente", mascota: mascota };

            }
            else {
                throw new Error(`No fue posible actualizar la mascota. Error: ${result}`);
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

    public async eliminarMascota(): Promise<{ success: boolean; message: string; }> {

        try {

            const idMascota = this._idMascota;
            if (!this._idMascota) {

                throw new Error("No se envio ningun idMascota");

            }
            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute('DELETE FROM mascotas WHERE idmascota=?', [idMascota]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                console.log("La eliminacion fue exitosa");

                return { success: true, message: `Mascota Eliminada correctamente. IdMascota= ${idMascota}` };

            } else {
                throw new Error("No fue posible eliminar la mascota.");
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





