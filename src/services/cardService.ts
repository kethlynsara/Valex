import dayjs from "dayjs";
import Cryptr from "cryptr";
import { faker } from '@faker-js/faker';
import * as cardRepository from "../repositories/cardRepository.js";
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

export async function createCardInfo(fullName: string) {
    const number = faker.finance.creditCardNumber('');
    const array = fullName.split(" ");

    for (let i = 1; i < array.length - 1; i++) {
        array[i].length >= 3 ?  array[i] = array[i][0] : array.splice(i, 1);    
    }

    const name = array.join(" ");
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

async function validateCVC(CVC: number, card: cardRepository.Card) {
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const decryptedCVC = cryptr.decrypt(card.securityCode);
    console.log('decryptedCVC', decryptedCVC)
    if (parseInt(decryptedCVC) !== CVC) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };
        
    }
    return true;
}

async function updatePassword(password: string, cardId: number) {
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

export async function activateCard(cardId: number, CVC: number, password: string) {
    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw {
            type: "not found",
            message: "card not found"
        };        
    }
    
    const todaysDate = dayjs().format("MM-YYYY").toString();
    if (card.expirationDate < todaysDate) {
        throw {
            type: "unauthorized",
            message: "incorrect data"
        };  
    }

    if (card.password) {
        throw {
            type: "unauthorized",
            message: "card is already active"
        };  
    }

    await validateCVC(CVC, card);
    const result = await updatePassword(password, cardId);
    return result;
}