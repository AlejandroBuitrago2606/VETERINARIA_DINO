import { Router} from "../Dependencies/dependencias.ts";
import { getMascotas, postMascotas, putMascotas, deleteMascotas } from "../Controllers/MascotaControllers.ts";



const routerMascotas = new Router();

routerMascotas.get("/mascotas",getMascotas);
routerMascotas.post("/mascotas",postMascotas);
routerMascotas.put("/mascotas",putMascotas);
routerMascotas.delete("/mascotas",deleteMascotas);

export { routerMascotas };