import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerCliente } from "./Routes/ClienteRouter.ts";
import { routerMascotas } from "./Routes/MascotasRouter.ts";


const app = new Application();

app.use(oakCors());

const routers = [routerCliente, routerMascotas];

routers.forEach((router) => {
    app.use(router.routes());
    app.use(router.allowedMethods());
});

console.log("Servidor corriendo en el puerto 8000");

app.listen({ port: 8000 });