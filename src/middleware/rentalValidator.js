import { rentalSchema } from "../schemas/rentalSchema.js";

export function rentalValidator(req, res, next) {

    const validation = rentalSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.message);
    }

    next();

}