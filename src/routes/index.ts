import { Router } from "express";
import cardRouter from "./cardRouter.js";
import rechargeRouter from "./rechargeRouter.js";
import shoppingRouter from "./shoppingRouter.js";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(shoppingRouter);

export default router;