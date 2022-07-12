import * as cardService from "../services/cardService.js";
import * as utils from "../utils/sqlUtils.js"; 
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import dotenv from "dotenv";
dotenv.config();

export async function postRecharge(id: number, value: number) {
    const card = await cardService.findCard(id);
    await utils.validateExpirationDate(card);
    await utils.checkCardActivation(card.password);
    await rechargeRepository.insert({cardId: id, amount: value});
    return {status: "recharged"}
}