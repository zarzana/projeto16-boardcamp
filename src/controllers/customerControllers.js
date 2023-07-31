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

        const customers = await db.query(`SELECT * FROM customers WHERE id=${customerId} LIMIT 1`);

        if (customers.rows.length === 0) { return res.sendStatus(404) };

        res.send(customers.rows);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function createCustomer(req, res) {

    const { name, phone, cpf, birthday } = req.body;

    const customerWithCpf = await db.query(`SELECT exists (SELECT 1 FROM customers WHERE cpf = '${cpf}' LIMIT 1)`);
    if (customerWithCpf.rows[0].exists) { return res.sendStatus(409) };

    try {

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]);
        res.sendStatus(201);

    } catch (err) {

        res.status(500).send(err.message);

    }

}