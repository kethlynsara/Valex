import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js"

export async function postRecharge(req: Request, res: Response) {
    const apiKey = req.header('x-api-key');
    const { id, value }: { id: number, value: number } = req.body;

    if (id <= 0 || value <= 0) {
        return res.status(401).send("incorrect data");
    }

    const result = await rechargeService.postRecharge(apiKey, id, value);
    res.send(result);
}