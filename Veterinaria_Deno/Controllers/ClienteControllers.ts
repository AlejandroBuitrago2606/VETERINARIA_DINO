//deno-lint-ignore-file

import { Cliente } from "../Models/ClienteModels.ts";


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


export const  postCliente = async (ctx: any)=> {

    const { response, request } = ctx;

    try{

        const contentLength = request.headers. get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body= await request.body.json();

        const ClienteData ={
            idcliente: null,
            nombre: body.nombre,
            apellido: body.apellido,
            email: body.email,
            telefono: body.telefono

        };

        const objCliente = new Cliente(ClienteData);
        const result = await objCliente.insertarCliente();
        response.status = 200;
        response.body ={

            success: true,
            body: result
        };

        console.log("Cliente creado correctamente" + result);

} catch (error) {
        response.status = 400;
        response.body = {

            success: false,
            msg: `Error al procesar la solicitud. \n ${error}`

        }
        console.log(error);


    }
}

    export const putCliente = async (ctx: any)=>{

        const { response, request} = ctx;

       try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

          const ClienteData ={
            idcliente: body.idcliente,
            nombre: body.nombre,
            apellido: body.apellido,
            email: body.email,
            telefono: body.telefono
          };

        const idCliente = Number(body.idcliente);

        const objCliente = new Cliente(ClienteData, idCliente);
        const result = await objCliente.actualizarCliente();
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


    



    




