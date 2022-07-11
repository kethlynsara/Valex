import { NextFunction, Request, Response } from "express";
import { activateCardSchema, schema } from "../schemas/cardSchema.js";

export async function validateData(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('x-api-key');
    const { employeeId, type } : { employeeId: number, type: string } = req.body;

    const { error } = schema.validate({apiKey, employeeId, type}, {abortEarly: false});

    if (error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    next();
}

export async function validateActivateCardData(req: Request, res: Response, next: NextFunction) {
    const { cardId, CVC, password }: {cardId: number, CVC: number, password: string} = req.body;

    const { error } = activateCardSchema.validate({ cardId, CVC, password }, {abortEarly: false});

    if (error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    next();
}