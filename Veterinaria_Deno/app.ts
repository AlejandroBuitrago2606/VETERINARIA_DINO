//deno-lint-ignore-file
import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { send } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { routerCliente } from "./Routes/ClienteRouter.ts";
import { routerMascotas } from "./Routes/MascotasRouter.ts";
import { routerProductos } from "./Routes/ProductoRouter.ts";

const app = new Application();


// Middleware para servir archivos estáticos desde /uploads
app.use(async (ctx:any, next) => {
  const path = ctx.request.url.pathname;
  if (path.startsWith("/uploads/")) {
    await send(ctx, path, {
      root: Deno.cwd(),         // carpeta de trabajo, donde esté tu carpeta uploads
      index: "index.html",     // no aplica aquí, pero es obligatorio
    });
  } else {
    await next();
  }
});

// 1) Permitir peticiones desde cualquier origen
app.use(oakCors({
  origin: "*",             // o ["http://localhost:3000"] para más seguridad
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));


// Rutas de la aplicación
const routers = [routerCliente, routerMascotas, routerProductos];
routers.forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

console.log("Servidor corriendo en el puerto 8000");

await app.listen({ port: 8000 });