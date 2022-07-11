import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";
import * as cardRepository from "../repositories/cardRepository.js"

export async function createCard(req: Request, res: Response) {
    const apiKey = req.header('x-api-key');
    const { employeeId, type } : { employeeId: number, type: cardRepository.TransactionTypes } = req.body;
    const result = await cardService.createCard(apiKey, employeeId, type);
    res.send(result);
}

export async function activateCard(req: Request, res: Response) {
    const { cardId, CVC, password }: {cardId: number, CVC: number, password: string} = req.body;
    const result = await cardService.activateCard(cardId, CVC, password);
    res.send(result);
}

export async function getTransactions(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.sendStatus(401);
    }

    const result = await cardService.getTransactions(parseInt(id));
    res.send(result);
}

export async function blockCard(req: Request, res: Response) {
    const { id } = req.params;
    const { password }: {password: string} = req.body;
    console.log('id', id)
    if (!id || !password) {
        return res.sendStatus(401);
    }

    const result = await cardService.blockCard(parseInt(id), password);
    res.send(result);
}

export async function unlockCard(req: Request, res: Response) {
    const { id } = req.params;
    const { password }: {password: string} = req.body;
    console.log('id', id)
    if (!id || !password) {
        return res.sendStatus(401);
    }

    const result = await cardService.unlockCard(parseInt(id), password);
    res.send(result);
}