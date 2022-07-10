import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";
import * as cardRepository from "../repositories/cardRepository.js"

export async function createCard(req: Request, res: Response) {
    const apiKey = req.header('x-api-key');
    const { employeeId, type } : { employeeId: number, type: cardRepository.TransactionTypes } = req.body;
    const result = await cardService.createCard(apiKey, employeeId, type);
    res.send(result);
}