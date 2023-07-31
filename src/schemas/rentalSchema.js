import joi from "joi";

export const rentalSchema = joi.object({
    'customerId': joi.number().required(),
    'gameId': joi.number().required(),
    'daysRented': joi.number().positive().required(),
});