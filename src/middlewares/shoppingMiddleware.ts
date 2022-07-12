import { NextFunction, Request, Response } from "express";
import { shoppingSchema } from "../schemas/shoppingSchema.js";

export async function validateData(req: Request, res: Response, next: NextFunction) {
    const { cardId, password, businessId, amount}: {cardId: number, password: string, businessId: number, amount: number} = req.body;

    if (!cardId || !password || !businessId || !amount) {
        return res.sendStatus(400);
    }

    const { error } = shoppingSchema.validate({cardId, password, businessId, amount}, {abortEarly: false});

    if (error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    if (amount <= 0) {
        return res.status(401).send("incorrect data");
    }

    next();
}