import dayjs from "dayjs";
import Cryptr from "cryptr";
import * as cardRepository from "../repositories/cardRepository.js";

export function mapObjectToUpdateQuery({ object, offset = 1 }) {
  const objectColumns = Object.keys(object)
    .map((key, index) => `"${key}"=$${index + offset}`)
    .join(",");
  const objectValues = Object.values(object);

  return { objectColumns, objectValues };
}


export async function checkCardActivation(password: string) {
  if (!password) {
    throw {
        type: "unauthorized",
        message: "card is not acttive"
    };         
  }
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

export async function checkCardBlock(isBlocked: boolean) {
  if (isBlocked) {
      throw {
          type: "unauthorized",
          message: "card is blocked"
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