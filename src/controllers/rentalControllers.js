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
            customer: { id: e.customerId, name: e.customerName },
            game: { id: e.gameId, name: e.gameName }
        }));
        rentalsFixed = rentalsFixed.map(({ customerName, gameName, ...keepAttrs }) => keepAttrs);

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
        const gameRentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = ${gameId} AND "returnDate" IS NULL;`);
        if (gameRentals.rows.length >= game.stockTotal) { return res.sendStatus(400) };

        // set variables to be sent to db
        const originalPrice = game.pricePerDay * daysRented;
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

export async function endRental(req, res) {

    const rentalId = req.params.id;

    try {

        // check if id exists and set rental
        const rentals = await db.query(`SELECT rentals.*, games."pricePerDay" FROM rentals
            JOIN games ON rentals."gameId" = games.id
            WHERE rentals.id=${rentalId};`);
        if (rentals.rows.length === 0) { return res.sendStatus(404) };
        const rental = rentals.rows[0];
        console.log(rental);
        if (rental.returnDate) { return res.sendStatus(400) };

        // set variables
        const returnDate = dayjs().format('YYYY-MM-DD');
        const delayFee = Math.max(0, (dayjs(returnDate).diff(rental.rentDate, 'd')-rental.daysRented) * rental.pricePerDay);

        await db.query(`UPDATE rentals
                SET "returnDate" = '${returnDate}', "delayFee" = ${delayFee}
                WHERE id=${rentalId};`);
        res.sendStatus(200);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function deleteRental(req, res) {

    const rentalId = req.params.id;

    try {

        // check if id exists and if item has been returned
        const rentals = await db.query(`SELECT * FROM rentals WHERE id=${rentalId} LIMIT 1;`);
        if (rentals.rows.length === 0) { return res.sendStatus(404) }
        else if (rentals.rows[0].returnDate === null) { return res.sendStatus(400) };

        await db.query(`DELETE FROM rentals WHERE id=${rentalId};`)
        res.sendStatus(200);

    } catch (err) {

        res.status(500).send(err.message);

    }

}