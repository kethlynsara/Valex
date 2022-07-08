import { Router } from "express";
import { createCard } from "../controllers/cardController.js";
import { validateData } from "../middlewares/cardMiddleware.js";

const cardRouter = Router();

cardRouter.post("/card", validateData, createCard);

export default cardRouter;