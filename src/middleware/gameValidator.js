import { gameSchema } from "../schemas/gameSchema.js";

export function gameValidator(req, res, next) {

    const validation = gameSchema.validate(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.message);
    }

    next();

}