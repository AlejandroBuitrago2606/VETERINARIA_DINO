// Routes/ClienteRouter.ts
import { Router } from "../Dependencies/dependencias.ts";
import {
  getClientes,
  getClienteConMascotas,
  postCliente,
  putCliente,
  deleteCliente,
} from "../Controllers/ClienteControllers.ts";

const routerCliente = new Router();

routerCliente
  .get("/cliente", getClientes)
  .get("/cliente/con-mascotas/:id", getClienteConMascotas)
  .post("/cliente", postCliente)
  .put("/cliente", putCliente)
  .delete("/cliente", deleteCliente);



export { routerCliente };
