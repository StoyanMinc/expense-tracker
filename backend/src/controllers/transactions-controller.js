import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    const { id } = req.params
    console.log(id);
    try {
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${id} ORDER BY created_at_ts DESC`
        console.log(`TRANSACTIONS FOR USER ${id}:`, transactions);
        res.status(200).json(transactions);
    } catch (error) {
        console.log('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export async function createTransaction(req, res) {

    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || !amount || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `;
        console.log(`USER ${user_id} CREATE TRANSACTION:`, transaction[0]);
        res.status(201).json(transaction[0])

    } catch (error) {
        console.log('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export async function deleteTransaction(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid transaction ID.' });
    }
    try {
        const deletedTransaction = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
        if (deletedTransaction.length === 0) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }
        console.log(`USER ${deletedTransaction[0].user_id} DELETE TRANSACTION:`, deletedTransaction[0]);
        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        console.log('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export async function getUserSummary(req, res) {
    const { id } = req.params;

    try {
        const balance = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${id}`;
        const income = await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${id} AND amount > 0`;
        const expenses = await sql`SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${id} AND amount < 0`;

        const summary = {
            balance: balance[0].balance,
            income: income[0].income,
            expenses: expenses[0].expenses
        }
        console.log(`USER ${id} TRANSACTION SUMMARY:`, summary);
        res.status(200).json(summary);
    } catch (error) {
        console.log('Error fetching transaction summary:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export async function getTransactionsStatistic(req, res) {
    const { id } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
        res.status(400).json({ message: 'Start and End Date are required!' })
    }
    try {
        const transactions = await sql`
            SELECT * FROM transactions
            WHERE user_id = ${id}
            AND created_at >= ${start}
            AND created_at <= ${end}
            AND category != 'Income'
        `;

        const categoryTotals = {};
        let totalAmount = 0;

        for (const transaction of transactions) {
            const amount = Math.abs(Number(transaction.amount));
            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = amount
            } else {
                categoryTotals[transaction.category] += amount
            }

            totalAmount += amount;
        }

        const result = Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            total: amount,
            percentage: totalAmount ? Math.round((amount / totalAmount) * 100) : 0
        }));
        console.log(`USER ${id} GET TRANSACTION STATISTIC:`, result);
        res.status(200).json(result)
    } catch (error) {
        console.log('Error fetching transaction summary:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};