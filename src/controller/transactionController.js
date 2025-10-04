import { sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
    try {
        const { userId } = req.params;
        const transactions = await sql`SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC`
        res.status(200).json({ message: "Transactions fetched successfully", transactions });
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function createTransaction(req, res) {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || amount === undefined || !category || !user_id) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const transaction = await sql`INSERT INTO transactions(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
            `
        console.log("Transaction created:", transaction[0]);
        res.status(201).json({ message: "Transaction created successfully", transaction: transaction[0] });
    }
    catch (err) {
        console.error("Error creating transaction:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteTransactionById(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }
        const deleted = await sql`DELETE FROM transactions WHERE id=${id} RETURNING *`
        if (deleted.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully", transaction: deleted[0] });
    }
    catch (err) {
        console.error("Error deleting transaction:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getSummaryByUserId(req, res) {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS balance
            FROM transactions
            WHERE user_id=${userId}
            `
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS income
            FROM transactions
            WHERE user_id=${userId} AND amount>0
            `
        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS expense
            FROM transactions 
            WHERE user_id=${userId} AND amount<0
            `

        res.status(200).json({
            message: "Summary fetched successfully",
            summary: {
                balance: parseFloat(balanceResult[0].balance),
                income: parseFloat(incomeResult[0].income),
                expense: parseFloat(expenseResult[0].expense)
            }
        })
    } catch (error) {
        console.error("Error fetching summary:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}
