import { db } from "../database/database.js";

export async function readCustomer(req, res) {

    try {

        const customers = await db.query("SELECT * FROM customers");
        res.send(customers.rows);

    } catch (err) {

        res.status(500).send(err.message);

    }

}