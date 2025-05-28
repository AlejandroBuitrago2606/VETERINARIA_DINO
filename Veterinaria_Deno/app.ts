//deno-lint-ignore-file
import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { send} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { routerCliente } from "./Routes/ClienteRouter.ts";
import { routerMascotas } from "./Routes/MascotasRouter.ts";
import { routerProductos } from "./Routes/ProductoRouter.ts";

const app = new Application();

// Permitir CORS
app.use(oakCors());

// Servir archivos estáticos desde la carpeta "uploads"
app.use(async (ctx: any, next: any) => {
  if (ctx.request.url.pathname.startsWith("/uploads")) {
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(),
    });
  } else {
    await next();
  }
});

// Rutas de la aplicación
const routers = [routerCliente, routerMascotas];
routers.forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

console.log("Servidor corriendo en el puerto 8000");

await app.listen({ port: 8000 });