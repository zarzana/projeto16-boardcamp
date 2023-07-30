import { db } from "../database.js";

export async function readGame(req, res) {

    try {

        const games = await db.query("SELECT * FROM games");
        res.send(games.rows);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function createGame(req, res) {

    const { name, image, stockTotal, pricePerDay } = req.body;

    const gameWithName = await db.query(`SELECT exists (SELECT 1 FROM games WHERE name = '${name}' LIMIT 1)`);
    if (gameWithName.rows[0].exists) { return res.sendStatus(409) };

    try {

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,
            [name, image, stockTotal, pricePerDay]);
        res.sendStatus(201);

    } catch (err) {

        res.status(500).send(err.message);

    }

}