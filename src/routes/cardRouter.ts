import { Router } from "express";
import { activateCard, blockCard, createCard, getTransactions } from "../controllers/cardController.js";
import { validateActivateCardData, validateData } from "../middlewares/cardMiddleware.js";

const cardRouter = Router();

cardRouter.get("/card-transactions/:id", getTransactions);
cardRouter.post("/card", validateData, createCard);
cardRouter.post("/activate-card", validateActivateCardData ,activateCard);
cardRouter.post("/block-card/:id", blockCard);

export default cardRouter;