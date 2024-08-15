import { Router } from "express";
import * as controller from "../controllers/product.controllers.js";

import { validate } from "../middlewares/validation.middleware.js";
import { productDto } from "../dtos/product.dto.js";
import { authorizations } from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/", controller.getAll);

router.get("/:id", controller.getById);

router.post("/", authorizations(["admin"]), validate(productDto), controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

export default router;
