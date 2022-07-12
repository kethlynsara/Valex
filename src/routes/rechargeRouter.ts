import { Router } from "express";
import { postRecharge } from "../controllers/rechargeController.js";
import { validateData } from "../middlewares/cardMiddleware.js";
// import { validateData } from "../middlewares/rechargeMiddleware.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge", validateData, postRecharge);

export default rechargeRouter;