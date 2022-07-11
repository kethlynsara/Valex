import { Router } from "express";
import { activateCard, createCard, getTransactions } from "../controllers/cardController.js";
import { validateActivateCardData, validateData } from "../middlewares/cardMiddleware.js";

const cardRouter = Router();

cardRouter.get("/card-transactions/:id", getTransactions);
cardRouter.post("/card", validateData, createCard);
cardRouter.post("/activate-card", validateActivateCardData ,activateCard);

export default cardRouter;