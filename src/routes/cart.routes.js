import { Router } from "express";
import * as controller from "../controllers/cart.controllers.js";

import { ProductModel } from "../daos/mongodb/models/product.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { cartDto } from "../dtos/cart.dto.js";
import { uuid } from "uuidv4";

const router = Router();

router.get("/", controller.getAll); 

router.get("/:id", controller.getById); 

router.post("/", validate(cartDto), controller.create); 

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

router.post("/:idCart/products/:idProd", controller.addProdToCart);

router.delete("/:idCart/products/:idProd", controller.removeProdToCart);

router.put("/:idCart/products/:idProd", controller.updateProdQuantityToCart);

router.delete("/clear/:idCart", controller.clearCart);

// Entrega final
router.post("/:id/purchase", controller.finalizarCompra)

export default router;
