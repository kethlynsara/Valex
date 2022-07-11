import joi from "joi";

export const rechargeSchema = joi.object({
    id: joi.number().integer().required(),
    value: joi.number().required()
});