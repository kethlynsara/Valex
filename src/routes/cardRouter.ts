import { Router } from "express";
import { activateCard, blockCard, createCard, getTransactions, unlockCard } from "../controllers/cardController.js";
import { validateActivateCardData, validateData } from "../middlewares/cardMiddleware.js";

const cardRouter = Router();

cardRouter.get("/card-transactions/:id", getTransactions);
cardRouter.post("/card", validateData, createCard);
cardRouter.post("/card-activate", validateActivateCardData, activateCard);
cardRouter.post("/card-block/:id", blockCard);
cardRouter.post("/card-unlock/:id", unlockCard);

export default cardRouter;