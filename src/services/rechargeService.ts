import * as cardService from "../services/cardService.js";
import * as utils from "../utils/sqlUtils.js"; 
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js"
import dotenv from "dotenv";
dotenv.config();

async function findCompany(apiKey: string) {
    const company = await companyRepository.findByApiKey(apiKey);
    if (!company) {
        throw {
            type: "not found",
            message: "company not found"
        }
    }
}

export async function postRecharge(apiKey: string, id: number, value: number) {
    await findCompany(apiKey);
    const card = await cardService.findCard(id);
    await utils.validateExpirationDate(card);
    await utils.checkCardActivation(card.password);
    await rechargeRepository.insert({cardId: id, amount: value});
    return {status: "recharged"}
}