//Agregamos los contrroladores de producto
//deno-lint-ignore-file

import { Producto } from "../Models/ProductoModels.ts";

//GET
export const getProductos = async (ctx: any) => {

    const { response } = ctx;
    try {

        const objProducto = new Producto();
        const listaProductos = await objProducto.SeleccionarProducto();
        response.status = 200;
        response.body = {

            success: true,
            data: listaProductos
        };
        console.log("Productos obtenidos correctamente" + listaProductos);


    } catch (error) {

        response.status = 400;
        response.body = {

            success: false,
            msg: "Error al procesar la solicitud",
            errors: error
        }

    }
};

//GET por ID
export const getProductoById = async (ctx: any) => {
    const { response, params } = ctx;
    try {
        const idProducto = Number(params.idproducto);

        if (isNaN(idProducto)) {
            response.status = 400;
            response.body = { success: false, message: "ID de producto inválido" };
            return;
        }

        const objProducto = new Producto(null, idProducto);
        const data = await objProducto.obtenerProductoPorId();

        if (!data) {
            response.status = 404;
            response.body = { success: false, message: "Producto no encontrado" };
            return;
        }

        response.status = 200;
        response.body = {
            success: true,
            producto: data
        };

    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: `Error al procesar la solicitud. \n ${error}` };
    }
}

//POST
export const postProducto = async (ctx: any) => {

    const { response, request } = ctx;

    try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

        const ProductoData = {
            idproducto: null,
            cantidad: body.cantidad,
            descripcion: body.descripcion,
            precio: body.precio,
            unidadmedida: body.unidadmedida,
            categoria: body.categoria
        };

        const objProducto = new Producto(ProductoData);
        const result = await objProducto.insertarProducto();
        response.status = 200;
        response.body = {

            success: true,
            body: result
        };

        console.log("Producto creado correctamente" + result);

    } catch (error) {
        response.status = 400;
        response.body = {

            success: false,
            msg: `Error al procesar la solicitud. \n ${error}`

        }
        console.log(error);


    }
}

//PUT
export const putProducto = async (ctx: any) => {

    const { response, request } = ctx;

    try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

        const ProductoData = {
            idproducto: null,
            cantidad: body.cantidad,
            descripcion: body.descripcion,
            precio: body.precio,
            unidadmedida: body.unidadmedida,
            categoria: body.categoria
        };

        const idProducto = Number(body.idproducto);

        const objProducto = new Producto(ProductoData, idProducto);
        const result = await objProducto.actualizarProducto();
        response.status = 200;
        response.body = {

            success: true,
            body: result

        };


    } catch (error) {
        response.status = 400;
        response.body = {

            success: false,
            msg: `Error al procesar la solicitud. \n ${error}`

        }
        console.log(error);


    }


}

//DELETE
export const deleteProducto = async (ctx: any) => {

    const { response, request } = ctx;

    try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

        const idProducto = Number(body.idproducto);

        const objProducto = new Producto(null, idProducto);
        const result = await objProducto.eliminarProducto();
        response.status = 200;
        response.body = {

            success: true,
            body: result

        }


    } catch (error) {
        response.status = 400;
        response.body = {

            success: false,
            msg: `Error al procesar la solicitud. \n ${error}`

        }
        console.log(error);


    }

}

//Ahora haremos el metodo para registrar una lista de productos
export const postListaProductos = async (ctx: any) => {
    const { response, request } = ctx;

    try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

        const listaProductos = body; // Asegúrate de que el cuerpo tenga un campo 'productos'

        if (!Array.isArray(listaProductos) || listaProductos.length === 0) {
            response.status = 400;
            response.body = { success: false, msg: "La lista de productos es inválida o está vacía." };
            return;
        }

        const objProducto = new Producto();
        const result = await objProducto.insertarListaProductos(listaProductos);
        response.status = 200;
        response.body = {

            success: true,
            body: result
        };

    } catch (error) {
        response.status = 400;
        response.body = {

            success: false,
            msg: `Error al procesar la solicitud. \n ${error}`

        }
        console.log(error);

    }
}


