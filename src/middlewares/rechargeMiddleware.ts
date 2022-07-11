import { NextFunction, Request, Response } from "express";
import { rechargeSchema } from "../schemas/rechargeSchema.js";

export async function validateData(req: Request, res: Response, next: NextFunction) {
    const { id, value }: { id: number, value: number } = req.body;

    const { error } = rechargeSchema.validate({id, value}, {abortEarly: false});

    if (error) {
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    next();
}