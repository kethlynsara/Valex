import * as utils from "../utils/sqlUtils.js"; 
import * as cardService from "../services/cardService.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import dotenv from "dotenv";
dotenv.config();

async function findBusiness(id: number) {
    const business = await businessRepository.findById(id);
    if (!business) {
        throw {
            type: "not found",
            message: "business not found"
        };
    }
    return business;
}

async function checkBusinessType(businessType: string, cardType: string) {
    if (businessType !== cardType) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };
    }
}

export async function postPurchase(cardId: number, password: string, businessId: number, amount: number) {
    const card = await cardService.findCard(cardId);
    await utils.validateExpirationDate(card);
    await utils.checkCardActivation(card.password);
    await utils.checkCardBlock(card.isBlocked);
    await utils.decrypt(password, card.password);
    
    const business = await findBusiness(businessId);
    await checkBusinessType(business.type, card.type);

    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);
    const balance = await utils.getBalance(recharges, transactions);
    
    if (balance < amount) {
        throw {
            type: "unauthorized",
            message: "balance is insufficient"
        }
    }

    await paymentRepository.insert({cardId, businessId, amount});
    return {status: "successful"}
}