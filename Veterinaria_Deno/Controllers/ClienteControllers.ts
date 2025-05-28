//deno-lint-ignore-file

import { Cliente } from "../Models/ClienteModels.ts";
import { multiParser, FormFile } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";


export const getClientes = async (ctx: any)=>{

    const{ response } = ctx;
    try{

        const objCliente = new Cliente();
        const listaClientes = await objCliente.SeleccionarCliente();
        response.status = 200;
        response.body ={

            success: true,
            data: listaClientes
        };
        console.log("Apreendices obtenidos correctamete" + listaClientes);


    }catch(error){

        response.status = 400;
        response.body = {

            success: false,
            msg: "Error al procesar la solicitud",
            errors: error
        }

    }
}

export const getClienteConMascotas = async (ctx: any) => {
    const { response, params } = ctx;

    try {
        const idCliente = Number(params.id);

        if (isNaN(idCliente)) {
            response.status = 400;
            response.body = { success: false, message: "ID de cliente inválido" };
            return;
        }

        const objCliente = new Cliente(null, idCliente);
        const data = await objCliente.obtenerClienteConMascotas();

        if (!data) {
            response.status = 404;
            response.body = { success: false, message: "Cliente no encontrado" };
            return;
        }

        response.status = 200;
        response.body = {
            success: true,
            cliente: data.cliente,
            mascotas: data.mascotas
        };

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            message: `Error interno del servidor: ${error}`
        };
    }
};


export const postCliente = async (ctx: any) => {
  const { response, request } = ctx;

  try {
    const form = await multiParser(request.originalRequest);
    if (!form || !form.fields || !form.files) {
      response.status = 400;
      response.body = { success: false, msg: "Formulario inválido o vacío" };
      return;
    }

    const { nombre, apellido, email, telefono } = form.fields;
    const file = form.files.imagen;

    let nombreImagen: string | null = null;

    // Asegurarse que file no es array y tiene content
    if (file && !Array.isArray(file) && file.filename && file.content) {
      nombreImagen = `${Date.now()}_${file.filename}`;
      const rutaFinal = join("uploads", nombreImagen);

      // Escribir el archivo
      await Deno.writeFile(rutaFinal, file.content);
    }

    const objCliente = new Cliente({
      idcliente: null,
      nombre,
      apellido,
      email,
      telefono,
      imagen: nombreImagen,
    });

    const result = await objCliente.insertarCliente();

    response.status = 200;
    response.body = {
      success: true,
      body: result,
    };

  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `Error al procesar la solicitud.\n ${error}`,
    };
    console.error(error);
  }
};
   export const putCliente = async (ctx: any) => {
  const { response, request } = ctx;

  try {
    const form = await multiParser(request.originalRequest);
    if (!form || !form.fields) {
      response.status = 400;
      response.body = { success: false, msg: "Formulario inválido o vacío" };
      return;
    }

    const { idcliente, nombre, apellido, email, telefono, imagenActual } = form.fields;

    if (!idcliente) {
      response.status = 400;
      response.body = { success: false, msg: "Falta el id del cliente." };
      return;
    }

    const file = form.files?.imagen;
    let nombreImagen = imagenActual ?? null; // Si no hay nueva imagen, se mantiene la anterior

    if (file && !Array.isArray(file) && file.filename && file.content) {
      nombreImagen = `${Date.now()}_${file.filename}`;
      const rutaFinal = join("uploads", nombreImagen);
      await Deno.writeFile(rutaFinal, file.content);
    }
const idClienteNumber = Number(idcliente);

const objCliente = new Cliente({
  idcliente: idClienteNumber,
  nombre,
  apellido,
  email,
  telefono,
  imagen: nombreImagen,
}, idClienteNumber);

    const result = await objCliente.actualizarCliente();

    response.status = 200;
    response.body = {
      success: true,
      body: result,
    };

  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `Error al actualizar cliente.\n ${error}`,
    };
    console.error(error);
  }
};

    export const deleteCliente = async (ctx: any)=>{

         const { response, request } = ctx;

    try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

        const idCliente= Number(body.idcliente);

        const objAprendiz = new Cliente(null, idCliente);
        const result = await objAprendiz.eliminarCliente();
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


    



    





    




