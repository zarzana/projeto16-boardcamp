import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function readRental(req, res) {

    try {

        const rentals = await db.query(`SELECT
            customers.id AS "customerId", customers.name AS "customerName",
            rentals.*,
            games.id AS "gameId", games.name AS "gameName"
            FROM customers 
                JOIN rentals 
                    ON customers.id = rentals."customerId" 
                JOIN games 
                    ON games.id = rentals."gameId";`);
    
        let rentalsFixed = rentals.rows.map(e => ({
            ...e,
            customer: {id: e.customerId, name: e.customerName},
            game: {id: e.gameId, name: e.gameName}
        }));
        rentalsFixed = rentalsFixed.map(({customerName, gameName, ...keepAttrs}) => keepAttrs);

        res.send(rentalsFixed);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function createRental(req, res) {

    const { customerId, gameId, daysRented } = req.body;

    try {

        // check if customer exists
        const customerWithId = await db.query(`SELECT exists (SELECT 1 FROM customers WHERE id = '${customerId}' LIMIT 1)`);
        if (!customerWithId.rows[0].exists) { return res.sendStatus(400) };

        // check if game exists
        const gameWithId = await db.query(`SELECT exists (SELECT 1 FROM games WHERE id = '${gameId}' LIMIT 1)`);
        if (!gameWithId.rows[0].exists) { return res.sendStatus(400) };

        // select the game
        const games = await db.query(`SELECT * FROM games WHERE id = '${gameId}' LIMIT 1`);
        const game = games.rows[0];

        // check if game is in stock
        const gameRentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = '${gameId}'`);
        if (gameRentals.rows.length == game.stockTotal) { return res.sendStatus(400) };

        console.log(game);

        // set variables to be sent to db
        const originalPrice = game.pricePerDay;
        const rentDate = dayjs().format('YYYY-MM-DD');
        const returnDate = null;
        const delayFee = null;

        // insert into table
        await db.query(`INSERT
                INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
        res.sendStatus(201);

    } catch (err) {

        res.status(500).send(err.message);

    }

}