import dayjs from "dayjs";
import Cryptr from "cryptr";
import { faker } from '@faker-js/faker';
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import dotenv from "dotenv";
dotenv.config();

async function validateData(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    const data = await cardRepository.findEmployeeAndCompany(apiKey, employeeId);
    if (!data) {
        throw {
            type: "not found",
            message: "employee or company not found"
        }
    }
    
    const cardType = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (cardType) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        }
    }

    return {
        cardType,
        data: data
    };
}

async function encrypt(string: string) {
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const encryptedString = cryptr.encrypt(string);
    return encryptedString;
}

export async function decrypt(info: any, compareInfo: string) {
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const decryptedInfo = cryptr.decrypt(compareInfo);
    console.log('decryptedInfo', decryptedInfo)
    if (decryptedInfo != info) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };        
    }
    return true;
}

async function getCardFullName(fullName: string) {
    const array = fullName.split(" ");
    for (let i = 1; i < array.length - 1; i++) {
        array[i].length >= 3 ?  array[i] = array[i][0] : array.splice(i, 1);    
    }

    const name = array.join(" ");
    return name;
}

export async function createCardInfo(fullName: string) {
    const number = faker.finance.creditCardNumber('');
    const name = await getCardFullName(fullName);
    const expirationDate = dayjs().add(5, 'year').format("MM-YYYY");
    const CVC = faker.random.numeric(3);
    const encryptedCVC = await encrypt(CVC);

    return {
        number,
        name,
        encryptedCVC,
        expirationDate
    }
}

export async function createCard(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    const inputValidation = await validateData(apiKey, employeeId, type);
    const cardInfo = await createCardInfo(inputValidation.data.fullName);
    const card: cardRepository.CardInsertData = {
        number: cardInfo.number,
        employeeId,
        cardholderName: cardInfo.name,
        securityCode: cardInfo.encryptedCVC,
        expirationDate: cardInfo.expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type
    }    
    const result = await cardRepository.insert(card);
    return result;
}

export async function findCard(id: number) {
    const card = await cardRepository.findById(id);
    if (!card) {
        throw {
            type: "not found",
            message: "card not found"
        };        
    }
    return card;
}

export async function updatePassword(password: string, cardId: number) {
    if (password.length === 4) {
        const encrypedPassword = await encrypt(password);
        await cardRepository.update(cardId, {password: encrypedPassword});     
        return {status: "updated"};   
    } else {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };
    }
}

export async function validateExpirationDate(card: cardRepository.Card) {
    const todaysDate = dayjs().format("MM-YYYY").toString();
    if (card.expirationDate < todaysDate) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };  
    }
    return true;
}

export async function validateCardActivation(card: cardRepository.Card) {
    if (card.password) {
        throw {
            type: "unauthorized",
            message: "card is already active"
        };  
    }
    return true;
}

export async function activateCard(cardId: number, CVC: number, password: string) {
    const card = await findCard(cardId);
    await validateExpirationDate(card);
    await validateCardActivation(card);
    await decrypt(CVC, card.securityCode);    
    const result = await updatePassword(password, cardId);
    return result;
}

export async function getBalance(recharges: any, transactions: any) {
    let cont1 = 0;
    recharges.forEach(recharge =>{
         return cont1 += recharge.amount;
    })

    let cont2 = 0;
    transactions.forEach(t =>{
         return cont2 += t.amount;
    })

    const balance = cont1 - cont2;
    return balance;
}

export async function getTransactions(id: number) {
    const transactions = await paymentRepository.findByCardId(id);
    const recharges = await rechargeRepository.findByCardId(id);
    const card = await findCard(id);
    await validateExpirationDate(card);
    const balance  = await getBalance(recharges, transactions);

    return {
        balance,
        transactions,
        recharges
    };
}

export async function blockCard(id: number, password: string) {
    const card = await findCard(id);
    await validateExpirationDate(card);
    await decrypt(password, card.password);
    
    if (card.isBlocked) {
        throw {
            type: "unauthorized",
            message: "card is already blocked"
        };         
    }
  
    await cardRepository.update(id, {isBlocked: true});  
    return {status: "blocked"};
}

export async function unlockCard(id: number, password: string) {
    const card = await findCard(id);
    await validateExpirationDate(card);

    if (!card.isBlocked) {
        throw {
            type: "unauthorized",
            message: "card is already blocked"
        };         
    }

    await decrypt(password, card.password);  
    await cardRepository.update(id, {isBlocked: false});  
    return {status: "unlocked"};
}