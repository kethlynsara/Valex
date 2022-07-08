import { Request, Response } from "express";

export async function createCard(req: Request, res: Response) {
    const apiKey = req.header('x-api-key');
    const { type } : { type: string } = req.body;
    res.send({apiKey, type});
}