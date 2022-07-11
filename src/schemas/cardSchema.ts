import joi from "joi";

export const schema = joi.object({
    apiKey: joi.string().required(),
    employeeId: joi.number().integer().required(),
    type: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});

export const activateCardSchema = joi.object({
    cardId: joi.number().integer().required(),
    CVC: joi.number().integer().required(),
    password: joi.string().length(4).required()
})