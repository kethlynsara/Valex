import joi from "joi";

export const shoppingSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().length(4).required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().required()
});