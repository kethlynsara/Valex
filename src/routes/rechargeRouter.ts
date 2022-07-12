import { Router } from "express";
import { postRecharge } from "../controllers/rechargeController.js";
import { validateRechargeData } from "../middlewares/rechargeMiddleware.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge", validateRechargeData, postRecharge);

export default rechargeRouter;