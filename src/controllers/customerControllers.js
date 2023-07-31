import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function readCustomer(req, res) {

    try {

        const customers = await db.query("SELECT * FROM customers");

        const customersDateFix = customers.rows.map(e => ({ ...e, birthday: dayjs(e.birthday).format('YYYY-MM-DD') }));
        res.send(customersDateFix);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function readCustomerId(req, res) {

    const customerId = req.params.id;

    try {

        const customers = await db.query(`SELECT * FROM customers WHERE id=${customerId} LIMIT 1`);

        if (customers.rows.length === 0) { return res.sendStatus(404) };

        let customer = customers.rows[0];
        customer.birthday = dayjs(customer.birthday).format('YYYY-MM-DD');

        res.send(customer);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function createCustomer(req, res) {

    const { name, phone, cpf, birthday } = req.body;

    try {

        const customerWithCpf = await db.query(`SELECT exists (SELECT 1 FROM customers WHERE cpf = '${cpf}' LIMIT 1)`);
        if (customerWithCpf.rows[0].exists) { return res.sendStatus(409) };

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]);
        res.sendStatus(201);

    } catch (err) {

        res.status(500).send(err.message);

    }

}

export async function updateCustomer(req, res) {

    const customerId = req.params.id;
    const { name, phone, cpf, birthday } = req.body;

    try {

        const customerWithCpf = await db.query(`SELECT exists (SELECT 1 FROM customers WHERE cpf = '${cpf}' LIMIT 1)`);
        if (customerWithCpf.rows[0].exists) { return res.sendStatus(409) };

        const customers = await db.query(`SELECT * FROM customers WHERE id=${customerId} LIMIT 1`);
        if (customers.rows.length === 0) { return res.sendStatus(404) };

        await db.query(`UPDATE customers
                SET name = '${name}', phone = ${phone}, cpf = ${cpf}, birthday = '${birthday}'
                WHERE id=${customerId}`);
        res.sendStatus(200);

    } catch (err) {

        res.status(500).send(err.message);

    }

}