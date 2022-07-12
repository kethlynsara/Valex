import joi from "joi";

export const rechargeSchema = joi.object({
    apiKey: joi.string().required(),
    id: joi.number().integer().required(),
    value: joi.number().required()
});