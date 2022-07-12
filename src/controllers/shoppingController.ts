import { Request, Response } from "express";
import * as shoppingService from "../services/shoppingService.js" 

export async function postPurchase(req: Request, res: Response) {
    const { cardId, password, businessId, amount}: {cardId: number, password: string, businessId: number, amount: number} = req.body;
    const result = await shoppingService.postPurchase(cardId, password, businessId, amount);
    res.send(result);
}