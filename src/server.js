import express from 'express';
import dotenv from 'dotenv'; // Import and configure dotenv
import transactionsRouter from './routes/transactionsRouter.js';
dotenv.config();

import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import job from './config/cron.js';
const app = express();
if(process.env.NODE_ENV === 'production'){
job.start(); // Start the cron job
}
const PORT = process.env.PORT || 5001
app.use(rateLimiter);
app.use(express.json())


app.use("/api/health", (req, res) => {
    res.status(200).send("API is healthy");
});
app.use("/api/transaction", transactionsRouter);



// Start the server after initializing the database
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err);
});