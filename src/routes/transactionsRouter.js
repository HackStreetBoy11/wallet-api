import express from "express";
import { createTransaction, getTransactionByUserId,deleteTransactionById,getSummaryByUserId } from "../controller/transactionController.js";
const router = express.Router();
import { sql } from "../config/db.js";
export default router

router.get("/:userId", getTransactionByUserId);


router.post("/", createTransaction)


router.delete("/:id", deleteTransactionById)

router.get("/summary/:userId", getSummaryByUserId)
