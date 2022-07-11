import * as cardService from "../services/cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import dotenv from "dotenv";
dotenv.config();

export async function postRecharge(id: number, value: number) {
    const card = await cardService.findCard(id);
    await cardService.validateExpirationDate(card);

    if (!card.password) {
        throw {
            type: "unauthorized",
            message: "card is not acttive"
        };         
    }

    await rechargeRepository.insert({cardId: id, amount: value});
    return {status: "recharged"}
}