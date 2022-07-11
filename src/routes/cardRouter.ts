import { Router } from "express";
import { activateCard, createCard } from "../controllers/cardController.js";
import { validateActivateCardData, validateData } from "../middlewares/cardMiddleware.js";

const cardRouter = Router();

cardRouter.post("/card", validateData, createCard);
cardRouter.post("/activate-card", validateActivateCardData ,activateCard);

export default cardRouter;