import { db } from "../database/database.js";

export async function readCustomer(req, res) {

    try {

        const customers = await db.query("SELECT * FROM customers");
        res.send(customers.rows);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function readCustomerId(req, res) {

    const customerId = req.params.id

    try {

        const customers = await db.query(`SELECT * FROM users WHERE id=${customerId} LIMIT 1`);

        if (customers.rows.length === 0) { return res.sendStatus(404) };

        res.send(customers.rows);

    } catch (err) {

        res.status(500).send(err.message);

    }

}