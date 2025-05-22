import { Router} from "../Dependencies/dependencias.ts";
import { getClientes, getClienteConMascotas, postCliente, putCliente, deleteCliente } from "../Controllers/ClienteControllers.ts";



const routerCliente = new Router();

routerCliente.get("/cliente",getClientes);
routerCliente.get("/cliente/con-mascotas/:id", getClienteConMascotas);
routerCliente.post("/cliente",postCliente);
routerCliente.put("/cliente",putCliente);
routerCliente.delete("/cliente",deleteCliente);

export { routerCliente };