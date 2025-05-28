import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface ProductoData {

    idproducto: number | null;
    cantidad: number;
    descripcion: string;
    precio: number;
    unidadmedida: string;
    categoria: string;
}

export class Producto {

    public _objProducto: ProductoData | null;
    public _idProducto: number | null;

    constructor(objProducto: ProductoData | null = null, idProducto: number | null = null) {
        this._objProducto = objProducto;
        this._idProducto = idProducto;
    }

    public async SeleccionarProducto(): Promise<ProductoData[]> {
        const result = await conexion.query("SELECT * FROM productos");
        console.log("Resultado de la consulta productos:", result);
        return result as ProductoData[];
    }

    public async obtenerProductoPorId(): Promise<ProductoData | null> {
        try {
            if (!this._idProducto) {
                throw new Error("No se proporcionó un ID de producto.");
            }

            const [producto] = await conexion.query("SELECT * FROM productos WHERE idproducto = ?", [this._idProducto]);

            if (!producto) {
                return null;
            }

            return producto as ProductoData;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            throw error;
        }
    }

    //INSERT
    public async insertarProducto(): Promise<{ success: boolean; message: string; producto?: Record<string, unknown> }> {

        try {

            if (!this._objProducto) {
                throw new Error("No se ha proporcionado un objeto producto");

            }

            const { cantidad, descripcion, precio, unidadmedida, categoria } = this._objProducto;
            if (!cantidad || !descripcion || !precio || !unidadmedida || !categoria) {
                throw new Error("Faltan datos del producto");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute('INSERT INTO productos (cantidad, descripcion, precio, unidadmedida, categoria) VALUES (?, ?, ?, ?, ?)', [
                cantidad,
                descripcion,
                precio,
                unidadmedida,
                categoria
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [producto] = await conexion.query("SELECT * FROM productos WHERE idproducto = LAST_INSERT_ID()");

                await conexion.execute("COMMIT");

                return { success: true, message: "Producto insertado correctamente", producto: producto };
            } else {
                throw new Error('No fue posible registrar el producto');
            }

        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "Error al servidor" }
            }


        }

    }

    //UPDATE
    public async actualizarProducto(): Promise<{ success: boolean; message: string; producto?: Record<string, unknown> }> {

        try {
            if (!this._objProducto) {
                throw new Error("No se ha proporcionado un objeto producto");
            }

            const { cantidad, descripcion, precio, unidadmedida, categoria } = this._objProducto;
            if (!cantidad || !descripcion || !precio || !unidadmedida || !categoria) {
                throw new Error("Faltan datos del producto");
            }

            if (!this._idProducto) {
                throw new Error("No se envio ningun idProducto");
            }
            const idProducto = this._idProducto;

            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute('UPDATE productos SET cantidad = ?, descripcion = ?, precio = ?, unidadmedida = ?, categoria = ? WHERE idproducto = ?', [
                cantidad,
                descripcion,
                precio,
                unidadmedida,
                categoria,
                idProducto
            ]);

            console.log("Se ejecuto la consulta");

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {

                console.log("La actualizacion fue exitosa");

                const [producto] = await conexion.query('SELECT * FROM productos WHERE idproducto = ?', [idProducto]);
                await conexion.execute("COMMIT");
                console.log("Obteniendo el producto actualizado" + producto);

                return { success: true, message: "Producto actualizado correctamente", producto: producto };

            }
            else {
                throw new Error(`No fue posible actualizar el producto. Error: ${result}`);
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

    //DELETE
    public async eliminarProducto(): Promise<{ success: boolean; message: string; }> {

        try {

            const idProducto = this._idProducto;
            if (!this._idProducto) {

                throw new Error("No se envio ningun idProducto");

            }
            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute('DELETE FROM productos WHERE idproducto=?', [idProducto]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                console.log("La eliminacion fue exitosa");

                return { success: true, message: `Producto Eliminado Correctamente. IdProducto= ${idProducto}` };

            } else {
                throw new Error("No fue posible eliminar el producto.");
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

    //Ahora necesitamos crear un metodo para registrar una lista de productos
    public async insertarListaProductos(productos: ProductoData[]): Promise<{ success: boolean; message: string; }> {
        try {
            if (!Array.isArray(productos) || productos.length === 0) {
                throw new Error("No se ha proporcionado una lista de productos válida");
            }

            await conexion.execute("START TRANSACTION");

            for (const producto of productos) {
                const { cantidad, descripcion, precio, unidadmedida, categoria } = producto;
                if (!cantidad || !descripcion || !precio || !unidadmedida || !categoria) {
                    throw new Error("Faltan datos del producto");
                }

                const result = await conexion.execute('INSERT INTO productos (cantidad, descripcion, precio, unidadmedida, categoria) VALUES (?, ?, ?, ?, ?)', [
                    cantidad,
                    descripcion,
                    precio,
                    unidadmedida,
                    categoria
                ]);

                if (!result || typeof result.affectedRows !== "number" || result.affectedRows <= 0) {
                    throw new Error('No fue posible registrar el producto');
                }
            }

            await conexion.execute("COMMIT");
            return { success: true, message: "Productos insertados correctamente" };

        } catch (error) {
            if (error instanceof z.ZodError) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "Error al servidor" }
            }
        }
    }

}