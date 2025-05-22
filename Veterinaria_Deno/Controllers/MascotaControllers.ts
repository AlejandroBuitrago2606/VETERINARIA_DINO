//deno-lint-ignore-file


import { Mascota } from "../Models/MascotaModels.ts";




export const getMascotas = async (ctx: any)=>{

    const{ response } = ctx;
    try{

        const objMascota = new Mascota();
        const listaMascotas = await objMascota.SeleccionarMascota();
        response.status = 200;
        response.body ={

            success: true,
            data: listaMascotas
        };
        console.log("Mascotas obtenidos correctamete" + listaMascotas);


    }catch(error){

        response.status = 400;
        response.body = {

            success: false,
            msg: "Error al procesar la solicitud",
            errors: error
        }

    }
}

export const  postMascotas = async (ctx: any)=> {

    const { response, request } = ctx;

    try{

        const contentLength = request.headers. get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body= await request.body.json();

        const MascotaData ={
            idmascota: null,
            nombre: body.nombre,
            especie: body.especie,
            raza: body.raza,
            edad: body.edad,
            idcliente: body.idcliente

        };

        const objMascota = new Mascota(MascotaData);
        const result = await objMascota.insertarMascotas();
        response.status = 200;
        response.body ={

            success: true,
            body: result
        };

        console.log("Mascota creado correctamente" + result);

} catch (error) {
        response.status = 400;
        response.body = {

            success: false,
            msg: `Error al procesar la solicitud. \n ${error}`

        }
        console.log(error);


    }
}

    export const putMascotas = async (ctx: any)=>{

        const { response, request} = ctx;

       try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

          const MascotaData ={
            idmascota: body.idmascota,
            nombre: body.nombre,
            especie: body.especie,
            raza: body.raza,
            edad: body.edad,
            idcliente: body.idcliente
          };

        const idMascota = Number(body.idmascota);

        const objMascota = new Mascota(MascotaData, idMascota);
        const result = await objMascota.actualizarMascotas();
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

    export const deleteMascotas = async (ctx: any)=>{

         const { response, request } = ctx;

    try {

        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud esta vacio." };
            return;
        }

        const body = await request.body.json();

        const idMascota= Number(body.idmascota);

        const objMascota = new Mascota(null, idMascota);
        const result = await objMascota.eliminarMascota();
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


    



    




