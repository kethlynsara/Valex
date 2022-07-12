import * as cardService from "../services/cardService.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config();

export async function postPurchase(cardId: number, password: string, businessId: number, amount: number) {
    const card = await cardService.findCard(cardId);
    await cardService.validateExpirationDate(card);

    if (!card.password) {
        throw {
            type: "unauthorized",
            message: "card is not active"
        };         
    }

    if (card.isBlocked) {
        throw {
            type: "unauthorized",
            message: "card is blocked"
        };         
    }

    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const decryptedPassword = cryptr.decrypt(card.password);
    console.log('decryptedpass', decryptedPassword)

    if (decryptedPassword !== password) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };
        
    } 

    const business = await businessRepository.findById(businessId);
    if (!business) {
        throw {
            type: "not found",
            message: "business not found"
        };
    }

    if (business.type !== card.type) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };
    }


    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);

    let cont1 = 0;
    recharges.forEach(recharge =>{
         return cont1 += recharge.amount;
    })

    let cont2 = 0;
    transactions.forEach(t =>{
         return cont2 += t.amount;
    })

    const balance = cont1 - cont2;
    if (balance < amount) {
        throw {
            type: "unauthorized",
            message: "balance is insufficient"
        }
    }

    await paymentRepository.insert({cardId, businessId, amount});
    return {status: "successful"}
}