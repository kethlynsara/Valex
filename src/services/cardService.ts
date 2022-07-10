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

export async function createCardInfo(fullName: string) {
    const number = faker.finance.creditCardNumber('');
    const array = fullName.split(" ");
    for (let i = 1; i < array.length - 1; i++) {
        array[i].length >= 3 ?  array[i] = array[i][0] : array.splice(i, 1);    
    }
    const name = array.join(" ");
    const expirationDate = dayjs().add(5, 'year').format("MM-YYYY");
    const CVC = faker.random.numeric(3);
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const encryptedCVC = cryptr.encrypt(CVC);
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