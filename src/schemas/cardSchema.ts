import joi from "joi";

export const schema = joi.object({
    apiKey: joi.string().required(),
    type: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
})