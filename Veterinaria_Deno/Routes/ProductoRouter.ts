import { Router} from "../Dependencies/dependencias.ts";
import { getProductos, postProducto, putProducto, deleteProducto, postListaProductos } from "../Controllers/ProductoControllers.ts";


const routerProductos = new Router();

routerProductos.get("/productos", getProductos);
routerProductos.post("/productos", postProducto);
routerProductos.put("/productos", putProducto);
routerProductos.delete("/productos", deleteProducto);
routerProductos.post("/productos/sbmasiva", postListaProductos);

export { routerProductos };