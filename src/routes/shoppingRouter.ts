import { Router } from "express";
import { postPurchase } from "../controllers/shoppingController.js";
import { validateData } from "../middlewares/shoppingMiddleware.js";

const shoppingRouter = Router();

shoppingRouter.post("/buy", validateData, postPurchase);

export default shoppingRouter;